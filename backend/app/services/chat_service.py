"""
Chat service — David AI assistant for the GovJobs Portal.

• When OPENAI_API_KEY is set  → uses ChatGPT (gpt-4o-mini by default)
  with a system prompt that knows about the portal, government jobs, and
  can look up specific job context from the database.

• When OPENAI_API_KEY is empty → falls back to the built-in rule-based
  engine so the widget always works even without an API key.
"""

from __future__ import annotations

import json
import logging
import re
from datetime import date
from typing import Any, Dict, List, Optional

from sqlalchemy.orm import Session

from app.core.config import settings
from app.repositories.job_repository import JobRepository
from app.schemas.job import JobRead

logger = logging.getLogger(__name__)


# ── OpenAI lazy import ────────────────────────────────────────────────────────
def _openai_client():
    """Return an OpenAI client or None if the key is not configured."""
    if not settings.OPENAI_API_KEY:
        return None
    try:
        from openai import OpenAI  # type: ignore
        return OpenAI(api_key=settings.OPENAI_API_KEY)
    except Exception as e:
        logger.warning("Failed to initialise OpenAI client: %s", e)
        return None


SYSTEM_PROMPT = """You are David, a friendly and knowledgeable AI assistant for DeshKiSeva — a free Government Jobs Portal of India.

Your job is to help users with:
- Finding government jobs (SSC, UPSC, Railway, Banking, Defence, PSUs, State Govt)
- Explaining eligibility, age limits, qualifications, salary, and selection process
- Helping understand admit cards and exam results
- Guiding users on how to apply online for government jobs
- Answering questions about specific job notifications (you will be given job details in context when relevant)
- Navigating the DeshKiSeva portal (search, bookmarks, resume builder, etc.)

Tone: Friendly, clear, helpful. Use bullet points and short paragraphs. Reply in the same language the user writes in (Hindi or English).

Key facts about DeshKiSeva portal:
- Shows latest Jobs, Admit Cards, Results from official Govt sources
- Has a Resume Builder with 8 professional templates
- Supports bookmarks, search & filter by category/state/qualification
- Scrapes data from SSC, UPSC, Railways, IBPS, ISRO, DRDO, PSUs, SarkariResult.com
- Free to use, no account needed for browsing (account needed for bookmarks)

Age relaxation (Central Govt standard):
- OBC: +3 years | SC/ST: +5 years | PwD: +10 years

Application fee (typical Central Govt):
- General/OBC/EWS: ₹100–500 | SC/ST/PwD/Women: Free

Keep answers concise but complete. If given job context, answer specifically about that job."""


class ChatService:
    def __init__(self, db: Session) -> None:
        self.db = db
        self.jobs = JobRepository(db)

    # ── Public entry point ───────────────────────────────────────────────────

    def chat(
        self,
        messages: List[Dict[str, str]],
        job_id: Optional[int] = None,
    ) -> str:
        if not messages:
            return self._greeting()

        # Build job context string if a job_id was provided
        job_context_str = ""
        job_context_dict: Optional[Dict[str, Any]] = None
        if job_id:
            job = self.jobs.get(job_id)
            if job:
                job_context_dict = JobRead.model_validate(job).model_dump()
                job_context_str = self._build_job_context(job_context_dict)

        # Try OpenAI first
        client = _openai_client()
        if client:
            try:
                return self._openai_chat(client, messages, job_context_str)
            except Exception as exc:
                # Log the error and fall back to rule-based
                logger.error("OpenAI chat failed: %s", exc, exc_info=True)

        # Rule-based fallback
        last_user = ""
        for m in reversed(messages):
            if m.get("role") == "user":
                last_user = m.get("content", "").strip()
                break
        return self._rule_based(last_user.lower(), last_user, job_context_dict)

    # ── OpenAI path ──────────────────────────────────────────────────────────

    def _openai_chat(
        self,
        client: Any,
        messages: List[Dict[str, str]],
        job_context: str,
    ) -> str:
        system = SYSTEM_PROMPT
        if job_context:
            system += f"\n\n--- CURRENT JOB CONTEXT ---\n{job_context}\n--- END JOB CONTEXT ---"

        oai_messages = [{"role": "system", "content": system}]
        for m in messages[-10:]:  # last 10 turns to stay within token limits
            role = m.get("role", "user")
            content = m.get("content", "")
            if role in ("user", "assistant") and content:
                oai_messages.append({"role": role, "content": content})

        response = client.chat.completions.create(
            model=settings.OPENAI_MODEL or "gpt-4o-mini",
            messages=oai_messages,
            max_tokens=600,
            temperature=0.7,
        )
        return response.choices[0].message.content.strip()

    def _build_job_context(self, job: Dict[str, Any]) -> str:
        lines = []
        if job.get("title"):        lines.append(f"Title: {job['title']}")
        if job.get("organization"): lines.append(f"Organization: {job['organization']}")
        if job.get("vacancies"):    lines.append(f"Total Vacancies: {job['vacancies']}")
        if job.get("qualification"):lines.append(f"Qualification: {job['qualification']}")
        if job.get("salary"):       lines.append(f"Salary: {job['salary']}")
        if job.get("age_limit"):    lines.append(f"Age Limit: {job['age_limit']}")
        if job.get("last_date"):    lines.append(f"Last Date: {job['last_date']}")
        if job.get("description"):  lines.append(f"Description: {str(job['description'])[:400]}")
        if job.get("selection_process"): lines.append(f"Selection: {job['selection_process']}")
        if job.get("application_url"):   lines.append(f"Apply URL: {job['application_url']}")
        if job.get("notification_pdf"):  lines.append(f"Notification PDF: {job['notification_pdf']}")
        if job.get("how_to_apply"):
            try:
                steps = json.loads(job["how_to_apply"])
                lines.append("How to Apply: " + " | ".join(steps[:5]))
            except Exception:
                pass
        if job.get("application_fee"):
            try:
                fee = json.loads(job["application_fee"])
                fee_str = ", ".join(f"{r.get('label')}: {r.get('value')}" for r in fee[:4])
                lines.append(f"Application Fee: {fee_str}")
            except Exception:
                pass
        if job.get("vacancy_details"):
            try:
                rows = json.loads(job["vacancy_details"])
                vd = ", ".join(f"{r.get('post_name')} ({r.get('total')})" for r in rows[:5])
                lines.append(f"Post-wise Vacancies: {vd}")
            except Exception:
                pass
        return "\n".join(lines)

    # ── Rule-based fallback ──────────────────────────────────────────────────

    def _rule_based(
        self,
        query: str,
        raw_query: str,
        job: Optional[Dict[str, Any]] = None,
    ) -> str:
        if job:
            if any(w in query for w in ["last date", "deadline", "apply by"]):
                return self._answer_last_date(job)
            if any(w in query for w in ["salary", "pay", "stipend"]):
                return self._answer_salary(job)
            if any(w in query for w in ["qualification", "eligib", "education"]):
                return self._answer_qualification(job)
            if any(w in query for w in ["age", "age limit"]):
                return self._answer_age(job)
            if any(w in query for w in ["vacanc", "post", "seat"]):
                return self._answer_vacancies(job)
            if any(w in query for w in ["how to apply", "apply online", "steps"]):
                return self._answer_how_to_apply(job)
            if any(w in query for w in ["fee", "application fee"]):
                return self._answer_fee(job)
            if any(w in query for w in ["notification", "pdf"]):
                return self._answer_notification(job)
            if any(w in query for w in ["selection", "exam", "interview"]):
                return self._answer_selection(job)
            return self._job_summary(job)

        if re.search(r"^(hi|hello|hey|namaste)\b", query):
            return self._greeting()
        if any(w in query for w in ["admit card", "hall ticket"]):
            return "Find all **Admit Cards** from the **Admit Cards** section in the top navigation."
        if any(w in query for w in ["result", "merit list"]):
            return "Check the **Results** section from the top navigation for latest exam results."
        if any(w in query for w in ["bookmark", "save"]):
            return "Click the bookmark icon on any job card to save it. Access saved jobs from **Bookmarks** in the nav."
        if any(w in query for w in ["how to apply", "application process"]):
            return (
                "**Steps to Apply:**\n1. Read the notification PDF\n2. Check eligibility\n"
                "3. Visit Apply Online link\n4. Fill form & upload documents\n5. Pay fee & submit"
            )
        if any(w in query for w in ["latest job", "new job", "recent"]):
            return self._latest_jobs_reply()
        if any(w in query for w in ["about", "this portal", "deshkiseva"]):
            return (
                "**DeshKiSeva** is a free Govt Jobs Portal covering Jobs, Admit Cards & Results "
                "from SSC, UPSC, Railways, Banking, PSUs and more. Updated every 6 hours."
            )
        return (
            "I'm David, your DeshKiSeva assistant! I can help with:\n\n"
            "- 📋 Job details — eligibility, salary, last date\n"
            "- 📑 Admit cards & results\n"
            "- 🔍 How to apply & required documents\n"
            "- 📚 Jobs by qualification (10th/12th/Graduate)\n\n"
            "What would you like to know?"
        )

    # ── Job-specific helpers ─────────────────────────────────────────────────

    def _answer_last_date(self, job: Dict[str, Any]) -> str:
        ld = job.get("last_date")
        title = job.get("title", "this job")
        if not ld:
            return f"Last date for **{title}** is not specified. Check the official notification."
        try:
            d = date.fromisoformat(str(ld))
            days = (d - date.today()).days
            if days < 0:
                status = f"⚠️ This notification **closed {abs(days)} days ago**."
            elif days == 0:
                status = "🚨 **Last date is TODAY!**"
            elif days <= 7:
                status = f"🔥 Only **{days} days** left — apply soon!"
            else:
                status = f"✅ **{days} days** remaining."
            return f"**Last Date:** {d.strftime('%d %B %Y')}\n\n{status}"
        except Exception:
            return f"**Last Date:** {ld}"

    def _answer_salary(self, job: Dict[str, Any]) -> str:
        s = job.get("salary")
        mn, mx = job.get("salary_min"), job.get("salary_max")
        if s: return f"**Salary:** {s}"
        if mn and mx: return f"**Salary Range:** ₹{mn:,} – ₹{mx:,}/month"
        if mn: return f"**Minimum Salary:** ₹{mn:,}/month"
        return "Salary not specified in this notification."

    def _answer_qualification(self, job: Dict[str, Any]) -> str:
        q = job.get("qualification")
        if q: return f"**Qualification Required:**\n\n{q}"
        return "Qualification details not available. Check the official notification PDF."

    def _answer_age(self, job: Dict[str, Any]) -> str:
        age = job.get("age_limit")
        if age:
            return (
                f"**Age Limit:** {age}\n\n"
                "Standard relaxation: OBC +3 yrs | SC/ST +5 yrs | PwD +10 yrs"
            )
        return "Age limit not specified. Check the official notification."

    def _answer_vacancies(self, job: Dict[str, Any]) -> str:
        total = job.get("vacancies")
        vd = job.get("vacancy_details")
        result = f"**Vacancies for {job.get('title', 'this post')}:**\n\n"
        if vd:
            try:
                rows = json.loads(vd)
                lines = [f"- **{r.get('post_name')}**: {r.get('total')} posts" for r in rows[:8] if r.get("post_name")]
                if lines:
                    result += "\n".join(lines)
                    if total: result += f"\n\n**Total: {total:,} posts**"
                    return result
            except Exception:
                pass
        if total: return result + f"**Total Posts: {total:,}**"
        return result + "Vacancy count not specified."

    def _answer_how_to_apply(self, job: Dict[str, Any]) -> str:
        hta = job.get("how_to_apply")
        url = job.get("application_url")
        if hta:
            try:
                steps = json.loads(hta)
                numbered = "\n".join(f"{i+1}. {s}" for i, s in enumerate(steps[:10]))
                result = f"**How to Apply:**\n\n{numbered}"
                if url: result += f"\n\n🔗 [Apply Online]({url})"
                return result
            except Exception:
                pass
        if url:
            return (
                f"**Apply Online:** {url}\n\n"
                "1. Register/Login on the official portal\n"
                "2. Fill the application form\n"
                "3. Upload photo & signature\n"
                "4. Pay fee & submit"
            )
        return "Application link not available. Check the official notification."

    def _answer_fee(self, job: Dict[str, Any]) -> str:
        fee = job.get("application_fee")
        if fee:
            try:
                rows = json.loads(fee)
                lines = [f"- **{r.get('label')}**: {r.get('value')}" for r in rows if r.get("label")]
                if lines: return "**Application Fee:**\n\n" + "\n".join(lines)
            except Exception:
                pass
        return "Application fee details not available in this notification."

    def _answer_notification(self, job: Dict[str, Any]) -> str:
        pdf = job.get("notification_pdf")
        if pdf: return f"📄 **Official Notification PDF:**\n\n{pdf}"
        return "Notification PDF not available. Visit the official website."

    def _answer_selection(self, job: Dict[str, Any]) -> str:
        sp = job.get("selection_process")
        if sp: return f"**Selection Process:**\n\n{sp}"
        return (
            "Selection process not specified.\n\nTypically includes:\n"
            "1. Written Exam\n2. Physical Test (if applicable)\n"
            "3. Document Verification\n4. Medical Examination"
        )

    def _job_summary(self, job: Dict[str, Any]) -> str:
        lines = [f"## {job.get('title', 'Job Details')}", ""]
        for label, key in [("Organization", "organization"), ("Total Posts", "vacancies"),
                            ("Qualification", "qualification"), ("Salary", "salary"),
                            ("Age Limit", "age_limit"), ("Last Date", "last_date")]:
            val = job.get(key)
            if val:
                lines.append(f"**{label}:** {val}")
        lines.append("\nAsk me about salary, eligibility, last date, how to apply, or vacancies.")
        return "\n".join(lines)

    def _greeting(self) -> str:
        return (
            "👋 **Namaste! I'm David, your DeshKiSeva assistant.**\n\n"
            "I can help with:\n"
            "- 🔍 Finding jobs by qualification or category\n"
            "- 📋 Admit cards and exam results\n"
            "- 📝 How to apply, required documents\n"
            "- 💰 Salary, age limits, eligibility\n"
            "- 🧭 Navigating this portal\n\n"
            "What would you like to know?"
        )

    def _latest_jobs_reply(self) -> str:
        try:
            rows, total = self.jobs.search(
                job_type="job", sort_by="created_at", sort_dir="desc", page=1, page_size=5
            )
            if not rows:
                return "No jobs yet — scraper runs every 6 hours. Check back soon!"
            lines = [f"**{total:,} jobs available. Latest 5:**\n"]
            for j in rows:
                ld = f" | Last Date: {j.last_date}" if j.last_date else ""
                lines.append(f"- **{j.title}** — {j.organization}{ld}")
            lines.append("\nVisit the **Jobs** page to see all listings.")
            return "\n".join(lines)
        except Exception:
            return "Visit the **Jobs** section to browse all latest government job notifications."

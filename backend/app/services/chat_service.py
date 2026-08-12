"""
Rule-based AI chat agent for the GovJobs Portal.

Answers questions about:
- Government jobs, vacancies, categories
- How to apply, eligibility, age limits
- Admit cards and results
- App navigation and features
- Specific jobs from the database (when job_id provided)

No external AI API key required — works out of the box.
Designed to be swappable with OpenAI/Gemini by replacing _generate_response().
"""

from __future__ import annotations

import json
import re
from datetime import date
from typing import Any, Dict, List, Optional

from sqlalchemy.orm import Session

from app.repositories.job_repository import JobRepository
from app.schemas.job import JobRead


class ChatMessage:
    def __init__(self, role: str, content: str) -> None:
        self.role = role          # "user" | "assistant"
        self.content = content


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
        """Process a conversation and return the assistant's reply."""
        if not messages:
            return self._greeting()

        last_user_msg = ""
        for m in reversed(messages):
            if m.get("role") == "user":
                last_user_msg = m.get("content", "").strip()
                break

        if not last_user_msg:
            return "How can I help you with government jobs today?"

        # Optionally fetch job context
        job_context: Optional[Dict[str, Any]] = None
        if job_id:
            job = self.jobs.get(job_id)
            if job:
                job_context = JobRead.model_validate(job).model_dump()

        return self._generate_response(last_user_msg.lower(), last_user_msg, job_context)

    # ── Response generator ───────────────────────────────────────────────────

    def _generate_response(
        self,
        query: str,
        raw_query: str,
        job: Optional[Dict[str, Any]] = None,
    ) -> str:
        # ── Job-specific context questions ──────────────────────────────────
        if job:
            if any(w in query for w in ["last date", "deadline", "apply by", "last day"]):
                return self._answer_last_date(job)
            if any(w in query for w in ["salary", "pay", "stipend", "ctc", "income"]):
                return self._answer_salary(job)
            if any(w in query for w in ["qualification", "eligib", "education", "degree", "graduate"]):
                return self._answer_qualification(job)
            if any(w in query for w in ["age", "age limit", "maximum age", "minimum age"]):
                return self._answer_age(job)
            if any(w in query for w in ["vacanc", "post", "seat", "opening"]):
                return self._answer_vacancies(job)
            if any(w in query for w in ["how to apply", "apply online", "application process", "steps"]):
                return self._answer_how_to_apply(job)
            if any(w in query for w in ["fee", "application fee", "exam fee", "charges"]):
                return self._answer_fee(job)
            if any(w in query for w in ["notification", "pdf", "official notice", "advertisement"]):
                return self._answer_notification(job)
            if any(w in query for w in ["selection", "process", "exam", "interview", "test"]):
                return self._answer_selection(job)
            if any(w in query for w in ["organisation", "organization", "department", "which org"]):
                return f"This vacancy is from **{job.get('organization', 'N/A')}**."
            # Default: give a summary of the job
            return self._job_summary(job)

        # ── General knowledge ────────────────────────────────────────────────

        # Greetings
        if re.search(r"^(hi|hello|hey|namaste|hii|helo|good morning|good evening)\b", query):
            return self._greeting()

        # App navigation
        if any(w in query for w in ["admit card", "hall ticket", "call letter"]):
            return (
                "You can find all **Admit Cards** by clicking **Admit Cards** in the top navigation menu.\n\n"
                "Admit cards are listed as soon as they're published. You can search by exam name or organization."
            )
        if any(w in query for w in ["result", "merit list", "score card", "cut off"]):
            return (
                "Check the **Results** section from the top navigation.\n\n"
                "It shows the latest exam results, merit lists, and score cards from all major organizations."
            )
        if any(w in query for w in ["bookmark", "save job", "saved"]):
            return (
                "You can **bookmark any job** by clicking the bookmark icon on a job card.\n\n"
                "All saved jobs are accessible from **Bookmarks** in the navigation menu. You need to be logged in to save bookmarks."
            )
        if any(w in query for w in ["search", "filter", "find job"]):
            return (
                "Use the **Search** page to filter jobs by:\n"
                "- **Keyword** (job title, organization)\n"
                "- **State** — for state-specific postings\n"
                "- **Category** — Railway, Banking, Defence, etc.\n"
                "- **Qualification** — 10th, 12th, Graduate, etc.\n"
                "- **Salary range**\n"
                "- **Last date** — to find jobs closing soon"
            )
        if any(w in query for w in ["profile", "account", "my account", "update profile"]):
            return (
                "Go to your **Profile** page from the top-right user menu.\n\n"
                "You can update your name, phone, state, and qualification there."
            )
        if any(w in query for w in ["register", "sign up", "create account"]):
            return (
                "Click the **Login / Register** button in the navbar.\n"
                "Registration is free and takes less than a minute.\n\n"
                "After registering you can bookmark jobs, track applications, and get personalized suggestions."
            )
        if any(w in query for w in ["login", "sign in", "log in"]):
            return "Click **Login** in the top navigation to sign in with your email and password."

        # Job categories
        if any(w in query for w in ["railway", "rrb", "rrc"]):
            return (
                "**Railway Jobs** include positions from RRB (Railway Recruitment Board) and RRC.\n\n"
                "Common posts: Loco Pilot, Technician, Group D, Station Master, NTPC.\n"
                "Eligibility is usually 10th to graduation depending on the post."
            )
        if any(w in query for w in ["bank", "banking", "ibps", "sbi", "rbi"]):
            return (
                "**Banking Jobs** include IBPS PO/Clerk, SBI PO/Clerk, RBI Grade B, NABARD, and insurance companies.\n\n"
                "Most require graduation. Age limit is typically 20–30 years with relaxation for reserved categories."
            )
        if any(w in query for w in ["defence", "army", "navy", "air force", "agniveer"]):
            return (
                "**Defence Jobs** include Indian Army, Navy, Air Force, and Agniveer scheme.\n\n"
                "Eligibility varies from 10th pass to graduation. Physical fitness tests are mandatory."
            )
        if any(w in query for w in ["upsc", "ias", "ips", "civil service"]):
            return (
                "**UPSC Civil Services** (IAS, IPS, IFS) requires graduation in any subject.\n\n"
                "Age limit: 21–32 years (OBC +3, SC/ST +5 years).\n"
                "The exam has 3 stages: Prelims → Mains → Interview."
            )
        if any(w in query for w in ["ssc", "cgl", "chsl", "mts"]):
            return (
                "**SSC (Staff Selection Commission)** conducts:\n"
                "- **CGL** — graduation required, for Group B & C posts\n"
                "- **CHSL** — 12th pass, for LDC/DEO/PA/SA\n"
                "- **MTS** — 10th pass, for multi-tasking staff\n"
                "- **GD Constable** — 10th/12th pass, physical test required"
            )

        # Age-related general questions
        if any(w in query for w in ["age limit", "age relaxation", "obc age", "sc age", "st age"]):
            return (
                "**General Age Relaxation Rules (Central Government):**\n\n"
                "- OBC: +3 years\n"
                "- SC/ST: +5 years\n"
                "- PwD (General): +10 years\n"
                "- PwD (OBC): +13 years\n"
                "- PwD (SC/ST): +15 years\n"
                "- Ex-Serviceman: up to 45–50 years depending on category\n\n"
                "Age limits vary per job — always check the official notification."
            )

        # Application fee general
        if any(w in query for w in ["application fee", "exam fee", "how much fee", "fee waiver"]):
            return (
                "**Typical Application Fee (Central Govt Jobs):**\n\n"
                "- General/OBC/EWS: ₹100–₹500 (varies by post)\n"
                "- SC/ST/PwD/Women: Usually **free** (fee waived)\n"
                "- Ex-Serviceman: Usually **free**\n\n"
                "Payment is online via Debit Card, Credit Card, Net Banking, or UPI.\n"
                "Always check the specific notification for exact fee details."
            )

        # Qualification related
        if any(w in query for w in ["10th pass", "matric", "ssc 10"]):
            return (
                "**Jobs for 10th Pass candidates:**\n\n"
                "- Railway Group D, Track Maintainer\n"
                "- SSC MTS (Multi Tasking Staff)\n"
                "- Army Soldier GD / Tradesman\n"
                "- Navy MR / Tradesman\n"
                "- Various State Govt posts\n\n"
                "Use the Search page with qualification filter to find current 10th pass jobs."
            )
        if any(w in query for w in ["12th pass", "intermediate", "class 12"]):
            return (
                "**Jobs for 12th Pass candidates:**\n\n"
                "- SSC CHSL (LDC, DEO, Postal Assistant)\n"
                "- Railway NTPC (some posts)\n"
                "- Air Force Group X & Y\n"
                "- Banking Clerk (some)\n"
                "- State Govt clerical posts\n\n"
                "Filter by '12th' on the Search page to find active notifications."
            )
        if any(w in query for w in ["graduate", "graduation", "degree holder", "b.tech", "bsc", "ba ", "b.com"]):
            return (
                "**Jobs for Graduates:**\n\n"
                "- UPSC Civil Services, CDS, NDA\n"
                "- SSC CGL, CPO\n"
                "- IBPS PO/Clerk, SBI PO\n"
                "- RBI Grade B, NABARD\n"
                "- PSU jobs (ONGC, BHEL, ISRO, DRDO, HAL)\n"
                "- State PSC exams\n\n"
                "These are the most numerous government job opportunities."
            )

        # How to apply general
        if any(w in query for w in ["how to apply", "application process", "steps to apply", "how do i apply"]):
            return (
                "**General Steps to Apply for a Government Job:**\n\n"
                "1. Read the official notification PDF carefully\n"
                "2. Check eligibility (age, qualification, category)\n"
                "3. Visit the official Apply Online link\n"
                "4. Register with your email/mobile if first time\n"
                "5. Fill the application form with accurate details\n"
                "6. Upload required documents (photo, signature, certificates)\n"
                "7. Pay the application fee (if applicable)\n"
                "8. Submit and save the confirmation printout\n\n"
                "On this portal, click **View Details** on any job to find the direct Apply Online link."
            )

        # Document preparation
        if any(w in query for w in ["document", "certificate", "photo", "signature", "required"]):
            return (
                "**Common Documents Required for Govt Job Applications:**\n\n"
                "- Recent passport-size photograph (usually JPG, under 50KB)\n"
                "- Scanned signature (JPG, under 20KB)\n"
                "- Date of Birth certificate (10th marksheet)\n"
                "- Educational qualification certificates\n"
                "- Caste/Category certificate (if applicable)\n"
                "- Income & Asset certificate for EWS\n"
                "- Domicile/Residence certificate (for state jobs)\n"
                "- Disability certificate (for PwD quota)\n"
                "- Ex-Serviceman discharge book (if applicable)\n\n"
                "Always check the specific notification for exact requirements."
            )

        # Salary questions
        if any(w in query for w in ["salary", "pay scale", "7th pay", "level 1", "level 2", "pay matrix"]):
            return (
                "**7th Pay Commission Pay Matrix (Central Govt):**\n\n"
                "- Level 1 (₹18,000/month) — Peon, MTS, Group D\n"
                "- Level 2 (₹19,900) — Lower skilled posts\n"
                "- Level 4 (₹25,500) — Clerk, LDC, DEO\n"
                "- Level 6 (₹35,400) — Inspector, Sub-Inspector\n"
                "- Level 7 (₹44,900) — SSC CGL Group B, IBPS PO\n"
                "- Level 8 (₹47,600) — Inspector of Income Tax\n"
                "- Level 10 (₹56,100) — Gazetted Officer\n"
                "- Level 14 (₹1,44,200) — UPSC IAS/IPS entry\n\n"
                "Add DA (~50% of basic), HRA (8–24%), and TA for total in-hand salary."
            )

        # Latest jobs
        if any(w in query for w in ["latest job", "new job", "recent", "today", "this week", "fresh"]):
            return self._latest_jobs_reply()

        # About the app
        if any(w in query for w in ["about", "what is this", "this portal", "this website", "deshkiseva"]):
            return (
                "**DeshKiSeva** is a free Government Jobs Portal that aggregates the latest:\n\n"
                "- 🏢 **Job Notifications** from SSC, UPSC, Railways, Banking, PSUs & more\n"
                "- 📋 **Admit Cards** — download links as soon as released\n"
                "- 🏆 **Results** — exam results and merit lists\n\n"
                "Features: search & filter, bookmarks, multi-language support, dark mode.\n\n"
                "All data is scraped directly from official government websites and updated every 6 hours."
            )

        # Confused / fallback
        return (
            "I can help you with:\n\n"
            "- 📋 **Job details** — eligibility, salary, last date, vacancies\n"
            "- 🎯 **How to apply** — step-by-step application guidance\n"
            "- 📑 **Admit cards & results** — where to find them\n"
            "- 🔍 **Job categories** — Railway, Banking, Defence, SSC, UPSC\n"
            "- 📚 **Qualifications** — jobs for 10th/12th/Graduate\n\n"
            "Try asking something like:\n"
            "*\"What jobs are available for 12th pass?\"* or *\"How do I apply online?\"*"
        )

    # ── Job-specific answer helpers ──────────────────────────────────────────

    def _answer_last_date(self, job: Dict[str, Any]) -> str:
        ld = job.get("last_date")
        title = job.get("title", "this job")
        if not ld:
            return f"The last date for **{title}** is not specified. Please check the official notification."
        try:
            d = date.fromisoformat(str(ld))
            today = date.today()
            days = (d - today).days
            if days < 0:
                status = f"⚠️ This notification **closed {abs(days)} days ago**."
            elif days == 0:
                status = "🚨 **Last date is TODAY!** Apply immediately."
            elif days <= 7:
                status = f"🔥 Only **{days} days remaining** — apply soon!"
            else:
                status = f"✅ **{days} days remaining** to apply."
            return f"**Last Date to Apply:** {d.strftime('%d %B %Y')}\n\n{status}"
        except Exception:
            return f"**Last Date:** {ld}\n\nPlease verify on the official notification."

    def _answer_salary(self, job: Dict[str, Any]) -> str:
        salary = job.get("salary")
        s_min = job.get("salary_min")
        s_max = job.get("salary_max")
        title = job.get("title", "this post")
        if salary:
            return f"**Salary for {title}:**\n\n{salary}"
        if s_min or s_max:
            if s_min and s_max:
                return f"**Salary Range:** ₹{s_min:,} – ₹{s_max:,} per month"
            if s_min:
                return f"**Minimum Salary:** ₹{s_min:,} per month"
        return "Salary details are not specified in this notification. Please refer to the official notification PDF."

    def _answer_qualification(self, job: Dict[str, Any]) -> str:
        q = job.get("qualification")
        title = job.get("title", "this post")
        if q:
            return f"**Eligibility / Qualification for {title}:**\n\n{q}"
        # Try vacancy_details
        vd = job.get("vacancy_details")
        if vd:
            try:
                rows = json.loads(vd)
                lines = [f"- **{r.get('post_name', '')}**: {r.get('eligibility', 'See notification')}" for r in rows[:5] if r.get("post_name")]
                if lines:
                    return f"**Qualification by Post:**\n\n" + "\n".join(lines)
            except Exception:
                pass
        return "Qualification details are not available. Please check the official notification PDF."

    def _answer_age(self, job: Dict[str, Any]) -> str:
        age = job.get("age_limit")
        if age:
            return (
                f"**Age Limit:** {age}\n\n"
                "Standard relaxations apply:\n"
                "- OBC: +3 years | SC/ST: +5 years | PwD: +10 years"
            )
        return "Age limit details are not specified. Please refer to the official notification."

    def _answer_vacancies(self, job: Dict[str, Any]) -> str:
        total = job.get("vacancies")
        vd = job.get("vacancy_details")
        title = job.get("title", "this post")
        result = f"**Vacancies for {title}:**\n\n"
        if vd:
            try:
                rows = json.loads(vd)
                lines = [
                    f"- **{r.get('post_name', 'Post')}**: {r.get('total', 'N/A')} posts"
                    for r in rows[:8] if r.get("post_name")
                ]
                if lines:
                    result += "\n".join(lines)
                    if total:
                        result += f"\n\n**Total: {total:,} posts**"
                    return result
            except Exception:
                pass
        if total:
            return result + f"**Total Posts: {total:,}**"
        return result + "Vacancy count not specified. Please check the official notification."

    def _answer_how_to_apply(self, job: Dict[str, Any]) -> str:
        hta = job.get("how_to_apply")
        apply_url = job.get("application_url")
        title = job.get("title", "this job")
        if hta:
            try:
                steps = json.loads(hta)
                numbered = "\n".join(f"{i+1}. {s}" for i, s in enumerate(steps[:10]))
                result = f"**How to Apply for {title}:**\n\n{numbered}"
                if apply_url:
                    result += f"\n\n🔗 [Apply Online]({apply_url})"
                return result
            except Exception:
                pass
        if apply_url:
            return (
                f"**Apply Online here:** {apply_url}\n\n"
                "General steps:\n"
                "1. Visit the Apply Online link above\n"
                "2. Register/Login on the official portal\n"
                "3. Fill the application form\n"
                "4. Upload documents (photo, signature)\n"
                "5. Pay the application fee\n"
                "6. Submit and save the confirmation"
            )
        return "Application link not available. Please check the official notification PDF for the application process."

    def _answer_fee(self, job: Dict[str, Any]) -> str:
        fee = job.get("application_fee")
        if fee:
            try:
                rows = json.loads(fee)
                lines = [f"- **{r.get('label', '')}**: {r.get('value', '')}" for r in rows if r.get("label")]
                if lines:
                    return "**Application Fee:**\n\n" + "\n".join(lines)
            except Exception:
                pass
        return "Application fee details are not available in this notification."

    def _answer_notification(self, job: Dict[str, Any]) -> str:
        pdf = job.get("notification_pdf")
        if pdf:
            return f"📄 **Official Notification PDF:**\n\n{pdf}\n\nDownload and read carefully before applying."
        return "Notification PDF link is not available. Please visit the organization's official website."

    def _answer_selection(self, job: Dict[str, Any]) -> str:
        sp = job.get("selection_process")
        if sp:
            return f"**Selection Process:**\n\n{sp}"
        return (
            "Selection process is not specified in this notification.\n\n"
            "Typically for government jobs it includes:\n"
            "1. Written Exam (Objective/Descriptive)\n"
            "2. Physical Test (if applicable)\n"
            "3. Document Verification\n"
            "4. Medical Examination"
        )

    def _job_summary(self, job: Dict[str, Any]) -> str:
        lines = [f"## {job.get('title', 'Job Details')}", ""]
        if job.get("organization"):
            lines.append(f"**Organization:** {job['organization']}")
        if job.get("vacancies"):
            lines.append(f"**Total Posts:** {job['vacancies']:,}")
        if job.get("qualification"):
            lines.append(f"**Qualification:** {job['qualification']}")
        if job.get("salary"):
            lines.append(f"**Salary:** {job['salary']}")
        if job.get("age_limit"):
            lines.append(f"**Age Limit:** {job['age_limit']}")
        if job.get("last_date"):
            lines.append(f"**Last Date:** {job['last_date']}")
        lines.append("")
        lines.append("Ask me about salary, eligibility, last date, how to apply, or vacancies for this job.")
        return "\n".join(lines)

    # ── General helpers ──────────────────────────────────────────────────────

    def _greeting(self) -> str:
        return (
            "👋 **Namaste! I'm your DeshKiSeva assistant.**\n\n"
            "I can help you with:\n"
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
                return "No jobs found in the database yet. The scraper runs every 6 hours — check back soon!"
            lines = [f"**Latest {total:,} jobs available. Here are the 5 most recent:**\n"]
            for job in rows:
                ld = f" | Last Date: {job.last_date}" if job.last_date else ""
                lines.append(f"- **{job.title}** — {job.organization}{ld}")
            lines.append("\nVisit the **Jobs** page to see all listings with search & filter.")
            return "\n".join(lines)
        except Exception:
            return "Visit the **Jobs** section in the navigation to browse all latest government job notifications."

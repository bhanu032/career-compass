"""Resume ATS optimization endpoint — powered by OpenAI."""

from typing import Any, Dict, List, Optional

from fastapi import APIRouter
from pydantic import BaseModel, Field

from app.core.config import settings

router = APIRouter(tags=["resume"])


# ── Schemas ───────────────────────────────────────────────────────────────────

class PersonalIn(BaseModel):
    fullName: str = ""
    email: str = ""
    phone: str = ""
    address: str = ""
    linkedin: str = ""
    website: str = ""
    jobTitle: str = ""
    summary: str = ""


class ExperienceIn(BaseModel):
    id: str = ""
    company: str = ""
    position: str = ""
    startDate: str = ""
    endDate: str = ""
    current: bool = False
    description: str = ""


class EducationIn(BaseModel):
    id: str = ""
    institution: str = ""
    degree: str = ""
    field: str = ""
    startDate: str = ""
    endDate: str = ""
    grade: str = ""


class SkillIn(BaseModel):
    id: str = ""
    name: str = ""
    level: str = "Intermediate"


class ProjectIn(BaseModel):
    id: str = ""
    name: str = ""
    description: str = ""
    link: str = ""
    technologies: str = ""


class CertificateIn(BaseModel):
    id: str = ""
    name: str = ""
    issuer: str = ""
    date: str = ""


class ResumeDataIn(BaseModel):
    personal: PersonalIn = PersonalIn()
    experience: List[ExperienceIn] = []
    education: List[EducationIn] = []
    skills: List[SkillIn] = []
    projects: List[ProjectIn] = []
    certificates: List[CertificateIn] = []


class OptimizeRequest(BaseModel):
    resume: ResumeDataIn
    jd_text: str = Field(min_length=10, max_length=8000)


class SuggestedChange(BaseModel):
    section: str          # "summary" | "skills" | "experience" | "jobTitle"
    field: str            # e.g. "summary", "exp_0_description", "skill_add"
    original: str
    suggested: str
    reason: str


class OptimizeResponse(BaseModel):
    changes: List[SuggestedChange]
    ats_score_before: int
    ats_score_after: int   # estimated
    ai_powered: bool


# ── Helpers ───────────────────────────────────────────────────────────────────

def _openai_client():
    if not settings.OPENAI_API_KEY:
        return None
    try:
        from openai import OpenAI  # type: ignore
        return OpenAI(api_key=settings.OPENAI_API_KEY)
    except Exception:
        return None


def _rule_based_optimize(resume: ResumeDataIn, jd_text: str) -> List[SuggestedChange]:
    """Lightweight keyword-injection fallback when OpenAI is not available."""
    import re

    changes: List[SuggestedChange] = []
    jd_lower = jd_text.lower()

    # Extract keywords from JD (simple)
    stop = {"the","and","for","with","that","have","from","will","your","are","not",
            "you","can","all","has","its","but","was","were","they","their","who","how",
            "what","when","which","while","both","each","than","into","only","about",
            "should","would","could","must","may","work","role","team","good","new",
            "use","year","years","per","etc","please","apply","company","position",
            "job","candidate","required","preferred","experience","knowledge","skills",
            "ability","strong","excellent","minimum","following","responsible"}
    words = re.findall(r"[a-z][a-z0-9#+.]*", jd_lower)
    kws = list(dict.fromkeys(w for w in words if len(w) > 3 and w not in stop))[:30]

    resume_text = " ".join([
        resume.personal.summary,
        " ".join(s.name for s in resume.skills),
        " ".join(f"{e.position} {e.description}" for e in resume.experience),
    ]).lower()

    missing = [k for k in kws if k not in resume_text][:8]

    # Summary enhancement
    if missing and resume.personal.summary:
        new_summary = resume.personal.summary.rstrip(" .") + f". Proficient in {', '.join(k.title() for k in missing[:4])}."
        changes.append(SuggestedChange(
            section="summary", field="summary",
            original=resume.personal.summary, suggested=new_summary,
            reason=f"Added {len(missing[:4])} missing JD keywords to summary."
        ))
    elif missing and not resume.personal.summary:
        title = resume.personal.jobTitle or "professional"
        new_summary = (
            f"Results-driven {title} with expertise in "
            f"{', '.join(k.title() for k in missing[:5])}. "
            "Committed to delivering high-quality outcomes and continuous improvement."
        )
        changes.append(SuggestedChange(
            section="summary", field="summary",
            original="", suggested=new_summary,
            reason="Generated a keyword-rich summary from JD requirements."
        ))

    # Skills to add
    existing_skills = {s.name.lower() for s in resume.skills}
    new_skills = [k for k in missing if k not in existing_skills and len(k.split()) <= 3][:5]
    for sk in new_skills:
        changes.append(SuggestedChange(
            section="skills", field="skill_add",
            original="", suggested=sk.title(),
            reason=f"'{sk.title()}' appears in JD but is missing from your skills."
        ))

    # Experience descriptions
    for i, exp in enumerate(resume.experience):
        exp_text = f"{exp.position} {exp.description}".lower()
        exp_missing = [k for k in missing if k not in exp_text][:3]
        if exp_missing and exp.description:
            addition = f"\n• Applied {', '.join(k.title() for k in exp_missing)} skills to deliver project goals."
            changes.append(SuggestedChange(
                section="experience", field=f"exp_{i}_description",
                original=exp.description, suggested=exp.description.rstrip() + addition,
                reason=f"Wove in {len(exp_missing)} missing JD keyword(s) for '{exp.position}'."
            ))

    return changes


def _ai_optimize(resume: ResumeDataIn, jd_text: str) -> List[SuggestedChange]:
    """Use OpenAI to generate targeted, specific resume changes."""
    client = _openai_client()
    if not client:
        return _rule_based_optimize(resume, jd_text)

    resume_summary = f"""
Current Resume:
- Job Title: {resume.personal.jobTitle or 'Not set'}
- Summary: {resume.personal.summary or 'Not provided'}
- Skills: {', '.join(s.name for s in resume.skills) or 'None'}
- Experience:
{chr(10).join(f'  [{i}] {e.position} at {e.company}: {e.description[:200]}' for i, e in enumerate(resume.experience)) or '  None'}
""".strip()

    prompt = f"""You are an expert ATS resume consultant. Analyze this resume against the job description and provide SPECIFIC, ACTIONABLE improvements.

{resume_summary}

JOB DESCRIPTION:
{jd_text[:3000]}

Return a JSON array of changes. Each change must have:
- section: one of "summary", "skills", "experience", "jobTitle"  
- field: "summary", "jobTitle", "skill_add", or "exp_0_description" (use index for experience)
- original: the current text (empty string if adding new)
- suggested: the improved/new text
- reason: brief explanation of why this improves ATS score

Rules:
1. Max 8 changes total
2. For "skill_add": original="" and suggested=skill name only (e.g. "Python")
3. For experience, use index like "exp_0_description", "exp_1_description"
4. Make suggested text natural and specific — NOT generic
5. Focus on keywords from the JD that are missing
6. Rewrite summary to include target job title and top 5 JD keywords
7. Return ONLY valid JSON array, no markdown

Example:
[{{"section":"summary","field":"summary","original":"I am a developer","suggested":"Results-driven Full Stack Developer with 3+ years of experience in React, Node.js and PostgreSQL...","reason":"Added target role and key JD technologies"}}]"""

    try:
        response = client.chat.completions.create(
            model=settings.OPENAI_MODEL or "gpt-4o-mini",
            messages=[{"role": "user", "content": prompt}],
            max_tokens=2000,
            temperature=0.3,
        )
        import json
        raw = response.choices[0].message.content.strip()
        # Strip markdown code fences if present
        if raw.startswith("```"):
            raw = "\n".join(raw.split("\n")[1:])
        if raw.endswith("```"):
            raw = "\n".join(raw.split("\n")[:-1])

        items = json.loads(raw)
        return [SuggestedChange(**item) for item in items if isinstance(item, dict)]
    except Exception as exc:
        # Fall back to rule-based on any error
        return _rule_based_optimize(resume, jd_text)


def _estimate_score(resume: ResumeDataIn, jd_text: str) -> int:
    """Quick heuristic score 0-100."""
    score = 0
    jd_lower = jd_text.lower()

    resume_blob = " ".join([
        resume.personal.summary, resume.personal.jobTitle,
        " ".join(s.name for s in resume.skills),
        " ".join(f"{e.position} {e.description}" for e in resume.experience),
    ]).lower()

    import re
    jd_words = set(re.findall(r"[a-z][a-z0-9#+.]*", jd_lower)) - {
        "the","and","for","with","that","have","from","will","are","not","you"
    }
    meaningful = [w for w in jd_words if len(w) > 4]
    if meaningful:
        matched = sum(1 for w in meaningful if w in resume_blob)
        score += min(40, int(matched / len(meaningful) * 80))
    else:
        score += 20

    if resume.personal.summary:   score += 15
    if len(resume.skills) >= 5:   score += 15
    if resume.experience:         score += 15
    if resume.education:          score += 10
    if resume.personal.email:     score += 5

    return min(100, score)


# ── Endpoint ──────────────────────────────────────────────────────────────────

@router.post("/resume/optimize", response_model=OptimizeResponse)
def optimize_resume(payload: OptimizeRequest) -> OptimizeResponse:
    """
    Analyse a resume against a job description and return a list of
    suggested changes with before/after text for each section.
    Uses OpenAI when OPENAI_API_KEY is set, falls back to rule-based engine.
    """
    score_before = _estimate_score(payload.resume, payload.jd_text)
    ai_powered = bool(settings.OPENAI_API_KEY)

    changes = _ai_optimize(payload.resume, payload.jd_text)

    # Estimate after score (each accepted change boosts by ~5 pts)
    score_after = min(98, score_before + len(changes) * 6)

    return OptimizeResponse(
        changes=changes,
        ats_score_before=score_before,
        ats_score_after=score_after,
        ai_powered=ai_powered,
    )

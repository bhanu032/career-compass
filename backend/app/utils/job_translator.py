"""
Page-level translation — batch ALL text fields from ALL jobs into
as few Google Translate HTTP calls as possible.

For a page of 12 jobs with ~6 text fields each = 72 strings
→ packed into ONE combined HTTP call instead of 72 separate ones.
"""
import copy
import json
from typing import Any, Dict, List

from app.utils.translate import (
    translate_batch,
    translate_json_kv,
    translate_json_vacancy,
    translate_json_links,
    translate_json_steps,
)

_SIMPLE = [
    "title", "organization", "department", "qualification",
    "salary", "age_limit", "description", "selection_process",
    "short_info", "experience",
]

_STRUCTURED = {
    "important_dates": translate_json_kv,
    "application_fee": translate_json_kv,
    "vacancy_details": translate_json_vacancy,
    "important_links": translate_json_links,
    "how_to_apply":    translate_json_steps,
}


def translate_jobs_parallel(jobs: List[Dict[str, Any]], lang: str) -> List[Dict[str, Any]]:
    """
    Translate all simple text fields from all jobs in ONE batch call,
    then handle structured JSON fields per-job.
    Falls back to original values on any failure.
    """
    if not jobs or not lang or lang == "en":
        return jobs

    results = [copy.copy(j) for j in jobs]

    # ── Step 1: collect ALL simple-field values in order ──────────────────
    # flat list: [job0.title, job0.org, job0.dept, ..., job1.title, ...]
    positions: list[tuple[int, str]] = []  # (job_index, field_name)
    texts: list[str] = []

    for i, job in enumerate(jobs):
        for field in _SIMPLE:
            val = job.get(field) or ""
            positions.append((i, field))
            texts.append(val)

    # ── Step 2: translate entire flat list in one batch call ───────────────
    translated = translate_batch(texts, lang)

    # ── Step 3: put translated values back ────────────────────────────────
    for idx, (job_idx, field) in enumerate(positions):
        val = translated[idx]
        if val:
            results[job_idx][field] = val

    # ── Step 4: translate structured JSON fields (per-job, fast) ──────────
    for result in results:
        for field, fn in _STRUCTURED.items():
            if result.get(field):
                try:
                    result[field] = fn(result[field], lang) or result[field]
                except Exception:
                    pass

    return results


def translate_job(job: Dict[str, Any], lang: str) -> Dict[str, Any]:
    """Translate a single job dict (used for detail page)."""
    if not lang or lang == "en":
        return job
    result = translate_jobs_parallel([job], lang)
    return result[0] if result else job

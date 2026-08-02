from datetime import date
from typing import Annotated, Any, Dict, List, Optional

from fastapi import APIRouter, Query

from app.api.deps import JobServiceDep
from app.schemas.common import Page
from app.schemas.job import JobRead
from app.utils.job_translator import translate_job, translate_jobs_parallel
from app.utils.translate_cache import prewarm, record_lang

router = APIRouter(tags=["jobs"])

SUPPORTED_LANGS = {
    "en", "hi", "bn", "ta", "te", "mr", "gu", "pa", "kn", "ml", "or", "ur"
}


def _needs_translation(lang: str) -> bool:
    return bool(lang) and lang != "en" and lang in SUPPORTED_LANGS


def _is_cached(texts: list[str], lang: str) -> bool:
    """Check if the batch is likely cached by sampling first 3 non-empty strings."""
    from app.utils.translate import _cached_batch
    samples = [t for t in texts[:5] if t and t.strip()][:3]
    if not samples:
        return True
    from app.utils.translate import _SEP
    combined = _SEP.join(s.strip() for s in samples)
    key = f"{lang}|||{combined}"
    # If key is in lru_cache, result is instant; otherwise it's a cold call
    ci = _cached_batch.cache_info()
    return ci.currsize > 0  # rough heuristic: if ANY cache entries exist


def _page_with_translation(
    items: List[Any], total: int, page: int, page_size: int, lang: str = "en"
) -> Page[JobRead]:
    dicts = [JobRead.model_validate(i).model_dump() for i in items]

    if _needs_translation(lang):
        record_lang(lang)
        # Try translation — if it completes within the timeout it returns translated,
        # otherwise the fallback inside translate_jobs_parallel returns originals
        translated = translate_jobs_parallel(dicts, lang)
        dicts = translated

    return Page[JobRead](
        items=[JobRead.model_validate(d) for d in dicts],
        total=total,
        page=page,
        page_size=page_size,
        pages=max(1, -(-total // page_size)),
    )


@router.get("/jobs", response_model=Page[JobRead])
def list_jobs(
    service: JobServiceDep,
    page: Annotated[int, Query(ge=1)] = 1,
    page_size: Annotated[int, Query(ge=1, le=100)] = 12,
    sort_by: str = "created_at",
    sort_dir: str = "desc",
    active_only: bool = False,
    lang: str = "en",
) -> Page[JobRead]:
    rows, total = service.search(
        page=page, page_size=page_size, sort_by=sort_by,
        sort_dir=sort_dir, active_only=active_only,
    )
    # Always pre-warm next language in background for fast subsequent loads
    if _needs_translation(lang):
        dicts = [JobRead.model_validate(r).model_dump() for r in rows]
        prewarm(dicts, lang)
    return _page_with_translation(rows, total, page, page_size, lang)


@router.get("/search", response_model=Page[JobRead])
def search_jobs(
    service: JobServiceDep,
    q: Optional[str] = None,
    state: Optional[str] = None,
    qualification: Optional[str] = None,
    organization: Optional[str] = None,
    category: Optional[str] = None,
    job_type: Optional[str] = None,
    salary_min: Optional[int] = None,
    salary_max: Optional[int] = None,
    last_date_before: Optional[date] = None,
    last_date_after: Optional[date] = None,
    active_only: bool = False,
    sort_by: str = "created_at",
    sort_dir: str = "desc",
    page: Annotated[int, Query(ge=1)] = 1,
    page_size: Annotated[int, Query(ge=1, le=100)] = 12,
    lang: str = "en",
) -> Page[JobRead]:
    rows, total = service.search(
        q=q, state=state, qualification=qualification, organization=organization,
        category=category, job_type=job_type, salary_min=salary_min,
        salary_max=salary_max, last_date_before=last_date_before,
        last_date_after=last_date_after, active_only=active_only,
        sort_by=sort_by, sort_dir=sort_dir, page=page, page_size=page_size,
    )
    return _page_with_translation(rows, total, page, page_size, lang)


@router.get("/home", response_model=Dict[str, Any])
def homepage(service: JobServiceDep, lang: str = "en") -> Dict[str, Any]:
    data = service.homepage_data()

    def _tlist(jobs: list) -> list:
        dicts = [JobRead.model_validate(j).model_dump() for j in jobs]
        if _needs_translation(lang):
            record_lang(lang)
            dicts = translate_jobs_parallel(dicts, lang)
        return dicts

    return {
        "latest_jobs":        _tlist(data["latest_jobs"]),
        "top_organizations":  data["top_organizations"],
        "popular_categories": data["popular_categories"],
        "closing_soon":       _tlist(service.expiring_soon()),
        "latest_admit_cards": _tlist(data.get("latest_admit_cards", [])),
        "latest_results":     _tlist(data.get("latest_results", [])),
    }


@router.get("/admit-cards", response_model=Page[JobRead])
def list_admit_cards(
    service: JobServiceDep,
    page: Annotated[int, Query(ge=1)] = 1,
    page_size: Annotated[int, Query(ge=1, le=100)] = 12,
    q: Optional[str] = None,
    category: Optional[str] = None,
    sort_by: str = "created_at",
    sort_dir: str = "desc",
    lang: str = "en",
) -> Page[JobRead]:
    rows, total = service.search(
        q=q, category=category, job_type="admit_card",
        sort_by=sort_by, sort_dir=sort_dir, page=page, page_size=page_size,
    )
    return _page_with_translation(rows, total, page, page_size, lang)


@router.get("/results", response_model=Page[JobRead])
def list_results(
    service: JobServiceDep,
    page: Annotated[int, Query(ge=1)] = 1,
    page_size: Annotated[int, Query(ge=1, le=100)] = 12,
    q: Optional[str] = None,
    category: Optional[str] = None,
    sort_by: str = "created_at",
    sort_dir: str = "desc",
    lang: str = "en",
) -> Page[JobRead]:
    rows, total = service.search(
        q=q, category=category, job_type="result",
        sort_by=sort_by, sort_dir=sort_dir, page=page, page_size=page_size,
    )
    return _page_with_translation(rows, total, page, page_size, lang)


@router.get("/jobs/{job_id}", response_model=JobRead)
def job_details(job_id: int, service: JobServiceDep, lang: str = "en") -> JobRead:
    job = JobRead.model_validate(service.get(job_id))
    if not _needs_translation(lang):
        return job
    translated = translate_job(job.model_dump(), lang)
    return JobRead.model_validate(translated)

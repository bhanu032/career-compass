from datetime import date
from typing import Annotated, Any, Dict, List, Optional

from fastapi import APIRouter, Query

from app.api.deps import JobServiceDep
from app.schemas.common import Page
from app.schemas.job import JobRead

router = APIRouter(tags=["jobs"])


def _page(items: List[Any], total: int, page: int, page_size: int) -> Page[JobRead]:
    return Page[JobRead](
        items=[JobRead.model_validate(i) for i in items],
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
) -> Page[JobRead]:
    rows, total = service.search(
        page=page, page_size=page_size, sort_by=sort_by, sort_dir=sort_dir, active_only=active_only
    )
    return _page(rows, total, page, page_size)


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
) -> Page[JobRead]:
    rows, total = service.search(
        q=q,
        state=state,
        qualification=qualification,
        organization=organization,
        category=category,
        job_type=job_type,
        salary_min=salary_min,
        salary_max=salary_max,
        last_date_before=last_date_before,
        last_date_after=last_date_after,
        active_only=active_only,
        sort_by=sort_by,
        sort_dir=sort_dir,
        page=page,
        page_size=page_size,
    )
    return _page(rows, total, page, page_size)


@router.get("/home", response_model=Dict[str, Any])
def homepage(service: JobServiceDep) -> Dict[str, Any]:
    data = service.homepage_data()
    return {
        "latest_jobs": [JobRead.model_validate(j) for j in data["latest_jobs"]],
        "top_organizations": data["top_organizations"],
        "popular_categories": data["popular_categories"],
        "closing_soon": [JobRead.model_validate(j) for j in service.expiring_soon()],
    }


@router.get("/jobs/{job_id}", response_model=JobRead)
def job_details(job_id: int, service: JobServiceDep) -> JobRead:
    return JobRead.model_validate(service.get(job_id))

from typing import Annotated, Any, Dict, List

from fastapi import APIRouter, Query, status

from app.api.deps import AdminUser, DbSession, JobServiceDep, ScraperServiceDep
from app.repositories.job_repository import JobRepository
from app.repositories.scraper_log_repository import ScraperLogRepository
from app.repositories.user_repository import UserRepository
from app.schemas.common import Message, Page
from app.schemas.job import JobCreate, JobRead, JobUpdate
from app.schemas.scraper import RunScraperRequest, ScraperLogRead
from app.schemas.user import UserAdminUpdate, UserRead
from app.scrapers.registry import list_sources

router = APIRouter(tags=["admin"], prefix="/admin")


@router.get("/stats", response_model=Dict[str, Any])
def dashboard_stats(admin: AdminUser, db: DbSession) -> Dict[str, Any]:
    jobs = JobRepository(db)
    return {
        "total_jobs": jobs.count(),
        "todays_jobs": jobs.count_today(),
        "total_users": UserRepository(db).count(),
        "total_scrapers": len(list_sources()),
        "jobs_per_day": jobs.jobs_per_day(),
        "jobs_per_organization": jobs.top_organizations(6),
        "recent_jobs": [JobRead.model_validate(j) for j in jobs.latest(5)],
    }


@router.get("/jobs", response_model=Page[JobRead])
def admin_jobs(
    admin: AdminUser,
    service: JobServiceDep,
    q: str | None = None,
    page: Annotated[int, Query(ge=1)] = 1,
    page_size: Annotated[int, Query(ge=1, le=100)] = 20,
) -> Page[JobRead]:
    rows, total = service.search(q=q, page=page, page_size=page_size)
    return Page[JobRead](
        items=[JobRead.model_validate(j) for j in rows],
        total=total,
        page=page,
        page_size=page_size,
        pages=max(1, -(-total // page_size)),
    )


@router.post("/jobs", response_model=JobRead, status_code=status.HTTP_201_CREATED)
def create_job(payload: JobCreate, admin: AdminUser, service: JobServiceDep) -> JobRead:
    return JobRead.model_validate(service.create(payload))


@router.put("/jobs/{job_id}", response_model=JobRead)
def update_job(job_id: int, payload: JobUpdate, admin: AdminUser, service: JobServiceDep) -> JobRead:
    return JobRead.model_validate(service.update(job_id, payload))


@router.delete("/jobs/{job_id}", response_model=Message)
def delete_job(job_id: int, admin: AdminUser, service: JobServiceDep) -> Message:
    service.delete(job_id)
    return Message(detail="Job deleted")


@router.get("/users", response_model=Page[UserRead])
def admin_users(
    admin: AdminUser,
    db: DbSession,
    q: str | None = None,
    page: Annotated[int, Query(ge=1)] = 1,
    page_size: Annotated[int, Query(ge=1, le=100)] = 20,
) -> Page[UserRead]:
    rows, total = UserRepository(db).paginate(page, page_size, q)
    return Page[UserRead](
        items=[UserRead.model_validate(u) for u in rows],
        total=total,
        page=page,
        page_size=page_size,
        pages=max(1, -(-total // page_size)),
    )


@router.put("/users/{user_id}", response_model=UserRead)
def update_user(user_id: int, payload: UserAdminUpdate, admin: AdminUser, db: DbSession) -> UserRead:
    repo = UserRepository(db)
    user = repo.get(user_id)
    if not user:
        from fastapi import HTTPException

        raise HTTPException(status.HTTP_404_NOT_FOUND, "User not found")
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(user, field, value)
    repo.commit()
    db.refresh(user)
    return UserRead.model_validate(user)


@router.get("/scrapers", response_model=List[str])
def scraper_sources(admin: AdminUser) -> List[str]:
    return list_sources()


@router.post("/run-scraper", response_model=List[Dict[str, Any]])
def run_scraper(
    payload: RunScraperRequest, admin: AdminUser, service: ScraperServiceDep
) -> List[Dict[str, Any]]:
    return service.run(payload.sources)


@router.get("/scraper-logs", response_model=Page[ScraperLogRead])
def scraper_logs(
    admin: AdminUser,
    db: DbSession,
    source: str | None = None,
    page: Annotated[int, Query(ge=1)] = 1,
    page_size: Annotated[int, Query(ge=1, le=100)] = 20,
) -> Page[ScraperLogRead]:
    rows, total = ScraperLogRepository(db).paginate(page, page_size, source)
    return Page[ScraperLogRead](
        items=[ScraperLogRead.model_validate(r) for r in rows],
        total=total,
        page=page,
        page_size=page_size,
        pages=max(1, -(-total // page_size)),
    )

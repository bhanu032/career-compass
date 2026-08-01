from datetime import date
from typing import Any, Dict, List, Optional, Tuple

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.job import Job
from app.repositories.job_repository import JobRepository
from app.schemas.job import JobCreate, JobUpdate
from app.utils.text import parse_salary_range


class JobService:
    def __init__(self, db: Session) -> None:
        self.db = db
        self.jobs = JobRepository(db)

    def get(self, job_id: int) -> Job:
        job = self.jobs.get(job_id)
        if not job:
            raise HTTPException(status.HTTP_404_NOT_FOUND, "Job not found")
        return job

    def search(self, **filters: Any) -> Tuple[List[Job], int]:
        return self.jobs.search(**filters)

    def latest(self, limit: int = 8) -> List[Job]:
        return self.jobs.latest(limit)

    def create(self, payload: JobCreate) -> Job:
        data = payload.model_dump()
        if data.get("salary") and data.get("salary_min") is None:
            data["salary_min"], data["salary_max"] = parse_salary_range(data["salary"])
        if self.jobs.find_duplicate(data["title"], data["organization"], data.get("last_date")):
            raise HTTPException(status.HTTP_409_CONFLICT, "An identical job already exists")
        job = Job(**data)
        self.jobs.add(job)
        self.jobs.commit()
        self.db.refresh(job)
        return job

    def update(self, job_id: int, payload: JobUpdate) -> Job:
        job = self.get(job_id)
        for field, value in payload.model_dump(exclude_unset=True).items():
            setattr(job, field, value)
        if job.salary:
            job.salary_min, job.salary_max = parse_salary_range(job.salary)
        self.jobs.commit()
        self.db.refresh(job)
        return job

    def delete(self, job_id: int) -> None:
        job = self.get(job_id)
        self.jobs.delete(job)
        self.jobs.commit()

    def homepage_data(self) -> Dict[str, Any]:
        return {
            "latest_jobs": self.jobs.latest(8),
            "top_organizations": self.jobs.top_organizations(),
            "popular_categories": self.jobs.popular_categories(),
        }

    def expiring_soon(self, limit: int = 6) -> List[Job]:
        rows, _ = self.jobs.search(
            active_only=True, sort_by="last_date", sort_dir="asc", page=1, page_size=limit
        )
        return rows

    @staticmethod
    def is_open(job: Job, today: Optional[date] = None) -> bool:
        today = today or date.today()
        return job.last_date is None or job.last_date >= today

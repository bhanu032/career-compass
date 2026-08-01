from datetime import date, datetime, timedelta, timezone
from typing import Any, Dict, List, Optional, Tuple

from sqlalchemy import func, or_, select
from sqlalchemy.orm import Session

from app.models.job import Job
from app.repositories.base import BaseRepository

SORTABLE = {
    "created_at": Job.created_at,
    "last_date": Job.last_date,
    "published_date": Job.published_date,
    "title": Job.title,
    "salary_min": Job.salary_min,
}


class JobRepository(BaseRepository[Job]):
    def __init__(self, db: Session) -> None:
        super().__init__(Job, db)

    def find_duplicate(self, title: str, organization: str, last_date: Optional[date]) -> Optional[Job]:
        return self.db.scalar(
            select(Job).where(
                func.lower(Job.title) == title.lower(),
                func.lower(Job.organization) == organization.lower(),
                Job.last_date == last_date,
            )
        )

    def search(
        self,
        *,
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
        page: int = 1,
        page_size: int = 12,
    ) -> Tuple[List[Job], int]:
        stmt = select(Job)

        if q:
            like = f"%{q.lower()}%"
            stmt = stmt.where(
                or_(
                    func.lower(Job.title).like(like),
                    func.lower(Job.organization).like(like),
                    func.lower(func.coalesce(Job.description, "")).like(like),
                    func.lower(func.coalesce(Job.department, "")).like(like),
                )
            )
        if state:
            stmt = stmt.where(func.lower(Job.state) == state.lower())
        if qualification:
            stmt = stmt.where(func.lower(Job.qualification).like(f"%{qualification.lower()}%"))
        if organization:
            stmt = stmt.where(func.lower(Job.organization).like(f"%{organization.lower()}%"))
        if category:
            stmt = stmt.where(func.lower(Job.category) == category.lower())
        if job_type:
            stmt = stmt.where(func.lower(Job.job_type) == job_type.lower())
        if salary_min is not None:
            stmt = stmt.where(func.coalesce(Job.salary_max, Job.salary_min) >= salary_min)
        if salary_max is not None:
            stmt = stmt.where(func.coalesce(Job.salary_min, Job.salary_max) <= salary_max)
        if last_date_before:
            stmt = stmt.where(Job.last_date <= last_date_before)
        if last_date_after:
            stmt = stmt.where(Job.last_date >= last_date_after)
        if active_only:
            stmt = stmt.where(or_(Job.last_date.is_(None), Job.last_date >= date.today()))

        total = int(self.db.scalar(select(func.count()).select_from(stmt.subquery())) or 0)

        column = SORTABLE.get(sort_by, Job.created_at)
        stmt = stmt.order_by(column.asc() if sort_dir == "asc" else column.desc())
        rows = self.db.scalars(stmt.limit(page_size).offset((page - 1) * page_size)).all()
        return list(rows), total

    def latest(self, limit: int = 8) -> List[Job]:
        return list(self.db.scalars(select(Job).order_by(Job.created_at.desc()).limit(limit)).all())

    def count(self) -> int:
        return int(self.db.scalar(select(func.count(Job.id))) or 0)

    def count_today(self) -> int:
        start = datetime.now(timezone.utc).replace(hour=0, minute=0, second=0, microsecond=0)
        return int(self.db.scalar(select(func.count(Job.id)).where(Job.created_at >= start)) or 0)

    def top_organizations(self, limit: int = 8) -> List[Dict[str, Any]]:
        rows = self.db.execute(
            select(Job.organization, func.count(Job.id).label("count"))
            .group_by(Job.organization)
            .order_by(func.count(Job.id).desc())
            .limit(limit)
        ).all()
        return [{"organization": r[0], "count": r[1]} for r in rows]

    def popular_categories(self, limit: int = 8) -> List[Dict[str, Any]]:
        rows = self.db.execute(
            select(Job.category, func.count(Job.id).label("count"))
            .where(Job.category.is_not(None))
            .group_by(Job.category)
            .order_by(func.count(Job.id).desc())
            .limit(limit)
        ).all()
        return [{"category": r[0], "count": r[1]} for r in rows]

    def jobs_per_day(self, days: int = 14) -> List[Dict[str, Any]]:
        since = datetime.now(timezone.utc) - timedelta(days=days)
        rows = self.db.execute(
            select(func.date(Job.created_at).label("day"), func.count(Job.id))
            .where(Job.created_at >= since)
            .group_by(func.date(Job.created_at))
            .order_by(func.date(Job.created_at))
        ).all()
        return [{"date": str(r[0]), "count": r[1]} for r in rows]

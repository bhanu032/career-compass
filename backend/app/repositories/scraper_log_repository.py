from typing import List, Optional, Tuple

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.models.scraper_log import ScraperLog
from app.repositories.base import BaseRepository


class ScraperLogRepository(BaseRepository[ScraperLog]):
    def __init__(self, db: Session) -> None:
        super().__init__(ScraperLog, db)

    def paginate(self, page: int, page_size: int, source: Optional[str] = None) -> Tuple[List[ScraperLog], int]:
        stmt = select(ScraperLog)
        if source:
            stmt = stmt.where(ScraperLog.source == source)
        total = int(self.db.scalar(select(func.count()).select_from(stmt.subquery())) or 0)
        rows = self.db.scalars(
            stmt.order_by(ScraperLog.started_at.desc()).limit(page_size).offset((page - 1) * page_size)
        ).all()
        return list(rows), total

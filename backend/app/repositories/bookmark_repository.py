from typing import List, Optional, Tuple

from sqlalchemy import func, select
from sqlalchemy.orm import Session, joinedload

from app.models.bookmark import Bookmark
from app.repositories.base import BaseRepository


class BookmarkRepository(BaseRepository[Bookmark]):
    def __init__(self, db: Session) -> None:
        super().__init__(Bookmark, db)

    def get_for_user(self, user_id: int, job_id: int) -> Optional[Bookmark]:
        return self.db.scalar(
            select(Bookmark).where(Bookmark.user_id == user_id, Bookmark.job_id == job_id)
        )

    def list_for_user(self, user_id: int, page: int, page_size: int) -> Tuple[List[Bookmark], int]:
        stmt = select(Bookmark).where(Bookmark.user_id == user_id)
        total = int(self.db.scalar(select(func.count()).select_from(stmt.subquery())) or 0)
        rows = self.db.scalars(
            stmt.options(joinedload(Bookmark.job))
            .order_by(Bookmark.created_at.desc())
            .limit(page_size)
            .offset((page - 1) * page_size)
        ).all()
        return list(rows), total

    def job_ids_for_user(self, user_id: int) -> List[int]:
        return list(self.db.scalars(select(Bookmark.job_id).where(Bookmark.user_id == user_id)).all())

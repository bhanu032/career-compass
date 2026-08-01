from typing import List, Tuple

from fastapi import HTTPException, status
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.models.bookmark import Bookmark
from app.repositories.bookmark_repository import BookmarkRepository
from app.repositories.job_repository import JobRepository


class BookmarkService:
    def __init__(self, db: Session) -> None:
        self.db = db
        self.bookmarks = BookmarkRepository(db)
        self.jobs = JobRepository(db)

    def add(self, user_id: int, job_id: int) -> Bookmark:
        if not self.jobs.get(job_id):
            raise HTTPException(status.HTTP_404_NOT_FOUND, "Job not found")
        existing = self.bookmarks.get_for_user(user_id, job_id)
        if existing:
            return existing
        bookmark = Bookmark(user_id=user_id, job_id=job_id)
        try:
            self.bookmarks.add(bookmark)
            self.bookmarks.commit()
        except IntegrityError:
            self.db.rollback()
            return self.bookmarks.get_for_user(user_id, job_id)  # type: ignore[return-value]
        self.db.refresh(bookmark)
        return bookmark

    def remove(self, user_id: int, job_id: int) -> None:
        bookmark = self.bookmarks.get_for_user(user_id, job_id)
        if not bookmark:
            raise HTTPException(status.HTTP_404_NOT_FOUND, "Bookmark not found")
        self.bookmarks.delete(bookmark)
        self.bookmarks.commit()

    def list(self, user_id: int, page: int, page_size: int) -> Tuple[List[Bookmark], int]:
        return self.bookmarks.list_for_user(user_id, page, page_size)

    def job_ids(self, user_id: int) -> List[int]:
        return self.bookmarks.job_ids_for_user(user_id)

from typing import List, Optional, Tuple

from sqlalchemy import func, or_, select
from sqlalchemy.orm import Session

from app.models.user import User
from app.repositories.base import BaseRepository


class UserRepository(BaseRepository[User]):
    def __init__(self, db: Session) -> None:
        super().__init__(User, db)

    def get_by_email(self, email: str) -> Optional[User]:
        return self.db.scalar(select(User).where(User.email == email.lower()))

    def count(self) -> int:
        return int(self.db.scalar(select(func.count(User.id))) or 0)

    def paginate(self, page: int, page_size: int, q: Optional[str] = None) -> Tuple[List[User], int]:
        stmt = select(User)
        if q:
            like = f"%{q.lower()}%"
            stmt = stmt.where(
                or_(func.lower(User.email).like(like), func.lower(User.full_name).like(like))
            )
        total = int(self.db.scalar(select(func.count()).select_from(stmt.subquery())) or 0)
        rows = self.db.scalars(
            stmt.order_by(User.created_at.desc()).limit(page_size).offset((page - 1) * page_size)
        ).all()
        return list(rows), total

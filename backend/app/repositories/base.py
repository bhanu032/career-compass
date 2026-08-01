from typing import Generic, List, Optional, Type, TypeVar

from sqlalchemy.orm import Session

from app.database.base import Base

ModelType = TypeVar("ModelType", bound=Base)


class BaseRepository(Generic[ModelType]):
    """Generic repository implementing common persistence operations."""

    def __init__(self, model: Type[ModelType], db: Session) -> None:
        self.model = model
        self.db = db

    def get(self, obj_id: int) -> Optional[ModelType]:
        return self.db.get(self.model, obj_id)

    def list(self, limit: int = 100, offset: int = 0) -> List[ModelType]:
        return list(self.db.query(self.model).limit(limit).offset(offset).all())

    def add(self, obj: ModelType) -> ModelType:
        self.db.add(obj)
        self.db.flush()
        return obj

    def delete(self, obj: ModelType) -> None:
        self.db.delete(obj)
        self.db.flush()

    def commit(self) -> None:
        self.db.commit()

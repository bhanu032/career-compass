import enum
from datetime import datetime

from sqlalchemy import DateTime, Enum, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.database.base import Base


class ScraperStatus(str, enum.Enum):
    SUCCESS = "success"
    FAILED = "failed"
    PARTIAL = "partial"


class ScraperLog(Base):
    __tablename__ = "scraper_logs"

    id: Mapped[int] = mapped_column(primary_key=True)
    source: Mapped[str] = mapped_column(String(80), index=True, nullable=False)
    status: Mapped[ScraperStatus] = mapped_column(Enum(ScraperStatus, name="scraper_status"), nullable=False)
    items_found: Mapped[int] = mapped_column(Integer, default=0)
    items_created: Mapped[int] = mapped_column(Integer, default=0)
    items_updated: Mapped[int] = mapped_column(Integer, default=0)
    duration_ms: Mapped[int] = mapped_column(Integer, default=0)
    message: Mapped[str | None] = mapped_column(Text)
    started_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    finished_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)

from datetime import date
from typing import List

from sqlalchemy import Date, Index, Integer, String, Text, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.base import Base, TimestampMixin


class Job(Base, TimestampMixin):
    __tablename__ = "jobs"
    __table_args__ = (
        UniqueConstraint("title", "organization", "last_date", name="uq_job_identity"),
        Index("ix_jobs_search", "title", "organization"),
        Index("ix_jobs_last_date", "last_date"),
        Index("ix_jobs_state_category", "state", "category"),
    )

    id: Mapped[int] = mapped_column(primary_key=True)
    title: Mapped[str] = mapped_column(String(300), nullable=False, index=True)
    organization: Mapped[str] = mapped_column(String(200), nullable=False, index=True)
    department: Mapped[str | None] = mapped_column(String(200))
    state: Mapped[str | None] = mapped_column(String(80), index=True)
    city: Mapped[str | None] = mapped_column(String(80))
    qualification: Mapped[str | None] = mapped_column(String(300), index=True)
    category: Mapped[str | None] = mapped_column(String(120), index=True)
    salary: Mapped[str | None] = mapped_column(String(160))
    salary_min: Mapped[int | None] = mapped_column(Integer, index=True)
    salary_max: Mapped[int | None] = mapped_column(Integer, index=True)
    age_limit: Mapped[str | None] = mapped_column(String(120))
    application_mode: Mapped[str | None] = mapped_column(String(60))
    application_url: Mapped[str | None] = mapped_column(String(600))
    notification_pdf: Mapped[str | None] = mapped_column(String(600))
    last_date: Mapped[date | None] = mapped_column(Date, index=True)
    published_date: Mapped[date | None] = mapped_column(Date, index=True)
    description: Mapped[str | None] = mapped_column(Text)
    selection_process: Mapped[str | None] = mapped_column(Text)
    vacancies: Mapped[int | None] = mapped_column(Integer)
    experience: Mapped[str | None] = mapped_column(String(160))
    job_type: Mapped[str | None] = mapped_column(String(80), index=True)
    source: Mapped[str | None] = mapped_column(String(80), index=True)

    # Rich structured fields (stored as JSON text)
    # important_dates: list of {label: str, value: str}
    important_dates: Mapped[str | None] = mapped_column(Text)
    # application_fee: list of {label: str, value: str}
    application_fee: Mapped[str | None] = mapped_column(Text)
    # vacancy_details: list of {post_name: str, total: str, eligibility: str}
    vacancy_details: Mapped[str | None] = mapped_column(Text)
    # important_links: list of {label: str, url: str, link_text: str}
    important_links: Mapped[str | None] = mapped_column(Text)
    # how_to_apply: list of strings (bullet points)
    how_to_apply: Mapped[str | None] = mapped_column(Text)
    # short_info: the introductory paragraph from source page
    short_info: Mapped[str | None] = mapped_column(Text)

    bookmarks: Mapped[List["Bookmark"]] = relationship(
        back_populates="job", cascade="all, delete-orphan"
    )

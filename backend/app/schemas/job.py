from datetime import date, datetime
from typing import List, Optional

from pydantic import BaseModel, ConfigDict, Field


class JobBase(BaseModel):
    title: str = Field(min_length=3, max_length=300)
    organization: str = Field(min_length=2, max_length=200)
    department: Optional[str] = None
    state: Optional[str] = None
    city: Optional[str] = None
    qualification: Optional[str] = None
    category: Optional[str] = None
    salary: Optional[str] = None
    salary_min: Optional[int] = None
    salary_max: Optional[int] = None
    age_limit: Optional[str] = None
    application_mode: Optional[str] = None
    application_url: Optional[str] = None
    notification_pdf: Optional[str] = None
    last_date: Optional[date] = None
    published_date: Optional[date] = None
    description: Optional[str] = None
    selection_process: Optional[str] = None
    vacancies: Optional[int] = None
    experience: Optional[str] = None
    job_type: Optional[str] = None
    source: Optional[str] = None
    # Rich structured fields stored as JSON strings
    important_dates: Optional[str] = None   # JSON: [{label, value}]
    application_fee: Optional[str] = None   # JSON: [{label, value}]
    vacancy_details: Optional[str] = None   # JSON: [{post_name, total, eligibility}]
    important_links: Optional[str] = None   # JSON: [{label, url, link_text}]
    how_to_apply: Optional[str] = None      # JSON: [str, ...]
    short_info: Optional[str] = None        # Plain text intro paragraph


class JobCreate(JobBase):
    pass


class JobUpdate(BaseModel):
    title: Optional[str] = None
    organization: Optional[str] = None
    department: Optional[str] = None
    state: Optional[str] = None
    city: Optional[str] = None
    qualification: Optional[str] = None
    category: Optional[str] = None
    salary: Optional[str] = None
    salary_min: Optional[int] = None
    salary_max: Optional[int] = None
    age_limit: Optional[str] = None
    application_mode: Optional[str] = None
    application_url: Optional[str] = None
    notification_pdf: Optional[str] = None
    last_date: Optional[date] = None
    published_date: Optional[date] = None
    description: Optional[str] = None
    selection_process: Optional[str] = None
    vacancies: Optional[int] = None
    experience: Optional[str] = None
    job_type: Optional[str] = None
    important_dates: Optional[str] = None
    application_fee: Optional[str] = None
    vacancy_details: Optional[str] = None
    important_links: Optional[str] = None
    how_to_apply: Optional[str] = None
    short_info: Optional[str] = None


class JobRead(JobBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    created_at: datetime
    updated_at: datetime


class JobStats(BaseModel):
    total_jobs: int
    todays_jobs: int
    total_users: int
    total_scrapers: int
    jobs_per_day: List[dict]
    jobs_per_organization: List[dict]

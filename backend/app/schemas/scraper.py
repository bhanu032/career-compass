from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, ConfigDict

from app.models.scraper_log import ScraperStatus


class ScraperLogRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    source: str
    status: ScraperStatus
    items_found: int
    items_created: int
    items_updated: int
    duration_ms: int
    message: Optional[str]
    started_at: datetime
    finished_at: datetime


class RunScraperRequest(BaseModel):
    sources: Optional[List[str]] = None


class ScrapedJob(BaseModel):
    title: str
    organization: str
    salary: Optional[str] = None
    qualification: Optional[str] = None
    last_date: Optional[str] = None
    notification_pdf: Optional[str] = None
    application_url: Optional[str] = None
    description: Optional[str] = None
    state: Optional[str] = None
    category: Optional[str] = None
    vacancies: Optional[int] = None
    age_limit: Optional[str] = None
    selection_process: Optional[str] = None
    published_date: Optional[str] = None
    job_type: Optional[str] = None          # "job" | "admit_card" | "result"
    # Rich structured fields (JSON-serialised strings)
    important_dates: Optional[str] = None
    application_fee: Optional[str] = None
    vacancy_details: Optional[str] = None
    important_links: Optional[str] = None
    how_to_apply: Optional[str] = None
    short_info: Optional[str] = None

from datetime import datetime, timezone
from typing import Dict, List, Optional

from sqlalchemy.orm import Session

from app.core.logging_config import get_logger
from app.models.job import Job
from app.models.scraper_log import ScraperLog, ScraperStatus
from app.repositories.job_repository import JobRepository
from app.repositories.scraper_log_repository import ScraperLogRepository
from app.scrapers.base import BaseScraper
from app.scrapers.registry import get_scrapers
from app.schemas.scraper import ScrapedJob
from app.utils.dates import parse_date
from app.utils.text import parse_salary_range

logger = get_logger("scraper.service")


class ScraperService:
    """Runs the site scrapers and persists results without creating duplicates."""

    def __init__(self, db: Session) -> None:
        self.db = db
        self.jobs = JobRepository(db)
        self.logs = ScraperLogRepository(db)

    def run(self, sources: Optional[List[str]] = None) -> List[Dict[str, int | str]]:
        summary: List[Dict[str, int | str]] = []
        for scraper in get_scrapers(sources):
            summary.append(self._run_one(scraper))
        return summary

    def _run_one(self, scraper: BaseScraper) -> Dict[str, int | str]:
        started = datetime.now(timezone.utc)
        created = updated = 0
        status = ScraperStatus.SUCCESS
        message: Optional[str] = None
        items: List[ScrapedJob] = []

        try:
            items = scraper.scrape()
            if not items:
                status = ScraperStatus.PARTIAL
                message = "No job listings were extracted from the source page."
            for item in items:
                was_created = self._upsert(item, scraper.source)
                created += int(was_created)
                updated += int(not was_created)
            self.db.commit()
        except Exception as exc:  # noqa: BLE001
            self.db.rollback()
            status = ScraperStatus.FAILED
            message = str(exc)[:800]
            logger.exception("Scraper %s failed", scraper.source)

        finished = datetime.now(timezone.utc)
        log = ScraperLog(
            source=scraper.source,
            status=status,
            items_found=len(items),
            items_created=created,
            items_updated=updated,
            duration_ms=int((finished - started).total_seconds() * 1000),
            message=message,
            started_at=started,
            finished_at=finished,
        )
        self.db.add(log)
        self.db.commit()

        return {
            "source": scraper.source,
            "status": status.value,
            "found": len(items),
            "created": created,
            "updated": updated,
        }

    def _upsert(self, item: ScrapedJob, source: str) -> bool:
        last_date = parse_date(item.last_date)
        existing = self.jobs.find_duplicate(item.title, item.organization, last_date)
        salary_min, salary_max = parse_salary_range(item.salary)

        if existing:
            existing.application_url = item.application_url or existing.application_url
            existing.notification_pdf = item.notification_pdf or existing.notification_pdf
            existing.description = item.description or existing.description
            existing.qualification = item.qualification or existing.qualification
            existing.salary = item.salary or existing.salary
            existing.salary_min = salary_min or existing.salary_min
            existing.salary_max = salary_max or existing.salary_max
            return False

        self.db.add(
            Job(
                title=item.title[:300],
                organization=item.organization[:200],
                state=item.state,
                category=item.category,
                qualification=item.qualification,
                salary=item.salary,
                salary_min=salary_min,
                salary_max=salary_max,
                last_date=last_date,
                published_date=datetime.now(timezone.utc).date(),
                notification_pdf=item.notification_pdf,
                application_url=item.application_url,
                application_mode="Online",
                description=item.description,
                vacancies=item.vacancies,
                job_type="Permanent",
                source=source,
            )
        )
        return True

from apscheduler.schedulers.background import BackgroundScheduler

from app.core.config import settings
from app.core.logging_config import get_logger
from app.database.session import SessionLocal
from app.services.scraper_service import ScraperService

logger = get_logger("scheduler")
scheduler = BackgroundScheduler(timezone="UTC")


def scheduled_scrape() -> None:
    logger.info("Scheduled scraping run started")
    db = SessionLocal()
    try:
        summary = ScraperService(db).run()
        logger.info("Scheduled scraping finished: %s", summary)
    finally:
        db.close()


def start_scheduler() -> None:
    if not settings.ENABLE_SCHEDULER or scheduler.running:
        return
    scheduler.add_job(
        scheduled_scrape,
        trigger="interval",
        hours=settings.SCRAPER_INTERVAL_HOURS,
        id="scrape_all_sources",
        replace_existing=True,
        max_instances=1,
        coalesce=True,
    )
    scheduler.start()
    logger.info("Scheduler started (every %sh)", settings.SCRAPER_INTERVAL_HOURS)


def stop_scheduler() -> None:
    if scheduler.running:
        scheduler.shutdown(wait=False)

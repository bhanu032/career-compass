from apscheduler.schedulers.background import BackgroundScheduler

from app.core.config import settings
from app.core.logging_config import get_logger
from app.database.session import SessionLocal
from app.services.scraper_service import ScraperService

logger = get_logger("scheduler")
scheduler = BackgroundScheduler(timezone="UTC")

_cycle_counter = 0


def scheduled_scrape() -> None:
    global _cycle_counter
    _cycle_counter += 1
    logger.info("Scheduled scraping run #%d started", _cycle_counter)

    db = SessionLocal()
    try:
        service = ScraperService(db)

        # Tier 1 runs every cycle (SarkariResult — fast, high yield)
        from app.scrapers.registry import get_scrapers_by_tier
        tier = 1

        # Tier 2 (major bodies) runs every 2nd cycle
        if _cycle_counter % 2 == 0:
            tier = 2

        scrapers = get_scrapers_by_tier(tier)
        sources = [s.source for s in scrapers]
        logger.info("Running Tier %d scrapers: %s", tier, sources)

        summary = service.run(sources=sources)
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

"""
Scraper for FreeJobAlert.com — India's most comprehensive govt job aggregator.
Covers SSC, Railway, Banking, Defence, PSU, State Govt and more.
"""
from typing import List

from app.scrapers.base import BaseScraper
from app.schemas.scraper import ScrapedJob
from app.utils.text import absolute_url, clean


class FreeJobAlertScraper(BaseScraper):
    source = "freejobalert"
    name = "FreeJobAlert"
    base_url = "https://www.freejobalert.com"
    listing_url = "https://www.freejobalert.com/latest-notifications/"
    requires_javascript = False

    SKIP = ("answer key", "result", "admit card", "cut off", "syllabus", "merit list")
    KEYWORDS = ("recruit", "vacanc", "advertis", "notification", "appointment", "post", "opening")

    def parse(self, html: str) -> List[ScrapedJob]:
        soup = self.soup(html)
        jobs: List[ScrapedJob] = []
        seen: set[str] = set()

        for anchor in soup.find_all("a", href=True):
            title = clean(anchor.get_text())
            if len(title) < 15:
                continue
            low = title.lower()
            if any(s in low for s in self.SKIP):
                continue
            if not any(k in low for k in self.KEYWORDS):
                continue
            if title in seen:
                continue
            seen.add(title)

            href = absolute_url(self.base_url, anchor["href"])
            pdf = href if href and href.lower().endswith(".pdf") else None

            jobs.append(ScrapedJob(
                title=title[:300],
                organization=self.name,
                notification_pdf=pdf,
                application_url=href,
                description=f"{title}. Visit the official link for complete details.",
                state="All India",
                category="Central Government",
                job_type="job",
            ))
            if len(jobs) >= 50:
                break
        return jobs

"""
Scraper for Bharat Heavy Electricals Limited (BHEL) — www.bhel.com
Engineering PSU under Ministry of Heavy Industries.
"""
from typing import List

from app.scrapers.base import BaseScraper
from app.schemas.scraper import ScrapedJob
from app.utils.text import absolute_url, clean


class BHELScraper(BaseScraper):
    source = "bhel"
    name = "Bharat Heavy Electricals Limited"
    base_url = "https://www.bhel.com"
    listing_url = "https://www.bhel.com/"
    requires_javascript = True

    KEYWORDS = ("recruit", "vacanc", "advertis", "notification", "engineer", "trainee", "apprentice", "post", "opening")

    def parse(self, html: str) -> List[ScrapedJob]:
        soup = self.soup(html)
        jobs: List[ScrapedJob] = []
        seen: set[str] = set()

        for anchor in soup.find_all("a", href=True):
            title = clean(anchor.get_text())
            if len(title) < 12:
                continue
            low = title.lower()
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
                description=f"{title}. Bharat Heavy Electricals Limited (BHEL) — Engineering PSU.",
                state="All India",
                category="PSU",
                job_type="job",
            ))
            if len(jobs) >= 30:
                break
        return jobs

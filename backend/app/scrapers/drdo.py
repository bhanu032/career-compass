from typing import List

from app.scrapers.base import BaseScraper
from app.schemas.scraper import ScrapedJob
from app.utils.text import absolute_url, clean


class DRDOScraper(BaseScraper):
    """Scraper for Defence Research and Development Organisation recruitment notices."""

    source = "drdo"
    name = "Defence Research and Development Organisation"
    base_url = "https://www.drdo.gov.in"
    listing_url = "https://www.drdo.gov.in/careers"
    requires_javascript = True

    KEYWORDS = ("recruit", "vacanc", "advertis", "notification", "appointment", "engagement")

    def parse(self, html: str) -> List[ScrapedJob]:
        soup = self.soup(html)
        jobs: List[ScrapedJob] = []
        seen: set[str] = set()

        for anchor in soup.find_all("a"):
            title = clean(anchor.get_text())
            if len(title) < 12:
                continue
            lowered = title.lower()
            if not any(keyword in lowered for keyword in self.KEYWORDS):
                continue
            if title in seen:
                continue
            seen.add(title)

            href = absolute_url(self.base_url, anchor.get("href"))
            pdf = href if href and href.lower().endswith(".pdf") else None

            jobs.append(
                ScrapedJob(
                    title=title[:300],
                    organization=self.name,
                    qualification=None,
                    salary=None,
                    last_date=None,
                    notification_pdf=pdf,
                    application_url=href,
                    description=f"{title} published by {self.name}. Refer to the official notification for eligibility, vacancy details and the application procedure.",
                    state="All India",
                    category="Defence",
                )
            )

            if len(jobs) >= 40:
                break

        return jobs

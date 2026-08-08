"""National Highways Authority of India — nhai.gov.in"""
from typing import List
from app.scrapers.base import BaseScraper
from app.schemas.scraper import ScrapedJob
from app.utils.text import absolute_url, clean

class NHAIScraper(BaseScraper):
    source = "nhai"
    name = "National Highways Authority of India"
    base_url = "https://nhai.gov.in"
    listing_url = "https://nhai.gov.in/career.html"
    requires_javascript = False
    KEYWORDS = ("recruit", "vacanc", "advertis", "notification", "post", "officer", "manager", "consultant", "opening")

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
                title=title[:300], organization=self.name,
                notification_pdf=pdf, application_url=href,
                description=f"{title}. National Highways Authority of India (NHAI) — Ministry of Road Transport.",
                state="All India", category="Central Government", job_type="job",
            ))
            if len(jobs) >= 30:
                break
        return jobs

"""RITES Limited — rites.com — transport infrastructure consultancy PSU"""
from typing import List
from app.scrapers.base import BaseScraper
from app.schemas.scraper import ScrapedJob
from app.utils.text import absolute_url, clean

class RITESScraper(BaseScraper):
    source = "rites"
    name = "RITES Limited"
    base_url = "https://www.rites.com"
    listing_url = "https://www.rites.com/web/index.php/career"
    requires_javascript = False
    KEYWORDS = ("recruit", "vacanc", "advertis", "notification", "post", "engineer", "officer", "consultant", "trainee")

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
                description=f"{title}. RITES Limited — Navratna PSU, Ministry of Railways.",
                state="All India", category="Railway", job_type="job",
            ))
            if len(jobs) >= 30:
                break
        return jobs

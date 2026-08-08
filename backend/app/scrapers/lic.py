"""
Scraper for Life Insurance Corporation of India (LIC) — licindia.in
"""
from typing import List

from app.scrapers.base import BaseScraper
from app.schemas.scraper import ScrapedJob
from app.utils.text import absolute_url, clean


class LICScraper(BaseScraper):
    source = "lic"
    name = "Life Insurance Corporation of India"
    base_url = "https://licindia.in"
    listing_url = "https://licindia.in/Bottom-Links/Careers/Recruitment-Notices"
    requires_javascript = False

    KEYWORDS = ("recruit", "vacanc", "advertis", "notification", "post", "officer", "assistant", "ado", "aao")

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
                description=f"{title}. Life Insurance Corporation of India (LIC) recruitment notification.",
                state="All India",
                category="Insurance",
                job_type="job",
            ))
            if len(jobs) >= 30:
                break
        return jobs

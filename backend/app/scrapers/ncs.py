"""
Scraper for National Career Service Portal (www.ncs.gov.in) —
Ministry of Labour & Employment's official job portal.
"""
from typing import List

from app.scrapers.base import BaseScraper
from app.schemas.scraper import ScrapedJob
from app.utils.text import absolute_url, clean


class NCSPortalScraper(BaseScraper):
    source = "ncs"
    name = "National Career Service Portal"
    base_url = "https://www.ncs.gov.in"
    listing_url = "https://www.ncs.gov.in/jobseeker/pages/jobseeker/jobSearch.aspx"
    requires_javascript = True

    KEYWORDS = ("recruit", "vacanc", "notification", "appointment", "post", "opening", "hiring")

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
            jobs.append(ScrapedJob(
                title=title[:300],
                organization=self.name,
                application_url=href,
                description=f"{title}. Listed on National Career Service Portal (Ministry of Labour & Employment).",
                state="All India",
                category="Central Government",
                job_type="job",
            ))
            if len(jobs) >= 40:
                break
        return jobs

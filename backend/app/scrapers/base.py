from abc import ABC, abstractmethod
from typing import List, Optional

import requests
from bs4 import BeautifulSoup

from app.core.logging_config import get_logger
from app.schemas.scraper import ScrapedJob

USER_AGENT = (
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
    "(KHTML, like Gecko) Chrome/122.0 Safari/537.36"
)


class BaseScraper(ABC):
    """Base class every website scraper must extend."""

    source: str = "base"
    name: str = "Base Scraper"
    base_url: str = ""
    listing_url: str = ""
    requires_javascript: bool = False
    timeout: int = 25

    def __init__(self) -> None:
        self.logger = get_logger(f"scraper.{self.source}")

    def fetch(self, url: Optional[str] = None) -> Optional[str]:
        target = url or self.listing_url
        if self.requires_javascript:
            return self._fetch_with_playwright(target)
        try:
            response = requests.get(
                target, headers={"User-Agent": USER_AGENT}, timeout=self.timeout
            )
            response.raise_for_status()
            return response.text
        except requests.RequestException as exc:
            self.logger.warning("HTTP fetch failed for %s: %s", target, exc)
            return None

    def _fetch_with_playwright(self, url: str) -> Optional[str]:
        try:
            from playwright.sync_api import sync_playwright
        except ImportError:
            self.logger.warning("Playwright not installed; skipping %s", url)
            return None
        try:
            with sync_playwright() as p:
                browser = p.chromium.launch(headless=True)
                page = browser.new_page(user_agent=USER_AGENT)
                page.goto(url, wait_until="domcontentloaded", timeout=self.timeout * 1000)
                page.wait_for_timeout(2000)
                html = page.content()
                browser.close()
                return html
        except Exception as exc:  # noqa: BLE001 - third-party failures vary widely
            self.logger.warning("Playwright fetch failed for %s: %s", url, exc)
            return None

    @staticmethod
    def soup(html: str) -> BeautifulSoup:
        return BeautifulSoup(html, "lxml")

    @abstractmethod
    def parse(self, html: str) -> List[ScrapedJob]:
        """Parse listing HTML into normalised job dictionaries."""

    def scrape(self) -> List[ScrapedJob]:
        html = self.fetch()
        if not html:
            return []
        try:
            return self.parse(html)
        except Exception as exc:  # noqa: BLE001
            self.logger.exception("Parse failed for %s: %s", self.source, exc)
            return []

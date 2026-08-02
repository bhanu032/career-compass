from typing import Dict, List, Type

from app.scrapers.aiims import AIIMSScraper
from app.scrapers.barc import BARCScraper
from app.scrapers.base import BaseScraper
from app.scrapers.drdo import DRDOScraper
from app.scrapers.ibps import IBPSScraper
from app.scrapers.income_tax import IncomeTaxScraper
from app.scrapers.isro import ISROScraper
from app.scrapers.ongc import ONGCScraper
from app.scrapers.rrb import RRBScraper
from app.scrapers.sarkari_result import SarkariResultCmScraper
from app.scrapers.ssc import SSCScraper
from app.scrapers.upsc import UPSCScraper

SCRAPER_CLASSES: List[Type[BaseScraper]] = [
    SarkariResultCmScraper,
    SSCScraper,
    UPSCScraper,
    RRBScraper,
    IBPSScraper,
    ISROScraper,
    DRDOScraper,
    ONGCScraper,
    BARCScraper,
    AIIMSScraper,
    IncomeTaxScraper,
]

SCRAPER_REGISTRY: Dict[str, Type[BaseScraper]] = {c.source: c for c in SCRAPER_CLASSES}


def get_scrapers(sources: List[str] | None = None) -> List[BaseScraper]:
    if not sources:
        return [cls() for cls in SCRAPER_CLASSES]
    return [SCRAPER_REGISTRY[s]() for s in sources if s in SCRAPER_REGISTRY]


def list_sources() -> List[str]:
    return list(SCRAPER_REGISTRY.keys())

from typing import Dict, List, Type

from app.scrapers.airforce import IndianAirForceScraper
from app.scrapers.aiims import AIIMSScraper
from app.scrapers.army import IndianArmyScraper
from app.scrapers.barc import BARCScraper
from app.scrapers.base import BaseScraper
from app.scrapers.bel import BELScraper
from app.scrapers.bhel import BHELScraper
from app.scrapers.coal_india import CoalIndiaScraper
from app.scrapers.drdo import DRDOScraper
from app.scrapers.employment_news import EmploymentNewsScraper
from app.scrapers.fci import FCIScraper
from app.scrapers.freejobalert import FreeJobAlertScraper
from app.scrapers.hal import HALScraper
from app.scrapers.hpcl import HPCLScraper
from app.scrapers.ibps import IBPSScraper
from app.scrapers.income_tax import IncomeTaxScraper
from app.scrapers.iocl import IOCLScraper
from app.scrapers.isro import ISROScraper
from app.scrapers.lic import LICScraper
from app.scrapers.nabard import NABARDScraper
from app.scrapers.navy import IndianNavyScraper
from app.scrapers.niacl import NIACLScraper
from app.scrapers.ntpc import NTPCScraper
from app.scrapers.ongc import ONGCScraper
from app.scrapers.rbi import RBIScraper
from app.scrapers.rrb import RRBScraper
from app.scrapers.sail import SAILScraper
from app.scrapers.sarkari_result import SarkariResultCmScraper
from app.scrapers.ssc import SSCScraper
from app.scrapers.upsc import UPSCScraper

SCRAPER_CLASSES: List[Type[BaseScraper]] = [
    # Aggregators (highest yield — run first)
    SarkariResultCmScraper,
    FreeJobAlertScraper,
    EmploymentNewsScraper,
    # Central Recruitment Bodies
    SSCScraper,
    UPSCScraper,
    RRBScraper,
    IBPSScraper,
    # Defence
    IndianArmyScraper,
    IndianNavyScraper,
    IndianAirForceScraper,
    ISROScraper,
    DRDOScraper,
    BARCScraper,
    # Banking & Finance
    RBIScraper,
    NABARDScraper,
    NIACLScraper,
    LICScraper,
    # Energy PSUs
    ONGCScraper,
    NTPCScraper,
    HPCLScraper,
    IOCLScraper,
    CoalIndiaScraper,
    # Engineering & Manufacturing PSUs
    BHELScraper,
    BELScraper,
    HALScraper,
    SAILScraper,
    # Other Government
    AIIMSScraper,
    IncomeTaxScraper,
    FCIScraper,
]

SCRAPER_REGISTRY: Dict[str, Type[BaseScraper]] = {c.source: c for c in SCRAPER_CLASSES}


def get_scrapers(sources: List[str] | None = None) -> List[BaseScraper]:
    if not sources:
        return [cls() for cls in SCRAPER_CLASSES]
    return [SCRAPER_REGISTRY[s]() for s in sources if s in SCRAPER_REGISTRY]


def list_sources() -> List[str]:
    return list(SCRAPER_REGISTRY.keys())

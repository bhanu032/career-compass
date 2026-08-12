from typing import Dict, List, Type

from app.scrapers.aai import AAIScraper
from app.scrapers.airforce import IndianAirForceScraper
from app.scrapers.aiims import AIIMSScraper
from app.scrapers.army import IndianArmyScraper
from app.scrapers.barc import BARCScraper
from app.scrapers.base import BaseScraper
from app.scrapers.bel import BELScraper
from app.scrapers.beml import BEMLScraper
from app.scrapers.bhel import BHELScraper
from app.scrapers.bpcl import BPCLScraper
from app.scrapers.bsnl import BSNLScraper
from app.scrapers.coal_india import CoalIndiaScraper
from app.scrapers.concor import CONCORScraper
from app.scrapers.drdo import DRDOScraper
from app.scrapers.employment_news import EmploymentNewsScraper
from app.scrapers.fci import FCIScraper
from app.scrapers.freejobalert import FreeJobAlertScraper
from app.scrapers.gail import GAILScraper
from app.scrapers.hal import HALScraper
from app.scrapers.hpcl import HPCLScraper
from app.scrapers.ibps import IBPSScraper
from app.scrapers.income_tax import IncomeTaxScraper
from app.scrapers.iocl import IOCLScraper
from app.scrapers.ircon import IRCONScraper
from app.scrapers.isro import ISROScraper
from app.scrapers.lic import LICScraper
from app.scrapers.mecl import MECLScraper
from app.scrapers.mtnl import MTNLScraper
from app.scrapers.nabard import NABARDScraper
from app.scrapers.navy import IndianNavyScraper
from app.scrapers.nhai import NHAIScraper
from app.scrapers.nhpc import NHPCScraper
from app.scrapers.niacl import NIACLScraper
from app.scrapers.nmdc import NMDCScraper
from app.scrapers.ntpc import NTPCScraper
from app.scrapers.ongc import ONGCScraper
from app.scrapers.pgcil import PGCILScraper
from app.scrapers.rbi import RBIScraper
from app.scrapers.rinl import RINLScraper
from app.scrapers.rites import RITESScraper
from app.scrapers.rrb import RRBScraper
from app.scrapers.sail import SAILScraper
from app.scrapers.sarkari_result import SarkariResultCmScraper
from app.scrapers.ssc import SSCScraper
from app.scrapers.upsc import UPSCScraper

# ── Priority tiers ────────────────────────────────────────────────────────────
# TIER_1: Run on every scheduled cycle (fast aggregators — high yield)
TIER_1_CLASSES: List[Type[BaseScraper]] = [
    SarkariResultCmScraper,   # covers jobs, admit cards, results in one scrape
]

# TIER_2: Run every 2nd cycle (major recruitment bodies)
TIER_2_CLASSES: List[Type[BaseScraper]] = [
    FreeJobAlertScraper,
    EmploymentNewsScraper,
    SSCScraper,
    UPSCScraper,
    RRBScraper,
    IBPSScraper,
]

# TIER_3: Run on-demand or manually via admin panel
TIER_3_CLASSES: List[Type[BaseScraper]] = [
    IndianArmyScraper,
    IndianNavyScraper,
    IndianAirForceScraper,
    ISROScraper,
    DRDOScraper,
    BARCScraper,
    HALScraper,
    BELScraper,
    BEMLScraper,
    RBIScraper,
    NABARDScraper,
    NIACLScraper,
    LICScraper,
    ONGCScraper,
    NTPCScraper,
    HPCLScraper,
    IOCLScraper,
    BPCLScraper,
    GAILScraper,
    CoalIndiaScraper,
    PGCILScraper,
    NHPCScraper,
    BHELScraper,
    SAILScraper,
    NMDCScraper,
    RINLScraper,
    MECLScraper,
    NHAIScraper,
    AAIScraper,
    IRCONScraper,
    RITESScraper,
    CONCORScraper,
    BSNLScraper,
    MTNLScraper,
    AIIMSScraper,
    IncomeTaxScraper,
    FCIScraper,
]

# All scrapers combined (for registry lookup and admin "run all")
SCRAPER_CLASSES: List[Type[BaseScraper]] = TIER_1_CLASSES + TIER_2_CLASSES + TIER_3_CLASSES

SCRAPER_REGISTRY: Dict[str, Type[BaseScraper]] = {c.source: c for c in SCRAPER_CLASSES}


def get_scrapers(sources: List[str] | None = None) -> List[BaseScraper]:
    """Return scrapers for given sources. If none specified, return only Tier 1 (fast default)."""
    if not sources:
        return [cls() for cls in TIER_1_CLASSES]
    return [SCRAPER_REGISTRY[s]() for s in sources if s in SCRAPER_REGISTRY]


def get_scrapers_by_tier(tier: int) -> List[BaseScraper]:
    """Return scrapers for a specific tier (1, 2, or 3)."""
    tier_map = {1: TIER_1_CLASSES, 2: TIER_2_CLASSES, 3: TIER_3_CLASSES}
    return [cls() for cls in tier_map.get(tier, TIER_1_CLASSES)]


def get_all_scrapers() -> List[BaseScraper]:
    """Return all scrapers — use only for manual full runs."""
    return [cls() for cls in SCRAPER_CLASSES]


def list_sources() -> List[str]:
    return list(SCRAPER_REGISTRY.keys())

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

SCRAPER_CLASSES: List[Type[BaseScraper]] = [
    # ── Aggregators (highest yield — run first) ──────────────────────────────
    SarkariResultCmScraper,
    FreeJobAlertScraper,
    EmploymentNewsScraper,
    # ── Central Recruitment Bodies ────────────────────────────────────────────
    SSCScraper,
    UPSCScraper,
    RRBScraper,
    IBPSScraper,
    # ── Defence & Research ────────────────────────────────────────────────────
    IndianArmyScraper,
    IndianNavyScraper,
    IndianAirForceScraper,
    ISROScraper,
    DRDOScraper,
    BARCScraper,
    HALScraper,
    BELScraper,
    BEMLScraper,
    # ── Banking, Finance & Insurance ─────────────────────────────────────────
    RBIScraper,
    NABARDScraper,
    NIACLScraper,
    LICScraper,
    # ── Energy & Oil PSUs ─────────────────────────────────────────────────────
    ONGCScraper,
    NTPCScraper,
    HPCLScraper,
    IOCLScraper,
    BPCLScraper,
    GAILScraper,
    CoalIndiaScraper,
    PGCILScraper,
    NHPCScraper,
    # ── Engineering, Steel & Manufacturing PSUs ───────────────────────────────
    BHELScraper,
    SAILScraper,
    NMDCScraper,
    RINLScraper,
    MECLScraper,
    # ── Transport, Infra & Telecom PSUs ──────────────────────────────────────
    NHAIScraper,
    AAIScraper,
    IRCONScraper,
    RITESScraper,
    CONCORScraper,
    BSNLScraper,
    MTNLScraper,
    # ── Health, Food & Other Central Government ───────────────────────────────
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

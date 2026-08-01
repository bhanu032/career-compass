from datetime import date, datetime
from typing import Optional

FORMATS = (
    "%Y-%m-%d",
    "%d-%m-%Y",
    "%d/%m/%Y",
    "%d.%m.%Y",
    "%d %b %Y",
    "%d %B %Y",
    "%b %d, %Y",
    "%B %d, %Y",
)


def parse_date(value: Optional[str]) -> Optional[date]:
    if not value:
        return None
    text = value.strip()
    for fmt in FORMATS:
        try:
            return datetime.strptime(text, fmt).date()
        except ValueError:
            continue
    return None

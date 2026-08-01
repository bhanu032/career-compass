import re
from typing import Optional, Tuple

WHITESPACE = re.compile(r"\s+")
SALARY_NUM = re.compile(r"(\d[\d,]{3,})")


def clean(text: Optional[str]) -> str:
    if not text:
        return ""
    return WHITESPACE.sub(" ", text).strip()


def parse_salary_range(salary: Optional[str]) -> Tuple[Optional[int], Optional[int]]:
    """Extract a numeric (min, max) pay range from a free-form salary string."""
    if not salary:
        return None, None
    numbers = [int(n.replace(",", "")) for n in SALARY_NUM.findall(salary)]
    numbers = [n for n in numbers if n >= 1000]
    if not numbers:
        return None, None
    if len(numbers) == 1:
        return numbers[0], numbers[0]
    return min(numbers), max(numbers)


def absolute_url(base: str, href: Optional[str]) -> Optional[str]:
    if not href:
        return None
    if href.startswith("http://") or href.startswith("https://"):
        return href
    return base.rstrip("/") + "/" + href.lstrip("/")

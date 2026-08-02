"""
Translation utility — Google Translate free API.
- Batches ALL strings from a page into as few HTTP calls as possible
- Hard 5-second timeout; falls back to English silently
- LRU cache (8000 entries) so same string never translated twice
"""
import json
import logging
import urllib.parse
import urllib.request
from functools import lru_cache
from typing import Optional

logger = logging.getLogger(__name__)

_SKIP    = {"en", ""}
_SEP     = "\n---\n"   # multi-line separator unlikely in titles
_TIMEOUT = 5           # seconds per HTTP call; fall back to English on exceed


def _gt(text: str, lang: str) -> Optional[str]:
    """Single Google Translate HTTP call. Returns None on failure."""
    try:
        url = (
            "https://translate.googleapis.com/translate_a/single"
            f"?client=gtx&sl=en&tl={lang}&dt=t&q={urllib.parse.quote(text)}"
        )
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(req, timeout=_TIMEOUT) as resp:
            data = json.loads(resp.read())
        return "".join(p[0] for p in data[0] if p[0])
    except Exception as exc:
        logger.debug("GT %s failed: %s", lang, exc)
        return None


@lru_cache(maxsize=8000)
def _cached(text: str, lang: str) -> str:
    """Translate a single string, with cache. Falls back to original."""
    return _gt(text, lang) or text


def translate_batch(texts: list[str], lang: str) -> list[str]:
    """
    Translate a list of strings in a SINGLE Google Translate call.
    Empty strings pass through unchanged.
    """
    if lang in _SKIP:
        return texts

    active_idx = [i for i, t in enumerate(texts) if t and t.strip()]
    if not active_idx:
        return texts

    # Check cache first — only call API for uncached strings
    results = list(texts)
    uncached_idx = [i for i in active_idx if _cached.cache_info() and
                    (texts[i], lang) not in _get_cache_keys()]
    # Simpler: just build combined and let lru_cache handle deduplication
    combined = _SEP.join(texts[i].strip() for i in active_idx)
    key = f"{lang}|||{combined}"

    translated_combined = _cached_batch(key, lang, combined)
    if not translated_combined:
        return results  # fall back to originals

    parts = translated_combined.split(_SEP)
    for i, part in zip(active_idx, parts):
        if part.strip():
            results[i] = part.strip()
    return results


def _get_cache_keys():
    """Helper to peek at cache — not used, kept for future."""
    return set()


@lru_cache(maxsize=2000)
def _cached_batch(key: str, lang: str, combined: str) -> Optional[str]:
    """Cached single batch call."""
    return _gt(combined, lang)


def translate_text(text: Optional[str], lang: str) -> Optional[str]:
    if text is None:
        return None
    if lang in _SKIP or not text.strip():
        return text
    return _cached(text.strip(), lang)


def translate_json_kv(json_str: Optional[str], lang: str) -> Optional[str]:
    if not json_str or lang in _SKIP:
        return json_str
    try:
        rows: list[dict] = json.loads(json_str)
        labels = translate_batch([r.get("label", "") for r in rows], lang)
        values = translate_batch([r.get("value", "") for r in rows], lang)
        for i, r in enumerate(rows):
            r["label"] = labels[i] or r.get("label", "")
            r["value"] = values[i] or r.get("value", "")
        return json.dumps(rows, ensure_ascii=False)
    except Exception:
        return json_str


def translate_json_vacancy(json_str: Optional[str], lang: str) -> Optional[str]:
    if not json_str or lang in _SKIP:
        return json_str
    try:
        rows: list[dict] = json.loads(json_str)
        names = translate_batch([r.get("post_name", "") for r in rows], lang)
        eligs = translate_batch([r.get("eligibility", "") for r in rows], lang)
        for i, r in enumerate(rows):
            r["post_name"] = names[i] or r.get("post_name", "")
            r["eligibility"] = eligs[i] or r.get("eligibility", "")
        return json.dumps(rows, ensure_ascii=False)
    except Exception:
        return json_str


def translate_json_links(json_str: Optional[str], lang: str) -> Optional[str]:
    if not json_str or lang in _SKIP:
        return json_str
    try:
        rows: list[dict] = json.loads(json_str)
        labels = translate_batch([r.get("label", "") for r in rows], lang)
        for i, r in enumerate(rows):
            r["label"] = labels[i] or r.get("label", "")
        return json.dumps(rows, ensure_ascii=False)
    except Exception:
        return json_str


def translate_json_steps(json_str: Optional[str], lang: str) -> Optional[str]:
    if not json_str or lang in _SKIP:
        return json_str
    try:
        steps: list[str] = json.loads(json_str)
        return json.dumps(translate_batch(steps, lang), ensure_ascii=False)
    except Exception:
        return json_str

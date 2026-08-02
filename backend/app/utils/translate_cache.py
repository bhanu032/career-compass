"""
Background translation pre-warmer.
When a page of jobs is fetched in English, we immediately spin up a background
thread to translate it into all recently-used languages so subsequent
requests hit the LRU cache and respond instantly.
"""
import threading
from typing import Any, Dict, List

_lock = threading.Lock()
_recent_langs: set[str] = set()


def record_lang(lang: str) -> None:
    """Track which languages have been requested."""
    if lang and lang != "en":
        with _lock:
            _recent_langs.add(lang)


def prewarm(jobs: List[Dict[str, Any]], lang: str) -> None:
    """Fire-and-forget background translation to fill the cache."""
    if not jobs or not lang or lang == "en":
        return
    record_lang(lang)

    def _run():
        try:
            from app.utils.job_translator import translate_jobs_parallel
            translate_jobs_parallel(jobs, lang)
        except Exception:
            pass

    t = threading.Thread(target=_run, daemon=True)
    t.start()

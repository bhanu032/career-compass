"""
Scraper for www.SarkariResult.com

Homepage: https://www.sarkariresult.com/
  - Links to individual job detail pages

Detail page structure (single outer table, Table[1]):
  Row 0 : Title / org header
  Row 1 : [Important Dates cell | Application Fee cell]  — two-column
  Row 2 : Age Limit section
  Row 3 : Vacancy Details header
  Row 4+ : inner vacancy table (post_name, total, eligibility)
  ...   : How to Fill Form
  ...   : Important Links table  (Apply Online, Notification, etc.)

All data is scraped and stored locally — no redirects to external site.
"""

import json
import re
from typing import List, Optional

from app.scrapers.base import BaseScraper
from app.schemas.scraper import ScrapedJob
from app.utils.text import clean


class SarkariResultCmScraper(BaseScraper):
    """Scraper for www.SarkariResult.com — Latest Jobs section."""

    source = "sarkari_result"
    name = "DeshKiSeva"
    base_url = "https://www.sarkariresult.com"
    listing_url = "https://www.sarkariresult.com"
    requires_javascript = False

    SKIP_KEYWORDS = (
        "answer key", "merit list",
        "cut off", "syllabus", "correction",
        "score card", "document verification",
    )

    # job_type detection keywords
    ADMIT_CARD_KEYWORDS = ("admit card", "hall ticket", "call letter", "e-admit")
    RESULT_KEYWORDS = ("result", " result ", "final result", "written result", "exam result",
                       "merit list", "score card", "selection list", "interview letter")

    ORG_MAP = {
        "UPSC": "Union Public Service Commission",
        "SSC": "Staff Selection Commission",
        "ISRO": "Indian Space Research Organisation",
        "DRDO": "Defence Research and Development Organisation",
        "IBPS": "Institute of Banking Personnel Selection",
        "RRB": "Railway Recruitment Board",
        "RRC": "Railway Recruitment Cell",
        "BARC": "Bhabha Atomic Research Centre",
        "AIIMS": "All India Institute of Medical Sciences",
        "ONGC": "Oil and Natural Gas Corporation",
        "UPPSC": "Uttar Pradesh Public Service Commission",
        "UPSSSC": "Uttar Pradesh Subordinate Services Selection Commission",
        "BPSC": "Bihar Public Service Commission",
        "RPSC": "Rajasthan Public Service Commission",
        "MPSC": "Maharashtra Public Service Commission",
        "TNPSC": "Tamil Nadu Public Service Commission",
        "RSSB": "Rajasthan Staff Selection Board",
        "RRVUNL": "Rajasthan Rajya Vidyut Utpadan Nigam",
        "JSSC": "Jharkhand Staff Selection Commission",
        "SBI": "State Bank of India",
        "RBI": "Reserve Bank of India",
        "NHM": "National Health Mission",
        "HAL": "Hindustan Aeronautics Limited",
        "BEL": "Bharat Electronics Limited",
        "BHEL": "Bharat Heavy Electricals Limited",
        "NTPC": "NTPC Limited",
        "GAIL": "GAIL India Limited",
        "HPCL": "Hindustan Petroleum Corporation",
        "BPCL": "Bharat Petroleum Corporation",
        "ESIC": "Employees State Insurance Corporation",
        "EPFO": "Employees Provident Fund Organisation",
        "NLC": "NLC India Limited",
        "PGIMER": "PGIMER Chandigarh",
        "NICL": "National Insurance Company Limited",
        "LIC": "Life Insurance Corporation of India",
        "SSB": "Sashastra Seema Bal",
        "BSNL": "Bharat Sanchar Nigam Limited",
        "RCFL": "Rashtriya Chemicals and Fertilizers Limited",
        "MPESB": "Madhya Pradesh Employee Selection Board",
        "CBSE": "Central Board of Secondary Education",
        "BSUSC": "Bihar State University Service Commission",
        "RSMSSB": "Rajasthan Staff Selection Board",
        "RVUNL": "Rajasthan Rajya Vidyut Utpadan Nigam",
        "IIT": "Indian Institute of Technology",
        "NTA": "National Testing Agency",
        "UPSSSC": "Uttar Pradesh Subordinate Services Selection Commission",
        "UPPSC": "Uttar Pradesh Public Service Commission",
        "GATE": "Graduate Aptitude Test in Engineering",
    }

    # ── Listing page ─────────────────────────────────────────────────────────

    def parse(self, html: str) -> List[ScrapedJob]:
        soup = self.soup(html)
        jobs: List[ScrapedJob] = []
        seen: set[str] = set()

        for anchor in soup.find_all("a", href=True):
            href = anchor["href"]
            title = clean(anchor.get_text())

            if not title or len(title) < 8:
                continue
            # Must be an internal sarkariresult.com link
            if "sarkariresult.com" not in href:
                continue
            # Must look like a year-specific post (/2026/slug/ pattern)
            if not re.search(r"/20\d\d/", href):
                continue
            if href in seen:
                continue

            lower = title.lower()
            if any(kw in lower for kw in self.SKIP_KEYWORDS):
                continue

            # Detect content type
            if any(kw in lower for kw in self.ADMIT_CARD_KEYWORDS):
                content_type = "admit_card"
            elif any(kw in lower for kw in self.RESULT_KEYWORDS):
                content_type = "result"
            else:
                content_type = "job"

            seen.add(href)
            detail = self._parse_detail(href)

            jobs.append(
                ScrapedJob(
                    title=detail.get("title") or title[:300],
                    organization=detail.get("organization") or self._guess_org(title) or self.name,
                    qualification=detail.get("qualification"),
                    salary=detail.get("salary"),
                    age_limit=detail.get("age_limit"),
                    last_date=detail.get("last_date"),
                    published_date=detail.get("published_date"),
                    notification_pdf=detail.get("notification_pdf"),
                    application_url=detail.get("apply_url") or href,
                    description=detail.get("description"),
                    selection_process=detail.get("selection_process"),
                    short_info=detail.get("short_info"),
                    state="All India",
                    category=detail.get("category") or self._detect_category(title),
                    vacancies=detail.get("vacancies"),
                    job_type=content_type,
                    important_dates=detail.get("important_dates"),
                    application_fee=detail.get("application_fee"),
                    vacancy_details=detail.get("vacancy_details"),
                    important_links=detail.get("important_links"),
                    how_to_apply=detail.get("how_to_apply"),
                )
            )

            if len(jobs) >= 40:
                break

        return jobs

    # ── Detail page parser ───────────────────────────────────────────────────

    def _parse_detail(self, url: str) -> dict:
        result: dict = {}
        html = self.fetch(url)
        if not html:
            return result

        soup = self.soup(html)

        # ── Title from H1 or the header row of the main content table
        h1 = soup.find("h1")
        if h1:
            result["title"] = clean(h1.get_text())[:300]

        # ── Short info: the "Name Of Post" row in the outer header table
        #    Table[0] has: Name Of Post | <title>, Post Date | <date>, Short Information | <text>
        tables = soup.find_all("table")
        if not tables:
            return result

        header_table = tables[0]
        for row in header_table.find_all("tr"):
            cells = row.find_all(["td", "th"])
            if len(cells) < 2:
                continue
            label = cells[0].get_text(strip=True).lower()
            value = clean(cells[1].get_text())
            if "name of post" in label:
                if not result.get("title"):
                    result["title"] = value[:300]
            elif "short information" in label:
                result["short_info"] = value[:1000]
                result["description"] = value[:800]
            elif "post date" in label or "update" in label:
                result["published_date"] = value

        # ── Main content table (Table[1]) — the big structured block
        if len(tables) < 2:
            return result

        main_table = tables[1]
        # rows are inside tbody — must use recursive=True
        rows = main_table.find_all("tr")

        # State machine to collect consecutive vacancy rows
        in_vacancy_block = False
        vacancy_headers: List[str] = []
        vacancy_rows_raw: List[List[str]] = []

        for row in rows:
            cells = row.find_all(["td", "th"], recursive=False)
            n = len(cells)
            row_text = row.get_text(" ", strip=True)
            row_lower = row_text.lower()

            # ── 3-col row: vacancy header OR data row
            if n == 3:
                texts = [clean(c.get_text()) for c in cells]
                joined = " ".join(texts).lower()
                if "post name" in joined and ("total" in joined or "eligib" in joined):
                    # This is the vacancy header row
                    in_vacancy_block = True
                    vacancy_headers = [t.lower() for t in texts]
                elif in_vacancy_block and any(texts):
                    vacancy_rows_raw.append(texts)
                else:
                    in_vacancy_block = False
                continue

            # Non-3-col row ends vacancy block
            in_vacancy_block = False

            # ── 2-col rows: Important Dates/Fee header | link rows
            if n == 2:
                left_text = cells[0].get_text(" ", strip=True).lower()
                right_text = cells[1].get_text(" ", strip=True).lower()
                left_label = clean(cells[0].get_text())

                # Important Dates + Application Fee side-by-side
                if "important dates" in left_text or "application begin" in left_text:
                    kv = self._parse_kv_cell(cells[0])
                    if kv:
                        result["important_dates"] = json.dumps(kv)
                        for entry in kv:
                            lbl = entry["label"].lower()
                            val = entry["value"]
                            if "last date" in lbl and not result.get("last_date"):
                                result["last_date"] = val
                            if ("application begin" in lbl or "start" in lbl) and not result.get("published_date"):
                                result["published_date"] = val

                if "application fee" in right_text or (
                    "general" in right_text and "obc" in right_text and "sc" in right_text
                ):
                    kv = self._parse_kv_cell(cells[1])
                    if kv:
                        result["application_fee"] = json.dumps(kv)

                # Important links rows
                skip_labels = {
                    "important dates", "application fee",
                    "sarkari result android app", "sarkari result apple ios app",
                    "join sarkari result channel", "some useful important links",
                }
                if left_label.lower() not in skip_labels:
                    anchor = row.find("a", href=True)
                    if anchor:
                        href = anchor["href"].strip()
                        skip_domains = ("whatsapp.com", "t.me", "telegram.me", "sarkariresulttools")
                        if not any(d in href for d in skip_domains):
                            link_text = clean(anchor.get_text()) or "Click Here"
                            existing = json.loads(result.get("important_links", "[]"))
                            existing.append({"label": left_label, "url": href, "link_text": link_text})
                            result["important_links"] = json.dumps(existing)
                            lbl_l = left_label.lower()
                            if "apply online" in lbl_l and not result.get("apply_url"):
                                result["apply_url"] = href
                            if ("notification" in lbl_l) and not result.get("notification_pdf"):
                                result["notification_pdf"] = href
                continue

            # ── 1-col rows
            if n != 1:
                continue

            if "age limit" in row_lower and ("minimum" in row_lower or "year" in row_lower):
                result["age_limit"] = self._extract_age_from_text(row_text)

            if ("how to fill" in row_lower or "how to apply" in row_lower) and not result.get("how_to_apply"):
                steps = [clean(li.get_text()) for li in row.find_all("li") if len(clean(li.get_text())) > 10]
                if not steps:
                    parts = re.split(r"\s*\d+\s*[.)]\s+", row_text)
                    steps = [clean(p) for p in parts[1:] if len(clean(p)) > 15]
                if steps:
                    result["how_to_apply"] = json.dumps(steps[:12])

        # ── Process collected vacancy rows
        if vacancy_rows_raw and not result.get("vacancy_details"):
            vac_list = []
            for texts in vacancy_rows_raw:
                row_dict: dict = {}
                for j, txt in enumerate(texts):
                    if j < len(vacancy_headers):
                        h = vacancy_headers[j]
                        if "post name" in h or "name" in h:
                            row_dict["post_name"] = txt
                        elif "total" in h:
                            row_dict["total"] = txt
                        elif "eligib" in h or "qualif" in h:
                            row_dict["eligibility"] = txt
                        else:
                            row_dict[f"col_{j}"] = txt
                    else:
                        row_dict[f"col_{j}"] = txt
                # Fallback mapping
                if "post_name" not in row_dict:
                    row_dict["post_name"] = texts[0] if texts else ""
                if "total" not in row_dict and len(texts) > 1:
                    row_dict["total"] = texts[1]
                if "eligibility" not in row_dict and len(texts) > 2:
                    row_dict["eligibility"] = texts[2]
                if row_dict.get("post_name"):
                    vac_list.append(row_dict)

            if vac_list:
                result["vacancy_details"] = json.dumps(vac_list)
                total = sum(self._parse_int(r.get("total", "0")) for r in vac_list)
                if total > 0 and not result.get("vacancies"):
                    result["vacancies"] = total
                if not result.get("qualification") and vac_list:
                    elig = vac_list[0].get("eligibility", "")
                    if len(elig) > 10:
                        result["qualification"] = elig[:300]

        # ── Category + org from title
        title_str = result.get("title", "")
        result["category"] = self._detect_category(title_str)
        org = self._guess_org(title_str)
        if org:
            result["organization"] = org

        # ── Fallback: vacancies from full text
        if not result.get("vacancies"):
            result["vacancies"] = self._extract_vacancies(soup.get_text(" ", strip=True))

        # ── Fallback: last_date from full text
        if not result.get("last_date"):
            result["last_date"] = self._extract_last_date(soup.get_text(" ", strip=True))

        # ── Fallback: qualification from text
        if not result.get("qualification"):
            result["qualification"] = self._extract_qualification(soup.get_text(" ", strip=True))

        return result

    # ── Cell / table parsers ─────────────────────────────────────────────────

    def _parse_kv_cell(self, cell) -> List[dict]:
        """Parse a table cell where labels and values are on separate lines.
        SarkariResult formats:
          Format A (dates):
            Application Begin
            :
            18/07/2026
          Format B (fee):
            General / OBC / EWS
            : 850/-
          Format C (one line):
            Pay Fee Last Date : 07/08/2026
        """
        rows = []
        lines = [clean(ln) for ln in cell.get_text("\n", strip=True).splitlines()]
        lines = [ln for ln in lines if ln]

        # Skip the section heading (first line like "Important Dates" / "Application Fee")
        start = 1 if lines and lines[0].lower() in ("important dates", "application fee") else 0
        lines = lines[start:]

        i = 0
        while i < len(lines):
            line = lines[i]

            # Format C: "Label : Value" on one line
            if " : " in line and not line.startswith(":"):
                parts = line.split(" : ", 1)
                label = parts[0].strip()
                value = parts[1].strip()
                if label and value:
                    rows.append({"label": label, "value": value})
                i += 1

            # Format A: label, then bare ":" on next line, then value
            elif i + 2 < len(lines) and lines[i + 1].strip() == ":":
                label = line
                value = lines[i + 2]
                rows.append({"label": label, "value": value})
                i += 3

            # Format B: label, then ": value" on next line
            elif i + 1 < len(lines) and lines[i + 1].startswith(":"):
                label = line
                value = lines[i + 1].lstrip(": ").strip()
                if label and value:
                    rows.append({"label": label, "value": value})
                i += 2

            # Standalone note (no colon, long sentence) — skip
            else:
                i += 1

        return [r for r in rows if r.get("label") and r.get("value")]

    def _parse_links_table(self, table) -> List[dict]:
        """Extract [{label, url, link_text}] from a links table."""
        links = []
        for tr in table.find_all("tr"):
            cells = tr.find_all(["td", "th"])
            if not cells:
                continue
            label = clean(cells[0].get_text())
            # Skip pure header/section rows
            if label.lower() in (
                "some useful important links", "important links", "link name", ""
            ):
                continue
            anchor = tr.find("a", href=True)
            if anchor:
                href = anchor["href"].strip()
                # Skip social/internal/tool links
                if any(s in href for s in ["whatsapp.com", "telegram.me", "t.me", "sarkariresulttools"]):
                    continue
                link_text = clean(anchor.get_text()) or "Click Here"
                links.append({"label": label, "url": href, "link_text": link_text})
        return links

    def _parse_vacancy_table(self, table) -> List[dict]:
        """Extract [{post_name, total, eligibility, ...}] from vacancy table."""
        rows = []
        header_row = None
        all_rows = table.find_all("tr")

        for i, tr in enumerate(all_rows):
            cells = tr.find_all(["td", "th"])
            texts = [clean(c.get_text()) for c in cells]

            if not any(texts):
                continue

            # First row is header
            if i == 0 or any(
                kw in " ".join(texts).lower()
                for kw in ("post name", "total post", "eligibility", "qualification")
            ):
                header_row = [t.lower() for t in texts]
                continue

            if not texts or not texts[0]:
                continue

            row: dict = {}
            if header_row:
                for j, txt in enumerate(texts):
                    if j >= len(header_row):
                        row[f"col_{j}"] = txt
                        continue
                    h = header_row[j]
                    if "post name" in h or ("post" in h and "name" in h):
                        row["post_name"] = txt
                    elif "total" in h or "post" in h:
                        row["total"] = txt
                    elif "eligib" in h or "qualif" in h or "education" in h:
                        row["eligibility"] = txt
                    else:
                        row[f"col_{j}"] = txt
            else:
                row = {
                    "post_name": texts[0] if len(texts) > 0 else "",
                    "total": texts[1] if len(texts) > 1 else "",
                    "eligibility": texts[2] if len(texts) > 2 else "",
                }

            if row.get("post_name"):
                rows.append(row)

        return rows

    # ── Text extraction helpers ───────────────────────────────────────────────

    def _extract_age_from_text(self, text: str) -> Optional[str]:
        m = re.search(
            r"(?:minimum|min)\.?\s*age\s*[:\-–]?\s*(\d+)\s+years?.{0,80}?(?:maximum|max)\.?\s*age\s*[:\-–]?\s*(\d+)\s+years?",
            text, re.IGNORECASE | re.DOTALL,
        )
        if m:
            return f"{m.group(1)}-{m.group(2)} Years"
        m = re.search(r"age\s*[:\-–]?\s*([\d]{2,3})\s*[-–to]+\s*([\d]{2,3})\s+years?", text, re.I)
        if m:
            return f"{m.group(1)}-{m.group(2)} Years"
        return None

    def _extract_last_date(self, text: str) -> Optional[str]:
        patterns = [
            r"last\s+date\s+(?:for\s+apply\s+online\s*[:\-–]?\s*)(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})",
            r"last\s+date\s*[:\-–]?\s*(\d{1,2}\s+\w+\s+\d{4})",
            r"last\s+date\s*[:\-–]?\s*(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})",
            r"apply\s+(?:before|till|by)\s*[:\-–]?\s*(\d{1,2}\s+\w+\s+\d{4})",
        ]
        for pat in patterns:
            m = re.search(pat, text, re.IGNORECASE)
            if m:
                return m.group(1).strip()
        return None

    def _extract_vacancies(self, text: str) -> Optional[int]:
        patterns = [
            r"total\s+post[s]?\s*[:\-–]?\s*(\d[\d,]+)",
            r"(\d[\d,]+)\s+post[s]?\s+(?:total|available)",
            r"\((\d[\d,]+)\s+post[s]?\)",
            r"total\s+(?:vacancy|vacancies)\s*[:\-–]?\s*(\d[\d,]+)",
        ]
        for pat in patterns:
            m = re.search(pat, text, re.IGNORECASE)
            if m:
                try:
                    val = int(m.group(1).replace(",", ""))
                    if 1 <= val <= 500_000:
                        return val
                except ValueError:
                    pass
        return None

    def _extract_qualification(self, text: str) -> Optional[str]:
        m = re.search(
            r"(?:qualification|eligibility|education)\s*[:\-–]?\s*([^\n.]{15,250})",
            text, re.IGNORECASE,
        )
        if m:
            return clean(m.group(1))[:300]
        m = re.search(
            r"((?:10th|12th|bachelor|master|degree|diploma|b\.?tech|b\.?sc|graduate)[^\n.]{0,150})",
            text, re.IGNORECASE,
        )
        if m:
            return clean(m.group(1))[:200]
        return None

    def _parse_int(self, value: str) -> int:
        try:
            return int(str(value).replace(",", "").strip())
        except (ValueError, AttributeError):
            return 0

    def _guess_org(self, title: str) -> Optional[str]:
        if not title:
            return None
        title_upper = title.upper()
        # 1. Check abbreviation map first
        for abbr, full in self.ORG_MAP.items():
            if re.search(r"\b" + abbr + r"\b", title_upper):
                return full
        # 2. Extract org from common title patterns like:
        #    "Bihar BSUSC Assistant..." → already caught above
        #    "UP Anganwadi..." → Uttar Pradesh Anganwadi
        #    "Rajasthan State Eligibility..." → Rajasthan Government
        #    "RCFL Management Trainee..." → caught above
        #    "Patan High Court..." → Patan High Court
        #    "Shri Krishna Ayush University..." → Shri Krishna Ayush University
        patterns = [
            # "XYZ University ..."
            r"^([\w\s]+?(?:University|Institute|Board|Commission|Corporation|Department|Council|Authority|Court|Bank|Force|Bureau|Academy|Mission|College|Trust|Society))\b",
            # "State name + body" e.g. "Bihar Public Service..."
            r"^((?:Uttar Pradesh|Bihar|Rajasthan|Maharashtra|Tamil Nadu|Madhya Pradesh|Gujarat|Karnataka|Odisha|West Bengal|Haryana|Himachal Pradesh|Assam|Punjab|Jharkhand|Chhattisgarh|Uttarakhand)\s[\w\s]+?(?:Commission|Board|Department|Council|Authority|Corporation|Mission|Police|Court))\b",
        ]
        for pat in patterns:
            m = re.search(pat, title, re.IGNORECASE)
            if m:
                org = clean(m.group(1))
                if 5 < len(org) < 80:
                    return org
        return None

    def _detect_category(self, text: str) -> str:
        tl = text.lower()
        if any(w in tl for w in ["railway", "rrb", "rrc", "section controller", "loco pilot"]):
            return "Railway"
        if any(w in tl for w in ["bank", "ibps", "sbi ", "rbi ", "nabard", "clerk", "nicl", "lic "]):
            return "Banking"
        if any(w in tl for w in ["defence", " army", " navy", "air force", "drdo", "agniveer"]):
            return "Defence"
        if any(w in tl for w in ["doctor", "nurse", "medical", "aiims", "health", "hospital"]):
            return "Medical"
        if any(w in tl for w in ["teacher", "professor", "lecturer", "tgt", "pgt", "prt"]):
            return "Teaching"
        if any(w in tl for w in ["engineer", "isro", "barc", "scientist", "research"]):
            return "Engineering"
        if any(w in tl for w in ["ongc", " bel ", "bhel", " hal ", "ntpc", "gail", "hpcl", "bpcl"]):
            return "PSU"
        return "Central Government"

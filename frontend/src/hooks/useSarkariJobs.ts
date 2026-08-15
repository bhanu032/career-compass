/**
 * useSarkariJobs
 * Fetches live Sarkari job listings from SarkariResult.com and SarkariExam.com
 * via their public RSS feeds, proxied through CORS proxies.
 * Deduplicates by (normalizedTitle + domain) and caches for 10 minutes.
 */

import { useQuery } from "@tanstack/react-query";

// ─── Types ────────────────────────────────────────────────────────────────────
export interface SarkariJob {
  id: string;
  title: string;
  link: string;
  pubDate: string;
  formattedDate: string;
  description: string;
  source: "SarkariResult" | "SarkariExam";
  category: string;
}

export interface SarkariJobsResult {
  jobs: SarkariJob[];
  errors: { source: string; message: string }[];
  counts: { total: number; sarkariResult: number; sarkariExam: number };
}

// ─── RSS Feed URLs ────────────────────────────────────────────────────────────
const RSS_FEEDS = {
  SarkariResult: "https://www.sarkariresult.com/feed/",
  SarkariExam: "https://www.sarkariexam.com/feed/",
} as const;

// ─── CORS Proxies (tried in order) ───────────────────────────────────────────
const CORS_PROXIES = [
  "https://api.allorigins.win/raw?url=",
  "https://corsproxy.io/?url=",
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 90);
}

function extractDomain(url: string): string {
  try {
    return new URL(url).hostname.replace("www.", "");
  } catch {
    return url.slice(0, 40);
  }
}

function makeDedupeKey(title: string, link: string): string {
  return `${normalizeText(title)}||${extractDomain(link)}`;
}

function formatDate(dateStr: string): string {
  if (!dateStr) return "Recent";
  try {
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 280);
}

// ─── RSS Fetcher ──────────────────────────────────────────────────────────────
async function fetchRaw(url: string): Promise<string> {
  let lastErr: Error | null = null;

  for (const proxy of CORS_PROXIES) {
    try {
      const proxyUrl = `${proxy}${encodeURIComponent(url)}`;
      const res = await fetch(proxyUrl, {
        headers: { Accept: "application/xml, text/xml, */*" },
        signal: AbortSignal.timeout(14_000),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.text();
    } catch (err) {
      lastErr = err instanceof Error ? err : new Error(String(err));
    }
  }

  throw lastErr ?? new Error("All proxies failed");
}

// ─── XML Parser ───────────────────────────────────────────────────────────────
function parseRss(
  xml: string,
  source: "SarkariResult" | "SarkariExam"
): SarkariJob[] {
  try {
    const doc = new DOMParser().parseFromString(xml, "text/xml");
    const items = Array.from(doc.querySelectorAll("item"));

    return items.map((item, idx) => {
      const title =
        item.querySelector("title")?.textContent?.trim() ?? "(No title)";
      const link =
        item.querySelector("link")?.textContent?.trim() ||
        item.querySelector("guid")?.textContent?.trim() ||
        "";
      const pubDate =
        item.querySelector("pubDate")?.textContent?.trim() ?? "";
      const rawDesc =
        item.querySelector("description")?.textContent?.trim() ?? "";
      const category =
        item.querySelector("category")?.textContent?.trim() ?? "";

      return {
        id: `${source}-${idx}-${Date.now()}`,
        title,
        link,
        pubDate,
        formattedDate: formatDate(pubDate),
        description: stripHtml(rawDesc),
        source,
        category,
      };
    });
  } catch {
    return [];
  }
}

// ─── Core Fetcher ─────────────────────────────────────────────────────────────
async function fetchAllSarkariJobs(): Promise<SarkariJobsResult> {
  const sources = ["SarkariResult", "SarkariExam"] as const;

  const results = await Promise.allSettled(
    sources.map((src) =>
      fetchRaw(RSS_FEEDS[src]).then((xml) => parseRss(xml, src))
    )
  );

  const allJobs: SarkariJob[] = [];
  const errors: { source: string; message: string }[] = [];

  results.forEach((result, i) => {
    if (result.status === "fulfilled") {
      allJobs.push(...result.value);
    } else {
      errors.push({
        source: sources[i],
        message:
          result.reason instanceof Error
            ? result.reason.message
            : "Unknown error",
      });
    }
  });

  // ── Deduplicate ──────────────────────────────────────────────────────────
  const seen = new Set<string>();
  const dedupedJobs = allJobs.filter((job) => {
    const key = makeDedupeKey(job.title, job.link);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  // ── Sort newest-first ────────────────────────────────────────────────────
  dedupedJobs.sort((a, b) => {
    try {
      return new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime();
    } catch {
      return 0;
    }
  });

  return {
    jobs: dedupedJobs,
    errors,
    counts: {
      total: dedupedJobs.length,
      sarkariResult: dedupedJobs.filter((j) => j.source === "SarkariResult")
        .length,
      sarkariExam: dedupedJobs.filter((j) => j.source === "SarkariExam")
        .length,
    },
  };
}

// ─── Hook ─────────────────────────────────────────────────────────────────────
export function useSarkariJobs() {
  return useQuery({
    queryKey: ["sarkari-jobs"],
    queryFn: fetchAllSarkariJobs,
    staleTime: 10 * 60 * 1000,   // 10 minutes
    gcTime: 15 * 60 * 1000,      // Keep in cache 15 minutes
    retry: 1,
  });
}

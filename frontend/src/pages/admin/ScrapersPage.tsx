import { useMemo, useState } from "react";
import { Check, Key, Loader2, Play, Search, Zap } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Skeleton } from "@/components/Skeleton";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { useScraperLogs, useRunScraper } from "@/hooks/useAdmin";
import { SCRAPER_SOURCES } from "@/utils/constants";
import { formatDateTime, formatNumber } from "@/utils/format";
import { fetchJobsFromApify } from "@/services/apifyScraper";

export function AdminScrapersPage(): JSX.Element {
  const { t } = useTranslation();
  useDocumentTitle("Scrapers — DeshKiSeva");
  const { data, isLoading } = useScraperLogs();
  const runScraper = useRunScraper();

  const [apifyToken, setApifyToken] = useState(
    () => localStorage.getItem("apify_api_token") || ""
  );
  const [apifyQuery, setApifyQuery] = useState("Software Engineer");
  const [isApifyRunning, setIsApifyRunning] = useState(false);
  const [apifyStatus, setApifyStatus] = useState<string | null>(null);

  const [scraperFilter, setScraperFilter] = useState("");

  const filteredScraperSources = useMemo(() => {
    if (!scraperFilter.trim()) return SCRAPER_SOURCES;
    const q = scraperFilter.toLowerCase().trim();
    return SCRAPER_SOURCES.filter((s) => s.toLowerCase().includes(q));
  }, [scraperFilter]);

  function handleSaveApifyToken() {
    const trimmed = apifyToken.trim();
    if (trimmed) {
      localStorage.setItem("apify_api_token", trimmed);
      setApifyStatus("Apify API token saved successfully!");
    } else {
      localStorage.removeItem("apify_api_token");
      setApifyStatus("Apify API token cleared.");
    }
  }

  async function handleRunApifyScraper() {
    if (!apifyToken.trim()) {
      setApifyStatus("Please enter an Apify API token first.");
      return;
    }

    setIsApifyRunning(true);
    setApifyStatus(`Running Apify LinkedIn/Indeed Scraper for "${apifyQuery}"...`);

    try {
      const res = await fetchJobsFromApify({ query: apifyQuery, token: apifyToken });
      setApifyStatus(`✅ Successfully scraped ${res.totalFound} live jobs via Apify!`);
    } catch (err) {
      setApifyStatus(`⚠️ Apify Error: ${err instanceof Error ? err.message : "Scraper run failed"}`);
    } finally {
      setIsApifyRunning(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Live Job Scrapers Control Center</h1>
        <p className="text-xs text-slate-500">46+ Automated &amp; Manual Scrapers for Govt Portals (SarkariResult, SSC, UPSC, RRB) &amp; Private Portals (Apify)</p>
      </div>

      {/* Apify Job Scraper API Section */}
      <section className="card p-6 border-violet-200 bg-gradient-to-br from-violet-50/50 via-white to-indigo-50/30 dark:border-violet-900/40 dark:from-violet-950/20 dark:to-slate-900">
        <div className="flex items-center gap-2 mb-3">
          <Zap className="h-5 w-5 text-violet-600 shrink-0" />
          <h2 className="text-base font-bold text-slate-900 dark:text-white">Apify Job Scraper API (Private Jobs)</h2>
        </div>
        <p className="text-xs text-slate-600 dark:text-slate-300 mb-4">
          Connect your Apify API Token (<code className="text-violet-600 font-bold">apify_api_...</code>) to execute cloud-hosted job scrapers for LinkedIn, Indeed, Glassdoor, and Google Jobs.
        </p>

        <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
          <div className="relative">
            <Key className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <input
              type="password"
              value={apifyToken}
              onChange={(e) => setApifyToken(e.target.value)}
              placeholder="Paste Apify API Token (apify_api_...)"
              className="input pl-10 text-xs w-full"
            />
          </div>
          <button
            type="button"
            onClick={handleSaveApifyToken}
            className="btn-primary text-xs py-2 px-4 shrink-0 gap-1.5"
          >
            <Check className="h-4 w-4" /> Save Token
          </button>
        </div>

        <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-col gap-3 sm:flex-row sm:items-center">
          <input
            type="text"
            value={apifyQuery}
            onChange={(e) => setApifyQuery(e.target.value)}
            placeholder="Search keyword (e.g. Software Engineer, React Developer, Bank PO)..."
            className="input text-xs flex-1"
          />
          <button
            type="button"
            onClick={handleRunApifyScraper}
            disabled={isApifyRunning}
            className="btn-secondary text-xs py-2 px-4 shrink-0 gap-1.5"
          >
            {isApifyRunning ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
            {isApifyRunning ? "Scraping via Apify..." : "Run Live Apify Scraper"}
          </button>
        </div>

        {apifyStatus && (
          <p className="mt-3 text-xs font-semibold text-violet-700 dark:text-violet-300">{apifyStatus}</p>
        )}
      </section>

      {/* Manual Internal Scraper Runs for all 46+ Portals */}
      <section className="card p-6 space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-400">
              Government &amp; Official Scrapers ({SCRAPER_SOURCES.length})
            </h2>
            <p className="text-xs text-slate-500">Run manual fetch for SarkariResult, FreeJobAlert, UPSC, SSC, Railways, Defense &amp; PSUs</p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              value={scraperFilter}
              onChange={(e) => setScraperFilter(e.target.value)}
              placeholder="Filter scrapers (e.g. ssc, rrb, army)..."
              className="input pl-9 text-xs w-full py-1.5"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-2 max-h-80 overflow-y-auto p-1 border border-slate-100 dark:border-slate-800 rounded-xl bg-slate-50/50 dark:bg-slate-900/40">
          {filteredScraperSources.map((source) => (
            <button
              key={source}
              type="button"
              className="btn-secondary text-xs py-1.5 px-3 uppercase tracking-wide font-bold"
              disabled={runScraper.isPending}
              onClick={() => runScraper.mutate(source)}
            >
              {runScraper.isPending && runScraper.variables === source ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin text-violet-600" />
              ) : (
                <Play className="h-3.5 w-3.5 text-emerald-600" />
              )}
              {source}
            </button>
          ))}
          {filteredScraperSources.length === 0 && (
            <p className="text-xs text-slate-400 p-4">No scrapers match "{scraperFilter}".</p>
          )}
        </div>
      </section>

      {/* Scraper History Logs */}
      <section className="card p-6">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-400">{t("common.runHistory")}</h2>
        {isLoading ? (
          <Skeleton className="mt-4 h-60 w-full" />
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-xs uppercase tracking-wide text-slate-400">
                <tr>
                  <th className="py-2 pr-4">{t("common.source")}</th>
                  <th className="py-2 pr-4">{t("common.status")}</th>
                  <th className="py-2 pr-4">{t("common.found")}</th>
                  <th className="py-2 pr-4">{t("common.new")}</th>
                  <th className="py-2 pr-4">{t("common.started")}</th>
                  <th className="py-2">{t("common.error")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {data?.items.map((log) => (
                  <tr key={log.id}>
                    <td className="py-2.5 pr-4 font-medium text-slate-800 dark:text-slate-100">{log.source}</td>
                    <td className="py-2.5 pr-4">
                      <span className={log.status === "success" ? "badge-success" : "badge-danger"}>
                        {log.status}
                      </span>
                    </td>
                    <td className="py-2.5 pr-4 text-slate-600 dark:text-slate-300">{formatNumber(log.items_found)}</td>
                    <td className="py-2.5 pr-4 text-slate-600 dark:text-slate-300">{formatNumber(log.items_created)}</td>
                    <td className="py-2.5 pr-4 text-slate-500">{formatDateTime(log.started_at)}</td>
                    <td className="max-w-xs truncate py-2.5 text-red-600 dark:text-red-400">{log.message ?? "—"}</td>
                  </tr>
                ))}
                {(data?.items?.length ?? 0) === 0 && (
                  <tr>
                    <td colSpan={6} className="py-6 text-center text-slate-400">
                      {t("common.noScraperRuns")}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

import { Loader2, Play } from "lucide-react";

import { Skeleton } from "@/components/Skeleton";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { useScraperLogs, useRunScraper } from "@/hooks/useAdmin";
import { SCRAPER_SOURCES } from "@/utils/constants";
import { formatDateTime, formatNumber } from "@/utils/format";

export function AdminScrapersPage(): JSX.Element {
  useDocumentTitle("Scrapers — GovJobs Portal");
  const { data, isLoading } = useScraperLogs();
  const runScraper = useRunScraper();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Scrapers</h1>

      <section className="card p-6">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-400">Run manually</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {SCRAPER_SOURCES.map((source) => (
            <button
              key={source}
              type="button"
              className="btn-secondary"
              disabled={runScraper.isPending}
              onClick={() => runScraper.mutate(source)}
            >
              {runScraper.isPending && runScraper.variables === source
                ? <Loader2 className="h-4 w-4 animate-spin" />
                : <Play className="h-4 w-4" />}
              {source}
            </button>
          ))}
        </div>
      </section>

      <section className="card p-6">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-400">Run history</h2>
        {isLoading ? (
          <Skeleton className="mt-4 h-60 w-full" />
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-xs uppercase tracking-wide text-slate-400">
                <tr>
                  <th className="py-2 pr-4">Source</th>
                  <th className="py-2 pr-4">Status</th>
                  <th className="py-2 pr-4">Found</th>
                  <th className="py-2 pr-4">New</th>
                  <th className="py-2 pr-4">Started</th>
                  <th className="py-2">Error</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {data?.items.map((log) => (
                  <tr key={log.id}>
                    <td className="py-2.5 pr-4 font-medium text-slate-800 dark:text-slate-100">{log.source}</td>
                    <td className="py-2.5 pr-4">
                      <span className={log.status === "success" ? "badge-success" : "badge-danger"}>{log.status}</span>
                    </td>
                    <td className="py-2.5 pr-4 text-slate-600 dark:text-slate-300">{formatNumber(log.jobs_found)}</td>
                    <td className="py-2.5 pr-4 text-slate-600 dark:text-slate-300">{formatNumber(log.jobs_created)}</td>
                    <td className="py-2.5 pr-4 text-slate-500">{formatDateTime(log.started_at)}</td>
                    <td className="max-w-xs truncate py-2.5 text-red-600 dark:text-red-400">{log.error_message ?? "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

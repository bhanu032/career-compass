import { Briefcase, Clock, Users } from "lucide-react";
import { useTranslation } from "react-i18next";

import { StatCard } from "@/components/StatCard";
import { Skeleton } from "@/components/Skeleton";
import { useAdminStats } from "@/hooks/useAdmin";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { formatDateTime, formatNumber } from "@/utils/format";

export function AdminDashboardPage(): JSX.Element {
  const { t } = useTranslation();
  useDocumentTitle("Admin dashboard — DeshKiSeva");
  const { data, isLoading } = useAdminStats();

  if (isLoading) return <Skeleton className="h-72 w-full" />;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{t("common.dashboard")}</h1>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label={t("common.totalJobs")} value={formatNumber(data?.total_jobs)} icon={Briefcase} />
        <StatCard label={t("common.activeJobs")} value={formatNumber(data?.active_jobs)} icon={Clock} />
        <StatCard label={t("common.registeredUsers")} value={formatNumber(data?.total_users)} icon={Users} />
      </div>

      <section className="card p-6">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">{t("common.recentScrapers")}</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-xs uppercase tracking-wide text-slate-400">
              <tr>
                <th className="py-2 pr-4">{t("common.source")}</th>
                <th className="py-2 pr-4">{t("common.status")}</th>
                <th className="py-2 pr-4">{t("common.found")}</th>
                <th className="py-2 pr-4">{t("common.new")}</th>
                <th className="py-2">{t("common.finished")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {(data?.recent_scraper_runs ?? []).map((run) => (
                <tr key={run.id}>
                  <td className="py-2.5 pr-4 font-medium text-slate-800 dark:text-slate-100">{run.source}</td>
                  <td className="py-2.5 pr-4">
                    <span className={run.status === "success" ? "badge-success" : "badge-danger"}>{run.status}</span>
                  </td>
                  <td className="py-2.5 pr-4 text-slate-600 dark:text-slate-300">{formatNumber(run.jobs_found)}</td>
                  <td className="py-2.5 pr-4 text-slate-600 dark:text-slate-300">{formatNumber(run.jobs_created)}</td>
                  <td className="py-2.5 text-slate-500">{formatDateTime(run.finished_at)}</td>
                </tr>
              ))}
              {(data?.recent_scraper_runs?.length ?? 0) === 0 && (
                <tr><td colSpan={5} className="py-6 text-center text-slate-400">{t("common.noScraperRuns")}</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

import { Bookmark, BookmarkCheck, Building2, CalendarClock, GraduationCap, IndianRupee, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { useAuth } from "@/hooks/useAuth";
import { useToggleBookmark } from "@/hooks/useBookmarks";
import type { Job } from "@/types";
import { classNames, daysRemaining, formatDate, formatSalary } from "@/utils/format";

interface JobCardProps { job: Job; compact?: boolean; }

export function JobCard({ job, compact = false }: JobCardProps): JSX.Element {
  const { t } = useTranslation();
  const { isAuthenticated } = useAuth();
  const { toggle, ids, isPending } = useToggleBookmark();
  const bookmarked = ids.includes(job.id);
  const remaining = daysRemaining(job.last_date);

  return (
    <article className="card animate-fade-up flex flex-col p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <Link to={`/jobs/${job.id}`} className="line-clamp-2 text-base font-semibold text-slate-900 hover:text-brand-600 dark:text-white dark:hover:text-brand-400">
            {job.title}
          </Link>
          <p className="mt-1.5 flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400">
            <Building2 className="h-4 w-4 shrink-0" />
            <span className="truncate">{job.organization}</span>
          </p>
        </div>
        {isAuthenticated && (
          <button type="button" onClick={() => toggle(job.id)} disabled={isPending}
            aria-label={bookmarked ? t("jobDetail.saved") : t("jobDetail.save")}
            className={classNames("grid h-9 w-9 shrink-0 place-items-center rounded-xl border transition",
              bookmarked ? "border-brand-200 bg-brand-50 text-brand-600 dark:border-brand-800 dark:bg-brand-900/40 dark:text-brand-300"
                         : "border-slate-200 text-slate-400 hover:text-brand-600 dark:border-slate-700")}>
            {bookmarked ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
          </button>
        )}
      </div>

      {!compact && (
        <dl className="mt-4 grid grid-cols-1 gap-2.5 text-sm sm:grid-cols-2">
          <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
            <GraduationCap className="h-4 w-4 shrink-0 text-brand-500" />
            <span className="truncate">{job.qualification ?? t("jobs.anyGraduate")}</span>
          </div>
          <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
            <IndianRupee className="h-4 w-4 shrink-0 text-brand-500" />
            <span className="truncate">{formatSalary(job.salary, job.salary_min, job.salary_max)}</span>
          </div>
          <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
            <MapPin className="h-4 w-4 shrink-0 text-brand-500" />
            <span className="truncate">{job.state ?? t("jobs.allIndia")}</span>
          </div>
          <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
            <CalendarClock className="h-4 w-4 shrink-0 text-brand-500" />
            <span className="truncate">{formatDate(job.last_date)}</span>
          </div>
        </dl>
      )}

      <div className="mt-4 flex flex-wrap items-center gap-2">
        {job.category && <span className="badge">{job.category}</span>}
        {job.vacancies ? <span className="badge">{t("jobs.posts", { count: job.vacancies.toLocaleString("en-IN") })}</span> : null}
        {remaining !== null && remaining >= 0 && (
          <span className={classNames("inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium",
            remaining <= 7 ? "bg-red-50 text-red-600 dark:bg-red-950/50 dark:text-red-300"
                           : "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300")}>
            {remaining === 0 ? t("jobs.closesToday") : t("jobs.daysLeft", { count: remaining })}
          </span>
        )}
      </div>

      <Link to={`/jobs/${job.id}`} className="btn-primary mt-5 w-full">{t("jobs.viewDetails")}</Link>
    </article>
  );
}

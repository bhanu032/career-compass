import { Building2, CalendarClock, Download, ExternalLink, FileText } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

import type { Job } from "@/types";
import { formatDate } from "@/utils/format";

interface ContentCardProps { job: Job; type: "admit_card" | "result"; }

export function ContentCard({ job, type }: ContentCardProps): JSX.Element {
  const { t } = useTranslation();
  const isAdmitCard = type === "admit_card";
  const detailPath = isAdmitCard ? `/admit-cards/${job.id}` : `/results/${job.id}`;

  return (
    <article className="card animate-fade-up flex flex-col p-5">
      <div className="min-w-0">
        <Link to={detailPath} className="line-clamp-2 text-base font-semibold text-slate-900 hover:text-brand-600 dark:text-white dark:hover:text-brand-400">
          {job.title}
        </Link>
        <p className="mt-1.5 flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400">
          <Building2 className="h-4 w-4 shrink-0" />
          <span className="truncate">{job.organization}</span>
        </p>
      </div>

      <dl className="mt-4 grid grid-cols-1 gap-2 text-sm">
        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
          <CalendarClock className="h-4 w-4 shrink-0 text-brand-500" />
          <span className="truncate">
            {isAdmitCard ? t("admitCards.available") : t("results.declared")}
            {formatDate(job.published_date) || t("common.checkOfficialSite")}
          </span>
        </div>
      </dl>

      <div className="mt-4 flex flex-wrap gap-2">
        {job.category && <span className="badge">{job.category}</span>}
        <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${isAdmitCard ? "bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300" : "bg-green-50 text-green-700 dark:bg-green-950/50 dark:text-green-300"}`}>
          {isAdmitCard ? t("admitCards.badge") : t("results.badge")}
        </span>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        {job.application_url ? (
          <a href={job.application_url} target="_blank" rel="noreferrer noopener" className="btn-primary text-xs py-2">
            {isAdmitCard ? <><Download className="h-3.5 w-3.5" /> {t("admitCards.download")}</> : <><ExternalLink className="h-3.5 w-3.5" /> {t("results.viewResult")}</>}
          </a>
        ) : (
          <Link to={detailPath} className="btn-primary text-xs py-2">
            <FileText className="h-3.5 w-3.5" /> {t("common.viewLinks")}
          </Link>
        )}
        <Link to={detailPath} className="btn-secondary text-xs py-2">{t("common.fullDetails")}</Link>
      </div>
    </article>
  );
}

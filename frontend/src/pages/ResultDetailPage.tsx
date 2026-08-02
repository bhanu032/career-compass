import { Bookmark, BookmarkCheck, CalendarCheck, ChevronRight, ExternalLink, FileText, Info, Link2, Trophy, Users } from "lucide-react";
import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { ShareButton } from "@/components/ShareButton";
import { Skeleton } from "@/components/Skeleton";
import { useAuth } from "@/hooks/useAuth";
import { useToggleBookmark } from "@/hooks/useBookmarks";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { useJob } from "@/hooks/useJobs";
import { useRecentlyViewed } from "@/hooks/useRecentlyViewed";
import type { Job } from "@/types";
import { formatDate, formatNumber } from "@/utils/format";

function parseJson<T>(raw: string | null | undefined): T[] {
  if (!raw) return [];
  try { const p = JSON.parse(raw); return Array.isArray(p) ? p as T[] : []; } catch { return []; }
}
interface KVRow { label: string; value: string; }
interface VacancyRow { post_name?: string; total?: string; eligibility?: string; [key: string]: string | undefined; }
interface LinkRow { label: string; url: string; link_text: string; }

function SectionH({ icon: Icon, title }: { icon: React.ElementType; title: string }) {
  return (
    <div className="flex items-center gap-2 border-b-2 border-emerald-500 pb-2 mb-4">
      <Icon className="h-5 w-5 text-emerald-600"/>
      <h2 className="text-base font-bold text-emerald-700 dark:text-emerald-400">{title}</h2>
    </div>
  );
}
function KVTable({ rows }: { rows: KVRow[] }) {
  if (!rows.length) return null;
  return (
    <table className="w-full text-sm border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
      <tbody>{rows.map((r, i) => (
        <tr key={i} className={i%2===0?"bg-white dark:bg-slate-900":"bg-slate-50 dark:bg-slate-800"}>
          <td className="px-4 py-2.5 font-medium text-slate-700 dark:text-slate-200 w-1/2 border-r border-slate-200 dark:border-slate-700">{r.label}</td>
          <td className="px-4 py-2.5 font-semibold text-slate-700 dark:text-slate-200">{r.value}</td>
        </tr>
      ))}</tbody>
    </table>
  );
}
function VacancyTable({ rows, t }: { rows: VacancyRow[]; t: (k: string) => string }) {
  if (!rows.length) return null;
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
        <thead><tr className="bg-slate-100 dark:bg-slate-800">
          <th className="px-4 py-2.5 text-left font-semibold text-slate-700 dark:text-slate-200 border-r border-slate-200 dark:border-slate-700">{t("common.postName")}</th>
          <th className="px-4 py-2.5 text-center font-semibold text-slate-700 dark:text-slate-200 border-r border-slate-200 dark:border-slate-700">{t("common.vacancies")}</th>
          <th className="px-4 py-2.5 text-left font-semibold text-slate-700 dark:text-slate-200">{t("common.eligibility")}</th>
        </tr></thead>
        <tbody>{rows.map((r, i) => (
          <tr key={i} className={i%2===0?"bg-white dark:bg-slate-900":"bg-slate-50 dark:bg-slate-800"}>
            <td className="px-4 py-2.5 font-medium text-slate-700 dark:text-slate-200 border-r border-slate-200 dark:border-slate-700">{r.post_name??"—"}</td>
            <td className="px-4 py-2.5 text-center font-bold text-emerald-700 dark:text-emerald-400 border-r border-slate-200 dark:border-slate-700">{r.total??"—"}</td>
            <td className="px-4 py-2.5 text-slate-600 dark:text-slate-300">{r.eligibility??"—"}</td>
          </tr>
        ))}</tbody>
      </table>
    </div>
  );
}
function LinksTable({ rows }: { rows: LinkRow[] }) {
  if (!rows.length) return null;
  return (
    <table className="w-full text-sm border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
      <tbody>{rows.map((r, i) => (
        <tr key={i} className={i%2===0?"bg-white dark:bg-slate-900":"bg-slate-50 dark:bg-slate-800"}>
          <td className="px-4 py-2.5 font-medium text-emerald-700 dark:text-emerald-400 w-1/2 border-r border-slate-200 dark:border-slate-700">{r.label}</td>
          <td className="px-4 py-2.5"><a href={r.url} target="_blank" rel="noreferrer noopener" className="inline-flex items-center gap-1.5 font-semibold text-blue-600 hover:text-blue-800 dark:text-blue-400 underline">{r.link_text||"Click Here"}<ExternalLink className="h-3.5 w-3.5 shrink-0"/></a></td>
        </tr>
      ))}</tbody>
    </table>
  );
}

function ResultDetail({ job }: { job: Job }) {
  const { t } = useTranslation();
  const dates = parseJson<KVRow>(job.important_dates);
  const vacancies = parseJson<VacancyRow>(job.vacancy_details);
  const links = parseJson<LinkRow>(job.important_links);

  return (
    <div className="space-y-8">
      <div className="rounded-xl border border-emerald-100 dark:border-emerald-900/40 bg-emerald-50 dark:bg-emerald-950/20 p-6 text-center space-y-1">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 dark:bg-emerald-900/40 px-3 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-300 mb-2">
          <Trophy className="h-3.5 w-3.5"/> {t("results.badge")}
        </span>
        <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-300 uppercase tracking-wide">{job.organization}</p>
        <h1 className="text-xl font-bold text-slate-900 dark:text-white">{job.title}</h1>
        {job.short_info && <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300 text-left">{job.short_info}</p>}
      </div>

      {dates.length > 0 && <div><SectionH icon={CalendarCheck} title={t("results.importantDates")}/><KVTable rows={dates}/></div>}

      {dates.length === 0 && (
        <div><SectionH icon={Info} title={t("results.quickDetails")}/>
          <KVTable rows={[
            { label: t("results.orgLabel"), value: job.organization },
            { label: t("common.postExam"), value: job.qualification ?? "—" },
            { label: t("results.totalPosts"), value: job.vacancies ? String(job.vacancies) : "—" },
            { label: t("results.declared2"), value: formatDate(job.published_date) || t("common.checkOfficialSite") },
          ].filter(r => r.value !== "—")}/>
        </div>
      )}

      {vacancies.length > 0 && <div><SectionH icon={Users} title={t("results.postWise", { count: formatNumber(job.vacancies) })}/><VacancyTable rows={vacancies} t={t}/></div>}

      {job.description && !job.short_info && <div><SectionH icon={Info} title={t("results.aboutResult")}/><p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300 whitespace-pre-line">{job.description}</p></div>}

      {job.selection_process && <div><SectionH icon={ChevronRight} title={t("results.selectionProcess")}/><p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300 whitespace-pre-line">{job.selection_process}</p></div>}

      {links.length > 0 && <div><SectionH icon={Link2} title={t("results.importantLinks")}/><LinksTable rows={links}/></div>}
    </div>
  );
}

export function ResultDetailPage(): JSX.Element {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const { data: job, isLoading, isError } = useJob(Number(id));
  const { isAuthenticated } = useAuth();
  const { toggle, ids } = useToggleBookmark();
  const { track } = useRecentlyViewed();

  useDocumentTitle(job ? `${job.title} — DeshKiSeva` : "Result — DeshKiSeva", job?.description ?? undefined);
  useEffect(() => { if (job) track(job.id); }, [job, track]);

  if (isLoading) return (
    <div className="container-page space-y-4 py-10">
      <Skeleton className="h-9 w-2/3"/><Skeleton className="h-5 w-1/3"/><Skeleton className="h-64 w-full"/>
    </div>
  );
  if (isError || !job) return (
    <div className="container-page py-24 text-center">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{t("results.detailNotFound")}</h1>
      <Link to="/results" className="btn-primary mt-6">{t("results.browseAll")}</Link>
    </div>
  );

  const bookmarked = ids.includes(job.id);
  return (
    <div className="container-page py-10">
      <div className="mb-4"><Link to="/results" className="text-sm text-brand-600 hover:underline dark:text-brand-400">{t("results.back")}</Link></div>
      <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
        <article><ResultDetail job={job}/></article>
        <aside className="card sticky top-20 h-fit space-y-3 p-6">
          {job.application_url && (
            <a href={job.application_url} target="_blank" rel="noreferrer noopener" className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700">
              <ExternalLink className="h-4 w-4"/> {t("results.viewBtn")}
            </a>
          )}
          {job.notification_pdf && (
            <a href={job.notification_pdf} target="_blank" rel="noreferrer noopener" className="btn-secondary w-full">
              <FileText className="h-4 w-4"/> {t("results.downloadPdf")}
            </a>
          )}
          {isAuthenticated && (
            <button type="button" onClick={() => toggle(job.id)} className="btn-secondary w-full">
              {bookmarked ? <BookmarkCheck className="h-4 w-4"/> : <Bookmark className="h-4 w-4"/>}
              {bookmarked ? t("jobDetail.saved") : t("jobDetail.save")}
            </button>
          )}
          <ShareButton title={job.title}/>
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2 text-xs text-slate-500 dark:text-slate-400">
            {job.organization && <p><span className="font-semibold text-slate-700 dark:text-slate-300">{t("results.orgLabel")}:</span> {job.organization}</p>}
            {job.vacancies && <p><span className="font-semibold text-slate-700 dark:text-slate-300">{t("results.totalPosts")}:</span> {formatNumber(job.vacancies)}</p>}
            {job.published_date && <p><span className="font-semibold text-slate-700 dark:text-slate-300">{t("results.declared2")}:</span> {formatDate(job.published_date)}</p>}
            {job.category && <p><span className="font-semibold text-slate-700 dark:text-slate-300">{t("results.category")}:</span> {job.category}</p>}
          </div>
          <p className="pt-2 text-xs leading-relaxed text-slate-400">{t("results.disclaimer")}</p>
        </aside>
      </div>
    </div>
  );
}

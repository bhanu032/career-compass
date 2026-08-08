import { Bookmark, BookmarkCheck, CalendarCheck, ChevronRight, Download, ExternalLink, FileCheck, FileText, Info, Link2 } from "lucide-react";
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
import { formatDate } from "@/utils/format";

function parseJson<T>(raw: string | null | undefined): T[] {
  if (!raw) return [];
  try { const p = JSON.parse(raw); return Array.isArray(p) ? p as T[] : []; } catch { return []; }
}
interface KVRow { label: string; value: string; }
interface LinkRow { label: string; url: string; link_text: string; }

function SectionH({ icon: Icon, title }: { icon: React.ElementType; title: string; color?: string }) {
  return (
    <div className={`flex items-center gap-2 border-b-2 border-blue-500 pb-2 mb-4`}>
      <Icon className="h-5 w-5 text-blue-600"/>
      <h2 className="text-base font-bold text-blue-700 dark:text-blue-400">{title}</h2>
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
function LinksTable({ rows }: { rows: LinkRow[] }) {
  if (!rows.length) return null;
  return (
    <table className="w-full text-sm border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
      <tbody>{rows.map((r, i) => (
        <tr key={i} className={i%2===0?"bg-white dark:bg-slate-900":"bg-slate-50 dark:bg-slate-800"}>
          <td className="px-4 py-2.5 font-medium text-blue-700 dark:text-blue-400 w-1/2 border-r border-slate-200 dark:border-slate-700">{r.label}</td>
          <td className="px-4 py-2.5"><a href={r.url} target="_blank" rel="noreferrer noopener" className="inline-flex items-center gap-1.5 font-semibold text-blue-600 hover:text-blue-800 dark:text-blue-400 underline">{r.link_text||"Click Here"}<ExternalLink className="h-3.5 w-3.5 shrink-0"/></a></td>
        </tr>
      ))}</tbody>
    </table>
  );
}

function AdmitCardDetail({ job }: { job: Job }) {
  const { t } = useTranslation();
  const dates = parseJson<KVRow>(job.important_dates);
  const links = parseJson<LinkRow>(job.important_links);
  const steps = parseJson<string>(job.how_to_apply);

  return (
    <div className="space-y-8">
      <div className="rounded-xl border border-blue-100 dark:border-blue-900/40 bg-blue-50 dark:bg-blue-950/20 p-6 text-center space-y-1">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-100 dark:bg-blue-900/40 px-3 py-1 text-xs font-semibold text-blue-700 dark:text-blue-300 mb-2">
          <FileCheck className="h-3.5 w-3.5"/> {t("admitCards.badge")}
        </span>
        <p className="text-sm font-semibold text-blue-700 dark:text-blue-300 uppercase tracking-wide">{job.organization}</p>
        <h1 className="text-xl font-bold text-slate-900 dark:text-white">{job.title}</h1>
        {job.short_info && <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300 text-left">{job.short_info}</p>}
      </div>

      {dates.length > 0 && <div><SectionH icon={CalendarCheck} title={t("admitCards.importantDates")}/><KVTable rows={dates}/></div>}

      {dates.length === 0 && (
        <div><SectionH icon={Info} title={t("admitCards.quickDetails")}/>
          <KVTable rows={[
            { label: t("admitCards.orgLabel"), value: job.organization },
            { label: "Exam / Post", value: job.qualification ?? "—" },
            { label: t("admitCards.availableLabel"), value: formatDate(job.published_date) || t("common.checkOfficialSite") },
            { label: t("admitCards.examDate"), value: formatDate(job.last_date) || t("common.asPerSchedule") },
          ].filter(r => r.value !== "—")}/>
        </div>
      )}

      {job.description && !job.short_info && <div><SectionH icon={Info} title={t("admitCards.aboutAdmit")}/><p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300 whitespace-pre-line">{job.description}</p></div>}

      {steps.length > 0 && (
        <div><SectionH icon={ChevronRight} title={t("admitCards.howToDownload")}/>
          <ul className="space-y-2">{steps.map((s, i) => (
            <li key={i} className="flex gap-2 text-sm text-slate-600 dark:text-slate-300">
              <span className="mt-0.5 h-5 w-5 shrink-0 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 flex items-center justify-center text-xs font-bold">{i+1}</span>{s}
            </li>
          ))}</ul>
        </div>
      )}

      {links.length > 0 && <div><SectionH icon={Link2} title={t("admitCards.importantLinks")}/><LinksTable rows={links}/></div>}
    </div>
  );
}

export function AdmitCardDetailPage(): JSX.Element {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const { data: job, isLoading, isError } = useJob(Number(id));
  const { isAuthenticated } = useAuth();
  const { toggle, ids } = useToggleBookmark();
  const { track } = useRecentlyViewed();

  useDocumentTitle(job ? `${job.title} — DeshKiSeva` : "Admit Card — DeshKiSeva", job?.description ?? undefined);
  useEffect(() => { if (job) track(job.id); }, [job, track]);

  if (isLoading) return (
    <div className="container-page space-y-4 py-10">
      <Skeleton className="h-9 w-2/3"/><Skeleton className="h-5 w-1/3"/><Skeleton className="h-64 w-full"/>
    </div>
  );
  if (isError || !job) return (
    <div className="container-page py-24 text-center">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{t("admitCards.detailNotFound")}</h1>
      <Link to="/admit-cards" className="btn-primary mt-6">{t("admitCards.browseAll")}</Link>
    </div>
  );

  const bookmarked = ids.includes(job.id);
  return (
    <div className="container-page py-10">
      <div className="mb-4"><Link to="/admit-cards" className="text-sm text-brand-600 hover:underline dark:text-brand-400">{t("admitCards.back")}</Link></div>
      <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
        <article><AdmitCardDetail job={job}/></article>
        <aside className="card sticky top-20 h-fit space-y-3 p-6">
          {job.application_url && (
            <a href={job.application_url} target="_blank" rel="noreferrer noopener" className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700">
              <Download className="h-4 w-4"/> {t("admitCards.downloadBtn")}
            </a>
          )}
          {job.notification_pdf && (
            <a href={job.notification_pdf} target="_blank" rel="noreferrer noopener" className="btn-secondary w-full">
              <FileText className="h-4 w-4"/> {t("admitCards.officialNotification")}
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
            {job.organization && <p><span className="font-semibold text-slate-700 dark:text-slate-300">{t("admitCards.orgLabel")}:</span> {job.organization}</p>}
            {job.published_date && <p><span className="font-semibold text-slate-700 dark:text-slate-300">{t("admitCards.availableLabel")}:</span> {formatDate(job.published_date)}</p>}
            {job.last_date && <p><span className="font-semibold text-slate-700 dark:text-slate-300">{t("admitCards.examDate")}:</span> {formatDate(job.last_date)}</p>}
          </div>
          <p className="pt-2 text-xs leading-relaxed text-slate-400">{t("admitCards.disclaimer")}</p>
        </aside>
      </div>
    </div>
  );
}

import { Bookmark, BookmarkCheck, CalendarCheck, ChevronRight, CreditCard, Download, ExternalLink, FileText, Info, Link2, Users } from "lucide-react";
import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { ShareButton } from "@/components/ShareButton";
import { JobMockFinder } from "@/components/JobMockFinder";
import { Skeleton } from "@/components/Skeleton";
import { useAuth } from "@/hooks/useAuth";
import { useToggleBookmark } from "@/hooks/useBookmarks";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { useJob } from "@/hooks/useJobs";
import { useRecentlyViewed } from "@/hooks/useRecentlyViewed";
import type { Job } from "@/types";
import { formatDate, formatNumber, formatSalary } from "@/utils/format";
import { exportJobAsPdf } from "@/utils/pdf";

function parseJson<T>(raw: string | null | undefined): T[] {
  if (!raw) return [];
  try { const p = JSON.parse(raw); return Array.isArray(p) ? p as T[] : []; } catch { return []; }
}
interface KVRow { label: string; value: string; }
interface VacancyRow { post_name?: string; total?: string; eligibility?: string; [key: string]: string | undefined; }
interface LinkRow { label: string; url: string; link_text: string; }

function SectionH({ icon: Icon, title }: { icon: React.ElementType; title: string }) {
  return (
    <div className="flex items-center gap-2 border-b-2 border-emerald-600 pb-2 mb-4">
      <Icon className="h-5 w-5 text-emerald-600" />
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
          <td className="px-4 py-2.5 font-semibold text-slate-600 dark:text-slate-300">{r.value}</td>
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
          <th className="px-4 py-2.5 text-left font-semibold text-slate-700 dark:text-slate-200 border-r border-slate-200 dark:border-slate-700">{t("jobs.postName")}</th>
          <th className="px-4 py-2.5 text-center font-semibold text-slate-700 dark:text-slate-200 border-r border-slate-200 dark:border-slate-700">{t("jobs.totalPosts")}</th>
          <th className="px-4 py-2.5 text-left font-semibold text-slate-700 dark:text-slate-200">{t("jobs.eligibility")}</th>
        </tr></thead>
        <tbody>{rows.map((r, i) => (
          <tr key={i} className={i%2===0?"bg-white dark:bg-slate-900":"bg-slate-50 dark:bg-slate-800"}>
            <td className="px-4 py-2.5 font-medium text-slate-700 dark:text-slate-200 border-r border-slate-200 dark:border-slate-700">{r.post_name??r.col_0??"—"}</td>
            <td className="px-4 py-2.5 text-center font-bold text-emerald-700 dark:text-emerald-400 border-r border-slate-200 dark:border-slate-700">{r.total??r.col_1??"—"}</td>
            <td className="px-4 py-2.5 text-slate-600 dark:text-slate-300">{r.eligibility??r.col_2??"—"}</td>
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
          <td className="px-4 py-2.5 font-medium text-fuchsia-700 dark:text-fuchsia-400 w-1/2 border-r border-slate-200 dark:border-slate-700">{r.label}</td>
          <td className="px-4 py-2.5"><a href={r.url} target="_blank" rel="noreferrer noopener" className="inline-flex items-center gap-1.5 font-semibold text-blue-600 hover:text-blue-800 dark:text-blue-400 underline">{r.link_text||"Click Here"}<ExternalLink className="h-3.5 w-3.5 shrink-0"/></a></td>
        </tr>
      ))}</tbody>
    </table>
  );
}

function RichJobDetail({ job }: { job: Job }) {
  const { t } = useTranslation();
  const dates = parseJson<KVRow>(job.important_dates);
  const fee = parseJson<KVRow>(job.application_fee);
  const vacancies = parseJson<VacancyRow>(job.vacancy_details);
  const links = parseJson<LinkRow>(job.important_links);
  const steps = parseJson<string>(job.how_to_apply);

  return (
    <div className="space-y-8">
      <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 text-center space-y-1">
        <p className="text-sm font-semibold text-fuchsia-600 uppercase tracking-wide">{job.organization}</p>
        <h1 className="text-xl font-bold text-emerald-700 dark:text-emerald-400">{job.title}</h1>
        {job.short_info && <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300 text-left">{job.short_info}</p>}
      </div>

      {(dates.length > 0 || fee.length > 0) && (
        <div className="grid gap-6 md:grid-cols-2">
          {dates.length > 0 && <div><SectionH icon={CalendarCheck} title={t("jobDetail.importantDates")}/><KVTable rows={dates}/></div>}
          {fee.length > 0 && <div><SectionH icon={CreditCard} title={t("jobDetail.applicationFee")}/><KVTable rows={fee}/></div>}
        </div>
      )}

      {dates.length === 0 && (
        <div><SectionH icon={Info} title={t("jobDetail.quickDetails")}/>
          <KVTable rows={[
            { label: t("jobDetail.organization"), value: job.organization },
            { label: t("jobDetail.vacancies"), value: job.vacancies ? String(job.vacancies) : "—" },
            { label: t("jobDetail.ageLimit"), value: job.age_limit ?? "—" },
            { label: t("jobDetail.qualification"), value: job.qualification ?? "—" },
            { label: t("jobDetail.publishedOn"), value: formatDate(job.published_date) },
            { label: t("jobDetail.lastDate"), value: formatDate(job.last_date) },
            { label: t("jobDetail.salary"), value: formatSalary(job.salary, job.salary_min, job.salary_max) },
          ].filter(r => r.value && r.value !== "—")}/>
        </div>
      )}

      {job.age_limit && (
        <div><SectionH icon={Users} title={t("jobDetail.ageLimitTitle")}/>
          <div className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-3 text-sm text-slate-700 dark:text-slate-200">
            <p>{job.age_limit}</p>
            {job.experience && <p className="mt-1"><span className="font-medium">{t("jobDetail.experience")}: </span>{job.experience}</p>}
          </div>
        </div>
      )}

      {vacancies.length > 0 && (
        <div><SectionH icon={Users} title={t("jobDetail.vacancyDetails", { count: formatNumber(job.vacancies) })}/>
          <VacancyTable rows={vacancies} t={t}/>
        </div>
      )}

      {!job.short_info && job.description && (
        <div><SectionH icon={Info} title={t("jobDetail.aboutRecruitment")}/><p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300 whitespace-pre-line">{job.description}</p></div>
      )}

      {steps.length > 0 && (
        <div><SectionH icon={ChevronRight} title={t("jobDetail.howToFill")}/>
          <ul className="space-y-2">{steps.map((s, i) => (
            <li key={i} className="flex gap-2 text-sm text-slate-600 dark:text-slate-300">
              <span className="mt-0.5 h-5 w-5 shrink-0 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 flex items-center justify-center text-xs font-bold">{i+1}</span>{s}
            </li>
          ))}</ul>
        </div>
      )}

      {job.selection_process && (
        <div><SectionH icon={ChevronRight} title={t("jobDetail.selectionProcess")}/><p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300 whitespace-pre-line">{job.selection_process}</p></div>
      )}

      {links.length > 0 && <div><SectionH icon={Link2} title={t("jobDetail.importantLinks")}/><LinksTable rows={links}/></div>}
    </div>
  );
}

export function JobDetailsPage(): JSX.Element {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const { data: job, isLoading, isError } = useJob(Number(id));
  const { isAuthenticated } = useAuth();
  const { toggle, ids } = useToggleBookmark();
  const { track } = useRecentlyViewed();

  useDocumentTitle(job ? `${job.title} — DeshKiSeva` : "Job details — DeshKiSeva", job?.description ?? undefined);
  useEffect(() => { if (job) track(job.id); }, [job, track]);

  if (isLoading) return (
    <div className="container-page space-y-4 py-10">
      <Skeleton className="h-9 w-2/3"/><Skeleton className="h-5 w-1/3"/><Skeleton className="h-64 w-full"/>
    </div>
  );
  if (isError || !job) return (
    <div className="container-page py-24 text-center">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{t("jobDetail.notFound")}</h1>
      <Link to="/jobs" className="btn-primary mt-6">{t("jobDetail.browseJobs")}</Link>
    </div>
  );

  const bookmarked = ids.includes(job.id);
  const hasRich = job.important_dates || job.application_fee || job.vacancy_details || job.important_links;

  return (
    <div className="container-page py-10">
      <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
        <article>
          {job.category && <span className="badge mb-3 inline-block">{job.category}</span>}
          {hasRich ? <RichJobDetail job={job}/> : (
            <div className="card p-6 sm:p-8">
              <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl dark:text-white">{job.title}</h1>
              <p className="mt-2 text-slate-500 dark:text-slate-400">{job.organization}</p>
              <dl className="mt-8 grid gap-x-8 gap-y-4 sm:grid-cols-2">
                {([
                  [t("jobDetail.organization"), job.organization],
                  [t("jobDetail.department"), job.department ?? "—"],
                  [t("jobDetail.location"), [job.city, job.state].filter(Boolean).join(", ") || t("jobs.allIndia")],
                  [t("jobDetail.qualification"), job.qualification ?? "—"],
                  [t("jobDetail.salary"), formatSalary(job.salary, job.salary_min, job.salary_max)],
                  [t("jobDetail.ageLimit"), job.age_limit ?? "—"],
                  [t("jobDetail.vacancies"), formatNumber(job.vacancies)],
                  [t("jobDetail.experience"), job.experience ?? "Fresher"],
                  [t("jobDetail.jobType"), job.job_type ?? "—"],
                  [t("jobDetail.appMode"), job.application_mode ?? "—"],
                  [t("jobDetail.publishedOn"), formatDate(job.published_date)],
                  [t("jobDetail.lastDate"), formatDate(job.last_date)],
                ] as [string,string][]).map(([label, value]) => (
                  <div key={label} className="border-b border-slate-100 pb-3 dark:border-slate-800">
                    <dt className="text-xs uppercase tracking-wide text-slate-400">{label}</dt>
                    <dd className="mt-1 text-sm font-medium text-slate-800 dark:text-slate-100">{value}</dd>
                  </div>
                ))}
              </dl>
          {job.description && <section className="mt-8"><h2 className="text-lg font-bold text-slate-900 dark:text-white">{t("jobDetail.description")}</h2><p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-slate-600 dark:text-slate-300">{job.description}</p></section>}
              {job.selection_process && <section className="mt-8"><h2 className="text-lg font-bold text-slate-900 dark:text-white">{t("jobDetail.selectionProcess")}</h2><p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-slate-600 dark:text-slate-300">{job.selection_process}</p></section>}
              {!job.description && !job.selection_process && job.application_url && (
                <div className="mt-8 rounded-lg border border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/30 p-4">
                  <p className="text-sm font-semibold text-blue-800 dark:text-blue-300 mb-1">Complete details available on official website</p>
                  <p className="text-sm text-blue-700 dark:text-blue-400 mb-3">This notification was fetched from the official source. For eligibility, salary, vacancies and application procedure, visit:</p>
                  <a href={job.application_url} target="_blank" rel="noreferrer noopener" className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-800 dark:text-blue-400 underline break-all">
                    <ExternalLink className="h-4 w-4 shrink-0"/>
                    {job.application_url}
                  </a>
                </div>
              )}
            </div>
          )}

          {/* Web Mock Test Finder component */}
          <div className="mt-8">
            <JobMockFinder
              jobTitle={job.title}
              organization={job.organization ?? undefined}
              category={job.category ?? undefined}
            />
          </div>
        </article>

        <aside className="card sticky top-20 h-fit space-y-3 p-6">
          {job.application_url && (
            <a href={job.application_url} target="_blank" rel="noreferrer noopener" className="btn-primary w-full">
              <ExternalLink className="h-4 w-4"/>{t("jobDetail.applyOnline")}
            </a>
          )}
          {!job.application_url && (
            <div className="rounded-lg border border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/30 p-3 text-xs text-amber-800 dark:text-amber-300">
              <p className="font-semibold mb-1">Full details not available</p>
              <p>Visit the official website of <span className="font-medium">{job.organization}</span> for complete information, application link and notification PDF.</p>
            </div>
          )}
          {job.notification_pdf && (
            <a href={job.notification_pdf} target="_blank" rel="noreferrer noopener" className="btn-secondary w-full">
              <FileText className="h-4 w-4"/>{t("jobDetail.downloadNotification")}
            </a>
          )}
          {isAuthenticated && (
            <button type="button" onClick={() => toggle(job.id)} className="btn-secondary w-full">
              {bookmarked ? <BookmarkCheck className="h-4 w-4"/> : <Bookmark className="h-4 w-4"/>}
              {bookmarked ? t("jobDetail.saved") : t("jobDetail.save")}
            </button>
          )}
          <div className="grid grid-cols-2 gap-3">
            <ShareButton title={job.title}/>
            <button type="button" onClick={() => exportJobAsPdf(job)} className="btn-secondary">
              <Download className="h-4 w-4"/>{t("jobDetail.pdf")}
            </button>
          </div>
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2 text-xs text-slate-500 dark:text-slate-400">
            {job.vacancies && <p><span className="font-semibold text-slate-700 dark:text-slate-300">{t("jobDetail.totalPosts")}:</span> {formatNumber(job.vacancies)}</p>}
            {job.age_limit && <p><span className="font-semibold text-slate-700 dark:text-slate-300">{t("jobDetail.ageLimit")}:</span> {job.age_limit}</p>}
            {job.last_date && <p><span className="font-semibold text-slate-700 dark:text-slate-300">{t("jobDetail.lastDate")}:</span> {formatDate(job.last_date)}</p>}
          </div>
          <p className="pt-2 text-xs leading-relaxed text-slate-400">{t("jobDetail.disclaimer")}</p>
        </aside>
      </div>
    </div>
  );
}

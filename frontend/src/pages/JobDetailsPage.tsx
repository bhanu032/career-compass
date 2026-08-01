import { Bookmark, BookmarkCheck, Download, ExternalLink, FileText } from "lucide-react";
import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";

import { ShareButton } from "@/components/ShareButton";
import { Skeleton } from "@/components/Skeleton";
import { useAuth } from "@/hooks/useAuth";
import { useToggleBookmark } from "@/hooks/useBookmarks";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { useJob } from "@/hooks/useJobs";
import { useRecentlyViewed } from "@/hooks/useRecentlyViewed";
import { formatDate, formatNumber, formatSalary } from "@/utils/format";
import { exportJobAsPdf } from "@/utils/pdf";

export function JobDetailsPage(): JSX.Element {
  const { id } = useParams<{ id: string }>();
  const jobId = Number(id);
  const { data: job, isLoading, isError } = useJob(jobId);
  const { isAuthenticated } = useAuth();
  const { toggle, ids } = useToggleBookmark();
  const { track } = useRecentlyViewed();

  useDocumentTitle(
    job ? `${job.title} — GovJobs Portal` : "Job details — GovJobs Portal",
    job?.description ?? undefined,
  );

  useEffect(() => {
    if (job) track(job.id);
  }, [job, track]);

  if (isLoading) {
    return (
      <div className="container-page space-y-4 py-10">
        <Skeleton className="h-9 w-2/3" />
        <Skeleton className="h-5 w-1/3" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (isError || !job) {
    return (
      <div className="container-page py-24 text-center">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Job not found</h1>
        <Link to="/jobs" className="btn-primary mt-6">Browse all jobs</Link>
      </div>
    );
  }

  const bookmarked = ids.includes(job.id);
  const details: [string, string][] = [
    ["Organization", job.organization],
    ["Department", job.department ?? "—"],
    ["Location", [job.city, job.state].filter(Boolean).join(", ") || "All India"],
    ["Qualification", job.qualification ?? "—"],
    ["Salary", formatSalary(job.salary, job.salary_min, job.salary_max)],
    ["Age limit", job.age_limit ?? "—"],
    ["Vacancies", formatNumber(job.vacancies)],
    ["Experience", job.experience ?? "Fresher"],
    ["Job type", job.job_type ?? "—"],
    ["Application mode", job.application_mode ?? "—"],
    ["Published on", formatDate(job.published_date)],
    ["Last date", formatDate(job.last_date)],
  ];

  return (
    <div className="container-page py-10">
      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <article className="card p-6 sm:p-8">
          {job.category && <span className="badge">{job.category}</span>}
          <h1 className="mt-3 text-2xl font-bold text-slate-900 sm:text-3xl dark:text-white">{job.title}</h1>
          <p className="mt-2 text-slate-500 dark:text-slate-400">{job.organization}</p>

          <dl className="mt-8 grid gap-x-8 gap-y-4 sm:grid-cols-2">
            {details.map(([label, value]) => (
              <div key={label} className="border-b border-slate-100 pb-3 dark:border-slate-800">
                <dt className="text-xs uppercase tracking-wide text-slate-400">{label}</dt>
                <dd className="mt-1 text-sm font-medium text-slate-800 dark:text-slate-100">{value}</dd>
              </div>
            ))}
          </dl>

          {job.description && (
            <section className="mt-8">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Description</h2>
              <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                {job.description}
              </p>
            </section>
          )}

          {job.selection_process && (
            <section className="mt-8">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Selection process</h2>
              <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                {job.selection_process}
              </p>
            </section>
          )}
        </article>

        <aside className="card sticky top-20 h-fit space-y-3 p-6">
          {job.application_url && (
            <a href={job.application_url} target="_blank" rel="noreferrer noopener" className="btn-primary w-full">
              <ExternalLink className="h-4 w-4" />
              Apply online
            </a>
          )}
          {job.notification_pdf && (
            <a href={job.notification_pdf} target="_blank" rel="noreferrer noopener" className="btn-secondary w-full">
              <FileText className="h-4 w-4" />
              Official notification
            </a>
          )}
          {isAuthenticated && (
            <button type="button" onClick={() => toggle(job.id)} className="btn-secondary w-full">
              {bookmarked ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
              {bookmarked ? "Saved" : "Bookmark"}
            </button>
          )}
          <div className="grid grid-cols-2 gap-3">
            <ShareButton title={job.title} />
            <button type="button" onClick={() => exportJobAsPdf(job)} className="btn-secondary">
              <Download className="h-4 w-4" />
              PDF
            </button>
          </div>
          <p className="pt-2 text-xs leading-relaxed text-slate-400">
            Always confirm eligibility and deadlines on the official website before applying.
          </p>
        </aside>
      </div>
    </div>
  );
}

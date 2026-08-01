import { ArrowRight, Building2, CalendarClock, Layers, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

import { JobCard } from "@/components/JobCard";
import { JobListSkeleton } from "@/components/Skeleton";
import { SearchBar } from "@/components/SearchBar";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { useHomeData } from "@/hooks/useJobs";
import { formatDate } from "@/utils/format";

export function HomePage(): JSX.Element {
  useDocumentTitle(
    "GovJobs Portal — Latest Government Job Notifications",
    "Browse the latest central and state government vacancies with eligibility, salary and last dates.",
  );
  const { data, isLoading } = useHomeData();

  return (
    <>
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-700 via-brand-600 to-brand-800 py-20 text-white">
        <div className="absolute inset-0 opacity-20 [background-image:radial-gradient(circle_at_20%_20%,white,transparent_45%),radial-gradient(circle_at_80%_0%,white,transparent_40%)]" />
        <div className="container-page relative">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 text-xs font-medium">
            <Sparkles className="h-3.5 w-3.5" />
            Notifications refreshed every 6 hours
          </span>
          <h1 className="mt-5 max-w-3xl text-4xl font-bold leading-tight sm:text-5xl">
            Every government job notification, in one searchable place.
          </h1>
          <p className="mt-4 max-w-2xl text-brand-100">
            SSC, UPSC, Railways, banking, defence, PSUs and medical recruitment — with eligibility,
            vacancy count, salary and closing dates you can actually filter on.
          </p>
          <div className="mt-8 max-w-4xl">
            <SearchBar />
          </div>
        </div>
      </section>

      <section className="container-page py-14">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Latest jobs</h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Freshly published recruitment notices.
            </p>
          </div>
          <Link to="/jobs" className="btn-secondary shrink-0">
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-6">
          {isLoading ? (
            <JobListSkeleton />
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {data?.latest_jobs.map((job) => <JobCard key={job.id} job={job} />)}
            </div>
          )}
        </div>
      </section>

      <section className="container-page grid gap-6 pb-14 lg:grid-cols-2">
        <div className="card p-6">
          <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900 dark:text-white">
            <Building2 className="h-5 w-5 text-brand-600" />
            Top organizations
          </h2>
          <ul className="mt-4 space-y-2">
            {(data?.top_organizations ?? []).map((item) => (
              <li key={item.organization}>
                <Link
                  to={`/search?organization=${encodeURIComponent(item.organization)}`}
                  className="flex items-center justify-between rounded-xl px-3 py-2.5 text-sm transition hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  <span className="truncate text-slate-700 dark:text-slate-200">{item.organization}</span>
                  <span className="badge shrink-0">{item.count}</span>
                </Link>
              </li>
            ))}
            {!isLoading && (data?.top_organizations.length ?? 0) === 0 && (
              <li className="px-3 py-2 text-sm text-slate-400">No data yet — run a scraper.</li>
            )}
          </ul>
        </div>

        <div className="card p-6">
          <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900 dark:text-white">
            <Layers className="h-5 w-5 text-brand-600" />
            Popular categories
          </h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {(data?.popular_categories ?? []).map((item) => (
              <Link
                key={item.category}
                to={`/search?category=${encodeURIComponent(item.category)}`}
                className="rounded-xl border border-slate-200 px-3.5 py-2 text-sm text-slate-700 transition hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-brand-900/30"
              >
                {item.category}
                <span className="ml-2 text-xs text-slate-400">{item.count}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="container-page pb-16">
        <h2 className="flex items-center gap-2 text-2xl font-bold text-slate-900 dark:text-white">
          <CalendarClock className="h-6 w-6 text-brand-600" />
          Closing soon
        </h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {(data?.closing_soon ?? []).map((job) => (
            <Link key={job.id} to={`/jobs/${job.id}`} className="card block p-4">
              <p className="line-clamp-2 text-sm font-semibold text-slate-900 dark:text-white">{job.title}</p>
              <p className="mt-1.5 truncate text-xs text-slate-500 dark:text-slate-400">{job.organization}</p>
              <p className="mt-3 text-xs font-medium text-red-600 dark:text-red-400">
                Last date: {formatDate(job.last_date)}
              </p>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}

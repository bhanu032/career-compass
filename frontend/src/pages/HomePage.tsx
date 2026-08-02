import { ArrowRight, Building2, CalendarClock, FileCheck, Layers, Sparkles, Trophy } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { ContentCard } from "@/components/ContentCard";
import { HeroBanner } from "@/components/HeroBanner";
import { JobCard } from "@/components/JobCard";
import { JobListSkeleton, Skeleton } from "@/components/Skeleton";
import { SearchBar } from "@/components/SearchBar";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { useHomeData } from "@/hooks/useJobs";
import { formatDate } from "@/utils/format";

export function HomePage(): JSX.Element {
  const { t } = useTranslation();
  useDocumentTitle("DeshKiSeva — Latest Government Job Notifications");
  const { data, isLoading } = useHomeData();

  return (
    <>
      <HeroBanner variant="jobs" py="py-24">
        <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 text-xs font-medium backdrop-blur-sm border border-white/10">
          <Sparkles className="h-3.5 w-3.5 text-yellow-300" />
          {t("home.refreshed")}
        </span>
        <h1 className="mt-5 max-w-3xl text-4xl font-bold leading-tight sm:text-5xl drop-shadow-lg">
          <span className="bg-gradient-to-r from-yellow-300 via-pink-300 to-purple-300 bg-clip-text text-transparent">
            {t("home.heroTitle")}
          </span>
        </h1>
        <p className="mt-4 max-w-2xl text-white/70 text-sm sm:text-base">{t("home.heroSubtitle")}</p>
        <div className="mt-5 flex flex-wrap gap-2">
          <Link to="/jobs" className="inline-flex items-center gap-1.5 rounded-full bg-white/15 border border-white/10 px-4 py-1.5 text-xs font-semibold hover:bg-white/25 transition backdrop-blur-sm">{t("home.pillJobs")}</Link>
          <Link to="/admit-cards" className="inline-flex items-center gap-1.5 rounded-full bg-blue-400/25 border border-blue-300/20 px-4 py-1.5 text-xs font-semibold hover:bg-blue-400/40 transition backdrop-blur-sm"><FileCheck className="h-3.5 w-3.5" /> {t("home.pillAdmit")}</Link>
          <Link to="/results" className="inline-flex items-center gap-1.5 rounded-full bg-emerald-400/25 border border-emerald-300/20 px-4 py-1.5 text-xs font-semibold hover:bg-emerald-400/40 transition backdrop-blur-sm"><Trophy className="h-3.5 w-3.5" /> {t("home.pillResults")}</Link>
        </div>
        <div className="mt-7 max-w-3xl"><SearchBar /></div>
      </HeroBanner>

      <section className="container-page py-14">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{t("home.latestJobs")}</h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{t("home.latestJobsDesc")}</p>
          </div>
          <Link to="/jobs" className="btn-secondary shrink-0">{t("home.viewAll")} <ArrowRight className="h-4 w-4" /></Link>
        </div>
        <div className="mt-6">
          {isLoading ? <JobListSkeleton /> : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {data?.latest_jobs.map((job) => <JobCard key={job.id} job={job} />)}
            </div>
          )}
        </div>
      </section>

      <section className="container-page pb-14">
        <div className="flex items-end justify-between gap-4 mb-6">
          <div>
            <h2 className="flex items-center gap-2 text-2xl font-bold text-slate-900 dark:text-white"><FileCheck className="h-6 w-6 text-blue-600" /> {t("home.latestAdmitCards")}</h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{t("home.latestAdmitCardsDesc")}</p>
          </div>
          <Link to="/admit-cards" className="btn-secondary shrink-0">{t("home.viewAll")} <ArrowRight className="h-4 w-4" /></Link>
        </div>
        {isLoading ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{Array.from({length:3}).map((_,i)=><Skeleton key={i} className="h-48 rounded-2xl"/>)}</div>
        ) : (data?.latest_admit_cards?.length ?? 0) === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 dark:border-slate-700 py-12 text-center">
            <FileCheck className="mx-auto h-10 w-10 text-slate-300 dark:text-slate-600" />
            <p className="mt-3 text-sm text-slate-400">{t("home.noAdmitCards")}</p>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {data?.latest_admit_cards.map((job)=><ContentCard key={job.id} job={job} type="admit_card"/>)}
          </div>
        )}
      </section>

      <section className="container-page pb-14">
        <div className="flex items-end justify-between gap-4 mb-6">
          <div>
            <h2 className="flex items-center gap-2 text-2xl font-bold text-slate-900 dark:text-white"><Trophy className="h-6 w-6 text-emerald-600" /> {t("home.latestResults")}</h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{t("home.latestResultsDesc")}</p>
          </div>
          <Link to="/results" className="btn-secondary shrink-0">{t("home.viewAll")} <ArrowRight className="h-4 w-4" /></Link>
        </div>
        {isLoading ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{Array.from({length:3}).map((_,i)=><Skeleton key={i} className="h-48 rounded-2xl"/>)}</div>
        ) : (data?.latest_results?.length ?? 0) === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 dark:border-slate-700 py-12 text-center">
            <Trophy className="mx-auto h-10 w-10 text-slate-300 dark:text-slate-600" />
            <p className="mt-3 text-sm text-slate-400">{t("home.noResults")}</p>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {data?.latest_results.map((job)=><ContentCard key={job.id} job={job} type="result"/>)}
          </div>
        )}
      </section>

      <section className="container-page grid gap-6 pb-14 lg:grid-cols-2">
        <div className="card p-6">
          <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900 dark:text-white"><Building2 className="h-5 w-5 text-brand-600" /> {t("home.topOrgs")}</h2>
          <ul className="mt-4 space-y-2">
            {(data?.top_organizations ?? []).map((item) => (
              <li key={item.organization}>
                <Link to={`/search?organization=${encodeURIComponent(item.organization)}`} className="flex items-center justify-between rounded-xl px-3 py-2.5 text-sm transition hover:bg-slate-50 dark:hover:bg-slate-800">
                  <span className="truncate text-slate-700 dark:text-slate-200">{item.organization}</span>
                  <span className="badge shrink-0">{item.count}</span>
                </Link>
              </li>
            ))}
            {!isLoading && (data?.top_organizations.length ?? 0) === 0 && <li className="px-3 py-2 text-sm text-slate-400">{t("home.noData")}</li>}
          </ul>
        </div>
        <div className="card p-6">
          <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900 dark:text-white"><Layers className="h-5 w-5 text-brand-600" /> {t("home.popularCats")}</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {(data?.popular_categories ?? []).map((item) => (
              <Link key={item.category} to={`/search?category=${encodeURIComponent(item.category)}`} className="rounded-xl border border-slate-200 px-3.5 py-2 text-sm text-slate-700 transition hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-brand-900/30">
                {item.category}<span className="ml-2 text-xs text-slate-400">{item.count}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="container-page pb-16">
        <h2 className="flex items-center gap-2 text-2xl font-bold text-slate-900 dark:text-white"><CalendarClock className="h-6 w-6 text-brand-600" /> {t("home.closingSoon")}</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {(data?.closing_soon ?? []).map((job) => (
            <Link key={job.id} to={`/jobs/${job.id}`} className="card block p-4">
              <p className="line-clamp-2 text-sm font-semibold text-slate-900 dark:text-white">{job.title}</p>
              <p className="mt-1.5 truncate text-xs text-slate-500 dark:text-slate-400">{job.organization}</p>
              <p className="mt-3 text-xs font-medium text-red-600 dark:text-red-400">{t("home.lastDate")}: {formatDate(job.last_date)}</p>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}

import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  AlertCircle,
  Briefcase,
  Building2,
  CheckCircle2,
  ExternalLink,
  Globe,
  Loader2,
  Search as SearchIcon,
  Sparkles,
  Zap,
} from "lucide-react";

import { EmptyState } from "@/components/EmptyState";
import { HeroBanner } from "@/components/HeroBanner";
import { JobCard } from "@/components/JobCard";
import { PrivateJobCard } from "@/components/PrivateJobCard";
import { JobListSkeleton } from "@/components/Skeleton";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { useJobSearch } from "@/hooks/useJobs";
import { useRealtimeJobSearch, type ScraperSource } from "@/hooks/useRealtimeJobSearch";
import { calculateGovtJobMatch, calculatePrivateJobMatch, getUserJobProfile } from "@/utils/jobMatcher";

type SearchTab = "all" | "private" | "govt" | "sources";

function ScraperBadge({ source }: { source: ScraperSource }) {
  const statusColor = {
    idle: "bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400",
    scraping: "bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 border border-blue-300 dark:border-blue-700",
    done: "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700",
    error: "bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400 border border-red-300 dark:border-red-700",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold transition-all duration-300 ${statusColor[source.status]}`}
    >
      {source.icon}
      {source.name}
      {source.status === "scraping" && <Loader2 className="h-3 w-3 animate-spin ml-0.5" />}
      {source.status === "done" && source.jobsFound > 0 && (
        <span className="ml-0.5 rounded-full bg-emerald-500 text-white text-[9px] px-1.5 py-0 font-bold">
          +{source.jobsFound}
        </span>
      )}
      {source.status === "done" && source.jobsFound === 0 && (
        <CheckCircle2 className="h-3 w-3 text-emerald-500" />
      )}
      {source.status === "error" && <AlertCircle className="h-3 w-3" />}
    </span>
  );
}

export function SearchPage(): JSX.Element {
  useDocumentTitle("Real-Time Job Search — DeshKiSeva");

  const [searchParams, setSearchParams] = useSearchParams();
  const queryParam = searchParams.get("q") ?? "";

  const [inputQuery, setInputQuery] = useState(queryParam);
  const [activeTab, setActiveTab] = useState<SearchTab>("all");
  const userProfile = useMemo(() => getUserJobProfile(), []);

  // Government Jobs API Search
  const { data: govtData, isLoading: isGovtLoading } = useJobSearch({
    q: queryParam || undefined,
    page: 1,
    page_size: 20,
  });

  // Full multi-portal real-time scraper
  const { privateJobs, govtJobUrls, isScraping, sources, totalFound } =
    useRealtimeJobSearch(queryParam);

  const govtItems = govtData?.items ?? [];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputQuery.trim()) {
      setSearchParams({ q: inputQuery.trim() });
    } else {
      setSearchParams({});
    }
  };

  const privateSources = sources.filter((s) => s.type === "private");
  const govtSources = sources.filter((s) => s.type === "govt");
  const activeScraping = sources.filter((s) => s.status === "scraping").map((s) => s.name);
  const doneSources = sources.filter((s) => s.status === "done").length;

  return (
    <>
      <HeroBanner variant="search" py="py-14 sm:py-16">
        <h1 className="text-3xl font-extrabold sm:text-5xl drop-shadow-lg">
          <span className="bg-gradient-to-r from-orange-300 via-yellow-200 to-amber-300 bg-clip-text text-transparent">
            Real-Time Job Scraper
          </span>
        </h1>
        <p className="mt-2.5 max-w-2xl text-white/80 text-sm sm:text-base">
          Instantly scrapes <span className="font-bold text-white">10+ private</span> and{" "}
          <span className="font-bold text-white">20+ government</span> job portals simultaneously
          — LinkedIn, Naukri, Indeed, Glassdoor, SSC, UPSC, Railways, IBPS, RBI, ISRO, Army & more.
        </p>

        {/* Search Form */}
        <form onSubmit={handleSearchSubmit} className="mt-6 max-w-3xl flex gap-2">
          <div className="relative flex-1">
            <SearchIcon className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder="Search: Software Engineer, Bank PO, SSC CGL, Python, UPSC, Army..."
              className="input pl-12 pr-4 py-3 text-sm rounded-xl shadow-lg"
            />
          </div>
          <button
            type="submit"
            className="btn-primary text-sm px-6 py-3 shrink-0 gap-2 bg-orange-600 hover:bg-orange-500"
          >
            <Zap className="h-4 w-4" /> Scrape &amp; Search
          </button>
        </form>

        {/* Quick chips */}
        <div className="mt-3 flex flex-wrap gap-2">
          {["SSC CGL", "Bank PO", "UPSC", "Software Engineer", "RRB NTPC", "Army GD"].map((q) => (
            <button
              key={q}
              onClick={() => {
                setInputQuery(q);
                setSearchParams({ q });
              }}
              className="rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-semibold px-3 py-1 border border-white/20 transition"
            >
              {q}
            </button>
          ))}
        </div>
      </HeroBanner>

      <div className="container-page py-8">
        {/* Live Scraper Status Bar */}
        <div className="card mb-6 p-4 border-blue-200 dark:border-blue-800/40 bg-gradient-to-br from-blue-900/10 via-indigo-900/5 to-violet-900/10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-3">
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl font-bold shadow-md text-white transition ${
                  isScraping ? "bg-blue-600 animate-pulse" : "bg-emerald-600"
                }`}
              >
                {isScraping ? <Loader2 className="h-5 w-5 animate-spin" /> : <Globe className="h-5 w-5" />}
              </div>
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                  {isScraping
                    ? `⚡ Scraping: ${activeScraping.slice(0, 3).join(", ")}${activeScraping.length > 3 ? ` +${activeScraping.length - 3} more` : ""}…`
                    : queryParam
                    ? `✅ Scraped ${totalFound} results for "${queryParam}" from ${doneSources} portals`
                    : "🌐 Multi-Portal Real-Time Job Scraper Ready"}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Portals: LinkedIn · Naukri · Indeed · Glassdoor · Shine · Monster · SSC · UPSC · IBPS · RBI · ISRO · DRDO · Army · Navy · Air Force · PSUs
                </p>
              </div>
            </div>

            {isScraping && (
              <span className="inline-flex items-center gap-2 text-xs font-bold text-blue-600 dark:text-blue-400 shrink-0">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-500" />
                </span>
                LIVE STREAMING
              </span>
            )}
          </div>

          {/* Source badges — always visible */}
          <div className="mt-4">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-2">
              Private Portals
            </p>
            <div className="flex flex-wrap gap-1.5">
              {privateSources.map((s) => (
                <ScraperBadge key={s.id} source={s} />
              ))}
            </div>
          </div>
          <div className="mt-3">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-2">
              Government Portals
            </p>
            <div className="flex flex-wrap gap-1.5">
              {govtSources.map((s) => (
                <ScraperBadge key={s.id} source={s} />
              ))}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3 mb-6">
          {[
            { key: "all",     label: `All Results (${privateJobs.length + govtItems.length + govtJobUrls.length})`,  color: "bg-violet-600" },
            { key: "private", label: `Private Jobs (${privateJobs.length})`,   color: "bg-blue-600"   },
            { key: "govt",    label: `Govt Jobs (${govtItems.length + govtJobUrls.length})`,     color: "bg-amber-600"  },
            { key: "sources", label: `Live Portals (${sources.length})`,       color: "bg-emerald-600" },
          ].map(({ key, label, color }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key as SearchTab)}
              className={`rounded-xl px-4 py-2 text-xs font-bold transition ${
                activeTab === key
                  ? `${color} text-white shadow-md`
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Content */}
        {activeTab === "private" && (
          <div>
            {privateJobs.length === 0 && !isScraping ? (
              <EmptyState
                title="No private jobs found"
                description="Try a different search term or wait for scrapers to complete."
              />
            ) : (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {privateJobs.map((job) => (
                  <PrivateJobCard
                    key={job.id}
                    job={job}
                    matchScore={calculatePrivateJobMatch(job, userProfile)}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "govt" && (
          <div className="space-y-8">
            {/* DB Govt Jobs */}
            {isGovtLoading ? (
              <JobListSkeleton count={6} />
            ) : govtItems.length > 0 ? (
              <div>
                <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-3 flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-amber-500" /> Database Notifications
                </h3>
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {govtItems.map((job) => (
                    <JobCard key={job.id} job={job} />
                  ))}
                </div>
              </div>
            ) : null}

            {/* Live Scraped Govt Portal Links */}
            {govtJobUrls.length > 0 && (
              <div>
                <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-3 flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-emerald-500" /> Live Scraped Government Portals
                </h3>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {govtJobUrls.map((entry, idx) => (
                    <a
                      key={idx}
                      href={entry.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="card p-4 hover:border-amber-400 dark:hover:border-amber-600 hover:shadow-md transition group flex flex-col gap-1.5"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-sm font-semibold text-slate-800 dark:text-white group-hover:text-amber-600 leading-snug">
                          {entry.title}
                        </span>
                        <ExternalLink className="h-3.5 w-3.5 shrink-0 text-slate-400 group-hover:text-amber-500 mt-0.5" />
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 text-[10px] font-bold px-2 py-0.5">
                          {entry.source}
                        </span>
                        <span className="text-[10px] text-slate-400">{entry.postedAgo}</span>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {govtItems.length === 0 && govtJobUrls.length === 0 && !isScraping && !isGovtLoading && (
              <EmptyState
                title="No government jobs found"
                description="Try broader search terms like SSC, UPSC, Railway, Bank, Army."
              />
            )}
          </div>
        )}

        {activeTab === "all" && (
          <div className="space-y-10">
            {/* Private Jobs */}
            <div>
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-blue-500" />
                  Live Scraped Private Jobs
                  <span className="text-xs text-blue-500 font-normal">(LinkedIn · Naukri · Indeed · Glassdoor · Shine · Monster +4)</span>
                </h3>
                <span className="text-xs text-slate-500 font-semibold">{privateJobs.length} roles</span>
              </div>
              {isScraping && privateJobs.length === 0 ? (
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  <JobListSkeleton count={3} />
                </div>
              ) : privateJobs.length === 0 ? (
                <p className="text-sm text-slate-400">No private job matches yet. Try a search query above.</p>
              ) : (
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {privateJobs.slice(0, 12).map((job) => (
                    <PrivateJobCard
                      key={job.id}
                      job={job}
                      matchScore={calculatePrivateJobMatch(job, userProfile)}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Govt Jobs */}
            <div className="pt-6 border-t border-slate-200 dark:border-slate-800">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />
                  Government Notifications
                  <span className="text-xs text-amber-500 font-normal">(SSC · UPSC · RRB · IBPS · RBI · ISRO · Army +14)</span>
                </h3>
                <span className="text-xs text-slate-500 font-semibold">
                  {govtItems.length + govtJobUrls.length} notifications
                </span>
              </div>
              {isGovtLoading ? (
                <JobListSkeleton count={6} />
              ) : (
                <div className="space-y-6">
                  {govtItems.length > 0 && (
                    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                      {govtItems.map((job) => (
                        <JobCard key={job.id} job={job} />
                      ))}
                    </div>
                  )}
                  {govtJobUrls.length > 0 && (
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                      {govtJobUrls.slice(0, 9).map((entry, idx) => (
                        <a
                          key={idx}
                          href={entry.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="card p-4 hover:border-amber-400 dark:hover:border-amber-600 hover:shadow-md transition group flex flex-col gap-1.5"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <span className="text-sm font-semibold text-slate-800 dark:text-white group-hover:text-amber-600 leading-snug">
                              {entry.title}
                            </span>
                            <ExternalLink className="h-3.5 w-3.5 shrink-0 text-slate-400 group-hover:text-amber-500 mt-0.5" />
                          </div>
                          <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 text-[10px] font-bold px-2 py-0.5 w-fit">
                            {entry.source}
                          </span>
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "sources" && (
          <div className="space-y-6">
            {/* Private Sources */}
            <div className="card p-5">
              <h3 className="font-bold text-slate-900 dark:text-white text-sm mb-4 flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-blue-500" /> Private Job Portals ({privateSources.length})
              </h3>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {privateSources.map((s) => (
                  <div
                    key={s.id}
                    className={`flex items-center gap-3 rounded-xl border p-3 transition ${
                      s.status === "scraping"
                        ? "border-blue-300 dark:border-blue-700 bg-blue-50 dark:bg-blue-900/20"
                        : s.status === "done"
                        ? "border-emerald-300 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-900/20"
                        : s.status === "error"
                        ? "border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-900/20"
                        : "border-slate-200 dark:border-slate-700"
                    }`}
                  >
                    <span className="text-xl">{s.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-800 dark:text-white truncate">{s.name}</p>
                      <p className="text-xs text-slate-500 capitalize">{s.status}{s.jobsFound > 0 ? ` · ${s.jobsFound} found` : ""}</p>
                    </div>
                    {s.status === "scraping" && <Loader2 className="h-4 w-4 animate-spin text-blue-500 shrink-0" />}
                    {s.status === "done" && <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />}
                    {s.status === "error" && <AlertCircle className="h-4 w-4 text-red-500 shrink-0" />}
                  </div>
                ))}
              </div>
            </div>

            {/* Govt Sources */}
            <div className="card p-5">
              <h3 className="font-bold text-slate-900 dark:text-white text-sm mb-4 flex items-center gap-2">
                <Building2 className="h-4 w-4 text-amber-500" /> Government Portals ({govtSources.length})
              </h3>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {govtSources.map((s) => (
                  <div
                    key={s.id}
                    className={`flex items-center gap-3 rounded-xl border p-3 transition ${
                      s.status === "scraping"
                        ? "border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-amber-900/20"
                        : s.status === "done"
                        ? "border-emerald-300 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-900/20"
                        : s.status === "error"
                        ? "border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-900/20"
                        : "border-slate-200 dark:border-slate-700"
                    }`}
                  >
                    <span className="text-xl">{s.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-800 dark:text-white truncate">{s.name}</p>
                      <p className="text-xs text-slate-500 capitalize">{s.status}</p>
                    </div>
                    {s.status === "scraping" && <Loader2 className="h-4 w-4 animate-spin text-amber-500 shrink-0" />}
                    {s.status === "done" && <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />}
                    {s.status === "error" && <AlertCircle className="h-4 w-4 text-red-500 shrink-0" />}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

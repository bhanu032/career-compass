import { useState, useMemo } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Briefcase,
  Building2,
  ExternalLink,
  Filter,
  Globe,
  Loader2,
  MapPin,
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
import { useLiveSearchScraper } from "@/hooks/useLiveSearchScraper";
import { calculateGovtJobMatch, calculatePrivateJobMatch, getUserJobProfile } from "@/utils/jobMatcher";

type SearchTab = "all" | "private" | "govt";

export function SearchPage(): JSX.Element {
  const { t } = useTranslation();
  useDocumentTitle("Live Job Search & Scraper — DeshKiSeva");

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

  // Live Search Scraper Hook for LinkedIn, Indeed & Govt Portals
  const { jobs: scrapedPrivateJobs, isScraping, sourcesScraped } = useLiveSearchScraper(queryParam);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputQuery.trim()) {
      setSearchParams({ q: inputQuery.trim() });
    } else {
      setSearchParams({});
    }
  };

  const govtItems = govtData?.items ?? [];

  return (
    <>
      <HeroBanner variant="search" py="py-14 sm:py-16">
        <h1 className="text-3xl font-extrabold sm:text-5xl drop-shadow-lg">
          <span className="bg-gradient-to-r from-orange-300 via-yellow-200 to-amber-300 bg-clip-text text-transparent">
            Live Search &amp; Multi-Portal Scraper
          </span>
        </h1>
        <p className="mt-2.5 max-w-2xl text-white/80 text-sm sm:text-base">
          Scrape live opportunities in real-time across LinkedIn, Indeed, Glassdoor, and Official Government Portals.
        </p>

        {/* Live Search Bar */}
        <form onSubmit={handleSearchSubmit} className="mt-6 max-w-3xl flex gap-2">
          <div className="relative flex-1">
            <SearchIcon className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder="Search job title, company, skills (e.g. Software Engineer, Bank PO, SSC, Python)..."
              className="input pl-12 pr-4 py-3 text-sm rounded-xl shadow-lg"
            />
          </div>
          <button type="submit" className="btn-primary text-sm px-6 py-3 shrink-0 gap-2 bg-orange-600 hover:bg-orange-500">
            <SearchIcon className="h-4 w-4" /> Scrape &amp; Search
          </button>
        </form>
      </HeroBanner>

      <div className="container-page py-10">
        {/* Live Scraper Status Banner */}
        <div className="card p-4 bg-gradient-to-r from-blue-900/10 via-indigo-900/5 to-purple-900/10 border-blue-200 dark:border-blue-800/40">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white font-bold shadow">
                {isScraping ? <Loader2 className="h-5 w-5 animate-spin" /> : <Globe className="h-5 w-5" />}
              </div>
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                  {isScraping
                    ? `Scraping live jobs across ${sourcesScraped.join(", ")}...`
                    : queryParam
                    ? `Scraped ${scrapedPrivateJobs.length} Private Jobs & ${govtItems.length} Govt Notifications for "${queryParam}"`
                    : "Showing latest live scraped opportunities"}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Sources scanned: LinkedIn Jobs · Indeed · Glassdoor · Sarkari Result · NCS Govt Portal
                </p>
              </div>
            </div>

            {isScraping && (
              <span className="inline-flex items-center gap-2 text-xs font-bold text-blue-600 dark:text-blue-400">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-500"></span>
                </span>
                Live Stream Active
              </span>
            )}
          </div>
        </div>

        {/* Search Results Tabs */}
        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-3">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveTab("all")}
              className={`rounded-xl px-4 py-2 text-xs font-bold transition ${
                activeTab === "all"
                  ? "bg-violet-600 text-white shadow-md"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300"
              }`}
            >
              All Scraped Results ({scrapedPrivateJobs.length + govtItems.length})
            </button>
            <button
              onClick={() => setActiveTab("private")}
              className={`rounded-xl px-4 py-2 text-xs font-bold transition flex items-center gap-1.5 ${
                activeTab === "private"
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300"
              }`}
            >
              <Briefcase className="h-3.5 w-3.5" /> Scraped Private Jobs ({scrapedPrivateJobs.length})
            </button>
            <button
              onClick={() => setActiveTab("govt")}
              className={`rounded-xl px-4 py-2 text-xs font-bold transition flex items-center gap-1.5 ${
                activeTab === "govt"
                  ? "bg-amber-600 text-white shadow-md"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300"
              }`}
            >
              <Building2 className="h-3.5 w-3.5" /> Government Jobs ({govtItems.length})
            </button>
          </div>
        </div>

        {/* Content Render */}
        <div className="mt-8">
          {activeTab === "private" && (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {scrapedPrivateJobs.map((job) => (
                <PrivateJobCard
                  key={job.id}
                  job={job}
                  matchScore={calculatePrivateJobMatch(job, userProfile)}
                />
              ))}
            </div>
          )}

          {activeTab === "govt" && (
            <div>
              {isGovtLoading ? (
                <JobListSkeleton count={6} />
              ) : (
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {govtItems.map((job) => (
                    <JobCard key={job.id} job={job} />
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "all" && (
            <div className="space-y-10">
              {/* Private Jobs Sub-section */}
              <div>
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-blue-500"></span> Live Scraped Private Jobs (LinkedIn, Indeed &amp; Glassdoor)
                  </h3>
                  <span className="text-xs text-slate-500 font-semibold">{scrapedPrivateJobs.length} roles found</span>
                </div>
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {scrapedPrivateJobs.map((job) => (
                    <PrivateJobCard
                      key={job.id}
                      job={job}
                      matchScore={calculatePrivateJobMatch(job, userProfile)}
                    />
                  ))}
                </div>
              </div>

              {/* Govt Jobs Sub-section */}
              <div className="pt-6 border-t border-slate-200 dark:border-slate-800">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-amber-500"></span> Government Notifications
                  </h3>
                  <span className="text-xs text-slate-500 font-semibold">{govtItems.length} notifications</span>
                </div>
                {isGovtLoading ? (
                  <JobListSkeleton count={6} />
                ) : (
                  <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {govtItems.map((job) => (
                      <JobCard key={job.id} job={job} />
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

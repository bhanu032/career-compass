import { useMemo, useState } from "react";
import {
  ArrowUpDown,
  Briefcase,
  Building2,
  CheckCircle2,
  ExternalLink,
  FileCheck,
  Filter,
  Loader2,
  MapPin,
  Search,
  Sparkles,
  SlidersHorizontal,
  Trophy,
  UserCheck,
  Zap,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { EmptyState } from "@/components/EmptyState";
import { HeroBanner } from "@/components/HeroBanner";
import { JobCard } from "@/components/JobCard";
import { PrivateJobCard } from "@/components/PrivateJobCard";
import { JobProfileModal } from "@/components/JobProfileModal";
import { JobListSkeleton } from "@/components/Skeleton";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { useHomeData, useInfiniteJobs } from "@/hooks/useJobs";
import { useProgressivePrivateJobs } from "@/hooks/useProgressiveJobs";
import { useLiveSearchScraper } from "@/hooks/useLiveSearchScraper";
import type { PrivateJob } from "@/data/privateJobs";
import {
  calculateGovtJobMatch,
  calculatePrivateJobMatch,
  getUserJobProfile,
  type UserJobProfile,
} from "@/utils/jobMatcher";
import { formatDate } from "@/utils/format";

type MainTab = "all" | "govt" | "private" | "admit-cards" | "results";
type SortOption = "relevance" | "newest" | "salary";

export function JobsPage(): JSX.Element {
  const { t } = useTranslation();
  useDocumentTitle("Jobs Hub — Government Jobs, LinkedIn & Indeed Private Jobs, Admit Cards & Results");

  // Fetch Government Jobs & Home Data (Admit Cards / Results)
  const { data: govtData, isLoading: isGovtLoading } = useInfiniteJobs({
    sort_by: "created_at",
    sort_dir: "desc",
    active_only: true,
  });
  const { data: homeData } = useHomeData();

  // Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedExperience, setSelectedExperience] = useState("All");
  const [selectedLocation, setSelectedLocation] = useState("All");
  const [selectedSource, setSelectedSource] = useState("All");
  const [sortBy, setSortBy] = useState<SortOption>("relevance");

  // Fetch Live Progressive Private Jobs & Real-Time Search Scraper
  const { jobs: progressivePrivateJobs, isStreaming: isPrivateStreaming } = useProgressivePrivateJobs();
  const { jobs: scrapedPrivateJobs, isScraping: isScraperActive } = useLiveSearchScraper(searchQuery);

  const privateJobs = searchQuery.trim() ? scrapedPrivateJobs : progressivePrivateJobs;

  // Active Tab & Profile state
  const [activeTab, setActiveTab] = useState<MainTab>("all");
  const [userProfile, setUserProfile] = useState<UserJobProfile>(() => getUserJobProfile());
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const govtJobs = useMemo(() => govtData?.pages.flatMap((p) => p.items) ?? [], [govtData]);
  const admitCards = homeData?.latest_admit_cards ?? [];
  const results = homeData?.latest_results ?? [];

  // Filter & Sort Private Jobs
  const processedPrivateJobs = useMemo(() => {
    let result = [...privateJobs];

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (j) =>
          j.title.toLowerCase().includes(q) ||
          j.company.toLowerCase().includes(q) ||
          j.location.toLowerCase().includes(q) ||
          j.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    // Category / Field filter
    if (selectedCategory !== "All") {
      result = result.filter((j) => j.category === selectedCategory);
    }

    // Experience filter
    if (selectedExperience !== "All") {
      result = result.filter((j) => j.experience.toLowerCase().includes(selectedExperience.toLowerCase()));
    }

    // Location filter
    if (selectedLocation !== "All") {
      const loc = selectedLocation.toLowerCase();
      result = result.filter(
        (j) => j.location.toLowerCase().includes(loc) || j.location.toLowerCase().includes("remote")
      );
    }

    // Source filter
    if (selectedSource !== "All") {
      result = result.filter((j) => j.source === selectedSource);
    }

    // Sort by relevance, newest, or salary
    result.sort((a, b) => {
      if (sortBy === "relevance") {
        const matchA = calculatePrivateJobMatch(a, userProfile);
        const matchB = calculatePrivateJobMatch(b, userProfile);
        return matchB - matchA;
      }
      return 0; // Default order
    });

    return result;
  }, [privateJobs, searchQuery, selectedCategory, selectedExperience, selectedLocation, selectedSource, sortBy, userProfile]);

  // Filter & Sort Govt Jobs
  const processedGovtJobs = useMemo(() => {
    let result = [...govtJobs];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (j) => j.title.toLowerCase().includes(q) || j.organization.toLowerCase().includes(q)
      );
    }

    if (selectedCategory !== "All") {
      result = result.filter((j) => (j.category || "").toLowerCase().includes(selectedCategory.toLowerCase()));
    }

    result.sort((a, b) => {
      if (sortBy === "relevance") {
        const matchA = calculateGovtJobMatch(a, userProfile);
        const matchB = calculateGovtJobMatch(b, userProfile);
        return matchB - matchA;
      }
      return 0;
    });

    return result;
  }, [govtJobs, searchQuery, selectedCategory, sortBy, userProfile]);

  return (
    <>
      {/* Profile Modal */}
      <JobProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        onProfileUpdated={(p) => setUserProfile(p)}
      />

      {/* Hero Banner */}
      <HeroBanner variant="jobs" py="py-14 sm:py-16">
        <h1 className="text-3xl font-extrabold sm:text-5xl drop-shadow-lg">
          <span className="bg-gradient-to-r from-violet-300 via-pink-300 to-indigo-300 bg-clip-text text-transparent">
            Jobs Portal — Government &amp; Private
          </span>
        </h1>
        <p className="mt-3 max-w-2xl text-white/80 text-sm sm:text-base">
          Explore Government Notifications, LinkedIn &amp; Indeed Private Opportunities, Admit Cards, and Official Exam Results.
        </p>
      </HeroBanner>

      {/* Main Container */}
      <div className="container-page py-10">
        {/* User Job Profile Matching Bar */}
        <div className="card p-4 bg-gradient-to-r from-violet-900/10 via-purple-900/5 to-indigo-900/10 border-violet-200 dark:border-violet-800/40">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-600 text-white font-bold shadow-md">
                <UserCheck className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 dark:text-white text-sm">Target Role:</span>
                  <span className="rounded-full bg-violet-100 text-violet-800 dark:bg-violet-900/60 dark:text-violet-200 px-3 py-0.5 text-xs font-semibold">
                    {userProfile.targetRole}
                  </span>
                  <span className="text-xs text-slate-500">({userProfile.location})</span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Experience: {userProfile.experience} · Skills: {userProfile.skills.join(", ")}
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsProfileModalOpen(true)}
              className="btn-primary text-xs py-2 px-4 shrink-0 gap-1.5 shadow-sm"
            >
              <Zap className="h-3.5 w-3.5" /> Filter by My Profile &amp; Relevance
            </button>
          </div>
        </div>

        {/* ── Sub-Tabs Navigation (Govt, Private, Admit Cards, Results) ───────── */}
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
              All Opportunities
            </button>
            <button
              onClick={() => setActiveTab("govt")}
              className={`rounded-xl px-4 py-2 text-xs font-bold transition flex items-center gap-1.5 ${
                activeTab === "govt"
                  ? "bg-amber-600 text-white shadow-md"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300"
              }`}
            >
              <Building2 className="h-3.5 w-3.5" /> Government Jobs
            </button>
            <button
              onClick={() => setActiveTab("private")}
              className={`rounded-xl px-4 py-2 text-xs font-bold transition flex items-center gap-1.5 ${
                activeTab === "private"
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300"
              }`}
            >
              <Briefcase className="h-3.5 w-3.5" /> Private Jobs (LinkedIn &amp; Indeed)
            </button>
            <button
              onClick={() => setActiveTab("admit-cards")}
              className={`rounded-xl px-4 py-2 text-xs font-bold transition flex items-center gap-1.5 ${
                activeTab === "admit-cards"
                  ? "bg-emerald-600 text-white shadow-md"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300"
              }`}
            >
              <FileCheck className="h-3.5 w-3.5 text-emerald-400" /> Admit Cards ({admitCards.length})
            </button>
            <button
              onClick={() => setActiveTab("results")}
              className={`rounded-xl px-4 py-2 text-xs font-bold transition flex items-center gap-1.5 ${
                activeTab === "results"
                  ? "bg-purple-600 text-white shadow-md"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300"
              }`}
            >
              <Trophy className="h-3.5 w-3.5 text-yellow-400" /> Results ({results.length})
            </button>
          </div>

          {/* Sort By Selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <ArrowUpDown className="h-3.5 w-3.5 text-violet-500" /> Sort By:
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="input text-xs py-1.5 px-3 rounded-lg"
            >
              <option value="relevance">Highest Relevance &amp; Match</option>
              <option value="newest">Recently Posted</option>
            </select>
          </div>
        </div>

        {/* ── Advanced Search & Filter Bar (For Private & Govt Jobs) ─────────── */}
        {(activeTab === "all" || activeTab === "private" || activeTab === "govt") && (
          <div className="mt-6 card p-4 space-y-4 bg-slate-50/70 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by job title, company name, skills (e.g. React, Python, Accounting, SSC)..."
                className="input pl-10 text-sm w-full"
              />
            </div>
            {isScraperActive && (
              <div className="flex items-center gap-2 text-xs font-bold text-blue-600 dark:text-blue-400">
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                Scraping live jobs in real-time across LinkedIn, Indeed, Glassdoor &amp; Govt Portals...
              </div>
            )}

            {/* Filter Selectors Grid */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {/* Field / Category */}
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Field / Sector
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="input text-xs w-full py-1.5"
                >
                  <option value="All">All Fields</option>
                  <option value="Tech">Technology / Software</option>
                  <option value="Management">Management &amp; HR</option>
                  <option value="Finance">Finance &amp; Accounts</option>
                  <option value="Design">UI/UX &amp; Design</option>
                  <option value="Marketing">Marketing &amp; Growth</option>
                  <option value="Operations">Operations &amp; Logistics</option>
                  <option value="Engineering">Civil &amp; Mechanical</option>
                </select>
              </div>

              {/* Experience Level */}
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Experience Level
                </label>
                <select
                  value={selectedExperience}
                  onChange={(e) => setSelectedExperience(e.target.value)}
                  className="input text-xs w-full py-1.5"
                >
                  <option value="All">All Experience Levels</option>
                  <option value="Fresher">Fresher / 0-1 Yr</option>
                  <option value="1-3 yrs">1 - 3 Years</option>
                  <option value="3-5 yrs">3 - 5 Years</option>
                  <option value="5+ yrs">5+ Years</option>
                </select>
              </div>

              {/* Location */}
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Location
                </label>
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="input text-xs w-full py-1.5"
                >
                  <option value="All">All Locations</option>
                  <option value="Bangalore">Bangalore</option>
                  <option value="Delhi NCR">Delhi NCR / Gurugram</option>
                  <option value="Mumbai">Mumbai</option>
                  <option value="Hyderabad">Hyderabad</option>
                  <option value="Pune">Pune</option>
                  <option value="Remote">Remote Only</option>
                </select>
              </div>

              {/* Source (LinkedIn / Indeed) */}
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Job Portal Source
                </label>
                <select
                  value={selectedSource}
                  onChange={(e) => setSelectedSource(e.target.value)}
                  className="input text-xs w-full py-1.5"
                >
                  <option value="All">All Sources</option>
                  <option value="LinkedIn">LinkedIn Jobs</option>
                  <option value="Indeed">Indeed Jobs</option>
                  <option value="Glassdoor">Glassdoor Jobs</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* ── Content Grid Based on Active Tab ───────────────────────────────── */}
        <div className="mt-8">
          {/* PRIVATE JOBS TAB */}
          {activeTab === "private" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-blue-600" /> Private Jobs Stream (via LinkedIn &amp; Indeed)
                </h3>
                <span className="text-xs text-slate-500 font-semibold">{processedPrivateJobs.length} roles found</span>
              </div>

              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {processedPrivateJobs.map((job) => (
                  <PrivateJobCard
                    key={job.id}
                    job={job}
                    matchScore={calculatePrivateJobMatch(job, userProfile)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* GOVT JOBS TAB */}
          {activeTab === "govt" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-amber-600" /> Official Government Job Notifications
                </h3>
                <span className="text-xs text-slate-500 font-semibold">{processedGovtJobs.length} notifications</span>
              </div>

              {isGovtLoading ? (
                <JobListSkeleton count={9} />
              ) : processedGovtJobs.length === 0 ? (
                <EmptyState title="No Government Jobs Found" description="Try broadening your search or filters." />
              ) : (
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {processedGovtJobs.map((job) => (
                    <JobCard key={job.id} job={job} />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ADMIT CARDS TAB */}
          {activeTab === "admit-cards" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
                  <FileCheck className="h-5 w-5 text-emerald-600" /> Latest Government Admit Cards
                </h3>
                <Link to="/admit-cards" className="text-xs text-violet-600 font-semibold hover:underline">
                  View Full Admit Cards Portal &rarr;
                </Link>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {admitCards.map((ac) => (
                  <Link key={ac.id} to={`/admit-cards/${ac.id}`} className="card p-5 hover:scale-[1.01] transition border-slate-200 dark:border-slate-800 block">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2.5 py-0.5 dark:bg-emerald-950/60 dark:text-emerald-300">
                        ADMIT CARD RELEASED
                      </span>
                    </div>
                    <h4 className="font-bold text-slate-900 dark:text-white text-sm line-clamp-2">{ac.title}</h4>
                    <p className="text-xs text-slate-500 mt-1">{ac.organization}</p>
                    <p className="text-xs text-emerald-600 font-semibold mt-3">Date: {formatDate(ac.last_date || ac.published_date)}</p>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* RESULTS TAB */}
          {activeTab === "results" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-yellow-500" /> Exam Results &amp; Selection Lists
                </h3>
                <Link to="/results" className="text-xs text-violet-600 font-semibold hover:underline">
                  View Full Results Portal &rarr;
                </Link>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {results.map((res) => (
                  <Link key={res.id} to={`/results/${res.id}`} className="card p-5 hover:scale-[1.01] transition border-slate-200 dark:border-slate-800 block">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="rounded-full bg-yellow-100 text-yellow-800 text-[10px] font-bold px-2.5 py-0.5 dark:bg-yellow-950/60 dark:text-yellow-300">
                        RESULT DECLARED
                      </span>
                    </div>
                    <h4 className="font-bold text-slate-900 dark:text-white text-sm line-clamp-2">{res.title}</h4>
                    <p className="text-xs text-slate-500 mt-1">{res.organization}</p>
                    <p className="text-xs text-purple-600 font-semibold mt-3">Date: {formatDate(res.last_date || res.published_date)}</p>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* ALL JOBS COMBINED TAB */}
          {activeTab === "all" && (
            <div className="space-y-10">
              {/* Private Jobs Sub-section */}
              <div>
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-blue-500"></span> Live Private Opportunities (via LinkedIn &amp; Indeed)
                  </h3>
                  <button onClick={() => setActiveTab("private")} className="text-xs text-violet-600 font-semibold hover:underline">
                    View All Private Jobs ({processedPrivateJobs.length}) &rarr;
                  </button>
                </div>

                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {processedPrivateJobs.slice(0, 6).map((job) => (
                    <PrivateJobCard
                      key={job.id}
                      job={job}
                      matchScore={calculatePrivateJobMatch(job, userProfile)}
                    />
                  ))}
                </div>
              </div>

              {/* Government Jobs Sub-section */}
              <div className="pt-6 border-t border-slate-200 dark:border-slate-800">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-amber-500"></span> Latest Government Notifications
                  </h3>
                  <button onClick={() => setActiveTab("govt")} className="text-xs text-violet-600 font-semibold hover:underline">
                    View All Sarkari Jobs ({processedGovtJobs.length}) &rarr;
                  </button>
                </div>

                {isGovtLoading ? (
                  <JobListSkeleton count={6} />
                ) : (
                  <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {processedGovtJobs.slice(0, 6).map((job) => (
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

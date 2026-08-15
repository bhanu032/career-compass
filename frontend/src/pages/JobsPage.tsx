import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertCircle,
  ArrowUpDown,
  Briefcase,
  Building2,
  CheckCircle2,
  Clock,
  ExternalLink,
  FileCheck,
  Filter,
  Landmark,
  Loader2,
  MapPin,
  RefreshCw,
  Search,
  Sparkles,
  SlidersHorizontal,
  Trophy,
  UserCheck,
  Zap,
} from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
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
import { useSarkariJobs, type SarkariJob } from "@/hooks/useSarkariJobs";
import type { PrivateJob } from "@/data/privateJobs";
import {
  calculateGovtJobMatch,
  calculatePrivateJobMatch,
  getUserJobProfile,
  type UserJobProfile,
} from "@/utils/jobMatcher";
import { formatDate } from "@/utils/format";

type MainTab = "all" | "govt" | "private" | "sarkari" | "admit-cards" | "results";
type SortOption = "relevance" | "newest" | "salary";

// ─── Animation Variants ───────────────────────────────────────────────────────
const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.055, delayChildren: 0.05 } },
};

const cardVariant = {
  hidden: { opacity: 0, y: 18, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring" as const, stiffness: 260, damping: 22 },
  },
};

// ─── Sarkari Job Card ─────────────────────────────────────────────────────────
function SarkariJobCard({ job, search }: { job: SarkariJob; search: string }) {
  const isSR = job.source === "SarkariResult";

  const highlight = (text: string) => {
    if (!search.trim()) return text;
    const parts = text.split(new RegExp(`(${search})`, "gi"));
    return parts.map((p, i) =>
      p.toLowerCase() === search.toLowerCase() ? (
        <mark key={i} className="bg-yellow-200 dark:bg-yellow-800/60 rounded px-0.5">
          {p}
        </mark>
      ) : (
        p
      )
    );
  };

  return (
    <motion.div
      variants={cardVariant}
      whileHover={{ y: -4, transition: { duration: 0.18 } }}
      className={`card overflow-hidden group ${
        isSR
          ? "border-orange-100 dark:border-orange-800/30"
          : "border-purple-100 dark:border-purple-800/30"
      }`}
    >
      {/* Top accent bar */}
      <div
        className={`h-1 w-full ${
          isSR
            ? "bg-gradient-to-r from-orange-400 to-amber-400"
            : "bg-gradient-to-r from-purple-500 to-violet-500"
        }`}
      />

      <div className="p-5">
        {/* Header */}
        <div className="flex items-start gap-3">
          <div
            className={`mt-0.5 h-9 w-9 shrink-0 rounded-xl flex items-center justify-center ${
              isSR
                ? "bg-orange-100 dark:bg-orange-900/40"
                : "bg-purple-100 dark:bg-purple-900/40"
            }`}
          >
            <Landmark
              className={`h-4.5 w-4.5 ${
                isSR ? "text-orange-600" : "text-purple-600"
              }`}
              style={{ width: 18, height: 18 }}
            />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-2 leading-snug">
              {highlight(job.title)}
            </h3>
            <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
              <span
                className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold border ${
                  isSR
                    ? "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950/50 dark:text-orange-300 dark:border-orange-700/40"
                    : "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/50 dark:text-purple-300 dark:border-purple-700/40"
                }`}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    isSR ? "bg-orange-400" : "bg-purple-500"
                  }`}
                />
                {job.source}
              </span>
              {job.category && (
                <span className="rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-2 py-0.5 text-[10px] font-medium">
                  {job.category}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Description */}
        {job.description && (
          <p className="mt-3 text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
            {highlight(job.description)}
          </p>
        )}

        {/* Footer */}
        <div className="mt-4 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1 text-[10px] text-slate-400">
            <Clock className="h-3 w-3" />
            {job.formattedDate || "Recent"}
          </div>
          <a
            href={job.link}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[11px] font-bold text-white transition-opacity hover:opacity-90 ${
              isSR
                ? "bg-orange-500 hover:bg-orange-600"
                : "bg-purple-600 hover:bg-purple-700"
            }`}
          >
            Apply Now
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export function JobsPage(): JSX.Element {
  const { t } = useTranslation();
  useDocumentTitle(
    "Jobs Hub — Government Jobs, LinkedIn & Indeed Private Jobs, Sarkari Jobs, Admit Cards & Results"
  );

  const [searchParams] = useSearchParams();
  const defaultTab = (searchParams.get("tab") as MainTab) || "all";

  const { data: govtData, isLoading: isGovtLoading } = useInfiniteJobs({
    sort_by: "created_at",
    sort_dir: "desc",
    active_only: true,
  });
  const { data: homeData } = useHomeData();
  const { data: sarkariData, isLoading: isSarkariLoading, refetch: refetchSarkari } =
    useSarkariJobs();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedExperience, setSelectedExperience] = useState("All");
  const [selectedLocation, setSelectedLocation] = useState("All");
  const [selectedSource, setSelectedSource] = useState("All");
  const [sarkariSource, setSarkariSource] = useState<"All" | "SarkariResult" | "SarkariExam">("All");
  const [sortBy, setSortBy] = useState<SortOption>("relevance");
  const [sarkariPage, setSarkariPage] = useState(1);
  const SARKARI_PER_PAGE = 20;

  const { jobs: progressivePrivateJobs, isStreaming: isPrivateStreaming } =
    useProgressivePrivateJobs();
  const { jobs: scrapedPrivateJobs, isScraping: isScraperActive } =
    useLiveSearchScraper(searchQuery);

  const privateJobs = searchQuery.trim() ? scrapedPrivateJobs : progressivePrivateJobs;

  const [activeTab, setActiveTab] = useState<MainTab>(defaultTab);
  const [userProfile, setUserProfile] = useState<UserJobProfile>(() =>
    getUserJobProfile()
  );
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const govtJobs = useMemo(
    () => govtData?.pages.flatMap((p) => p.items) ?? [],
    [govtData]
  );
  const admitCards = homeData?.latest_admit_cards ?? [];
  const results = homeData?.latest_results ?? [];

  // ── Processed Private Jobs ──────────────────────────────────────────────
  const processedPrivateJobs = useMemo(() => {
    let result = [...privateJobs];
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
    if (selectedCategory !== "All")
      result = result.filter((j) => j.category === selectedCategory);
    if (selectedExperience !== "All")
      result = result.filter((j) =>
        j.experience.toLowerCase().includes(selectedExperience.toLowerCase())
      );
    if (selectedLocation !== "All") {
      const loc = selectedLocation.toLowerCase();
      result = result.filter(
        (j) =>
          j.location.toLowerCase().includes(loc) ||
          j.location.toLowerCase().includes("remote")
      );
    }
    if (selectedSource !== "All")
      result = result.filter((j) => j.source === selectedSource);
    result.sort((a, b) => {
      if (sortBy === "relevance") {
        return (
          calculatePrivateJobMatch(b, userProfile) -
          calculatePrivateJobMatch(a, userProfile)
        );
      }
      return 0;
    });
    return result;
  }, [
    privateJobs,
    searchQuery,
    selectedCategory,
    selectedExperience,
    selectedLocation,
    selectedSource,
    sortBy,
    userProfile,
  ]);

  // ── Processed Govt Jobs ─────────────────────────────────────────────────
  const processedGovtJobs = useMemo(() => {
    let result = [...govtJobs];
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (j) =>
          j.title.toLowerCase().includes(q) ||
          j.organization.toLowerCase().includes(q)
      );
    }
    if (selectedCategory !== "All")
      result = result.filter((j) =>
        (j.category || "").toLowerCase().includes(selectedCategory.toLowerCase())
      );
    result.sort((a, b) => {
      if (sortBy === "relevance") {
        return (
          calculateGovtJobMatch(b, userProfile) -
          calculateGovtJobMatch(a, userProfile)
        );
      }
      return 0;
    });
    return result;
  }, [govtJobs, searchQuery, selectedCategory, sortBy, userProfile]);

  // ── Processed Sarkari Jobs ──────────────────────────────────────────────
  const processedSarkariJobs = useMemo(() => {
    let result = sarkariData?.jobs ?? [];
    if (sarkariSource !== "All")
      result = result.filter((j) => j.source === sarkariSource);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (j) =>
          j.title.toLowerCase().includes(q) ||
          j.description.toLowerCase().includes(q) ||
          (j.category || "").toLowerCase().includes(q)
      );
    }
    return result;
  }, [sarkariData?.jobs, sarkariSource, searchQuery]);

  const paginatedSarkariJobs = processedSarkariJobs.slice(
    0,
    sarkariPage * SARKARI_PER_PAGE
  );
  const hasMoreSarkari = paginatedSarkariJobs.length < processedSarkariJobs.length;

  const handleTabChange = (tab: MainTab) => {
    setActiveTab(tab);
    setSarkariPage(1);
  };

  return (
    <>
      <JobProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        onProfileUpdated={(p) => setUserProfile(p)}
      />

      {/* Hero */}
      <HeroBanner variant="jobs" py="py-14 sm:py-16">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl font-extrabold sm:text-5xl drop-shadow-lg"
        >
          <span className="bg-gradient-to-r from-violet-300 via-pink-300 to-indigo-300 bg-clip-text text-transparent">
            Jobs Portal — Government, Private &amp; Sarkari
          </span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.45 }}
          className="mt-3 max-w-2xl text-white/80 text-sm sm:text-base"
        >
          Explore Government Notifications, LinkedIn &amp; Indeed Private
          Opportunities, live Sarkari RSS feed, Admit Cards, and Official Exam
          Results.
        </motion.p>
      </HeroBanner>

      {/* Main Container */}
      <div className="container-page py-10">
        {/* Profile Bar */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card p-4 bg-gradient-to-r from-violet-900/10 via-purple-900/5 to-indigo-900/10 border-violet-200 dark:border-violet-800/40"
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-600 text-white shadow-md">
                <UserCheck className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 dark:text-white text-sm">
                    Target Role:
                  </span>
                  <span className="rounded-full bg-violet-100 text-violet-800 dark:bg-violet-900/60 dark:text-violet-200 px-3 py-0.5 text-xs font-semibold">
                    {userProfile.targetRole}
                  </span>
                  <span className="text-xs text-slate-500">
                    ({userProfile.location})
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Experience: {userProfile.experience} · Skills:{" "}
                  {userProfile.skills.join(", ")}
                </p>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setIsProfileModalOpen(true)}
              className="btn-primary text-xs py-2 px-4 shrink-0 gap-1.5 shadow-sm"
            >
              <Zap className="h-3.5 w-3.5" /> Filter by My Profile &amp; Relevance
            </motion.button>
          </div>
        </motion.div>

        {/* ── Tab Navigation ───────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.18 }}
          className="mt-8 flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-3"
        >
          <div className="flex flex-wrap gap-2">
            {/* All */}
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => handleTabChange("all")}
              className={`rounded-xl px-4 py-2 text-xs font-bold transition ${
                activeTab === "all"
                  ? "bg-violet-600 text-white shadow-md"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300"
              }`}
            >
              All Opportunities
            </motion.button>

            {/* Govt */}
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => handleTabChange("govt")}
              className={`rounded-xl px-4 py-2 text-xs font-bold transition flex items-center gap-1.5 ${
                activeTab === "govt"
                  ? "bg-amber-600 text-white shadow-md"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300"
              }`}
            >
              <Building2 className="h-3.5 w-3.5" /> Government Jobs
            </motion.button>

            {/* Sarkari RSS — NEW */}
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => handleTabChange("sarkari")}
              className={`rounded-xl px-4 py-2 text-xs font-bold transition flex items-center gap-1.5 ${
                activeTab === "sarkari"
                  ? "text-white shadow-md"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300"
              }`}
              style={
                activeTab === "sarkari"
                  ? { background: "linear-gradient(135deg,#ea580c,#9333ea)" }
                  : {}
              }
            >
              <Landmark className="h-3.5 w-3.5" /> 🏛️ Sarkari Jobs
              {sarkariData?.counts.total !== undefined && (
                <span
                  className={`rounded-full px-1.5 py-0.5 text-[10px] font-extrabold ${
                    activeTab === "sarkari"
                      ? "bg-white/25"
                      : "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300"
                  }`}
                >
                  {sarkariData.counts.total}
                </span>
              )}
            </motion.button>

            {/* Private */}
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => handleTabChange("private")}
              className={`rounded-xl px-4 py-2 text-xs font-bold transition flex items-center gap-1.5 ${
                activeTab === "private"
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300"
              }`}
            >
              <Briefcase className="h-3.5 w-3.5" /> Private Jobs (LinkedIn &amp; Indeed)
            </motion.button>

            {/* Admit Cards */}
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => handleTabChange("admit-cards")}
              className={`rounded-xl px-4 py-2 text-xs font-bold transition flex items-center gap-1.5 ${
                activeTab === "admit-cards"
                  ? "bg-emerald-600 text-white shadow-md"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300"
              }`}
            >
              <FileCheck className="h-3.5 w-3.5 text-emerald-400" /> Admit Cards (
              {admitCards.length})
            </motion.button>

            {/* Results */}
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => handleTabChange("results")}
              className={`rounded-xl px-4 py-2 text-xs font-bold transition flex items-center gap-1.5 ${
                activeTab === "results"
                  ? "bg-purple-600 text-white shadow-md"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300"
              }`}
            >
              <Trophy className="h-3.5 w-3.5 text-yellow-400" /> Results ({results.length})
            </motion.button>
          </div>

          {/* Sort By */}
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
        </motion.div>

        {/* ── Search & Filter Bar ──────────────────────────────────────── */}
        {(activeTab === "all" || activeTab === "private" || activeTab === "govt" || activeTab === "sarkari") && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.22 }}
            className="mt-6 card p-4 space-y-4 bg-slate-50/70 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800"
          >
            <div className="relative">
              <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={
                  activeTab === "sarkari"
                    ? "Search Sarkari jobs by title, description, category..."
                    : "Search by job title, company name, skills (e.g. React, Python, SSC)..."
                }
                className="input pl-10 text-sm w-full"
              />
            </div>
            {isScraperActive && activeTab !== "sarkari" && (
              <div className="flex items-center gap-2 text-xs font-bold text-blue-600 dark:text-blue-400">
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                Scraping live jobs in real-time across LinkedIn, Indeed, Glassdoor &amp; Govt
                Portals...
              </div>
            )}

            {/* Sarkari source filter */}
            {activeTab === "sarkari" && (
              <div className="flex flex-wrap gap-2">
                {(
                  [
                    { key: "All", label: "All Sources", cls: "bg-slate-900 text-white" },
                    {
                      key: "SarkariResult",
                      label: "SarkariResult.com",
                      cls: "bg-orange-500 text-white",
                    },
                    {
                      key: "SarkariExam",
                      label: "SarkariExam.com",
                      cls: "bg-purple-600 text-white",
                    },
                  ] as const
                ).map((s) => (
                  <motion.button
                    key={s.key}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => {
                      setSarkariSource(s.key);
                      setSarkariPage(1);
                    }}
                    className={`rounded-xl px-4 py-2 text-xs font-bold transition flex items-center gap-1.5 ${
                      sarkariSource === s.key
                        ? s.cls + " shadow-md"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300"
                    }`}
                  >
                    <Filter className="h-3 w-3" />
                    {s.label}
                    {sarkariData && (
                      <span className="opacity-70">
                        (
                        {s.key === "All"
                          ? sarkariData.counts.total
                          : s.key === "SarkariResult"
                          ? sarkariData.counts.sarkariResult
                          : sarkariData.counts.sarkariExam}
                        )
                      </span>
                    )}
                  </motion.button>
                ))}
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => refetchSarkari()}
                  disabled={isSarkariLoading}
                  className="ml-auto rounded-xl px-3 py-2 text-xs font-bold bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 flex items-center gap-1.5"
                >
                  <RefreshCw
                    className={`h-3.5 w-3.5 ${isSarkariLoading ? "animate-spin" : ""}`}
                  />
                  Refresh
                </motion.button>
              </div>
            )}

            {/* Private/Govt filters */}
            {activeTab !== "sarkari" && (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
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
            )}
          </motion.div>
        )}

        {/* ── Tab Content ─────────────────────────────────────────────── */}
        <AnimatePresence mode="wait">
          <div className="mt-8">

            {/* PRIVATE TAB */}
            {activeTab === "private" && (
              <motion.div
                key="private"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
                    <Briefcase className="h-5 w-5 text-blue-600" /> Private Jobs Stream
                  </h3>
                  <span className="text-xs text-slate-500 font-semibold">
                    {processedPrivateJobs.length} roles found
                  </span>
                </div>
                <motion.div
                  variants={staggerContainer}
                  initial="hidden"
                  animate="visible"
                  className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
                >
                  {processedPrivateJobs.map((job) => (
                    <motion.div key={job.id} variants={cardVariant}>
                      <PrivateJobCard
                        job={job}
                        matchScore={calculatePrivateJobMatch(job, userProfile)}
                      />
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
            )}

            {/* GOVT TAB */}
            {activeTab === "govt" && (
              <motion.div
                key="govt"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-amber-600" /> Official Government Job
                    Notifications
                  </h3>
                  <span className="text-xs text-slate-500 font-semibold">
                    {processedGovtJobs.length} notifications
                  </span>
                </div>
                {isGovtLoading ? (
                  <JobListSkeleton count={9} />
                ) : processedGovtJobs.length === 0 ? (
                  <EmptyState
                    title="No Government Jobs Found"
                    description="Try broadening your search or filters."
                  />
                ) : (
                  <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    animate="visible"
                    className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
                  >
                    {processedGovtJobs.map((job) => (
                      <motion.div key={job.id} variants={cardVariant}>
                        <JobCard job={job} />
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </motion.div>
            )}

            {/* 🏛️ SARKARI RSS TAB — NEW */}
            {activeTab === "sarkari" && (
              <motion.div
                key="sarkari"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-5"
              >
                {/* Header */}
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
                    <Landmark className="h-5 w-5 text-orange-500" />
                    Sarkari Jobs — Live RSS Feed
                    {sarkariData?.counts.total !== undefined && (
                      <span className="rounded-full bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-300 px-2.5 py-0.5 text-xs font-bold">
                        {sarkariData.counts.total} jobs
                      </span>
                    )}
                  </h3>
                  <span className="text-xs text-slate-500">
                    Showing {paginatedSarkariJobs.length} of{" "}
                    {processedSarkariJobs.length}
                    {searchQuery && ` matching "${searchQuery}"`}
                  </span>
                </div>

                {/* Error */}
                {sarkariData?.errors && sarkariData.errors.length > 0 && (
                  <div className="flex items-start gap-2 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-700/40 p-3">
                    <AlertCircle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                    <p className="text-xs text-amber-700 dark:text-amber-300">
                      {sarkariData.errors.map((e) => e.source).join(", ")} could not be
                      reached. Showing available jobs only.
                    </p>
                  </div>
                )}

                {/* Skeletons */}
                {isSarkariLoading && (
                  <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {Array.from({ length: 9 }).map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: i * 0.06 }}
                        className="skeleton h-36 rounded-2xl"
                      />
                    ))}
                  </div>
                )}

                {/* Jobs Grid */}
                {!isSarkariLoading && paginatedSarkariJobs.length > 0 && (
                  <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    animate="visible"
                    className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
                  >
                    {paginatedSarkariJobs.map((job) => (
                      <SarkariJobCard
                        key={job.id}
                        job={job}
                        search={searchQuery}
                      />
                    ))}
                  </motion.div>
                )}

                {/* Empty */}
                {!isSarkariLoading && paginatedSarkariJobs.length === 0 && (
                  <EmptyState
                    title="No Sarkari Jobs Found"
                    description={
                      searchQuery
                        ? `No jobs matching "${searchQuery}". Try a different search.`
                        : "Jobs are loading. Click Refresh to try again."
                    }
                  />
                )}

                {/* Load More */}
                {!isSarkariLoading && hasMoreSarkari && (
                  <div className="flex justify-center mt-6">
                    <motion.button
                      whileHover={{ scale: 1.04, y: -2 }}
                      whileTap={{ scale: 0.96 }}
                      onClick={() => setSarkariPage((p) => p + 1)}
                      className="inline-flex items-center gap-2 rounded-2xl px-8 py-3 text-sm font-bold text-white shadow-lg"
                      style={{ background: "linear-gradient(135deg,#ea580c,#9333ea)" }}
                    >
                      Load More Jobs
                    </motion.button>
                  </div>
                )}
              </motion.div>
            )}

            {/* ADMIT CARDS TAB */}
            {activeTab === "admit-cards" && (
              <motion.div
                key="admit-cards"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
                    <FileCheck className="h-5 w-5 text-emerald-600" /> Latest Government Admit Cards
                  </h3>
                  <Link to="/admit-cards" className="text-xs text-violet-600 font-semibold hover:underline">
                    View Full Admit Cards Portal →
                  </Link>
                </div>
                <motion.div
                  variants={staggerContainer}
                  initial="hidden"
                  animate="visible"
                  className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
                >
                  {admitCards.map((ac) => (
                    <motion.div key={ac.id} variants={cardVariant}>
                      <Link
                        to={`/admit-cards/${ac.id}`}
                        className="card p-5 hover:scale-[1.01] transition border-slate-200 dark:border-slate-800 block"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <span className="rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2.5 py-0.5 dark:bg-emerald-950/60 dark:text-emerald-300">
                            ADMIT CARD RELEASED
                          </span>
                        </div>
                        <h4 className="font-bold text-slate-900 dark:text-white text-sm line-clamp-2">
                          {ac.title}
                        </h4>
                        <p className="text-xs text-slate-500 mt-1">{ac.organization}</p>
                        <p className="text-xs text-emerald-600 font-semibold mt-3">
                          Date: {formatDate(ac.last_date || ac.published_date)}
                        </p>
                      </Link>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
            )}

            {/* RESULTS TAB */}
            {activeTab === "results" && (
              <motion.div
                key="results"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-yellow-500" /> Exam Results &amp; Selection Lists
                  </h3>
                  <Link to="/results" className="text-xs text-violet-600 font-semibold hover:underline">
                    View Full Results Portal →
                  </Link>
                </div>
                <motion.div
                  variants={staggerContainer}
                  initial="hidden"
                  animate="visible"
                  className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
                >
                  {results.map((res) => (
                    <motion.div key={res.id} variants={cardVariant}>
                      <Link
                        to={`/results/${res.id}`}
                        className="card p-5 hover:scale-[1.01] transition border-slate-200 dark:border-slate-800 block"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <span className="rounded-full bg-yellow-100 text-yellow-800 text-[10px] font-bold px-2.5 py-0.5 dark:bg-yellow-950/60 dark:text-yellow-300">
                            RESULT DECLARED
                          </span>
                        </div>
                        <h4 className="font-bold text-slate-900 dark:text-white text-sm line-clamp-2">
                          {res.title}
                        </h4>
                        <p className="text-xs text-slate-500 mt-1">{res.organization}</p>
                        <p className="text-xs text-purple-600 font-semibold mt-3">
                          Date: {formatDate(res.last_date || res.published_date)}
                        </p>
                      </Link>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
            )}

            {/* ALL TAB */}
            {activeTab === "all" && (
              <motion.div
                key="all"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-10"
              >
                {/* Private sub */}
                <div>
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full bg-blue-500" /> Live Private
                      Opportunities (via LinkedIn &amp; Indeed)
                    </h3>
                    <button
                      onClick={() => handleTabChange("private")}
                      className="text-xs text-violet-600 font-semibold hover:underline"
                    >
                      View All Private Jobs ({processedPrivateJobs.length}) →
                    </button>
                  </div>
                  <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    animate="visible"
                    className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
                  >
                    {processedPrivateJobs.slice(0, 6).map((job) => (
                      <motion.div key={job.id} variants={cardVariant}>
                        <PrivateJobCard
                          job={job}
                          matchScore={calculatePrivateJobMatch(job, userProfile)}
                        />
                      </motion.div>
                    ))}
                  </motion.div>
                </div>

                {/* Govt sub */}
                <div className="pt-6 border-t border-slate-200 dark:border-slate-800">
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full bg-amber-500" /> Latest
                      Government Notifications
                    </h3>
                    <button
                      onClick={() => handleTabChange("govt")}
                      className="text-xs text-violet-600 font-semibold hover:underline"
                    >
                      View All Sarkari Jobs ({processedGovtJobs.length}) →
                    </button>
                  </div>
                  {isGovtLoading ? (
                    <JobListSkeleton count={6} />
                  ) : (
                    <motion.div
                      variants={staggerContainer}
                      initial="hidden"
                      animate="visible"
                      className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
                    >
                      {processedGovtJobs.slice(0, 6).map((job) => (
                        <motion.div key={job.id} variants={cardVariant}>
                          <JobCard job={job} />
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </div>

                {/* Sarkari RSS sub */}
                <div className="pt-6 border-t border-slate-200 dark:border-slate-800">
                  <div className="mb-4 flex items-center justify-between flex-wrap gap-2">
                    <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full bg-orange-500" />
                      🏛️ Sarkari RSS Feed (SarkariResult &amp; SarkariExam)
                      {sarkariData?.counts.total !== undefined && (
                        <span className="rounded-full bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-300 px-2 py-0.5 text-[10px] font-bold">
                          {sarkariData.counts.total} live
                        </span>
                      )}
                    </h3>
                    <button
                      onClick={() => handleTabChange("sarkari")}
                      className="text-xs text-orange-600 font-semibold hover:underline"
                    >
                      View All Sarkari Jobs →
                    </button>
                  </div>
                  {isSarkariLoading ? (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                      {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="skeleton h-28 rounded-2xl" />
                      ))}
                    </div>
                  ) : (
                    <motion.div
                      variants={staggerContainer}
                      initial="hidden"
                      animate="visible"
                      className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4"
                    >
                      {(sarkariData?.jobs ?? []).slice(0, 4).map((job) => (
                        <motion.div key={job.id} variants={cardVariant}>
                          <SarkariJobCard job={job} search="" />
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </div>
              </motion.div>
            )}
          </div>
        </AnimatePresence>
      </div>
    </>
  );
}

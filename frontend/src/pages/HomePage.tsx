import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  BookOpen,
  Briefcase,
  Building2,
  Check,
  ChevronRight,
  Clock,
  ExternalLink,
  FileText,
  Landmark,
  RefreshCw,
  Search,
  Sparkles,
  Star,
  Target,
  Trophy,
  UserCheck,
  Zap,
  AlertCircle,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { ContentCard } from "@/components/ContentCard";
import { HeroBanner } from "@/components/HeroBanner";
import { JobCard } from "@/components/JobCard";
import { PrivateJobCard } from "@/components/PrivateJobCard";
import { JobProfileModal } from "@/components/JobProfileModal";
import { JobListSkeleton } from "@/components/Skeleton";
import { SearchBar } from "@/components/SearchBar";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { useHomeData } from "@/hooks/useJobs";
import { useProgressivePrivateJobs } from "@/hooks/useProgressiveJobs";
import { useSarkariJobs, type SarkariJob } from "@/hooks/useSarkariJobs";
import { EXAM_GROUPS } from "@/data/mockTests";
import {
  calculateGovtJobMatch,
  calculatePrivateJobMatch,
  getUserJobProfile,
  type UserJobProfile,
} from "@/utils/jobMatcher";
import { formatDate } from "@/utils/format";

type JobTab = "all" | "govt" | "private";

// ─── Animation Variants ───────────────────────────────────────────────────────
const fadeUpVariants = {
  hidden: { opacity: 0, y: 22 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.07, duration: 0.45, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06, delayChildren: 0.1 } },
};

const cardVariant = {
  hidden: { opacity: 0, y: 20, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring" as const, stiffness: 260, damping: 22 },
  },
};

// ─── Sarkari Mini Card ────────────────────────────────────────────────────────
function SarkariMiniCard({ job }: { job: SarkariJob }) {
  const isSR = job.source === "SarkariResult";
  return (
    <motion.a
      href={job.link}
      target="_blank"
      rel="noopener noreferrer"
      variants={cardVariant}
      whileHover={{ y: -3, transition: { duration: 0.18 } }}
      className={`card block p-4 border-l-4 ${
        isSR
          ? "border-l-orange-400 bg-orange-50/40 dark:bg-orange-950/20"
          : "border-l-purple-500 bg-purple-50/40 dark:bg-purple-950/20"
      }`}
    >
      <div className="flex items-start gap-2.5">
        <div
          className={`mt-0.5 h-7 w-7 shrink-0 rounded-lg flex items-center justify-center ${
            isSR
              ? "bg-orange-100 dark:bg-orange-900/40"
              : "bg-purple-100 dark:bg-purple-900/40"
          }`}
        >
          <Landmark
            className={`h-3.5 w-3.5 ${
              isSR ? "text-orange-600" : "text-purple-600"
            }`}
          />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-slate-900 dark:text-white line-clamp-2 leading-snug">
            {job.title}
          </p>
          <div className="mt-1.5 flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                isSR
                  ? "bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-300"
                  : "bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300"
              }`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  isSR ? "bg-orange-400" : "bg-purple-500"
                }`}
              />
              {job.source}
            </span>
            {job.formattedDate && (
              <span className="flex items-center gap-1 text-[10px] text-slate-400">
                <Clock className="h-2.5 w-2.5" />
                {job.formattedDate}
              </span>
            )}
          </div>
        </div>
        <ExternalLink className="h-3.5 w-3.5 shrink-0 text-slate-400 mt-0.5" />
      </div>
    </motion.a>
  );
}

// ─── Animated Stats Bar ───────────────────────────────────────────────────────
function AnimatedStat({
  value,
  label,
  color,
  delay,
}: {
  value: string;
  label: string;
  color: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4, ease: "easeOut" }}
      className="flex flex-col items-center justify-center"
    >
      <motion.span
        className={`text-xl font-extrabold ${color}`}
        initial={{ scale: 0.7 }}
        animate={{ scale: 1 }}
        transition={{ delay: delay + 0.1, type: "spring", stiffness: 280 }}
      >
        {value}
      </motion.span>
      <span className="text-xs text-slate-500 dark:text-slate-400">{label}</span>
    </motion.div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export function HomePage(): JSX.Element {
  const { t } = useTranslation();
  useDocumentTitle(
    "DeshKiSeva — Govt Jobs, Private Jobs (LinkedIn & Indeed), Mock Tests & Resume Builder"
  );

  const { data: homeData, isLoading: isGovtLoading } = useHomeData();
  const { jobs: privateJobs, isStreaming: isPrivateStreaming } =
    useProgressivePrivateJobs();
  const {
    data: sarkariData,
    isLoading: isSarkariLoading,
    refetch: refetchSarkari,
  } = useSarkariJobs();

  const [activeJobTab, setActiveJobTab] = useState<JobTab>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [userProfile, setUserProfile] = useState<UserJobProfile>(() =>
    getUserJobProfile()
  );

  const filteredPrivateJobs = privateJobs.filter((job) => {
    if (selectedCategory !== "All" && job.category !== selectedCategory)
      return false;
    return true;
  });

  const filteredGovtJobs = (homeData?.latest_jobs || []).filter((job) => {
    if (selectedCategory !== "All" && job.category !== selectedCategory)
      return false;
    return true;
  });

  // Show latest 4 sarkari jobs on home page
  const previewSarkariJobs = useMemo(
    () => (sarkariData?.jobs ?? []).slice(0, 4),
    [sarkariData]
  );

  return (
    <>
      <JobProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        onProfileUpdated={(newProfile) => setUserProfile(newProfile)}
      />

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <HeroBanner variant="jobs" py="py-16 sm:py-20">
        <motion.span
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-xs font-semibold backdrop-blur-sm border border-white/20"
        >
          <Sparkles className="h-3.5 w-3.5 text-yellow-300" />
          All-in-One Career &amp; Exam Portal for India
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="mt-4 max-w-4xl text-3xl font-extrabold leading-tight sm:text-5xl drop-shadow-lg"
        >
          One Platform for{" "}
          <span className="bg-gradient-to-r from-yellow-300 via-pink-300 to-purple-300 bg-clip-text text-transparent">
            Jobs, Mock Tests &amp; Resumes
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.45 }}
          className="mt-3 max-w-2xl text-white/80 text-sm sm:text-base leading-relaxed"
        >
          Discover latest Government Notifications, scrape live Private
          Opportunities via LinkedIn &amp; Indeed, practice 100+ Free Exam Mock
          Tests, and build an ATS-friendly CV.
        </motion.p>

        {/* Pillar Nav Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8 flex flex-wrap justify-center gap-3"
        >
          {[
            {
              href: "#jobs-section",
              icon: Briefcase,
              label: "1. Jobs Hub (Govt & Private)",
              cls: "bg-white/20 border-white/30 hover:bg-white/30",
              iconCls: "text-yellow-300",
            },
            {
              href: "#sarkari-section",
              icon: Landmark,
              label: "2. Sarkari Jobs",
              cls: "bg-orange-500/30 border-orange-300/30 hover:bg-orange-500/40",
              iconCls: "text-orange-200",
            },
            {
              href: "#mock-tests-section",
              icon: BookOpen,
              label: "3. Free Mock Tests",
              cls: "bg-purple-500/30 border-purple-300/30 hover:bg-purple-500/40",
              iconCls: "text-pink-300",
            },
            {
              href: "#resume-builder-section",
              icon: FileText,
              label: "4. ATS Resume Builder",
              cls: "bg-emerald-500/30 border-emerald-300/30 hover:bg-emerald-500/40",
              iconCls: "text-emerald-300",
            },
          ].map((item) => (
            <motion.a
              key={item.href}
              href={item.href}
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.97 }}
              className={`inline-flex items-center gap-2 rounded-2xl border px-5 py-2.5 text-xs font-bold backdrop-blur-md text-white shadow-lg transition ${item.cls}`}
            >
              <item.icon className={`h-4 w-4 ${item.iconCls}`} />
              {item.label}
            </motion.a>
          ))}
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="mt-8 max-w-3xl"
        >
          <SearchBar />
        </motion.div>
      </HeroBanner>

      {/* ── Quick Stats ───────────────────────────────────────────────────── */}
      <div className="border-b border-slate-200 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-900/40 py-4">
        <div className="container-page grid grid-cols-2 gap-4 text-center sm:grid-cols-4">
          <AnimatedStat
            value="25,000+"
            label="Government Notifications"
            color="text-slate-900 dark:text-white"
            delay={0}
          />
          <AnimatedStat
            value="LinkedIn & Indeed"
            label="Private Jobs Stream"
            color="text-blue-600 dark:text-blue-400"
            delay={0.1}
          />
          <AnimatedStat
            value={`${sarkariData?.counts.total ?? "—"} Live`}
            label="Sarkari Jobs Today"
            color="text-orange-600 dark:text-orange-400"
            delay={0.2}
          />
          <AnimatedStat
            value="100% Free"
            label="ATS Resume Builder"
            color="text-emerald-600 dark:text-emerald-400"
            delay={0.3}
          />
        </div>
      </div>

      {/* ── SECTION 1: JOBS HUB ───────────────────────────────────────────── */}
      <section id="jobs-section" className="container-page py-14 scroll-mt-6">
        <motion.div
          variants={fadeUpVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          custom={0}
          className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
        >
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-md bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300 font-bold px-2.5 py-1 text-xs">
                SECTION 1
              </span>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                Jobs Hub — Find Your Opportunity
              </h2>
            </div>
            <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">
              Browse verified Government Job notifications &amp; live scraped
              Private Jobs from LinkedIn, Indeed &amp; Glassdoor.
            </p>
          </div>
          <Link
            to="/jobs"
            className="btn-secondary shrink-0 self-start sm:self-auto text-xs py-2"
          >
            Browse Full Portal <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </motion.div>

        {/* Profile Matcher Bar */}
        <motion.div
          variants={fadeUpVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          custom={1}
          className="mt-6 card p-4 bg-gradient-to-r from-violet-900/10 via-purple-900/5 to-indigo-900/10 border-violet-200 dark:border-violet-800/40"
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-600 text-white font-bold shadow-md">
                <UserCheck className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 dark:text-white text-sm">
                    Target Profile:
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
              <Zap className="h-3.5 w-3.5" /> Edit Profile &amp; Preferences
            </motion.button>
          </div>
        </motion.div>

        {/* Sub-tabs */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-3">
          <div className="flex flex-wrap gap-2">
            {(
              [
                { key: "all", label: "All Opportunities", cls: "bg-violet-600" },
                {
                  key: "govt",
                  label: "Government Jobs (Sarkari)",
                  cls: "bg-amber-600",
                  icon: Building2,
                },
                {
                  key: "private",
                  label: "Private Jobs (LinkedIn & Indeed)",
                  cls: "bg-blue-600",
                  icon: Briefcase,
                },
              ] as const
            ).map((tab) => (
              <motion.button
                key={tab.key}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setActiveJobTab(tab.key as JobTab)}
                className={`rounded-xl px-4 py-2 text-xs font-bold transition flex items-center gap-1.5 ${
                  activeJobTab === tab.key
                    ? `${tab.cls} text-white shadow-md`
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300"
                }`}
              >
                {tab.key !== "all" && tab.icon && (
                  <tab.icon className="h-3.5 w-3.5" />
                )}
                {tab.label}
              </motion.button>
            ))}
          </div>
          {isPrivateStreaming && (
            <div className="flex items-center gap-2 text-xs font-medium text-blue-600 dark:text-blue-400">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500" />
              </span>
              Scraping live jobs progressively...
            </div>
          )}
        </div>

        {/* Category Pills */}
        <div className="mt-4 flex flex-wrap gap-1.5">
          {[
            "All","Tech","Management","Finance","Design","Marketing","SSC","UPSC","Banking",
          ].map((cat) => (
            <motion.button
              key={cat}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-lg px-3 py-1 text-[11px] font-medium transition ${
                selectedCategory === cat
                  ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400"
              }`}
            >
              {cat}
            </motion.button>
          ))}
        </div>

        {/* Jobs Grid */}
        <AnimatePresence mode="wait">
          <div className="mt-6">
            {activeJobTab === "private" && (
              <motion.div
                key="private"
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
              >
                {filteredPrivateJobs.map((job) => (
                  <motion.div key={job.id} variants={cardVariant}>
                    <PrivateJobCard
                      job={job}
                      matchScore={calculatePrivateJobMatch(job, userProfile)}
                    />
                  </motion.div>
                ))}
              </motion.div>
            )}

            {activeJobTab === "govt" && (
              <motion.div key="govt" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                {isGovtLoading ? (
                  <JobListSkeleton />
                ) : (
                  <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    animate="visible"
                    className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
                  >
                    {filteredGovtJobs.map((job) => (
                      <motion.div key={job.id} variants={cardVariant}>
                        <JobCard job={job} />
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </motion.div>
            )}

            {activeJobTab === "all" && (
              <div className="space-y-8">
                {/* Private sub-section */}
                <div>
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-blue-500" />
                      Live Scraped Private Jobs (LinkedIn &amp; Indeed)
                    </h3>
                    <span className="text-xs text-slate-500">
                      {filteredPrivateJobs.length} roles found
                    </span>
                  </div>
                  <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    animate="visible"
                    className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
                  >
                    {filteredPrivateJobs.slice(0, 6).map((job) => (
                      <motion.div key={job.id} variants={cardVariant}>
                        <PrivateJobCard
                          job={job}
                          matchScore={calculatePrivateJobMatch(job, userProfile)}
                        />
                      </motion.div>
                    ))}
                  </motion.div>
                </div>

                {/* Govt sub-section */}
                <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-amber-500" />
                      Latest Government Job Notifications
                    </h3>
                    <Link
                      to="/jobs"
                      className="text-xs font-semibold text-violet-600 hover:underline"
                    >
                      View All Sarkari Jobs →
                    </Link>
                  </div>
                  {isGovtLoading ? (
                    <JobListSkeleton />
                  ) : (
                    <motion.div
                      variants={staggerContainer}
                      initial="hidden"
                      animate="visible"
                      className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
                    >
                      {filteredGovtJobs.slice(0, 6).map((job) => (
                        <motion.div key={job.id} variants={cardVariant}>
                          <JobCard job={job} />
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </div>
              </div>
            )}
          </div>
        </AnimatePresence>
      </section>

      {/* ── SECTION 2: SARKARI JOBS (RSS Scraped) ────────────────────────── */}
      <section
        id="sarkari-section"
        className="bg-gradient-to-br from-orange-50 via-amber-50/50 to-white dark:from-orange-950/20 dark:via-slate-900 dark:to-slate-900 py-16 scroll-mt-6 border-y border-orange-200/60 dark:border-orange-800/20"
      >
        <div className="container-page">
          <motion.div
            variants={fadeUpVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            custom={0}
            className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
          >
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="rounded-md bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-300 font-bold px-2.5 py-1 text-xs">
                  SECTION 2
                </span>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  🏛️ Sarkari Jobs — Live Feed
                </h2>
                {sarkariData?.counts.total !== undefined && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 300, delay: 0.3 }}
                    className="rounded-full bg-orange-500 text-white text-xs font-bold px-2.5 py-0.5"
                  >
                    {sarkariData.counts.total} Live Jobs
                  </motion.span>
                )}
              </div>
              <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">
                Real-time job notifications scraped from{" "}
                <span className="font-semibold text-orange-600">
                  SarkariResult.com
                </span>{" "}
                &amp;{" "}
                <span className="font-semibold text-purple-600">
                  SarkariExam.com
                </span>
                . Deduplicated &amp; sorted newest first.
              </p>
            </div>

            <div className="flex gap-2 shrink-0">
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => refetchSarkari()}
                disabled={isSarkariLoading}
                className="btn-secondary text-xs py-2 gap-1.5"
              >
                <RefreshCw
                  className={`h-3.5 w-3.5 ${isSarkariLoading ? "animate-spin" : ""}`}
                />
                Refresh
              </motion.button>
              <Link
                to="/jobs?tab=sarkari"
                className="btn-primary text-xs py-2 px-4"
                style={{ background: "linear-gradient(135deg,#ea580c,#d97706)" }}
              >
                All Sarkari Jobs <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </motion.div>

          {/* Source count pills */}
          {sarkariData && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-4 flex flex-wrap gap-2"
            >
              {[
                {
                  label: "SarkariResult.com",
                  count: sarkariData.counts.sarkariResult,
                  cls: "bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900/40 dark:text-orange-300 dark:border-orange-700/40",
                  dot: "bg-orange-400",
                },
                {
                  label: "SarkariExam.com",
                  count: sarkariData.counts.sarkariExam,
                  cls: "bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/40 dark:text-purple-300 dark:border-purple-700/40",
                  dot: "bg-purple-500",
                },
              ].map((s) => (
                <span
                  key={s.label}
                  className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${s.cls}`}
                >
                  <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
                  {s.label}: {s.count} jobs
                </span>
              ))}
            </motion.div>
          )}

          {/* Error notice */}
          {sarkariData?.errors && sarkariData.errors.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-4 flex items-start gap-2 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-700/40 p-3"
            >
              <AlertCircle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
              <p className="text-xs text-amber-700 dark:text-amber-300">
                Some sources could not be reached. Showing available jobs only.
                Click Refresh to retry.
              </p>
            </motion.div>
          )}

          {/* Skeleton loading */}
          {isSarkariLoading && (
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.08 }}
                  className="skeleton h-28 rounded-2xl"
                />
              ))}
            </div>
          )}

          {/* Jobs grid */}
          {!isSarkariLoading && previewSarkariJobs.length > 0 && (
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
              className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
            >
              {previewSarkariJobs.map((job) => (
                <SarkariMiniCard key={job.id} job={job} />
              ))}
            </motion.div>
          )}

          {/* Empty state */}
          {!isSarkariLoading &&
            previewSarkariJobs.length === 0 &&
            !sarkariData?.errors?.length && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-8 text-center py-12"
              >
                <Landmark className="h-12 w-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                <p className="text-sm text-slate-500">
                  No jobs loaded yet.{" "}
                  <button
                    onClick={() => refetchSarkari()}
                    className="text-orange-600 font-semibold hover:underline"
                  >
                    Click to load
                  </button>
                </p>
              </motion.div>
            )}

          {/* View all CTA */}
          {!isSarkariLoading && previewSarkariJobs.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="mt-6 text-center"
            >
              <Link
                to="/jobs?tab=sarkari"
                className="inline-flex items-center gap-2 rounded-2xl px-8 py-3 text-sm font-bold text-white shadow-lg hover:shadow-xl transition-shadow"
                style={{ background: "linear-gradient(135deg,#ea580c,#9333ea)" }}
              >
                <Star className="h-4 w-4" />
                View All {sarkariData?.counts.total} Sarkari Jobs
                <ChevronRight className="h-4 w-4" />
              </Link>
            </motion.div>
          )}
        </div>
      </section>

      {/* ── SECTION 3: MOCK TESTS ──────────────────────────────────────────── */}
      <section
        id="mock-tests-section"
        className="bg-slate-50 dark:bg-slate-900/60 py-16 scroll-mt-6 border-y border-slate-200 dark:border-slate-800"
      >
        <div className="container-page">
          <motion.div
            variants={fadeUpVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            custom={0}
            className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
          >
            <div>
              <div className="flex items-center gap-2">
                <span className="rounded-md bg-pink-100 dark:bg-pink-900/40 text-pink-700 dark:text-pink-300 font-bold px-2.5 py-1 text-xs">
                  SECTION 3
                </span>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                  Mock Tests Hub — Practice &amp; Crack Exams
                </h2>
              </div>
              <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">
                Attempt official-pattern mock tests with instant scoring,
                section timers, and detailed explanations.
              </p>
            </div>
            <Link to="/mock-tests" className="btn-primary text-xs py-2 px-4 shrink-0">
              Browse All 100+ Mock Tests →
            </Link>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          >
            {EXAM_GROUPS.map((group) => (
              <motion.div key={group.id} variants={cardVariant}>
                <Link
                  to={`/mock-tests/${group.id}`}
                  className="card group flex flex-col justify-between p-5 hover:scale-[1.02] transition-transform bg-white dark:bg-[#101222]"
                >
                  <div>
                    <div className="flex items-start justify-between">
                      <span className="text-3xl">{group.icon}</span>
                      <span className="rounded-full bg-slate-100 dark:bg-slate-800 px-2.5 py-1 text-xs font-semibold text-slate-600 dark:text-slate-300">
                        {group.totalPapers} papers
                      </span>
                    </div>
                    <h3 className="mt-3 font-bold text-slate-900 dark:text-white group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
                      {group.shortName}
                    </h3>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                      {group.description}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {group.exams.slice(0, 3).map((exam) => (
                        <span
                          key={exam.id}
                          className="rounded-md border border-slate-200 px-2 py-0.5 text-[11px] font-medium text-slate-600 dark:border-slate-700 dark:text-slate-300"
                        >
                          {exam.name}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-violet-600 dark:text-violet-400 pt-3 border-t border-slate-100 dark:border-slate-800">
                    Attempt Tests <ChevronRight className="h-3.5 w-3.5" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>

          {/* CTET Banners */}
          <motion.div
            variants={fadeUpVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={1}
            className="mt-8 grid gap-5 lg:grid-cols-2"
          >
            <div className="card p-6 bg-gradient-to-br from-pink-900/20 via-purple-900/10 to-slate-900 border-pink-500/30">
              <div className="flex items-center gap-2 mb-2">
                <span className="rounded-full bg-pink-500 text-white text-[10px] font-extrabold px-2.5 py-0.5">
                  NEW OFFICIAL MOCK
                </span>
                <span className="text-xs text-pink-300 font-semibold">
                  CTET 2024 Paper-I
                </span>
              </div>
              <h3 className="text-lg font-bold text-white">
                CTET Paper-I (Primary Stage) Official Paper
              </h3>
              <p className="text-xs text-slate-300 mt-1">
                150 Questions · 150 Marks · 150 Mins · CDP, EVS, Maths, English &amp; Hindi
              </p>
              <div className="mt-4">
                <Link
                  to="/mock-tests/attempt/ctet-p1-2024-set1"
                  className="btn-primary text-xs py-2 px-5 bg-pink-600 hover:bg-pink-500"
                >
                  Start CTET Test Now →
                </Link>
              </div>
            </div>
            <div className="card p-6 bg-gradient-to-br from-teal-900/20 via-indigo-900/10 to-slate-900 border-teal-500/30">
              <div className="flex items-center gap-2 mb-2">
                <span className="rounded-full bg-teal-500 text-white text-[10px] font-extrabold px-2.5 py-0.5">
                  NEW OFFICIAL MOCK
                </span>
                <span className="text-xs text-teal-300 font-semibold">
                  CTET 2024 Paper-II
                </span>
              </div>
              <h3 className="text-lg font-bold text-white">
                CTET Paper-II (Elementary Stage) Official Paper
              </h3>
              <p className="text-xs text-slate-300 mt-1">
                150 Questions · 150 Marks · 150 Mins · CDP, Social Science, Maths &amp; Science
              </p>
              <div className="mt-4">
                <Link
                  to="/mock-tests/attempt/ctet-p2-2024-set1"
                  className="btn-primary text-xs py-2 px-5 bg-teal-600 hover:bg-teal-500"
                >
                  Start CTET Paper-II Now →
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── SECTION 4: RESUME BUILDER ─────────────────────────────────────── */}
      <section
        id="resume-builder-section"
        className="container-page py-16 scroll-mt-6"
      >
        <motion.div
          variants={fadeUpVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          custom={0}
          className="card overflow-hidden p-8 sm:p-10 bg-gradient-to-br from-slate-900 via-[#121528] to-violet-950 text-white border-violet-800/40 relative"
        >
          <div className="absolute top-0 right-0 h-64 w-64 rounded-full bg-violet-500/10 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/3 h-48 w-48 rounded-full bg-emerald-500/8 blur-2xl pointer-events-none" />

          <div className="relative z-10 grid gap-8 lg:grid-cols-2 lg:items-center">
            <div>
              <div className="flex items-center gap-2">
                <span className="rounded-md bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 font-bold px-2.5 py-1 text-xs">
                  SECTION 4
                </span>
                <span className="text-xs font-semibold text-violet-300">
                  Free Career Tool
                </span>
              </div>
              <h2 className="mt-4 text-3xl font-extrabold sm:text-4xl leading-tight">
                Build an{" "}
                <span className="bg-gradient-to-r from-emerald-300 to-cyan-300 bg-clip-text text-transparent">
                  ATS-Friendly Resume
                </span>{" "}
                in 5 Minutes
              </h2>
              <p className="mt-3 text-slate-300 text-sm leading-relaxed">
                Increase your interview callback rate by 3x. Use our professional
                resume builder with built-in ATS optimization, instant PDF export,
                and pre-formatted sections.
              </p>
              <div className="mt-6 space-y-2.5 text-xs text-slate-200">
                {[
                  "100% Free & ATS Scanner Compliant",
                  "Multiple Professional Templates for Tech, Corporate & Govt",
                  "Instant One-Click High Resolution PDF Export",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
              <div className="mt-8 flex flex-wrap gap-3">
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  <Link
                    to="/resume-builder"
                    className="btn-primary text-xs py-3 px-6 bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-lg"
                  >
                    Create My Resume Free →
                  </Link>
                </motion.div>
                <Link
                  to="/resume-builder/templates"
                  className="btn-secondary text-xs py-3 px-5 border-white/20 bg-white/10 text-white hover:bg-white/20"
                >
                  View Templates
                </Link>
              </div>
            </div>

            {/* Resume Preview Card */}
            <div className="relative flex justify-center">
              <motion.div
                initial={{ rotate: 1, opacity: 0, y: 20 }}
                whileInView={{ rotate: 1, opacity: 1, y: 0 }}
                whileHover={{ rotate: 0, scale: 1.02 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="card w-full max-w-sm p-6 bg-white/10 backdrop-blur-md border-white/15 text-white shadow-2xl rounded-2xl"
              >
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div>
                    <h4 className="font-bold text-base text-white">Rahul Sharma</h4>
                    <p className="text-xs text-emerald-300">Senior Full Stack Developer</p>
                  </div>
                  <span className="rounded-full bg-emerald-400/20 border border-emerald-400/30 text-emerald-300 text-[10px] font-bold px-2 py-0.5">
                    98% ATS Pass
                  </span>
                </div>
                <div className="mt-4 space-y-3 text-[11px] text-slate-300">
                  <div>
                    <span className="font-semibold text-white">Experience</span>
                    <p className="text-slate-400 mt-0.5">
                      Software Engineer at TechCorp (2022–Present)
                    </p>
                  </div>
                  <div>
                    <span className="font-semibold text-white">Top Skills</span>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {["React", "Node.js", "TypeScript", "SQL", "AWS"].map((s) => (
                        <span key={s} className="rounded bg-white/10 px-1.5 py-0.5 text-[10px]">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="mt-5 pt-3 border-t border-white/10 text-center">
                  <span className="text-[11px] text-slate-300 font-medium">
                    Ready to download in PDF
                  </span>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ── Closing Soon ──────────────────────────────────────────────────── */}
      <section className="container-page pb-16">
        <motion.h2
          variants={fadeUpVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          custom={0}
          className="flex items-center gap-2 text-2xl font-bold text-slate-900 dark:text-white"
        >
          <Clock className="h-6 w-6 text-violet-600" /> Closing Soon
          Notifications
        </motion.h2>
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {(homeData?.closing_soon ?? []).map((job) => (
            <motion.div key={job.id} variants={cardVariant}>
              <Link
                to={`/jobs/${job.id}`}
                className="card block p-4 hover:scale-[1.01] transition"
              >
                <p className="line-clamp-2 text-sm font-semibold text-slate-900 dark:text-white">
                  {job.title}
                </p>
                <p className="mt-1.5 truncate text-xs text-slate-500 dark:text-slate-400">
                  {job.organization}
                </p>
                <p className="mt-3 text-xs font-medium text-red-600 dark:text-red-400">
                  {t("home.lastDate")}: {formatDate(job.last_date)}
                </p>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </section>
    </>
  );
}

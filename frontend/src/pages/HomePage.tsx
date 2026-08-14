import { useState } from "react";
import {
  ArrowRight,
  BookOpen,
  Briefcase,
  Building2,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock,
  ExternalLink,
  FileCheck,
  FileText,
  Filter,
  Layers,
  MapPin,
  Search,
  Sparkles,
  Star,
  Target,
  Trophy,
  UserCheck,
  Zap,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { ContentCard } from "@/components/ContentCard";
import { HeroBanner } from "@/components/HeroBanner";
import { JobCard } from "@/components/JobCard";
import { PrivateJobCard } from "@/components/PrivateJobCard";
import { JobProfileModal } from "@/components/JobProfileModal";
import { JobListSkeleton, Skeleton } from "@/components/Skeleton";
import { SearchBar } from "@/components/SearchBar";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { useHomeData } from "@/hooks/useJobs";
import { useProgressivePrivateJobs } from "@/hooks/useProgressiveJobs";
import { EXAM_GROUPS } from "@/data/mockTests";
import {
  calculateGovtJobMatch,
  calculatePrivateJobMatch,
  getUserJobProfile,
  type UserJobProfile,
} from "@/utils/jobMatcher";
import { formatDate } from "@/utils/format";

type JobTab = "all" | "govt" | "private";

export function HomePage(): JSX.Element {
  const { t } = useTranslation();
  useDocumentTitle("DeshKiSeva — Govt Jobs, Private Jobs (LinkedIn & Indeed), Mock Tests & Resume Builder");

  // Home Data & Scrapers
  const { data: homeData, isLoading: isGovtLoading } = useHomeData();
  const { jobs: privateJobs, isStreaming: isPrivateStreaming } = useProgressivePrivateJobs();

  // Active Tab state for Jobs
  const [activeJobTab, setActiveJobTab] = useState<JobTab>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  // User Profile Modal & Matcher state
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [userProfile, setUserProfile] = useState<UserJobProfile>(() => getUserJobProfile());

  // Filter private jobs by profile & category
  const filteredPrivateJobs = privateJobs.filter(job => {
    if (selectedCategory !== "All" && job.category !== selectedCategory) return false;
    return true;
  });

  // Filter govt jobs by category
  const filteredGovtJobs = (homeData?.latest_jobs || []).filter(job => {
    if (selectedCategory !== "All" && job.category !== selectedCategory) return false;
    return true;
  });

  return (
    <>
      {/* ── Profile Customization Modal ────────────────────────────────────── */}
      <JobProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        onProfileUpdated={newProfile => setUserProfile(newProfile)}
      />

      {/* ── Hero Section with 3 Main Pillars Switcher ──────────────────────── */}
      <HeroBanner variant="jobs" py="py-16 sm:py-20">
        <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-xs font-semibold backdrop-blur-sm border border-white/20">
          <Sparkles className="h-3.5 w-3.5 text-yellow-300" />
          All-in-One Career &amp; Exam Portal for India
        </span>

        <h1 className="mt-4 max-w-4xl text-3xl font-extrabold leading-tight sm:text-5xl drop-shadow-lg">
          One Platform for{" "}
          <span className="bg-gradient-to-r from-yellow-300 via-pink-300 to-purple-300 bg-clip-text text-transparent">
            Jobs, Mock Tests &amp; Resumes
          </span>
        </h1>

        <p className="mt-3 max-w-2xl text-white/80 text-sm sm:text-base leading-relaxed">
          Discover latest Government Notifications, scrape live Private Opportunities via LinkedIn &amp; Indeed, practice 100+ Free Exam Mock Tests, and build an ATS-friendly CV.
        </p>

        {/* 3 Main Pillar Anchor Navigation Tabs */}
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <a
            href="#jobs-section"
            className="inline-flex items-center gap-2 rounded-2xl bg-white/20 border border-white/30 px-5 py-2.5 text-xs font-bold hover:bg-white/30 transition backdrop-blur-md text-white shadow-lg"
          >
            <Briefcase className="h-4 w-4 text-yellow-300" />
            1. Jobs Hub (Govt &amp; Private)
          </a>
          <a
            href="#mock-tests-section"
            className="inline-flex items-center gap-2 rounded-2xl bg-purple-500/30 border border-purple-300/30 px-5 py-2.5 text-xs font-bold hover:bg-purple-500/40 transition backdrop-blur-md text-white shadow-lg"
          >
            <BookOpen className="h-4 w-4 text-pink-300" />
            2. Free Mock Tests
          </a>
          <a
            href="#resume-builder-section"
            className="inline-flex items-center gap-2 rounded-2xl bg-emerald-500/30 border border-emerald-300/30 px-5 py-2.5 text-xs font-bold hover:bg-emerald-500/40 transition backdrop-blur-md text-white shadow-lg"
          >
            <FileText className="h-4 w-4 text-emerald-300" />
            3. ATS Resume Builder
          </a>
        </div>

        {/* Search Bar */}
        <div className="mt-8 max-w-3xl"><SearchBar /></div>
      </HeroBanner>

      {/* ── Quick Stats Bar ───────────────────────────────────────────────── */}
      <div className="border-b border-slate-200 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-900/40 py-4">
        <div className="container-page grid grid-cols-2 gap-4 text-center sm:grid-cols-4">
          <div className="flex flex-col items-center justify-center">
            <span className="text-xl font-extrabold text-slate-900 dark:text-white">25,000+</span>
            <span className="text-xs text-slate-500 dark:text-slate-400">Government Notifications</span>
          </div>
          <div className="flex flex-col items-center justify-center">
            <span className="text-xl font-extrabold text-blue-600 dark:text-blue-400">LinkedIn &amp; Indeed</span>
            <span className="text-xs text-slate-500 dark:text-slate-400">Private Jobs Stream</span>
          </div>
          <div className="flex flex-col items-center justify-center">
            <span className="text-xl font-extrabold text-purple-600 dark:text-purple-400">100+ Papers</span>
            <span className="text-xs text-slate-500 dark:text-slate-400">CTET, SSC, IBPS, RRB</span>
          </div>
          <div className="flex flex-col items-center justify-center">
            <span className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400">100% Free</span>
            <span className="text-xs text-slate-500 dark:text-slate-400">ATS Resume Builder</span>
          </div>
        </div>
      </div>

      {/* ── SECTION 1: JOBS HUB (Govt + Private LinkedIn/Indeed + Profile Collector) ── */}
      <section id="jobs-section" className="container-page py-14 scroll-mt-6">
        {/* Section Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-md bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300 font-bold px-2.5 py-1 text-xs">
                SECTION 1
              </span>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Jobs Hub — Find Your Opportunity</h2>
            </div>
            <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">
              Browse verified Government Job notifications &amp; live scraped Private Jobs from LinkedIn, Indeed &amp; Glassdoor.
            </p>
          </div>

          <Link to="/jobs" className="btn-secondary shrink-0 self-start sm:self-auto text-xs py-2">
            Browse Full Portal <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* User Job Profile Matcher Bar */}
        <div className="mt-6 card p-4 bg-gradient-to-r from-violet-900/10 via-purple-900/5 to-indigo-900/10 border-violet-200 dark:border-violet-800/40">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-600 text-white font-bold shadow-md">
                <UserCheck className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 dark:text-white text-sm">Target Profile:</span>
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
              <Zap className="h-3.5 w-3.5" /> Edit Profile &amp; Preferences
            </button>
          </div>
        </div>

        {/* Sub-tabs: All vs Government vs Private */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-3">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveJobTab("all")}
              className={`rounded-xl px-4 py-2 text-xs font-bold transition ${
                activeJobTab === "all"
                  ? "bg-violet-600 text-white shadow-md"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300"
              }`}
            >
              All Opportunities
            </button>
            <button
              onClick={() => setActiveJobTab("govt")}
              className={`rounded-xl px-4 py-2 text-xs font-bold transition flex items-center gap-1.5 ${
                activeJobTab === "govt"
                  ? "bg-amber-600 text-white shadow-md"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300"
              }`}
            >
              <Building2 className="h-3.5 w-3.5" /> Government Jobs (Sarkari)
            </button>
            <button
              onClick={() => setActiveJobTab("private")}
              className={`rounded-xl px-4 py-2 text-xs font-bold transition flex items-center gap-1.5 ${
                activeJobTab === "private"
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300"
              }`}
            >
              <Briefcase className="h-3.5 w-3.5" /> Private Jobs (LinkedIn &amp; Indeed)
            </button>
          </div>

          {/* Progressive Streaming Indicator */}
          {isPrivateStreaming && (
            <div className="flex items-center gap-2 text-xs font-medium text-blue-600 dark:text-blue-400">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              Scraping live jobs progressively...
            </div>
          )}
        </div>

        {/* Category Filter Pills */}
        <div className="mt-4 flex flex-wrap gap-1.5">
          {["All", "Tech", "Management", "Finance", "Design", "Marketing", "SSC", "UPSC", "Banking"].map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-lg px-3 py-1 text-[11px] font-medium transition ${
                selectedCategory === cat
                  ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Render Jobs Grid based on Active Tab */}
        <div className="mt-6">
          {activeJobTab === "private" && (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {filteredPrivateJobs.map(job => (
                <PrivateJobCard
                  key={job.id}
                  job={job}
                  matchScore={calculatePrivateJobMatch(job, userProfile)}
                />
              ))}
            </div>
          )}

          {activeJobTab === "govt" && (
            <div>
              {isGovtLoading ? (
                <JobListSkeleton />
              ) : (
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredGovtJobs.map(job => (
                    <JobCard key={job.id} job={job} />
                  ))}
                </div>
              )}
            </div>
          )}

          {activeJobTab === "all" && (
            <div className="space-y-8">
              {/* Private Jobs Sub-section */}
              <div>
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-blue-500"></span> Live Scraped Private Jobs (LinkedIn &amp; Indeed)
                  </h3>
                  <span className="text-xs text-slate-500">{filteredPrivateJobs.length} roles found</span>
                </div>
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredPrivateJobs.slice(0, 6).map(job => (
                    <PrivateJobCard
                      key={job.id}
                      job={job}
                      matchScore={calculatePrivateJobMatch(job, userProfile)}
                    />
                  ))}
                </div>
              </div>

              {/* Govt Jobs Sub-section */}
              <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-amber-500"></span> Latest Government Job Notifications
                  </h3>
                  <Link to="/jobs" className="text-xs font-semibold text-violet-600 hover:underline">
                    View All Sarkari Jobs &rarr;
                  </Link>
                </div>
                {isGovtLoading ? (
                  <JobListSkeleton />
                ) : (
                  <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {filteredGovtJobs.slice(0, 6).map(job => (
                      <JobCard key={job.id} job={job} />
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── SECTION 2: MOCK TESTS HUB ─────────────────────────────────────── */}
      <section id="mock-tests-section" className="bg-slate-50 dark:bg-slate-900/60 py-16 scroll-mt-6 border-y border-slate-200 dark:border-slate-800">
        <div className="container-page">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="rounded-md bg-pink-100 dark:bg-pink-900/40 text-pink-700 dark:text-pink-300 font-bold px-2.5 py-1 text-xs">
                  SECTION 2
                </span>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Mock Tests Hub — Practice &amp; Crack Exams</h2>
              </div>
              <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">
                Attempt official-pattern mock tests with instant scoring, section timers, and detailed explanations.
              </p>
            </div>

            <Link to="/mock-tests" className="btn-primary text-xs py-2 px-4 shrink-0">
              Browse All 100+ Mock Tests &rarr;
            </Link>
          </div>

          {/* Exam Category Grid */}
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {EXAM_GROUPS.map(group => (
              <Link
                key={group.id}
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
                    {group.exams.slice(0, 3).map(exam => (
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
            ))}
          </div>

          {/* Featured CTET & SSC CGL Cards Banner */}
          <div className="mt-8 grid gap-5 lg:grid-cols-2">
            {/* CTET Paper 1 Banner */}
            <div className="card p-6 bg-gradient-to-br from-pink-900/20 via-purple-900/10 to-slate-900 border-pink-500/30">
              <div className="flex items-center gap-2 mb-2">
                <span className="rounded-full bg-pink-500 text-white text-[10px] font-extrabold px-2.5 py-0.5">NEW OFFICIAL MOCK</span>
                <span className="text-xs text-pink-300 font-semibold">CTET 2024 Paper-I</span>
              </div>
              <h3 className="text-lg font-bold text-white">CTET Paper-I (Primary Stage) Official Paper</h3>
              <p className="text-xs text-slate-300 mt-1">150 Questions · 150 Marks · 150 Mins · CDP, EVS, Maths, English &amp; Hindi</p>
              <div className="mt-4 flex items-center gap-3">
                <Link to="/mock-tests/attempt/ctet-p1-2024-set1" className="btn-primary text-xs py-2 px-5 bg-pink-600 hover:bg-pink-500">
                  Start CTET Test Now &rarr;
                </Link>
              </div>
            </div>

            {/* CTET Paper 2 Banner */}
            <div className="card p-6 bg-gradient-to-br from-teal-900/20 via-indigo-900/10 to-slate-900 border-teal-500/30">
              <div className="flex items-center gap-2 mb-2">
                <span className="rounded-full bg-teal-500 text-white text-[10px] font-extrabold px-2.5 py-0.5">NEW OFFICIAL MOCK</span>
                <span className="text-xs text-teal-300 font-semibold">CTET 2024 Paper-II</span>
              </div>
              <h3 className="text-lg font-bold text-white">CTET Paper-II (Elementary Stage) Official Paper</h3>
              <p className="text-xs text-slate-300 mt-1">150 Questions · 150 Marks · 150 Mins · CDP, Social Science, Maths &amp; Science</p>
              <div className="mt-4 flex items-center gap-3">
                <Link to="/mock-tests/attempt/ctet-p2-2024-set1" className="btn-primary text-xs py-2 px-5 bg-teal-600 hover:bg-teal-500">
                  Start CTET Paper-II Now &rarr;
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 3: ATS RESUME BUILDER HUB ────────────────────────────── */}
      <section id="resume-builder-section" className="container-page py-16 scroll-mt-6">
        <div className="card overflow-hidden p-8 sm:p-10 bg-gradient-to-br from-slate-900 via-[#121528] to-violet-950 text-white border-violet-800/40 relative">
          {/* Background glow effects */}
          <div className="absolute top-0 right-0 h-64 w-64 rounded-full bg-violet-500/10 blur-3xl pointer-events-none"></div>

          <div className="relative z-10 grid gap-8 lg:grid-cols-2 lg:items-center">
            <div>
              <div className="flex items-center gap-2">
                <span className="rounded-md bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 font-bold px-2.5 py-1 text-xs">
                  SECTION 3
                </span>
                <span className="text-xs font-semibold text-violet-300">Free Career Tool</span>
              </div>

              <h2 className="mt-4 text-3xl font-extrabold sm:text-4xl leading-tight">
                Build an <span className="bg-gradient-to-r from-emerald-300 to-cyan-300 bg-clip-text text-transparent">ATS-Friendly Resume</span> in 5 Minutes
              </h2>

              <p className="mt-3 text-slate-300 text-sm leading-relaxed">
                Increase your interview callback rate by 3x. Use our professional resume builder with built-in ATS optimization, instant PDF export, and pre-formatted sections.
              </p>

              <div className="mt-6 space-y-2.5 text-xs text-slate-200">
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>100% Free &amp; ATS Scanner Compliant</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>Multiple Professional Templates for Tech, Corporate &amp; Govt</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>Instant One-Click High Resolution PDF Export</span>
                </div>
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link to="/resume-builder" className="btn-primary text-xs py-3 px-6 bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-lg">
                  Create My Resume Free &rarr;
                </Link>
                <Link to="/resume-builder/templates" className="btn-secondary text-xs py-3 px-5 border-white/20 bg-white/10 text-white hover:bg-white/20">
                  View Templates
                </Link>
              </div>
            </div>

            {/* Template Card Showcase Preview */}
            <div className="relative flex justify-center">
              <div className="card w-full max-w-sm p-6 bg-white/10 backdrop-blur-md border-white/15 text-white shadow-2xl rounded-2xl transform rotate-1 hover:rotate-0 transition duration-300">
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
                    <p className="text-slate-400 mt-0.5">Software Engineer at TechCorp (2022–Present)</p>
                  </div>
                  <div>
                    <span className="font-semibold text-white">Top Skills</span>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {["React", "Node.js", "TypeScript", "SQL", "AWS"].map(s => (
                        <span key={s} className="rounded bg-white/10 px-1.5 py-0.5 text-[10px]">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-white/10 text-center">
                  <span className="text-[11px] text-slate-300 font-medium">Ready to download in PDF</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Closing Soon & Top Orgs ────────────────────────────────────────── */}
      <section className="container-page pb-16">
        <h2 className="flex items-center gap-2 text-2xl font-bold text-slate-900 dark:text-white">
          <Clock className="h-6 w-6 text-brand-600" /> Closing Soon Notifications
        </h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {(homeData?.closing_soon ?? []).map(job => (
            <Link key={job.id} to={`/jobs/${job.id}`} className="card block p-4 hover:scale-[1.01] transition">
              <p className="line-clamp-2 text-sm font-semibold text-slate-900 dark:text-white">{job.title}</p>
              <p className="mt-1.5 truncate text-xs text-slate-500 dark:text-slate-400">{job.organization}</p>
              <p className="mt-3 text-xs font-medium text-red-600 dark:text-red-400">
                {t("home.lastDate")}: {formatDate(job.last_date)}
              </p>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}

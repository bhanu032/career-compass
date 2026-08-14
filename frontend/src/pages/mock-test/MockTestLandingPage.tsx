/**
 * Mock Test Landing Page — exam category dashboard
 * Shows all exam groups with paper counts and quick-start CTA
 */
import { BookOpen, ChevronRight, Clock, Target, TrendingUp, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { useTheme } from "@/hooks/useTheme";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { classNames } from "@/utils/format";
import { EXAM_GROUPS } from "@/data/mockTests";

const STATS = [
  { icon: BookOpen, label: "Mock Papers", value: "100+", color: "text-violet-600" },
  { icon: Users,    label: "Students Practiced", value: "2.4L+", color: "text-blue-600" },
  { icon: Target,   label: "Questions", value: "10,000+", color: "text-emerald-600" },
  { icon: TrendingUp, label: "Avg Score Improvement", value: "28%", color: "text-orange-600" },
];

export function MockTestLandingPage(): JSX.Element {
  const { theme } = useTheme();
  const isDark     = theme === "dark";
  const isTricolor = theme === "tricolor";
  useDocumentTitle("Mock Tests — DeshKiSeva");

  const heroBg = isDark
    ? "bg-gradient-to-br from-[#0a0b15] via-[#0d0e1a] to-[#111827]"
    : isTricolor
    ? "bg-gradient-to-br from-orange-50 via-white to-green-50"
    : "bg-gradient-to-br from-violet-900 via-purple-800 to-indigo-900";

  return (
    <div>
      {/* Hero */}
      <div className={classNames("relative overflow-hidden py-16 sm:py-20", heroBg)}>
        <div className="container-page relative z-10 text-center">
          <span className={classNames(
            "mb-4 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold",
            isDark ? "bg-violet-900/60 text-violet-300 border border-violet-700/40"
              : isTricolor ? "bg-orange-100 text-orange-700 border border-orange-200"
              : "bg-white/10 text-white/90 border border-white/20"
          )}>
            <Target className="h-3.5 w-3.5" /> Free Mock Tests for Govt Exams
          </span>
          <h1 className={classNames(
            "mt-3 text-4xl font-bold sm:text-5xl",
            isDark ? "text-white" : isTricolor ? "text-slate-900" : "text-white"
          )}>
            Practice &amp; <span className={classNames(
              "bg-clip-text text-transparent",
              isDark ? "bg-gradient-to-r from-violet-400 to-cyan-400"
                : isTricolor ? "bg-gradient-to-r from-orange-500 to-green-600"
                : "bg-gradient-to-r from-yellow-300 to-pink-300"
            )}>Crack</span> Your Exam
          </h1>
          <p className={classNames(
            "mx-auto mt-4 max-w-2xl text-sm sm:text-base",
            isDark ? "text-slate-400" : isTricolor ? "text-slate-600" : "text-white/75"
          )}>
            Attempt full-length mock tests based on the latest exam patterns. Get detailed analysis,
            section-wise scores, and improve with every attempt.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link to="/mock-tests/ssc" className="btn-primary px-6 py-2.5 text-sm">
              Start SSC CGL Mock <ChevronRight className="h-4 w-4" />
            </Link>
            <a href="#exams" className={classNames(
              "btn-secondary px-6 py-2.5 text-sm",
              !isDark && !isTricolor && "bg-white/10 border-white/20 text-white hover:bg-white/20"
            )}>
              Browse All Exams
            </a>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="border-b border-slate-200 dark:border-slate-800">
        <div className="container-page grid grid-cols-2 gap-0 sm:grid-cols-4">
          {STATS.map((s) => (
            <div key={s.label} className="flex flex-col items-center gap-1 border-r border-slate-200 py-5 last:border-0 dark:border-slate-800">
              <s.icon className={classNames("h-5 w-5", s.color)} />
              <span className="text-2xl font-bold text-slate-900 dark:text-white">{s.value}</span>
              <span className="text-xs text-slate-500 dark:text-slate-400">{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Exam Groups */}
      <div id="exams" className="container-page py-12">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Choose Your Exam</h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Select an exam category to browse available mock tests
          </p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {EXAM_GROUPS.map((group) => (
            <Link
              key={group.id}
              to={`/mock-tests/${group.id}`}
              className="card group flex flex-col gap-4 p-5 hover:scale-[1.02] transition-transform"
            >
              {/* Icon + badge */}
              <div className="flex items-start justify-between">
                <div className={classNames(
                  "flex h-12 w-12 items-center justify-center rounded-2xl text-2xl shadow-sm",
                  group.color.replace("bg-", "bg-") + "/10"
                )}>
                  {group.icon}
                </div>
                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                  {group.totalPapers} papers
                </span>
              </div>

              {/* Name + desc */}
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
                  {group.shortName}
                </h3>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                  {group.description}
                </p>
              </div>

              {/* Exams list preview */}
              <div className="flex flex-wrap gap-1.5">
                {group.exams.slice(0, 3).map((exam) => (
                  <span
                    key={exam.id}
                    className="rounded-md border border-slate-200 px-2 py-0.5 text-[11px] font-medium text-slate-600 dark:border-slate-700 dark:text-slate-300"
                  >
                    {exam.name}
                  </span>
                ))}
                {group.exams.length > 3 && (
                  <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-500 dark:bg-slate-800">
                    +{group.exams.length - 3} more
                  </span>
                )}
              </div>

              <div className="flex items-center gap-1 text-xs font-semibold text-violet-600 dark:text-violet-400 mt-auto">
                View Tests <ChevronRight className="h-3.5 w-3.5" />
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* How it works */}
      <div className="bg-slate-50 dark:bg-slate-900/40 py-12">
        <div className="container-page">
          <h2 className="mb-8 text-center text-2xl font-bold text-slate-900 dark:text-white">How It Works</h2>
          <div className="grid gap-6 sm:grid-cols-3">
            {[
              { step: "01", title: "Pick a Mock Test", desc: "Choose from 100+ papers across SSC, Banking, Railways, UPSC and State PSC.", icon: BookOpen },
              { step: "02", title: "Attempt the Test", desc: "60-minute timer, section-wise navigation, mark for review — just like the real exam.", icon: Clock },
              { step: "03", title: "Analyse Your Score", desc: "Instant results with section-wise breakdown, accuracy %, and question-level explanations.", icon: TrendingUp },
            ].map((item) => (
              <div key={item.step} className="card flex gap-4 p-5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-violet-700 font-bold text-sm dark:bg-violet-900/40 dark:text-violet-300">
                  {item.step}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white">{item.title}</h3>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Award,
  BookOpen,
  Briefcase,
  Building2,
  CheckCircle2,
  ChevronRight,
  Code2,
  Cpu,
  Download,
  ExternalLink,
  FileCheck,
  FileText,
  FolderGit2,
  GraduationCap,
  Globe,
  Landmark,
  Layers,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  Rocket,
  ShieldCheck,
  Sparkles,
  Star,
  Terminal,
  Trophy,
  User,
  Users,
  Zap,
} from "lucide-react";
import { Link } from "react-router-dom";

import { HeroBanner } from "@/components/HeroBanner";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { useSarkariJobs } from "@/hooks/useSarkariJobs";

// ─── Animation Variants ───────────────────────────────────────────────────────
const fadeUpVariants = {
  hidden: { opacity: 0, y: 22 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.45, ease: [0.22, 1, 0.36, 1] as const },
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

// ─── Main Portfolio HomePage Component ────────────────────────────────────────
export function HomePage(): JSX.Element {
  useDocumentTitle(
    "Bhanu Pratap Singh — Software Development Engineer | MERN Stack Developer | Portfolio"
  );

  const { data: sarkariData } = useSarkariJobs();
  const [activeSkillCategory, setActiveSkillCategory] = useState<string>("mern");

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-[#020308] dark:text-slate-100">

      {/* ── HERO BANNER: Portfolio Header ──────────────────────────────────── */}
      <HeroBanner variant="jobs" py="py-16 sm:py-24">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-xs font-semibold backdrop-blur-md border border-white/20 shadow-inner"
        >
          <Sparkles className="h-3.5 w-3.5 text-yellow-300 animate-pulse" />
          <span>SDE &amp; MERN Stack Developer Portfolio</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] as const }}
          className="mt-4 max-w-4xl text-3xl font-extrabold leading-tight sm:text-5xl lg:text-6xl drop-shadow-xl"
        >
          Hi, I&apos;m{" "}
          <span className="bg-gradient-to-r from-yellow-300 via-pink-300 to-purple-300 bg-clip-text text-transparent">
            BHANU PRATAP SINGH
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.45 }}
          className="mt-3 max-w-3xl text-white/90 text-sm sm:text-lg font-medium leading-relaxed"
        >
          Software Development Engineer (MERN Stack) with 1+ years of experience building scalable, AI-powered HRTech platforms across React.js, Node.js, Express.js, and MongoDB.
        </motion.p>

        {/* Contact Links Bar */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-6 flex flex-wrap justify-center items-center gap-3 text-xs sm:text-sm font-semibold text-white/90"
        >
          <a
            href="tel:+916376548862"
            className="inline-flex items-center gap-1.5 rounded-xl bg-white/10 px-3.5 py-1.5 hover:bg-white/20 transition border border-white/15"
          >
            <Phone className="h-3.5 w-3.5 text-emerald-300" />
            +91 6376548862
          </a>
          <a
            href="mailto:rankush248@gmail.com"
            className="inline-flex items-center gap-1.5 rounded-xl bg-white/10 px-3.5 py-1.5 hover:bg-white/20 transition border border-white/15"
          >
            <Mail className="h-3.5 w-3.5 text-yellow-300" />
            rankush248@gmail.com
          </a>
          <a
            href="https://www.linkedin.com/in/bhanu032"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600/40 px-3.5 py-1.5 hover:bg-blue-600/60 transition border border-blue-300/30 text-white"
          >
            <Linkedin className="h-3.5 w-3.5 text-blue-300" />
            linkedin.com/in/bhanu032
          </a>
        </motion.div>

        {/* Project Section Anchor Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8 flex flex-wrap justify-center gap-3"
        >
          {[
            { href: "#projects-section", icon: Rocket, label: "Featured Projects", cls: "bg-white/20 border-white/30 hover:bg-white/30 text-white" },
            { href: "#experience-section", icon: Briefcase, label: "Work Experience", cls: "bg-purple-500/30 border-purple-300/30 hover:bg-purple-500/40 text-white" },
            { href: "#skills-section", icon: Cpu, label: "Technical Skills", cls: "bg-emerald-500/30 border-emerald-300/30 hover:bg-emerald-500/40 text-white" },
            { href: "#live-apps-section", icon: Globe, label: "Live Applications Hub", cls: "bg-amber-500/30 border-amber-300/30 hover:bg-amber-500/40 text-white" },
          ].map((item) => (
            <motion.a
              key={item.href}
              href={item.href}
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.97 }}
              className={`inline-flex items-center gap-2 rounded-2xl border px-5 py-2.5 text-xs sm:text-sm font-bold backdrop-blur-md shadow-lg transition ${item.cls}`}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </motion.a>
          ))}
        </motion.div>
      </HeroBanner>

      {/* ── PROFESSIONAL SUMMARY BANNER ───────────────────────────────────── */}
      <div className="border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-[#0a0b15] py-8">
        <div className="container-page">
          <motion.div
            variants={fadeUpVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={0}
            className="card p-6 bg-gradient-to-r from-violet-900/10 via-purple-900/5 to-indigo-900/10 border-violet-200 dark:border-violet-800/40"
          >
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-violet-600 text-white shadow-lg">
                <User className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  Professional Summary
                  <span className="rounded-full bg-violet-100 text-violet-800 dark:bg-violet-900/60 dark:text-violet-200 text-xs font-semibold px-2.5 py-0.5">
                    Full-Stack MERN SDE
                  </span>
                </h3>
                <p className="mt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  Software Development Engineer (MERN Stack) with 1+ years of experience building scalable, AI-powered HRTech platforms across React.js, Node.js, Express.js, and MongoDB. Delivers end-to-end features spanning REST APIs, WebSocket-based real-time systems, and production-grade React/TypeScript interfaces. Strong background in state management (Redux Toolkit, React Query), design systems (Tailwind CSS, Radix UI), and CI/CD deployment (Docker, Nginx, Vercel, GitHub Actions).
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ── SECTION 1: FEATURED PROJECTS PORTFOLIO ──────────────────────── */}
      <section id="projects-section" className="container-page py-16 scroll-mt-6">
        <motion.div
          variants={fadeUpVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          custom={0}
          className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between"
        >
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-md bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300 font-bold px-2.5 py-1 text-xs">
                PORTFOLIO PROJECTS
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                Featured Projects &amp; Live Demos
              </h2>
            </div>
            <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">
              Interactive live platforms designed, engineered, and deployed by Bhanu Pratap Singh.
            </p>
          </div>
        </motion.div>

        {/* Projects Grid */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="mt-8 grid gap-8 lg:grid-cols-2"
        >

          {/* PROJECT 1: Career Compass / DeshKiSeva Job Portal — National Portal Layout + Saffron Beacon Animation */}
          <motion.div variants={cardVariant} className="card overflow-hidden group flex flex-col justify-between border-amber-400/50 dark:border-amber-500/40 bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-emerald-600/10 shadow-lg animate-saffron-beacon hover:shadow-orange-500/20 transition-all">
            <div className="p-6">
              {/* National Ribbon Header */}
              <div className="flex items-center justify-between gap-2 border-b border-amber-200/60 dark:border-amber-800/40 pb-3">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 px-3.5 py-1 text-xs font-bold border border-amber-300/40">
                  <Landmark className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" /> Government Career Hub
                </span>
                <span className="text-xs text-amber-600 dark:text-amber-400 font-bold flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-amber-500 animate-ping"></span> 2026 Live
                </span>
              </div>
              <h3 className="mt-4 text-xl font-extrabold text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                Career Compass — Government, Sarkari &amp; Private Jobs Portal
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Full-featured career hub integrating live government job notifications, RSS-scraped feeds from <b>SarkariResult.com</b> &amp; <b>SarkariExam.com</b>, progressive private job streaming (LinkedIn/Indeed), Admit Cards, and Selection Results.
              </p>

              {/* TEMPLATE GUI PREVIEW 1: Live Ticker & Saffron Pulse Accent */}
              <div className="mt-4 rounded-xl border border-amber-300/40 bg-amber-950/20 p-3.5 space-y-2.5 relative overflow-hidden">
                <div className="flex items-center justify-between text-[11px] font-bold text-amber-400">
                  <span className="flex items-center gap-1.5">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                    </span>
                    Live Sarkari RSS Stream: Active ({sarkariData?.counts.total ?? "40+"} Jobs)
                  </span>
                  <span className="text-amber-300/80">SarkariResult.com &amp; SarkariExam.com</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="rounded-lg bg-amber-500/10 border border-amber-400/30 p-2 font-medium text-amber-200">
                    🏛️ SBI Clerk 2024 (1,538 Posts)
                  </div>
                  <div className="rounded-lg bg-orange-500/10 border border-orange-400/30 p-2 font-medium text-orange-200">
                    ⚡ UP Police Constable Result
                  </div>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-1.5">
                {["React.js", "TypeScript", "Vite", "Tailwind CSS", "Sarkari RSS Scraper", "TanStack React Query", "Framer Motion"].map((tag) => (
                  <span key={tag} className="rounded-md bg-amber-100/60 dark:bg-amber-950/50 px-2.5 py-1 text-[11px] font-semibold text-amber-900 dark:text-amber-200 border border-amber-200/50 dark:border-amber-800/40">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-6 pt-0 border-t border-amber-200/50 dark:border-amber-800/40 mt-4 flex flex-wrap items-center justify-between gap-3 bg-amber-500/5 dark:bg-amber-950/20">
              <span className="text-xs font-bold text-amber-700 dark:text-amber-400 flex items-center gap-1">
                <CheckCircle2 className="h-3.5 w-3.5" /> Includes {sarkariData?.counts.total ?? "40+"} Live Sarkari Jobs
              </span>
              <div className="flex gap-2">
                <Link to="/jobs?tab=sarkari" className="btn-secondary text-xs py-2 px-3 border-amber-300 dark:border-amber-700">
                  Sarkari Feed
                </Link>
                <Link to="/jobs" className="btn-primary text-xs py-2 px-4 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white shadow-md">
                  Launch Job Portal <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </motion.div>

          {/* PROJECT 2: ATS Resume Builder — IDE Studio + Laser Beam Scanline Animation */}
          <motion.div variants={cardVariant} className="card overflow-hidden group flex flex-col justify-between border-emerald-300 dark:border-emerald-500/40 bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-cyan-500/10 shadow-lg hover:shadow-emerald-500/20 transition-all">
            <div className="p-6">
              {/* IDE Header Dots */}
              <div className="flex items-center justify-between gap-2 border-b border-emerald-200/60 dark:border-emerald-800/40 pb-3">
                <div className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-red-500/80"></span>
                  <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/80"></span>
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/80"></span>
                  <span className="ml-2 text-xs font-mono text-emerald-400 font-bold">resume_v1.pdf</span>
                </div>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 px-3 py-0.5 text-xs font-bold border border-emerald-300/40">
                  <FileText className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" /> ATS Resume Studio
                </span>
              </div>
              <h3 className="mt-4 text-xl font-extrabold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                ATS Resume Builder &amp; Scanner Engine
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                ATS-friendly resume builder featuring multi-template rendering, live keyword compliance scoring, print-ready high-resolution PDF export using <code>jsPDF</code> and <code>react-to-print</code>.
              </p>

              {/* TEMPLATE GUI PREVIEW 2: Laser Scanline Beam Animation */}
              <div className="mt-4 rounded-xl border border-emerald-300/40 bg-emerald-950/20 p-3.5 space-y-2.5 relative overflow-hidden">
                {/* Moving Scanline Overlay */}
                <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-scanline pointer-events-none"></div>

                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                    <Sparkles className="h-3.5 w-3.5 text-yellow-300" /> ATS Match Score: 98/100 (Optimal)
                  </span>
                  <span className="rounded-full bg-emerald-500/20 text-emerald-300 px-2 py-0.5 text-[10px] font-bold">PDF Export Ready</span>
                </div>
                <div className="w-full bg-emerald-950/80 rounded-full h-2 overflow-hidden border border-emerald-500/30">
                  <div className="bg-gradient-to-r from-emerald-500 to-teal-400 h-2 rounded-full w-[98%]"></div>
                </div>
                <div className="flex items-center gap-1 text-[10px] text-emerald-300 font-medium">
                  <span className="rounded bg-emerald-900/60 px-1.5 py-0.5">Classic</span>
                  <span className="rounded bg-emerald-600 text-white font-bold px-1.5 py-0.5">Modern</span>
                  <span className="rounded bg-emerald-900/60 px-1.5 py-0.5">ATS Pro</span>
                  <span className="rounded bg-emerald-900/60 px-1.5 py-0.5">Sidebar</span>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-1.5">
                {["React.js", "TypeScript", "jsPDF", "react-to-print", "ATS Scanner", "Tailwind CSS", "Redux Toolkit"].map((tag) => (
                  <span key={tag} className="rounded-md bg-emerald-100/60 dark:bg-emerald-950/50 px-2.5 py-1 text-[11px] font-semibold text-emerald-900 dark:text-emerald-200 border border-emerald-200/50 dark:border-emerald-800/40">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-6 pt-0 border-t border-emerald-200/50 dark:border-emerald-800/40 mt-4 flex flex-wrap items-center justify-between gap-3 bg-emerald-500/5 dark:bg-emerald-950/20">
              <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="h-3.5 w-3.5" /> 98% ATS Pass Rate Templates
              </span>
              <div className="flex gap-2">
                <Link to="/resume-builder/templates" className="btn-secondary text-xs py-2 px-3 border-emerald-300 dark:border-emerald-700">
                  Templates
                </Link>
                <Link to="/resume-builder" className="btn-primary text-xs py-2 px-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-md">
                  Build Resume Free <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </motion.div>

          {/* PROJECT 3: Exam Mock Test Hub — Exam Tablet + Radar Sweep Animation */}
          <motion.div variants={cardVariant} className="card overflow-hidden group flex flex-col justify-between border-purple-300 dark:border-purple-500/40 bg-gradient-to-br from-violet-600/15 via-purple-600/10 to-indigo-600/15 shadow-lg hover:shadow-purple-500/20 transition-all">
            <div className="p-6">
              {/* Exam Tablet Header */}
              <div className="flex items-center justify-between gap-2 border-b border-purple-200/60 dark:border-purple-800/40 pb-3">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-purple-100 text-purple-800 dark:bg-purple-950/80 dark:text-purple-300 px-3.5 py-1 text-xs font-bold border border-purple-300/40">
                  <BookOpen className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400" /> Exam Prep Engine
                </span>
                <span className="text-xs font-bold text-emerald-400 bg-emerald-950/80 px-2.5 py-0.5 rounded-full border border-emerald-500/40">
                  ⏱️ 00:58:24
                </span>
              </div>
              <h3 className="mt-4 text-xl font-extrabold text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                Exam Mock Test Engine — 100+ Free Papers
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Official-pattern full-length mock tests for SSC CGL/CHSL/MTS, CTET Paper I &amp; II, IBPS PO, RRB NTPC, UPSC, and Defence with section timers, question palette navigation, and instant score breakdowns.
              </p>

              {/* TEMPLATE GUI PREVIEW 3: Rotating Radar Sweep Overlay Animation */}
              <div className="mt-4 rounded-xl border border-purple-300/40 bg-purple-950/20 p-3.5 space-y-2.5 relative overflow-hidden">
                <div className="absolute -right-10 -bottom-10 h-32 w-32 rounded-full border border-purple-400/20 pointer-events-none flex items-center justify-center">
                  <div className="h-full w-full rounded-full border border-dashed border-purple-400/30 animate-radar-sweep"></div>
                </div>

                <div className="flex items-center justify-between text-[11px] font-bold text-purple-300">
                  <span>Question Palette Grid</span>
                  <span className="text-emerald-400 font-bold">Answered: 18 / 25</span>
                </div>
                <div className="grid grid-cols-8 gap-1">
                  {[1,2,3,4,5,6,7,8].map((q) => (
                    <div
                      key={q}
                      className={`h-6 rounded flex items-center justify-center text-[10px] font-bold text-white ${
                        q <= 5 ? "bg-emerald-500" : q === 6 ? "bg-yellow-500" : "bg-purple-900/60"
                      }`}
                    >
                      {q}
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-1.5">
                {["React.js", "TypeScript", "Full-length Engine", "Live Timers", "Analytics", "Palette Nav"].map((tag) => (
                  <span key={tag} className="rounded-md bg-purple-100/60 dark:bg-purple-950/50 px-2.5 py-1 text-[11px] font-semibold text-purple-900 dark:text-purple-200 border border-purple-200/50 dark:border-purple-800/40">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-6 pt-0 border-t border-purple-200/50 dark:border-purple-800/40 mt-4 flex flex-wrap items-center justify-between gap-3 bg-purple-500/5 dark:bg-purple-950/20">
              <span className="text-xs font-bold text-purple-700 dark:text-purple-400 flex items-center gap-1">
                <CheckCircle2 className="h-3.5 w-3.5" /> 100+ Free Official Paper Sets
              </span>
              <Link to="/mock-tests" className="btn-primary text-xs py-2 px-4 bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 text-white shadow-md">
                Attempt Mock Tests <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </motion.div>

          {/* PROJECT 4: InterviewGhost.ai — AI Proctoring Console + 13-Bar Equalizer Animation */}
          <motion.div variants={cardVariant} className="card overflow-hidden group flex flex-col justify-between border-blue-300 dark:border-blue-500/40 bg-gradient-to-br from-blue-600/15 via-sky-600/10 to-cyan-600/15 shadow-lg hover:shadow-blue-500/20 transition-all">
            <div className="p-6">
              {/* AI Chip Header */}
              <div className="flex items-center justify-between gap-2 border-b border-blue-200/60 dark:border-blue-800/40 pb-3">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-950/80 dark:text-blue-300 px-3.5 py-1 text-xs font-bold border border-blue-300/40">
                  <Cpu className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" /> AI HRTech Platform
                </span>
                <span className="text-xs font-mono text-cyan-400 font-bold bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-500/30">
                  🤖 WebSockets Active
                </span>
              </div>
              <h3 className="mt-4 text-xl font-extrabold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                InterviewGhost.ai — AI-Powered Hiring Platform
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                AI hiring platform with automated interview simulation, WebSockets real-time transcription, proctoring with <code>face-api.js</code>, screen-sharing validation, and multi-role HR candidate dashboards.
              </p>

              {/* TEMPLATE GUI PREVIEW 4: Dynamic 13-Bar Audio Equalizer Animation */}
              <div className="mt-4 rounded-xl border border-blue-300/40 bg-blue-950/20 p-3.5 space-y-2.5">
                <div className="flex items-center justify-between text-[11px] font-bold text-blue-300">
                  <span className="flex items-center gap-1">🤖 face-api.js Proctoring: Active</span>
                  <span className="text-cyan-300">WebSockets Connected</span>
                </div>
                <div className="flex items-center gap-1 h-6 justify-center">
                  <div className="w-1 bg-cyan-400 rounded-full animate-sound-bar-1"></div>
                  <div className="w-1 bg-cyan-400 rounded-full animate-sound-bar-2"></div>
                  <div className="w-1 bg-cyan-400 rounded-full animate-sound-bar-3"></div>
                  <div className="w-1 bg-cyan-400 rounded-full animate-sound-bar-4"></div>
                  <div className="w-1 bg-cyan-400 rounded-full animate-sound-bar-1"></div>
                  <div className="w-1 bg-cyan-400 rounded-full animate-sound-bar-2"></div>
                  <div className="w-1 bg-cyan-400 rounded-full animate-sound-bar-3"></div>
                  <div className="w-1 bg-cyan-400 rounded-full animate-sound-bar-4"></div>
                  <div className="w-1 bg-cyan-400 rounded-full animate-sound-bar-1"></div>
                  <div className="w-1 bg-cyan-400 rounded-full animate-sound-bar-2"></div>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-1.5">
                {["React.js", "Next.js", "TypeScript", "Redux Toolkit", "WebSockets", "face-api.js", "Speech Recognition API"].map((tag) => (
                  <span key={tag} className="rounded-md bg-blue-100/60 dark:bg-blue-950/50 px-2.5 py-1 text-[11px] font-semibold text-blue-900 dark:text-blue-200 border border-blue-200/50 dark:border-blue-800/40">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-6 pt-0 border-t border-blue-200/50 dark:border-blue-800/40 mt-4 flex items-center justify-between bg-blue-500/5 dark:bg-blue-950/20">
              <span className="text-xs font-bold text-blue-700 dark:text-blue-400">
                DarpanAI Technologies (Full-Time SDE)
              </span>
              <span className="text-xs text-blue-500 font-bold">Production Platform</span>
            </div>
          </motion.div>

          {/* PROJECT 5: Advertising Space Management System — Metallic Shimmer Animation */}
          <motion.div variants={cardVariant} className="card overflow-hidden group flex flex-col justify-between border-fuchsia-300 dark:border-fuchsia-500/40 bg-gradient-to-br from-fuchsia-600/15 via-pink-600/10 to-rose-600/15 shadow-lg hover:shadow-fuchsia-500/20 transition-all">
            <div className="p-6">
              {/* Stripe Header */}
              <div className="flex items-center justify-between gap-2 border-b border-fuchsia-200/60 dark:border-fuchsia-800/40 pb-3">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-fuchsia-100 text-fuchsia-800 dark:bg-fuchsia-950/80 dark:text-fuchsia-300 px-3.5 py-1 text-xs font-bold border border-fuchsia-300/40">
                  <Layers className="h-3.5 w-3.5 text-fuchsia-600 dark:text-fuchsia-400" /> MERN Ad Space Platform
                </span>
                <span className="text-xs text-emerald-400 font-bold bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/40">
                  💳 Stripe Verified
                </span>
              </div>
              <h3 className="mt-4 text-xl font-extrabold text-slate-900 dark:text-white group-hover:text-fuchsia-600 dark:group-hover:text-fuchsia-400 transition-colors">
                Advertising Space Management System
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                MERN platform connecting advertisers with ad-space owners. Features Stripe payment gateway integration and Google Maps API for location-based discovery.
              </p>

              {/* TEMPLATE GUI PREVIEW 5: Metallic Shimmer Beam Animation */}
              <div className="mt-4 rounded-xl border border-fuchsia-300/40 bg-fuchsia-950/20 p-3.5 space-y-2.5 relative overflow-hidden">
                <div className="flex items-center justify-between text-[11px] font-bold text-fuchsia-300">
                  <span>📍 Billboard Location: Connaught Place, Delhi</span>
                  <span className="text-emerald-400 font-bold">Google Maps API</span>
                </div>
                <div className="rounded-lg bg-fuchsia-900/40 p-2 flex items-center justify-between text-xs font-semibold text-fuchsia-200 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-metallic-shimmer pointer-events-none"></div>
                  <span>Ad Space Slot #A4</span>
                  <span className="rounded bg-fuchsia-600 text-white px-2 py-0.5 font-bold shadow-md">₹45,000 / Mo</span>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-1.5">
                {["MongoDB", "Express.js", "React.js", "Node.js", "Stripe API", "Google Maps API"].map((tag) => (
                  <span key={tag} className="rounded-md bg-fuchsia-100/60 dark:bg-fuchsia-950/50 px-2.5 py-1 text-[11px] font-semibold text-fuchsia-900 dark:text-fuchsia-200 border border-fuchsia-200/50 dark:border-fuchsia-800/40">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-6 pt-0 border-t border-fuchsia-200/50 dark:border-fuchsia-800/40 mt-4 flex items-center justify-between bg-fuchsia-500/5 dark:bg-fuchsia-950/20">
              <span className="text-xs font-semibold text-fuchsia-600 dark:text-fuchsia-400">Stripe Payments &amp; Map Discovery</span>
              <span className="text-xs font-bold text-fuchsia-600">Full Stack MERN</span>
            </div>
          </motion.div>

          {/* PROJECT 6: IntellectInn — Social Network + Water Ripple Animation */}
          <motion.div variants={cardVariant} className="card overflow-hidden group flex flex-col justify-between border-sky-300 dark:border-sky-500/40 bg-gradient-to-br from-sky-600/15 via-teal-600/10 to-blue-600/15 shadow-lg hover:shadow-sky-500/20 transition-all">
            <div className="p-6">
              {/* Social Network Header */}
              <div className="flex items-center justify-between gap-2 border-b border-sky-200/60 dark:border-sky-800/40 pb-3">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-sky-100 text-sky-800 dark:bg-sky-950/80 dark:text-sky-300 px-3.5 py-1 text-xs font-bold border border-sky-300/40">
                  <Users className="h-3.5 w-3.5 text-sky-600 dark:text-sky-400" /> Student Network
                </span>
                <span className="text-xs text-sky-400 font-bold bg-sky-950/80 px-2 py-0.5 rounded border border-sky-500/40">
                  🎓 JKLU Academic Network
                </span>
              </div>
              <h3 className="mt-4 text-xl font-extrabold text-slate-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                IntellectInn — Student Networking Platform
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Networking platform for students to showcase academic &amp; project achievements, connect with peers, and manage professional profiles via REST APIs.
              </p>

              {/* TEMPLATE GUI PREVIEW 6: Water Ripple Pulsating Skill Endorsements */}
              <div className="mt-4 rounded-xl border border-sky-300/40 bg-sky-950/20 p-3.5 space-y-2.5 relative overflow-hidden">
                <div className="flex items-center justify-between text-[11px] font-bold text-sky-300">
                  <span>🎓 Student Achievement Showcase</span>
                  <span className="text-sky-300">REST API Verified</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-sky-200">
                  <span className="rounded-full bg-sky-600 text-white px-2 py-0.5 font-bold animate-water-ripple">+24 Skill Endorsements</span>
                  <span className="rounded bg-sky-900/60 px-1.5 py-0.5">Project Portfolio</span>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-1.5">
                {["React.js", "MongoDB", "Express.js", "REST APIs", "Node.js"].map((tag) => (
                  <span key={tag} className="rounded-md bg-sky-100/60 dark:bg-sky-950/50 px-2.5 py-1 text-[11px] font-semibold text-sky-900 dark:text-sky-200 border border-sky-200/50 dark:border-sky-800/40">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-6 pt-0 border-t border-sky-200/50 dark:border-sky-800/40 mt-4 flex items-center justify-between bg-sky-500/5 dark:bg-sky-950/20">
              <span className="text-xs font-semibold text-sky-600 dark:text-sky-400">Student Achievements &amp; Profiles</span>
              <span className="text-xs font-bold text-sky-600">React &amp; MongoDB</span>
            </div>
          </motion.div>

        </motion.div>
      </section>

      {/* ── SECTION 2: WORK EXPERIENCE ────────────────────────────────────── */}
      <section id="experience-section" className="bg-slate-100/70 dark:bg-slate-900/60 py-16 scroll-mt-6 border-y border-slate-200 dark:border-slate-800">
        <div className="container-page">
          <motion.div
            variants={fadeUpVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            custom={0}
          >
            <div className="flex items-center gap-2">
              <span className="rounded-md bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 font-bold px-2.5 py-1 text-xs">
                CAREER HISTORY
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                Professional Work Experience
              </h2>
            </div>
            <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">
              1+ years of engineering production software in full-time &amp; internship roles.
            </p>
          </motion.div>

          <div className="mt-8 space-y-6">

            {/* EXP 1: DarpanAI Technologies */}
            <motion.div
              variants={fadeUpVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={1}
              className="card p-6 bg-white dark:bg-[#0d0e1a] border-l-4 border-l-purple-600"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-4">
                <div>
                  <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
                    Frontend Developer (MERN Stack)
                  </h3>
                  <p className="text-sm font-semibold text-purple-600 dark:text-purple-400">
                    DarpanAI Technologies (InterviewGhost.ai)
                  </p>
                </div>
                <div className="text-left sm:text-right">
                  <span className="inline-block rounded-full bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 text-xs font-bold px-3 py-1">
                    Jan 2025 – Jul 2026
                  </span>
                  <p className="text-xs text-slate-500 mt-1">Remote | Converted to full-time May 2025</p>
                </div>
              </div>

              <ul className="mt-4 space-y-2.5 text-xs sm:text-sm text-slate-600 dark:text-slate-300 list-disc list-inside leading-relaxed">
                <li>Built and maintained <b>InterviewGhost.ai</b>, an AI-powered hiring platform, using React.js, TypeScript, Next.js, Node.js/Express REST APIs, Vite, and Tailwind CSS.</li>
                <li>Developed ATS-focused resume workflows: dashboard (create/edit/preview/upload/download/delete), ATS keyword analysis, cover-letter generation, and print-ready PDF export via <b>jsPDF</b>, <b>react-to-print</b>, and <b>html2canvas</b>.</li>
                <li>Implemented real-time AI interview experiences using WebSockets, speech recognition, live transcription, audio capture, screen sharing, and candidate proctoring using <b>face-api.js</b>.</li>
                <li>Built dynamic HRTech candidate, HR, and executive dashboards for screening, onboarding, job matching, and interview feedback.</li>
                <li>Managed global state with Redux Toolkit and React Query; built reusable UI design layer with Radix UI, shadcn-style components, and Lucide icons.</li>
                <li>Owned production delivery: Docker multi-stage builds, Nginx, Vercel SPA routing, and GitHub Actions CI/CD.</li>
              </ul>
            </motion.div>

            {/* EXP 2: SysMorph */}
            <motion.div
              variants={fadeUpVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={2}
              className="card p-6 bg-white dark:bg-[#0d0e1a] border-l-4 border-l-blue-600"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-4">
                <div>
                  <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
                    Front-End Developer Intern
                  </h3>
                  <p className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                    SysMorph (Subhashish Homes)
                  </p>
                </div>
                <div className="text-left sm:text-right">
                  <span className="inline-block rounded-full bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 text-xs font-bold px-3 py-1">
                    Jul 2024 – Dec 2024
                  </span>
                  <p className="text-xs text-slate-500 mt-1">On-site | Jaipur, India</p>
                </div>
              </div>

              <ul className="mt-4 space-y-2.5 text-xs sm:text-sm text-slate-600 dark:text-slate-300 list-disc list-inside leading-relaxed">
                <li>Developed responsive, user-friendly web pages using HTML, CSS, JavaScript, and React.js, improving page performance and cross-browser compatibility.</li>
                <li>Created reusable UI components and optimized layouts for responsiveness across mobile, tablet, and desktop devices.</li>
                <li>Managed Git workflows and project configurations for efficient team collaboration and deployment.</li>
              </ul>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ── SECTION 3: TECHNICAL SKILLS DEMONSTRATION ────────────────────── */}
      <section id="skills-section" className="container-page py-16 scroll-mt-6">
        <motion.div
          variants={fadeUpVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          custom={0}
        >
          <div className="flex items-center gap-2">
            <span className="rounded-md bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 font-bold px-2.5 py-1 text-xs">
              TECHNICAL STACK
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              Skills &amp; Technology Stack
            </h2>
          </div>
          <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">
            Comprehensive breakdown of Bhanu Pratap Singh&apos;s technical capabilities.
          </p>
        </motion.div>

        {/* Skill Category Tabs */}
        <div className="mt-8 flex flex-wrap gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
          {[
            { id: "mern", label: "MERN & Backend", icon: DatabaseIcon },
            { id: "frontend", label: "Frontend & Web", icon: Code2 },
            { id: "state", label: "State & Data", icon: Layers },
            { id: "ui", label: "UI / 3D & Media", icon: Cpu },
            { id: "docs", label: "Documents & Auth", icon: FileText },
            { id: "devops", label: "Testing & DevOps", icon: Terminal },
          ].map((tab) => (
            <motion.button
              key={tab.id}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setActiveSkillCategory(tab.id)}
              className={`rounded-xl px-4 py-2 text-xs font-bold transition flex items-center gap-1.5 ${
                activeSkillCategory === tab.id
                  ? "bg-emerald-600 text-white shadow-md"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300"
              }`}
            >
              {tab.label}
            </motion.button>
          ))}
        </div>

        {/* Skill Display Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSkillCategory}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
          >
            {getSkillsList(activeSkillCategory).map((skill) => (
              <div key={skill.name} className="card p-4 bg-white dark:bg-[#0c0e1e] flex items-center gap-3">
                <div className="h-9 w-9 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold text-sm shrink-0">
                  {skill.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm">{skill.name}</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{skill.detail}</p>
                </div>
              </div>
            ))}
          </motion.div>
        </AnimatePresence>
      </section>

      {/* ── SECTION 4: EDUCATION & ADDITIONAL INFO ──────────────────────── */}
      <section className="bg-slate-100/70 dark:bg-slate-900/60 py-16 border-y border-slate-200 dark:border-slate-800">
        <div className="container-page grid gap-8 md:grid-cols-2">

          {/* Education */}
          <motion.div
            variants={fadeUpVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={0}
            className="card p-6 bg-white dark:bg-[#0d0e1a]"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500 text-white font-bold shadow-md">
                <GraduationCap className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Education</h3>
                <p className="text-xs text-slate-500">Academic Background</p>
              </div>
            </div>
            <div className="border-l-2 border-amber-500 pl-4 py-1">
              <h4 className="font-extrabold text-slate-900 dark:text-white text-base">
                B.Tech in Computer Science &amp; Engineering
              </h4>
              <p className="text-sm font-semibold text-amber-600 dark:text-amber-400 mt-0.5">
                JK Lakshmipat University
              </p>
              <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
                <span>Duration: 2021 – 2025</span>
                <span className="rounded-full bg-amber-100 text-amber-800 font-bold px-2.5 py-0.5 dark:bg-amber-950/60 dark:text-amber-300">
                  CGPA: 7.0
                </span>
              </div>
            </div>
          </motion.div>

          {/* Additional Information */}
          <motion.div
            variants={fadeUpVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={1}
            className="card p-6 bg-white dark:bg-[#0d0e1a]"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-600 text-white font-bold shadow-md">
                <Award className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Additional Information</h3>
                <p className="text-xs text-slate-500">Languages &amp; Core Domain Expertise</p>
              </div>
            </div>
            <div className="space-y-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
              <div>
                <span className="font-bold text-slate-900 dark:text-white">Programming Languages:</span>
                <p className="text-slate-500 mt-0.5">JavaScript, TypeScript, Python, SQL</p>
              </div>
              <div>
                <span className="font-bold text-slate-900 dark:text-white">Domain Expertise:</span>
                <p className="text-slate-500 mt-0.5">ATS Optimization, Resume Builder Workflows, HRTech Platforms, Interview Automation, System Design</p>
              </div>
            </div>
          </motion.div>

        </div>
      </section>

      {/* ── SECTION 5: LIVE APPLICATIONS LAUNCH HUB ──────────────────────── */}
      <section id="live-apps-section" className="container-page py-16 scroll-mt-6">
        <motion.div
          variants={fadeUpVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          custom={0}
          className="text-center max-w-3xl mx-auto"
        >
          <span className="rounded-full bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300 font-bold px-3 py-1 text-xs">
            LIVE PROJECT PORTALS
          </span>
          <h2 className="mt-3 text-3xl font-extrabold text-slate-900 dark:text-white">
            Explore Live Application Hubs
          </h2>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Launch into the fully working modules built inside this application portal.
          </p>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
        >

          {/* Hub 1: Job Search — Theme: Saffron Portal */}
          <motion.div variants={cardVariant}>
            <Link to="/jobs" className="card p-6 block group hover:scale-[1.02] transition border-amber-300 dark:border-amber-500/40 bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-amber-600/10 shadow-lg hover:shadow-orange-500/20">
              <div className="flex items-center justify-between">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 text-white flex items-center justify-center font-bold shadow-md">
                  <Briefcase className="h-5 w-5" />
                </div>
                <ArrowRight className="h-4 w-4 text-amber-600 dark:text-amber-400 group-hover:translate-x-1 transition-transform" />
              </div>
              <h3 className="mt-4 font-extrabold text-slate-900 dark:text-white text-base group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">Job Search Portal</h3>
              <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">Saffron National Theme • Government &amp; Private Jobs Stream (LinkedIn &amp; Indeed).</p>
            </Link>
          </motion.div>

          {/* Hub 2: Sarkari Feed — Theme: Tricolor Saffron */}
          <motion.div variants={cardVariant}>
            <Link to="/jobs?tab=sarkari" className="card p-6 block group hover:scale-[1.02] transition border-orange-300 dark:border-orange-500/40 bg-gradient-to-br from-orange-500/10 via-amber-500/5 to-emerald-600/10 shadow-lg hover:shadow-orange-500/20">
              <div className="flex items-center justify-between">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-r from-orange-600 to-emerald-600 text-white flex items-center justify-center font-bold shadow-md">
                  <Landmark className="h-5 w-5" />
                </div>
                <ArrowRight className="h-4 w-4 text-orange-600 dark:text-orange-400 group-hover:translate-x-1 transition-transform" />
              </div>
              <h3 className="mt-4 font-extrabold text-slate-900 dark:text-white text-base group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">🏛️ Sarkari Jobs Live RSS</h3>
              <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">Tricolor Theme • Live feeds from SarkariResult.com &amp; SarkariExam.com.</p>
            </Link>
          </motion.div>

          {/* Hub 3: ATS Resume Builder — Theme: Cyber Neon Teal */}
          <motion.div variants={cardVariant}>
            <Link to="/resume-builder" className="card p-6 block group hover:scale-[1.02] transition border-emerald-300 dark:border-emerald-500/40 bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-cyan-500/10 shadow-lg hover:shadow-emerald-500/20">
              <div className="flex items-center justify-between">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white flex items-center justify-center font-bold shadow-md">
                  <FileText className="h-5 w-5" />
                </div>
                <ArrowRight className="h-4 w-4 text-emerald-600 dark:text-emerald-400 group-hover:translate-x-1 transition-transform" />
              </div>
              <h3 className="mt-4 font-extrabold text-slate-900 dark:text-white text-base group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">ATS Resume Builder</h3>
              <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">Cyber-Teal Theme • Resume templates, ATS score scanner &amp; instant PDF export.</p>
            </Link>
          </motion.div>

          {/* Hub 4: Mock Tests — Theme: Royal Electric Violet */}
          <motion.div variants={cardVariant}>
            <Link to="/mock-tests" className="card p-6 block group hover:scale-[1.02] transition border-purple-300 dark:border-purple-500/40 bg-gradient-to-br from-violet-600/15 via-purple-600/10 to-indigo-600/15 shadow-lg hover:shadow-purple-500/20">
              <div className="flex items-center justify-between">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-r from-purple-600 to-violet-600 text-white flex items-center justify-center font-bold shadow-md">
                  <BookOpen className="h-5 w-5" />
                </div>
                <ArrowRight className="h-4 w-4 text-purple-600 dark:text-purple-400 group-hover:translate-x-1 transition-transform" />
              </div>
              <h3 className="mt-4 font-extrabold text-slate-900 dark:text-white text-base group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">Exam Mock Test Hub</h3>
              <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">Royal-Violet Theme • 100+ free paper sets for CTET, SSC, Banking, Railway, UPSC.</p>
            </Link>
          </motion.div>

          {/* Hub 5: Admit Cards — Theme: Electric Cyan */}
          <motion.div variants={cardVariant}>
            <Link to="/admit-cards" className="card p-6 block group hover:scale-[1.02] transition border-cyan-300 dark:border-cyan-500/40 bg-gradient-to-br from-cyan-600/15 via-sky-600/10 to-blue-600/15 shadow-lg hover:shadow-cyan-500/20">
              <div className="flex items-center justify-between">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 text-white flex items-center justify-center font-bold shadow-md">
                  <FileCheck className="h-5 w-5" />
                </div>
                <ArrowRight className="h-4 w-4 text-cyan-600 dark:text-cyan-400 group-hover:translate-x-1 transition-transform" />
              </div>
              <h3 className="mt-4 font-extrabold text-slate-900 dark:text-white text-base group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">Admit Cards Portal</h3>
              <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">Electric Cyan Theme • Latest hall tickets &amp; official exam download links.</p>
            </Link>
          </motion.div>

          {/* Hub 6: Exam Results — Theme: Trophy Gold */}
          <motion.div variants={cardVariant}>
            <Link to="/results" className="card p-6 block group hover:scale-[1.02] transition border-yellow-300 dark:border-yellow-500/40 bg-gradient-to-br from-yellow-500/15 via-amber-500/10 to-orange-600/15 shadow-lg hover:shadow-yellow-500/20">
              <div className="flex items-center justify-between">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-r from-yellow-600 to-amber-600 text-white flex items-center justify-center font-bold shadow-md">
                  <Trophy className="h-5 w-5" />
                </div>
                <ArrowRight className="h-4 w-4 text-yellow-600 dark:text-yellow-400 group-hover:translate-x-1 transition-transform" />
              </div>
              <h3 className="mt-4 font-extrabold text-slate-900 dark:text-white text-base group-hover:text-yellow-600 dark:group-hover:text-yellow-400 transition-colors">Exam Results Portal</h3>
              <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">Trophy Gold Theme • Declared results, merit lists &amp; official selection lists.</p>
            </Link>
          </motion.div>

        </motion.div>
      </section>

    </div>
  );
}

// ─── Helper for Skills List ──────────────────────────────────────────────────
function DatabaseIcon(props: any) {
  return <Terminal {...props} />;
}

function getSkillsList(category: string): Array<{ name: string; detail: string }> {
  switch (category) {
    case "mern":
      return [
        { name: "MongoDB", detail: "Database modeling, aggregations & indexing" },
        { name: "Express.js", detail: "RESTful APIs, routing & middleware" },
        { name: "React.js", detail: "Component architecture, hooks & performance" },
        { name: "Node.js", detail: "Backend services & asynchronous I/O" },
        { name: "WebSockets", detail: "Real-time bidirectional event streaming" },
        { name: "REST APIs", detail: "Production grade API architecture" },
      ];
    case "frontend":
      return [
        { name: "React.js", detail: "SPA architecture & state design" },
        { name: "Next.js", detail: "SSR, SSG, routing & prerendering" },
        { name: "TypeScript", detail: "Strict static typing & interfaces" },
        { name: "JavaScript (ES6+)", detail: "Modern JS features & async await" },
        { name: "HTML5 & CSS3", detail: "Semantic layout & modern styling" },
        { name: "Vite", detail: "Lightning-fast build tooling & HMR" },
      ];
    case "state":
      return [
        { name: "Redux Toolkit", detail: "Global state slices & async thunks" },
        { name: "React Redux", detail: "Typed selectors & hooks binding" },
        { name: "TanStack React Query", detail: "Server state caching & background refetch" },
        { name: "Context API", detail: "Lightweight local state distribution" },
      ];
    case "ui":
      return [
        { name: "Tailwind CSS", detail: "Utility-first design & custom design systems" },
        { name: "Radix UI", detail: "Unstyled accessible UI primitives" },
        { name: "Framer Motion", detail: "GPU-accelerated smooth animations" },
        { name: "Lucide React", detail: "Modern SVG icon design system" },
        { name: "Three.js & R3F", detail: "3D graphics & React canvas scenes" },
        { name: "face-api.js", detail: "Webcam candidate proctoring & AI detection" },
      ];
    case "docs":
      return [
        { name: "jsPDF", detail: "Programmatic PDF document generation" },
        { name: "react-to-print", detail: "Print-ready DOM template export" },
        { name: "html2canvas", detail: "DOM to high-res canvas rendering" },
        { name: "OAuth & Auth", detail: "Role-based routes & cookie sessions" },
        { name: "Zod & Hook Form", detail: "Strict form validation & schema parsing" },
      ];
    case "devops":
      return [
        { name: "Docker", detail: "Multi-stage containerized production builds" },
        { name: "Nginx", detail: "Reverse proxy & SPA routing configuration" },
        { name: "Vercel", detail: "Automated deployment & SPA rewrites" },
        { name: "GitHub Actions", detail: "Automated CI/CD workflows" },
        { name: "Vitest", detail: "Unit & component testing framework" },
      ];
    default:
      return [];
  }
}

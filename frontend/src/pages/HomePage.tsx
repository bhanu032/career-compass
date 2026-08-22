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
  Languages,
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
  Smartphone,
  Bluetooth,
  Usb,
  Keyboard,
  Mic,
  Music,
  Waves,
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
          ReactJS Developer | MERN Stack Developer with 2+ years of experience in Reactive Programming (React JS) and TypeScript, building scalable, AI-powered HRTech platforms across React.js, Node.js, Express.js, and MongoDB.
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
          <a
            href="https://career-compass-topaz.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-xl bg-purple-600/40 px-3.5 py-1.5 hover:bg-purple-600/60 transition border border-purple-300/30 text-white"
          >
            <Globe className="h-3.5 w-3.5 text-purple-300" />
            career-compass-topaz.vercel.app
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
                    2+ Years Exp | ReactJS &amp; MERN Stack
                  </span>
                </h3>
                <p className="mt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  Software Development Engineer with 2+ years of experience in Reactive Programming (React JS) and UI &amp; Markup Language (TypeScript), building scalable, AI-powered HRTech platforms across React.js, Node.js, Express.js, and MongoDB, deployed on Linux (Ubuntu) servers with Docker and Nginx. Skilled across the full Software Development Life Cycle (SDLC) — from understanding design specifications and writing test cases/scenarios to implementing designs, developing high-quality programs, and responding to production issues. Delivers end-to-end features spanning REST APIs, WebSocket-based real-time systems, and production-grade React/TypeScript interfaces.
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
          className="mt-8 grid gap-8 md:grid-cols-2 lg:grid-cols-3"
        >

          {/* FLAGSHIP PROJECT: AuraVoice AI — 3D David Avatar & Voice Studio */}
          <motion.div variants={cardVariant} className="card overflow-hidden group flex flex-col justify-between border-cyan-300 dark:border-cyan-700/60 bg-gradient-to-br from-cyan-500/5 via-violet-500/5 to-pink-500/10 shadow-md hover:shadow-cyan-500/10 transition-all">
            <div className="p-6">
              <div className="flex items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1 rounded-full bg-cyan-100 text-cyan-800 dark:bg-cyan-950/80 dark:text-cyan-300 px-3 py-1 text-xs font-bold border border-cyan-300/40">
                  <Mic className="h-3.5 w-3.5 text-cyan-600 dark:text-cyan-400" /> 3D Avatar &amp; Voice Intelligence
                </span>
                <span className="text-xs text-cyan-600 dark:text-cyan-400 font-bold">v3.5 Live</span>
              </div>
              <h3 className="mt-3 text-xl font-extrabold text-slate-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                AuraVoice AI — 3D David Avatar &amp; 22 Indic Languages Studio
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Native Devanagari Hindi &amp; Indian English real-time conversational voice AI with 3D WebGL David Avatar (viseme lip-sync, head tracking), AI4Bharat 22 official Indian languages dataset, 15D acoustic voice cloner (F0, formants, MOS 4.88+), and Indian Classical Sargam synthesizer.
              </p>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {["3D WebGL Avatar (david.glb)", "AI4Bharat IndicVoices (22 Langs)", "15D Voice Cloner", "Indian Classical Sargam", "Real-Time Lip Sync", "Devanagari TTS & Normalizer", "Web Audio DSP"].map((tag) => (
                  <span key={tag} className="rounded-md bg-cyan-100/70 dark:bg-cyan-950/60 px-2.5 py-1 text-[11px] font-semibold text-cyan-900 dark:text-cyan-200 border border-cyan-200/50 dark:border-cyan-800/40">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-6 pt-0 border-t border-cyan-200/60 dark:border-cyan-800/40 mt-4 flex flex-wrap items-center justify-between gap-3 bg-cyan-500/5 dark:bg-cyan-950/20">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                <Sparkles className="h-3.5 w-3.5 text-cyan-500" /> Gemini 3.5 Intelligence
              </span>
              <div className="flex gap-2">
                <Link to="/avoice" className="btn-primary text-xs py-2 px-4 bg-gradient-to-r from-cyan-600 to-violet-600 hover:from-cyan-500 hover:to-violet-500 text-white shadow-md">
                  Launch Studio <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </motion.div>

          {/* FLAGSHIP PROJECT: aMobile — Phone to PC Hardware Keyboard & Bridge */}
          <motion.div variants={cardVariant} className="card overflow-hidden group flex flex-col justify-between border-orange-300 dark:border-orange-700/60 bg-gradient-to-br from-orange-500/5 via-amber-500/5 to-purple-500/10 shadow-md hover:shadow-orange-500/10 transition-all">
            <div className="p-6">
              <div className="flex items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1 rounded-full bg-orange-100 text-orange-800 dark:bg-orange-950/80 dark:text-orange-300 px-3 py-1 text-xs font-bold border border-orange-300/40">
                  <Smartphone className="h-3.5 w-3.5 text-orange-600 dark:text-orange-400" /> Android Hardware HID &amp; PC Bridge
                </span>
                <span className="text-xs text-orange-600 dark:text-orange-400 font-bold">v2.4 Live</span>
              </div>
              <h3 className="mt-3 text-xl font-extrabold text-slate-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                aMobile — Phone to PC Physical Hardware Keyboard &amp; File Bridge
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Transform Android phones into true 104-key Physical Bluetooth HID Keyboards for Windows with 0 PC software required (<code className="text-orange-700 dark:text-orange-300">kbdhid.sys</code> driver, SEB / BIOS compatible). Includes high-speed PC File Drop, Unicode broadcaster, and Task Manager stealth process cloaking.
              </p>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {["Android Bluetooth HID", "Windows kbdhid.sys", "Zero PC Software Mode", "ADB Reverse Tunnel (58888)", "SEB Exam Compatible", "Swipe File Drop", "64-bit Trampoline Hooking"].map((tag) => (
                  <span key={tag} className="rounded-md bg-orange-100/70 dark:bg-orange-950/60 px-2.5 py-1 text-[11px] font-semibold text-orange-900 dark:text-orange-200 border border-orange-200/50 dark:border-orange-800/40">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-6 pt-0 border-t border-orange-200/60 dark:border-orange-800/40 mt-4 flex flex-wrap items-center justify-between gap-3 bg-orange-500/5 dark:bg-orange-950/20">
              <div className="flex items-center gap-3">
                <a
                  href="/amobile.apk"
                  download="amobile.apk"
                  className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
                >
                  <Download className="h-3.5 w-3.5" /> APK (80 KB)
                </a>
                <a
                  href="/amobile-windows-bridge.zip"
                  download="amobile-windows-bridge.zip"
                  className="text-xs font-bold text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1"
                >
                  <Download className="h-3.5 w-3.5" /> Windows Suite (ZIP)
                </a>
              </div>
              <div className="flex gap-2">
                <Link to="/amobile" className="btn-primary text-xs py-2 px-4 bg-gradient-to-r from-orange-600 to-purple-600 hover:from-orange-500 hover:to-purple-500 text-white shadow-md">
                  Explore &amp; Setup Guide <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </motion.div>

          {/* FLAGSHIP PROJECT: A-Translator / Translify Chrome Extension & Live Translator */}
          <motion.div variants={cardVariant} className="card overflow-hidden group flex flex-col justify-between border-violet-300 dark:border-violet-700/60 bg-gradient-to-br from-violet-500/5 via-indigo-500/5 to-cyan-500/10 shadow-md hover:shadow-violet-500/10 transition-all">
            <div className="p-6">
              <div className="flex items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1 rounded-full bg-violet-100 text-violet-800 dark:bg-violet-950/80 dark:text-violet-300 px-3 py-1 text-xs font-bold border border-violet-300/40">
                  <Languages className="h-3.5 w-3.5 text-violet-600 dark:text-violet-400" /> Chrome Extension &amp; Live Translator
                </span>
                <span className="text-xs text-violet-600 dark:text-violet-400 font-bold">v1.0.0 Live</span>
              </div>
              <h3 className="mt-3 text-xl font-extrabold text-slate-900 dark:text-white group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
                A-Translator / Translify — Live Multilingual Extension &amp; Engine
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Live real-time sentence &amp; phonetic typing translator Chrome extension. Type in English or Hinglish across Gmail, WhatsApp Web, Slack, Twitter/X, ChatGPT, Notion &amp; websites, translating live into 20+ languages. Includes instant ZIP extension package download.
              </p>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {["Chrome Extension Manifest V3", "React.js", "TypeScript", "Google GTX API", "OpenAI ChatGPT API", "Phonetic Engine", "Tailwind CSS"].map((tag) => (
                  <span key={tag} className="rounded-md bg-violet-100/70 dark:bg-violet-950/60 px-2.5 py-1 text-[11px] font-semibold text-violet-900 dark:text-violet-200 border border-violet-200/50 dark:border-violet-800/40">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-6 pt-0 border-t border-violet-200/60 dark:border-violet-800/40 mt-4 flex flex-wrap items-center justify-between gap-3 bg-violet-500/5 dark:bg-violet-950/20">
              <a
                href="/translify-extension-v1.0.0.zip"
                download="translify-extension-v1.0.0.zip"
                className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
              >
                <Download className="h-3.5 w-3.5" /> Download ZIP (v1.0.0)
              </a>
              <div className="flex gap-2">
                <Link to="/translify" className="btn-primary text-xs py-2 px-4 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-md">
                  Explore &amp; Live Demo <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </motion.div>

          {/* PROJECT 1: Career Compass / DeshKiSeva Job Portal */}
          <motion.div variants={cardVariant} className="card overflow-hidden group flex flex-col justify-between border-violet-200 dark:border-violet-800/40 bg-white dark:bg-[#0c0e1e]">
            <div className="p-6">
              <div className="flex items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1 rounded-full bg-orange-100 text-orange-700 dark:bg-orange-950/60 dark:text-orange-300 px-3 py-1 text-xs font-bold">
                  <Landmark className="h-3.5 w-3.5" /> Live Production App
                </span>
                <span className="text-xs text-slate-400 font-semibold">2026</span>
              </div>
              <h3 className="mt-3 text-xl font-extrabold text-slate-900 dark:text-white group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
                Career Compass — Government, Sarkari &amp; Private Jobs Portal
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Full-featured career hub integrating live government job notifications, RSS-scraped feeds from <b>SarkariResult.com</b> &amp; <b>SarkariExam.com</b>, progressive private job streaming (LinkedIn/Indeed), Admit Cards, and Selection Results.
              </p>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {["React.js", "TypeScript", "Vite", "Tailwind CSS", "Sarkari RSS Scraper", "TanStack React Query", "Framer Motion"].map((tag) => (
                  <span key={tag} className="rounded-md bg-slate-100 dark:bg-slate-800 px-2.5 py-1 text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-6 pt-0 border-t border-slate-100 dark:border-slate-800/60 mt-4 flex flex-wrap items-center justify-between gap-3 bg-slate-50/50 dark:bg-slate-900/30">
              <span className="text-xs font-bold text-orange-600 dark:text-orange-400 flex items-center gap-1">
                <CheckCircle2 className="h-3.5 w-3.5" /> Includes {sarkariData?.counts.total ?? "40+"} Live Sarkari Jobs
              </span>
              <div className="flex gap-2">
                <Link to="/jobs?tab=sarkari" className="btn-secondary text-xs py-2 px-3">
                  Sarkari Feed
                </Link>
                <Link to="/jobs" className="btn-primary text-xs py-2 px-4 bg-orange-600 hover:bg-orange-500 text-white">
                  Launch Job Portal <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </motion.div>

          {/* PROJECT 2: ATS Resume Builder */}
          <motion.div variants={cardVariant} className="card overflow-hidden group flex flex-col justify-between border-emerald-200 dark:border-emerald-800/40 bg-white dark:bg-[#0c0e1e]">
            <div className="p-6">
              <div className="flex items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 px-3 py-1 text-xs font-bold">
                  <FileText className="h-3.5 w-3.5" /> Free Career Tool
                </span>
                <span className="text-xs text-slate-400 font-semibold">2026</span>
              </div>
              <h3 className="mt-3 text-xl font-extrabold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                ATS Resume Builder &amp; Scanner Engine
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                ATS-friendly resume builder featuring multi-template rendering, live keyword compliance scoring, print-ready high-resolution PDF export using <code>jsPDF</code> and <code>react-to-print</code>.
              </p>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {["React.js", "TypeScript", "jsPDF", "react-to-print", "ATS Scanner", "Tailwind CSS", "Redux Toolkit"].map((tag) => (
                  <span key={tag} className="rounded-md bg-slate-100 dark:bg-slate-800 px-2.5 py-1 text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-6 pt-0 border-t border-slate-100 dark:border-slate-800/60 mt-4 flex flex-wrap items-center justify-between gap-3 bg-slate-50/50 dark:bg-slate-900/30">
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="h-3.5 w-3.5" /> 98% ATS Pass Rate Templates
              </span>
              <div className="flex gap-2">
                <Link to="/resume-builder/templates" className="btn-secondary text-xs py-2 px-3">
                  Templates
                </Link>
                <Link to="/resume-builder" className="btn-primary text-xs py-2 px-4 bg-emerald-600 hover:bg-emerald-500 text-white">
                  Build Resume Free <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </motion.div>

          {/* PROJECT 3: Exam Mock Test Hub */}
          <motion.div variants={cardVariant} className="card overflow-hidden group flex flex-col justify-between border-purple-200 dark:border-purple-800/40 bg-white dark:bg-[#0c0e1e]">
            <div className="p-6">
              <div className="flex items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1 rounded-full bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 px-3 py-1 text-xs font-bold">
                  <BookOpen className="h-3.5 w-3.5" /> Exam Prep Platform
                </span>
                <span className="text-xs text-slate-400 font-semibold">2026</span>
              </div>
              <h3 className="mt-3 text-xl font-extrabold text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                Exam Mock Test Engine — 100+ Free Papers
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Official-pattern full-length mock tests for SSC CGL/CHSL/MTS, CTET Paper I &amp; II, IBPS PO, RRB NTPC, UPSC, and Defence with section timers, question palette navigation, and instant score breakdowns.
              </p>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {["React.js", "TypeScript", "Full-length Engine", "Live Timers", "Analytics", "Palette Nav"].map((tag) => (
                  <span key={tag} className="rounded-md bg-slate-100 dark:bg-slate-800 px-2.5 py-1 text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-6 pt-0 border-t border-slate-100 dark:border-slate-800/60 mt-4 flex flex-wrap items-center justify-between gap-3 bg-slate-50/50 dark:bg-slate-900/30">
              <span className="text-xs font-bold text-purple-600 dark:text-purple-400 flex items-center gap-1">
                <CheckCircle2 className="h-3.5 w-3.5" /> 100+ Free Official Paper Sets
              </span>
              <Link to="/mock-tests" className="btn-primary text-xs py-2 px-4 bg-purple-600 hover:bg-purple-500 text-white">
                Attempt Mock Tests <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </motion.div>

          {/* PROJECT 4: InterviewGhost.ai — AI-Powered HRTech Platform */}
          <motion.div variants={cardVariant} className="card overflow-hidden group flex flex-col justify-between border-blue-200 dark:border-blue-800/40 bg-white dark:bg-[#0c0e1e]">
            <div className="p-6">
              <div className="flex items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 px-3 py-1 text-xs font-bold">
                  <Cpu className="h-3.5 w-3.5" /> AI HRTech Platform
                </span>
                <span className="text-xs text-slate-400 font-semibold">2025 – 2026</span>
              </div>
              <h3 className="mt-3 text-xl font-extrabold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                InterviewGhost.ai — AI-Powered Hiring Platform
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                AI hiring platform with automated interview simulation, WebSockets real-time transcription, proctoring with <code>face-api.js</code>, screen-sharing validation, and multi-role HR candidate dashboards.
              </p>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {["React.js", "Next.js", "TypeScript", "Redux Toolkit", "WebSockets", "face-api.js", "Speech Recognition API"].map((tag) => (
                  <span key={tag} className="rounded-md bg-slate-100 dark:bg-slate-800 px-2.5 py-1 text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-6 pt-0 border-t border-slate-100 dark:border-slate-800/60 mt-4 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/30">
              <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
                DarpanAI Technologies (Full-Time SDE)
              </span>
              <span className="text-xs text-slate-500 font-semibold">Production Platform</span>
            </div>
          </motion.div>

          {/* PROJECT 5: Advertising Space Management System */}
          <motion.div variants={cardVariant} className="card overflow-hidden group flex flex-col justify-between border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0c0e1e]">
            <div className="p-6">
              <div className="flex items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 px-3 py-1 text-xs font-bold">
                  <Layers className="h-3.5 w-3.5" /> Full Stack MERN
                </span>
                <span className="text-xs text-slate-400 font-semibold">2024</span>
              </div>
              <h3 className="mt-3 text-xl font-extrabold text-slate-900 dark:text-white group-hover:text-violet-600 transition-colors">
                Advertising Space Management System
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                MERN platform connecting advertisers with ad-space owners. Features Stripe payment gateway integration and Google Maps API for location-based discovery.
              </p>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {["MongoDB", "Express.js", "React.js", "Node.js", "Stripe API", "Google Maps API"].map((tag) => (
                  <span key={tag} className="rounded-md bg-slate-100 dark:bg-slate-800 px-2.5 py-1 text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-6 pt-0 border-t border-slate-100 dark:border-slate-800/60 mt-4 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/30">
              <span className="text-xs font-semibold text-slate-500">Stripe Payments &amp; Map Discovery</span>
              <span className="text-xs font-bold text-violet-600">Full Stack MERN</span>
            </div>
          </motion.div>

          {/* PROJECT 6: IntellectInn */}
          <motion.div variants={cardVariant} className="card overflow-hidden group flex flex-col justify-between border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0c0e1e]">
            <div className="p-6">
              <div className="flex items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 px-3 py-1 text-xs font-bold">
                  <Users className="h-3.5 w-3.5" /> Networking Platform
                </span>
                <span className="text-xs text-slate-400 font-semibold">2024</span>
              </div>
              <h3 className="mt-3 text-xl font-extrabold text-slate-900 dark:text-white group-hover:text-violet-600 transition-colors">
                IntellectInn — Student Networking Platform
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Networking platform for students to showcase academic &amp; project achievements, connect with peers, and manage professional profiles via REST APIs.
              </p>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {["React.js", "MongoDB", "Express.js", "REST APIs", "Node.js"].map((tag) => (
                  <span key={tag} className="rounded-md bg-slate-100 dark:bg-slate-800 px-2.5 py-1 text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-6 pt-0 border-t border-slate-100 dark:border-slate-800/60 mt-4 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/30">
              <span className="text-xs font-semibold text-slate-500">Student Achievements &amp; Profiles</span>
              <span className="text-xs font-bold text-violet-600">React &amp; MongoDB</span>
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
                    Jul 2024 – Present
                  </span>
                  <p className="text-xs text-slate-500 mt-1">Remote | Converted to full-time Nov 2024 (4-mo internship)</p>
                </div>
              </div>

              <ul className="mt-4 space-y-2.5 text-xs sm:text-sm text-slate-600 dark:text-slate-300 list-disc list-inside leading-relaxed">
                <li>Built and maintained <b>InterviewGhost.ai</b>, an AI-powered hiring and career-automation platform, using React.js, TypeScript, Next.js, Node.js/Express REST APIs, Vite, and Tailwind CSS across B2C, B2B/HR, and scheduling route groups following SDLC practices.</li>
                <li>Developed ATS-focused resume workflows: dashboard (create/edit/preview/upload/download/delete), template rendering, ATS score and keyword analysis, cover-letter generation, and print-ready PDF export via <b>jsPDF</b>, <b>react-to-print</b>, and <b>html2canvas</b>.</li>
                <li>Implemented real-time AI interview experiences using WebSockets, speech recognition, live transcription, audio capture, and candidate verification/hardware-check flows; integrated screen sharing, fullscreen monitoring, and candidate proctoring workflows using <b>face-api.js</b>.</li>
                <li>Built dynamic HRTech candidate, HR, and executive dashboards for screening, onboarding, job creation/matching, interview scheduling, and interviewer feedback.</li>
                <li>Managed application state with Redux Toolkit, React Query, and Context API; built reusable UI design layer with Radix UI, shadcn-style components, and Lucide icons.</li>
                <li>Wrote and executed test cases/scenarios with Vitest &amp; Testing Library; owned production delivery via Docker multi-stage builds with Nginx, Vercel SPA routing, and GitHub Actions CI/CD.</li>
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

          {/* Hub 1: Job Search */}
          <motion.div variants={cardVariant}>
            <Link to="/jobs" className="card p-6 block group hover:scale-[1.02] transition border-orange-200 dark:border-orange-900/30">
              <div className="flex items-center justify-between">
                <div className="h-10 w-10 rounded-xl bg-orange-500 text-white flex items-center justify-center font-bold shadow-md">
                  <Briefcase className="h-5 w-5" />
                </div>
                <ArrowRight className="h-4 w-4 text-orange-500 group-hover:translate-x-1 transition-transform" />
              </div>
              <h3 className="mt-4 font-bold text-slate-900 dark:text-white text-base">Job Search Portal</h3>
              <p className="mt-1 text-xs text-slate-500">Government Jobs, Private Jobs Stream (LinkedIn &amp; Indeed).</p>
            </Link>
          </motion.div>

          {/* Hub 2: Sarkari Feed */}
          <motion.div variants={cardVariant}>
            <Link to="/jobs?tab=sarkari" className="card p-6 block group hover:scale-[1.02] transition border-purple-200 dark:border-purple-900/30">
              <div className="flex items-center justify-between">
                <div className="h-10 w-10 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold shadow-md">
                  <Landmark className="h-5 w-5" />
                </div>
                <ArrowRight className="h-4 w-4 text-purple-600 group-hover:translate-x-1 transition-transform" />
              </div>
              <h3 className="mt-4 font-bold text-slate-900 dark:text-white text-base">🏛️ Sarkari Jobs Live RSS</h3>
              <p className="mt-1 text-xs text-slate-500">Live feeds from SarkariResult.com &amp; SarkariExam.com.</p>
            </Link>
          </motion.div>

          {/* Hub 3: ATS Resume Builder */}
          <motion.div variants={cardVariant}>
            <Link to="/resume-builder" className="card p-6 block group hover:scale-[1.02] transition border-emerald-200 dark:border-emerald-900/30">
              <div className="flex items-center justify-between">
                <div className="h-10 w-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold shadow-md">
                  <FileText className="h-5 w-5" />
                </div>
                <ArrowRight className="h-4 w-4 text-emerald-600 group-hover:translate-x-1 transition-transform" />
              </div>
              <h3 className="mt-4 font-bold text-slate-900 dark:text-white text-base">ATS Resume Builder</h3>
              <p className="mt-1 text-xs text-slate-500">Resume templates, ATS score scanner &amp; instant PDF export.</p>
            </Link>
          </motion.div>

          {/* Hub 4: Mock Tests */}
          <motion.div variants={cardVariant}>
            <Link to="/mock-tests" className="card p-6 block group hover:scale-[1.02] transition border-blue-200 dark:border-blue-900/30">
              <div className="flex items-center justify-between">
                <div className="h-10 w-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold shadow-md">
                  <BookOpen className="h-5 w-5" />
                </div>
                <ArrowRight className="h-4 w-4 text-blue-600 group-hover:translate-x-1 transition-transform" />
              </div>
              <h3 className="mt-4 font-bold text-slate-900 dark:text-white text-base">Exam Mock Test Hub</h3>
              <p className="mt-1 text-xs text-slate-500">100+ free paper sets for CTET, SSC, Banking, Railway, UPSC.</p>
            </Link>
          </motion.div>

          {/* Hub 5: Admit Cards */}
          <motion.div variants={cardVariant}>
            <Link to="/admit-cards" className="card p-6 block group hover:scale-[1.02] transition border-teal-200 dark:border-teal-900/30">
              <div className="flex items-center justify-between">
                <div className="h-10 w-10 rounded-xl bg-teal-600 text-white flex items-center justify-center font-bold shadow-md">
                  <FileCheck className="h-5 w-5" />
                </div>
                <ArrowRight className="h-4 w-4 text-teal-600 group-hover:translate-x-1 transition-transform" />
              </div>
              <h3 className="mt-4 font-bold text-slate-900 dark:text-white text-base">Admit Cards Portal</h3>
              <p className="mt-1 text-xs text-slate-500">Latest hall tickets &amp; official exam download links.</p>
            </Link>
          </motion.div>

          {/* Hub 6: Exam Results */}
          <motion.div variants={cardVariant}>
            <Link to="/results" className="card p-6 block group hover:scale-[1.02] transition border-yellow-200 dark:border-yellow-900/30">
              <div className="flex items-center justify-between">
                <div className="h-10 w-10 rounded-xl bg-yellow-600 text-white flex items-center justify-center font-bold shadow-md">
                  <Trophy className="h-5 w-5" />
                </div>
                <ArrowRight className="h-4 w-4 text-yellow-600 group-hover:translate-x-1 transition-transform" />
              </div>
              <h3 className="mt-4 font-bold text-slate-900 dark:text-white text-base">Exam Results Portal</h3>
              <p className="mt-1 text-xs text-slate-500">Declared results, merit lists &amp; official selection lists.</p>
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

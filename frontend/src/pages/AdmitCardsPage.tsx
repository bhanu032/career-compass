import { FileCheck, Search, Download, Calendar, CheckCircle2, ShieldCheck, Ticket } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import { ContentCard } from "@/components/ContentCard";
import { Skeleton } from "@/components/Skeleton";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { useAdmitCards } from "@/hooks/useJobs";
import { CATEGORIES } from "@/utils/constants";

export function AdmitCardsPage(): JSX.Element {
  const { t } = useTranslation();
  useDocumentTitle("Admit Cards Portal — DeshKiSeva");

  const [page, setPage] = useState(1);
  const [q, setQ] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");

  const { data, isLoading } = useAdmitCards({ q: search, category, page });
  const totalPages = data?.pages ?? 1;

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setSearch(q);
    setPage(1);
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* 🎟️ Electric Cyan Hall Ticket Dispatcher Hero Banner */}
      <div className="relative overflow-hidden bg-gradient-to-br from-cyan-950 via-sky-950 to-blue-950 border-b border-cyan-500/30 py-16">
        <div className="absolute top-0 right-0 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none"></div>
        <div className="container-page relative z-10">
          <div className="flex items-center gap-2 mb-3">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 px-3.5 py-1 text-xs font-bold shadow-md">
              <Ticket className="h-3.5 w-3.5 text-cyan-400 animate-pulse" /> Official Exam Ticket Dispatcher
            </span>
            <span className="rounded-full bg-sky-900/60 text-sky-300 px-3 py-1 text-xs font-bold border border-sky-700/50">
              Verified Hall Tickets
            </span>
          </div>

          <h1 className="text-3xl font-extrabold sm:text-5xl text-white tracking-tight">
            Admit Cards &amp; <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-teal-300 bg-clip-text text-transparent">Exam Call Letters</span>
          </h1>
          <p className="mt-3 max-w-2xl text-slate-300 text-sm sm:text-base leading-relaxed">
            Download official exam admit cards, hall tickets, and call letters for SSC, Banking, Railways, UPSC, CTET, and State PSC competitive examinations.
          </p>

          {/* Ticket Roll Search Form */}
          <form onSubmit={handleSearch} className="mt-8 flex max-w-2xl gap-2 bg-cyan-950/60 p-2 rounded-2xl border border-cyan-500/40 shadow-xl">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-cyan-400" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search by Exam Name, Roll No, or Organization..."
                className="w-full rounded-xl bg-slate-900/90 py-3 pl-10 pr-4 text-sm text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 border border-cyan-500/30"
              />
            </div>
            <button
              type="submit"
              className="rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-3 text-sm font-bold text-white hover:from-cyan-400 hover:to-blue-500 transition shadow-lg flex items-center gap-2"
            >
              Find Admit Card
            </button>
          </form>
        </div>
      </div>

      {/* Main Ticket Grid */}
      <div className="container-page py-12">
        <div className="mb-6 flex flex-wrap gap-2">
          {["", ...CATEGORIES].map((cat) => (
            <button
              key={cat || "all"}
              onClick={() => {
                setCategory(cat);
                setPage(1);
              }}
              className={`rounded-full border px-4 py-1.5 text-xs font-bold transition-all ${
                category === cat
                  ? "border-cyan-400 bg-cyan-500/20 text-cyan-300 shadow-md shadow-cyan-500/20"
                  : "border-slate-800 bg-slate-900/60 text-slate-400 hover:border-cyan-700 hover:text-slate-200"
              }`}
            >
              {cat || "All Categories"}
            </button>
          ))}
        </div>

        {data && (
          <p className="mb-6 text-xs font-bold text-cyan-400 flex items-center gap-1.5">
            <ShieldCheck className="h-4 w-4" /> Found {data.total} official admit card notifications
          </p>
        )}

        {isLoading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-56 rounded-2xl bg-slate-900 border border-slate-800" />
            ))}
          </div>
        ) : data?.items.length === 0 ? (
          <div className="py-24 text-center border border-slate-800 rounded-3xl bg-slate-900/40">
            <FileCheck className="mx-auto h-12 w-12 text-cyan-500/60" />
            <p className="mt-4 text-slate-400 font-semibold">No admit cards found for your search criteria.</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {data?.items.map((job) => (
              <div
                key={job.id}
                className="card overflow-hidden group flex flex-col justify-between border-cyan-400/30 bg-gradient-to-br from-cyan-950/40 via-sky-950/20 to-slate-900 p-6 shadow-xl hover:shadow-cyan-500/10 transition-all hover:scale-[1.02]"
              >
                <div>
                  <div className="flex items-center justify-between text-xs font-bold text-cyan-400 mb-3">
                    <span className="flex items-center gap-1">
                      <Ticket className="h-3.5 w-3.5" /> Official Call Letter
                    </span>
                    <span className="text-slate-400">{job.organization || "Govt Board"}</span>
                  </div>
                  <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
                    {job.title}
                  </h3>
                  <p className="mt-2 text-xs text-slate-300 line-clamp-2 leading-relaxed">
                    {job.description || "Official admit card for competitive recruitment examination."}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-cyan-900/40 flex items-center justify-between">
                  <span className="text-xs text-cyan-300 font-semibold flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" /> Released Live
                  </span>
                  <a
                    href={job.link || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary text-xs py-2 px-3.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold shadow-md flex items-center gap-1.5"
                  >
                    <Download className="h-3.5 w-3.5" /> Download Ticket
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="mt-12 flex justify-center gap-3">
            <button
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
              className="btn-secondary text-xs px-4 py-2 disabled:opacity-40 border-cyan-900/60"
            >
              Previous
            </button>
            <span className="flex items-center px-4 text-xs font-bold text-cyan-300 bg-cyan-950/60 rounded-xl border border-cyan-800/40">
              Page {page} of {totalPages}
            </span>
            <button
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="btn-secondary text-xs px-4 py-2 disabled:opacity-40 border-cyan-900/60"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

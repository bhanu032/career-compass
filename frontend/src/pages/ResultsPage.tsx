import { Search, Trophy, Download, Award, CheckCircle2, Medal, FileText } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { Skeleton } from "@/components/Skeleton";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { useResults } from "@/hooks/useJobs";
import { CATEGORIES } from "@/utils/constants";

export function ResultsPage(): JSX.Element {
  const { t } = useTranslation();
  useDocumentTitle("Exam Results & Merit Lists — DeshKiSeva");

  const [page, setPage] = useState(1);
  const [q, setQ] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");

  const { data, isLoading } = useResults({ q: search, category, page });
  const totalPages = data?.pages ?? 1;

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setSearch(q);
    setPage(1);
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* 🏆 Golden Trophy Winner Hero Banner */}
      <div className="relative overflow-hidden bg-gradient-to-br from-yellow-950 via-amber-950 to-amber-900 border-b border-yellow-500/30 py-16">
        <div className="absolute top-0 right-0 h-96 w-96 rounded-full bg-yellow-500/10 blur-3xl pointer-events-none"></div>
        <div className="container-page relative z-10">
          <div className="flex items-center gap-2 mb-3">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-yellow-500/20 text-yellow-300 border border-yellow-400/40 px-3.5 py-1 text-xs font-bold shadow-md">
              <Trophy className="h-3.5 w-3.5 text-yellow-400 animate-bounce" /> Official Exam Merit Hub
            </span>
            <span className="rounded-full bg-amber-900/60 text-amber-300 px-3 py-1 text-xs font-bold border border-amber-700/50">
              Selection Lists &amp; Cutoffs
            </span>
          </div>

          <h1 className="text-3xl font-extrabold sm:text-5xl text-white tracking-tight">
            Exam Results &amp; <span className="bg-gradient-to-r from-yellow-300 via-amber-200 to-orange-300 bg-clip-text text-transparent">Official Merit Lists</span>
          </h1>
          <p className="mt-3 max-w-2xl text-amber-100/90 text-sm sm:text-base leading-relaxed">
            Check official declared exam results, selection merit lists, cut-off marks, and scorecard download portals across SSC, Banking, UPSC, Railways, and State Boards.
          </p>

          {/* Result Search Form */}
          <form onSubmit={handleSearch} className="mt-8 flex max-w-2xl gap-2 bg-amber-950/60 p-2 rounded-2xl border border-yellow-500/40 shadow-xl">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-yellow-400" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search by Exam Name, Roll No, or Selection List..."
                className="w-full rounded-xl bg-slate-900/90 py-3 pl-10 pr-4 text-sm text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 border border-amber-500/30"
              />
            </div>
            <button
              type="submit"
              className="rounded-xl bg-gradient-to-r from-yellow-500 via-amber-500 to-orange-600 px-6 py-3 text-sm font-bold text-slate-950 hover:from-yellow-400 hover:to-orange-500 transition shadow-lg flex items-center gap-2"
            >
              Check Result
            </button>
          </form>
        </div>
      </div>

      {/* Main Results Grid */}
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
                  ? "border-yellow-400 bg-yellow-500/20 text-yellow-300 shadow-md shadow-yellow-500/20"
                  : "border-slate-800 bg-slate-900/60 text-slate-400 hover:border-amber-700 hover:text-slate-200"
              }`}
            >
              {cat || "All Categories"}
            </button>
          ))}
        </div>

        {data && (
          <p className="mb-6 text-xs font-bold text-yellow-400 flex items-center gap-1.5">
            <Medal className="h-4 w-4" /> Found {data.total} declared exam selection lists
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
            <Trophy className="mx-auto h-12 w-12 text-yellow-500/60" />
            <p className="mt-4 text-slate-400 font-semibold">No declared results found for your search query.</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {data?.items.map((job) => (
              <div
                key={job.id}
                className="card overflow-hidden group flex flex-col justify-between border-yellow-500/30 bg-gradient-to-br from-yellow-950/30 via-amber-950/20 to-slate-900 p-6 shadow-xl hover:shadow-yellow-500/10 transition-all hover:scale-[1.02]"
              >
                <div>
                  <div className="flex items-center justify-between text-xs font-bold text-yellow-400 mb-3">
                    <span className="flex items-center gap-1">
                      <Award className="h-3.5 w-3.5" /> Official Merit List
                    </span>
                    <span className="text-slate-400">{job.organization || "Govt Board"}</span>
                  </div>
                  <h3 className="text-lg font-bold text-white group-hover:text-yellow-300 transition-colors">
                    {job.title}
                  </h3>
                  <p className="mt-2 text-xs text-slate-300 line-clamp-2 leading-relaxed">
                    {job.description || "Official selection list and cut-off score details."}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-yellow-900/40 flex items-center justify-between">
                  <span className="text-xs text-yellow-300 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> Result Declared
                  </span>
                  <a
                    href={job.application_url || `/jobs/${job.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary text-xs py-2 px-3.5 bg-gradient-to-r from-yellow-500 via-amber-500 to-orange-600 hover:from-yellow-400 hover:to-orange-500 text-slate-950 font-bold shadow-md flex items-center gap-1.5"
                  >
                    <Download className="h-3.5 w-3.5" /> Selection PDF
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
              className="btn-secondary text-xs px-4 py-2 disabled:opacity-40 border-amber-900/60"
            >
              Previous
            </button>
            <span className="flex items-center px-4 text-xs font-bold text-yellow-300 bg-yellow-950/60 rounded-xl border border-yellow-800/40">
              Page {page} of {totalPages}
            </span>
            <button
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="btn-secondary text-xs px-4 py-2 disabled:opacity-40 border-amber-900/60"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

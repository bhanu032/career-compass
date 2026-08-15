import { Search, Trophy } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { ContentCard } from "@/components/ContentCard";
import { HeroBanner } from "@/components/HeroBanner";
import { Skeleton } from "@/components/Skeleton";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { useResults } from "@/hooks/useJobs";
import { CATEGORIES } from "@/utils/constants";

export function ResultsPage(): JSX.Element {
  const { t } = useTranslation();
  useDocumentTitle("Results — DeshKiSeva");

  const [page, setPage] = useState(1);
  const [q, setQ] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");

  const { data, isLoading } = useResults({ q: search, category, page });
  const totalPages = data?.pages ?? 1;

  function handleSearch(e: React.FormEvent) { e.preventDefault(); setSearch(q); setPage(1); }

  return (
    <>
      <HeroBanner variant="results" py="py-16">
        <div className="flex items-center gap-3 mb-4">
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-white/15 border border-white/10 backdrop-blur-sm">
            <Trophy className="h-5 w-5 text-emerald-200" />
          </span>
          <span className="text-sm font-semibold text-emerald-200 tracking-wide uppercase">DeshKiSeva</span>
        </div>
        <h1 className="text-3xl font-bold sm:text-4xl drop-shadow-lg">
          <span className="bg-gradient-to-r from-emerald-300 to-teal-300 bg-clip-text text-transparent">{t("results.title")}</span>
        </h1>
        <p className="mt-2 max-w-2xl text-emerald-100/80 text-sm sm:text-base">{t("results.desc")}</p>
        <form onSubmit={handleSearch} className="mt-6 flex max-w-2xl gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-emerald-300" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={t("results.searchPlaceholder")}
              className="w-full rounded-xl border border-white/15 bg-white/10 py-2.5 pl-9 pr-4 text-sm text-white placeholder:text-emerald-300/60 focus:outline-none focus:ring-2 focus:ring-emerald-300/40 backdrop-blur-sm" />
          </div>
          <button type="submit" className="rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-emerald-700 hover:bg-emerald-50 transition">{t("results.searchBtn")}</button>
        </form>
      </HeroBanner>

      <div className="container-page py-10">
        <div className="mb-6 flex flex-wrap gap-2">
          {["", ...CATEGORIES].map((cat) => (
            <button key={cat||"all"} onClick={() => { setCategory(cat); setPage(1); }}
              className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition ${category===cat ? "border-brand-500 bg-brand-50 text-brand-700 dark:bg-brand-900/40 dark:text-brand-300" : "border-slate-200 text-slate-600 hover:border-brand-300 dark:border-slate-700 dark:text-slate-300"}`}>
              {cat || t("common.allCategories")}
            </button>
          ))}
        </div>

        {data && <p className="mb-4 text-sm text-slate-500 dark:text-slate-400">{t("results.found", { count: data.total })}</p>}

        {isLoading ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{Array.from({length:6}).map((_,i)=><Skeleton key={i} className="h-48 rounded-2xl"/>)}</div>
        ) : data?.items.length === 0 ? (
          <div className="py-24 text-center"><Trophy className="mx-auto h-12 w-12 text-slate-300 dark:text-slate-600"/><p className="mt-4 text-slate-500">{t("results.noFound")}</p></div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{data?.items.map((job)=><ContentCard key={job.id} job={job} type="result"/>)}</div>
        )}

        {totalPages > 1 && (
          <div className="mt-10 flex justify-center gap-2">
            <button disabled={page<=1} onClick={()=>setPage(p=>p-1)} className="btn-secondary disabled:opacity-40">{t("common.previous")}</button>
            <span className="flex items-center px-4 text-sm text-slate-600 dark:text-slate-300">{t("common.page", {current:page, total:totalPages})}</span>
            <button disabled={page>=totalPages} onClick={()=>setPage(p=>p+1)} className="btn-secondary disabled:opacity-40">{t("common.next")}</button>
          </div>
        )}
      </div>
    </>
  );
}

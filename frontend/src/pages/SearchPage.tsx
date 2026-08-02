import { useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { EmptyState } from "@/components/EmptyState";
import { HeroBanner } from "@/components/HeroBanner";
import { JobCard } from "@/components/JobCard";
import { JobFilters } from "@/components/JobFilters";
import { Pagination } from "@/components/Pagination";
import { JobListSkeleton } from "@/components/Skeleton";
import { useDebounce } from "@/hooks/useDebounce";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { useJobSearch } from "@/hooks/useJobs";
import type { JobSearchParams } from "@/types";
import { PAGE_SIZE } from "@/utils/constants";

function paramsToFilters(search: URLSearchParams): JobSearchParams {
  const num = (v: string | null) => v && !Number.isNaN(Number(v)) ? Number(v) : undefined;
  return {
    q: search.get("q") ?? undefined, state: search.get("state") ?? undefined,
    qualification: search.get("qualification") ?? undefined, organization: search.get("organization") ?? undefined,
    category: search.get("category") ?? undefined, salary_min: num(search.get("salary_min")),
    salary_max: num(search.get("salary_max")), last_date_before: search.get("last_date_before") ?? undefined,
    active_only: search.get("active_only") === "true" ? true : undefined,
    sort_by: search.get("sort_by") ?? "created_at",
    sort_dir: (search.get("sort_dir") as "asc" | "desc" | null) ?? "desc",
    page: num(search.get("page")) ?? 1, page_size: PAGE_SIZE,
  };
}

export function SearchPage(): JSX.Element {
  const { t } = useTranslation();
  useDocumentTitle("Search Government Jobs — DeshKiSeva");

  const [searchParams, setSearchParams] = useSearchParams();
  const filters = useMemo(() => paramsToFilters(searchParams), [searchParams]);
  const debouncedFilters = useDebounce(filters, 350);
  const { data, isLoading, isFetching } = useJobSearch(debouncedFilters);

  const update = useCallback((next: Partial<JobSearchParams>) => {
    const merged = { ...filters, ...next, page: next.page ?? 1 };
    const params = new URLSearchParams();
    Object.entries(merged).forEach(([k, v]) => {
      if (v === undefined || v === "" || k === "page_size") return;
      if (k === "page" && v === 1) return;
      params.set(k, String(v));
    });
    setSearchParams(params, { replace: true });
  }, [filters, setSearchParams]);

  const reset = useCallback(() => setSearchParams(new URLSearchParams(), { replace: true }), [setSearchParams]);

  return (
    <>
      <HeroBanner variant="search" py="py-14">
        <h1 className="text-3xl font-bold sm:text-4xl drop-shadow-lg">
          <span className="bg-gradient-to-r from-orange-300 to-amber-300 bg-clip-text text-transparent">
            {t("search.title")}
          </span>
        </h1>
        <p className="mt-2 text-white/70 text-sm sm:text-base">
          {isLoading ? t("search.searching") : t("search.matchingVacancies", { count: (data?.total ?? 0).toLocaleString("en-IN") })}
        </p>
      </HeroBanner>

      <div className="container-page py-10">
        <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
          <JobFilters filters={filters} onChange={update} onReset={reset} />
          <div>
            {isLoading ? <JobListSkeleton count={6} /> : (data?.items.length ?? 0) === 0 ? (
              <EmptyState title={t("search.noMatch")} description={t("search.noMatchDesc")} />
            ) : (
              <div className={isFetching ? "opacity-60 transition-opacity" : "transition-opacity"}>
                <div className="grid gap-5 sm:grid-cols-2">
                  {data?.items.map((job) => <JobCard key={job.id} job={job} />)}
                </div>
                <Pagination page={data?.page ?? 1} pages={data?.pages ?? 1} onChange={(page) => update({ page })} />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

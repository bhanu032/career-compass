import { useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";

import { EmptyState } from "@/components/EmptyState";
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
  const numberOrUndefined = (value: string | null): number | undefined =>
    value && !Number.isNaN(Number(value)) ? Number(value) : undefined;

  return {
    q: search.get("q") ?? undefined,
    state: search.get("state") ?? undefined,
    qualification: search.get("qualification") ?? undefined,
    organization: search.get("organization") ?? undefined,
    category: search.get("category") ?? undefined,
    salary_min: numberOrUndefined(search.get("salary_min")),
    salary_max: numberOrUndefined(search.get("salary_max")),
    last_date_before: search.get("last_date_before") ?? undefined,
    active_only: search.get("active_only") === "true" ? true : undefined,
    sort_by: search.get("sort_by") ?? "created_at",
    sort_dir: (search.get("sort_dir") as "asc" | "desc" | null) ?? "desc",
    page: numberOrUndefined(search.get("page")) ?? 1,
    page_size: PAGE_SIZE,
  };
}

export function SearchPage(): JSX.Element {
  useDocumentTitle("Search Government Jobs — GovJobs Portal", "Filter vacancies by state, qualification, salary and closing date.");

  const [searchParams, setSearchParams] = useSearchParams();
  const filters = useMemo(() => paramsToFilters(searchParams), [searchParams]);
  const debouncedFilters = useDebounce(filters, 350);
  const { data, isLoading, isFetching } = useJobSearch(debouncedFilters);

  const update = useCallback(
    (next: Partial<JobSearchParams>) => {
      const merged: JobSearchParams = { ...filters, ...next, page: next.page ?? 1 };
      const params = new URLSearchParams();
      Object.entries(merged).forEach(([key, value]) => {
        if (value === undefined || value === "" || key === "page_size") return;
        if (key === "page" && value === 1) return;
        params.set(key, String(value));
      });
      setSearchParams(params, { replace: true });
    },
    [filters, setSearchParams],
  );

  const reset = useCallback(() => setSearchParams(new URLSearchParams(), { replace: true }), [setSearchParams]);

  return (
    <div className="container-page py-10">
      <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Search jobs</h1>
      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
        {isLoading ? "Searching…" : `${(data?.total ?? 0).toLocaleString("en-IN")} matching vacancies`}
      </p>

      <div className="mt-8 grid gap-6 lg:grid-cols-[300px_1fr]">
        <JobFilters filters={filters} onChange={update} onReset={reset} />

        <div>
          {isLoading ? (
            <JobListSkeleton count={6} />
          ) : (data?.items.length ?? 0) === 0 ? (
            <EmptyState
              title="No jobs match these filters"
              description="Try widening the salary range, removing the state filter or searching a broader keyword."
            />
          ) : (
            <div className={isFetching ? "opacity-60 transition-opacity" : "transition-opacity"}>
              <div className="grid gap-5 sm:grid-cols-2">
                {data?.items.map((job) => <JobCard key={job.id} job={job} />)}
              </div>
              <Pagination
                page={data?.page ?? 1}
                pages={data?.pages ?? 1}
                onChange={(page) => update({ page })}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

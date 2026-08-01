import { useInfiniteQuery, useQuery, type UseQueryResult } from "@tanstack/react-query";

import { jobService } from "@/services/jobService";
import type { HomeData, Job, JobSearchParams, Page } from "@/types";
import { PAGE_SIZE } from "@/utils/constants";

export function useHomeData(): UseQueryResult<HomeData> {
  return useQuery({ queryKey: ["home"], queryFn: () => jobService.home(), staleTime: 60_000 });
}

export function useJobSearch(params: JobSearchParams): UseQueryResult<Page<Job>> {
  return useQuery({
    queryKey: ["jobs", params],
    queryFn: () => jobService.search(params),
    staleTime: 30_000,
  });
}

export function useJob(id: number): UseQueryResult<Job> {
  return useQuery({
    queryKey: ["job", id],
    queryFn: () => jobService.detail(id),
    enabled: Number.isFinite(id) && id > 0,
  });
}

export function useInfiniteJobs(params: JobSearchParams) {
  return useInfiniteQuery({
    queryKey: ["jobs-infinite", params],
    initialPageParam: 1,
    queryFn: ({ pageParam }) =>
      jobService.search({ ...params, page: pageParam as number, page_size: params.page_size ?? PAGE_SIZE }),
    getNextPageParam: (lastPage) => (lastPage.page < lastPage.pages ? lastPage.page + 1 : undefined),
  });
}

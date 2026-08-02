import { useInfiniteQuery, useQuery, useQueryClient, type UseQueryResult } from "@tanstack/react-query";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

import { jobService } from "@/services/jobService";
import type { HomeData, Job, JobSearchParams, Page } from "@/types";
import { PAGE_SIZE } from "@/utils/constants";

function useLang(): string {
  const { i18n } = useTranslation();
  return i18n.language || "en";
}

/**
 * Resets (clears + refetches) ALL job queries when language changes.
 * resetQueries removes stale data so translated content shows immediately.
 */
export function useJobQueryInvalidatorOnLangChange(): void {
  const { i18n } = useTranslation();
  const qc = useQueryClient();
  useEffect(() => {
    const handler = () => {
      // resetQueries clears cached data AND triggers a refetch
      // so users see fresh translated data, not stale English
      void qc.resetQueries({ queryKey: ["home"] });
      void qc.resetQueries({ queryKey: ["jobs"] });
      void qc.resetQueries({ queryKey: ["job"] });
      void qc.resetQueries({ queryKey: ["jobs-infinite"] });
      void qc.resetQueries({ queryKey: ["admit-cards"] });
      void qc.resetQueries({ queryKey: ["results"] });
    };
    i18n.on("languageChanged", handler);
    return () => i18n.off("languageChanged", handler);
  }, [i18n, qc]);
}

export function useHomeData(): UseQueryResult<HomeData> {
  const lang = useLang();
  return useQuery({
    queryKey: ["home", lang],
    queryFn: () => jobService.home(),
    staleTime: 5 * 60_000,  // 5 minutes — lang change triggers resetQueries anyway
  });
}

export function useJobSearch(params: JobSearchParams): UseQueryResult<Page<Job>> {
  const lang = useLang();
  return useQuery({
    queryKey: ["jobs", params, lang],
    queryFn: () => jobService.search(params),
    staleTime: 5 * 60_000,
  });
}

export function useJob(id: number): UseQueryResult<Job> {
  const lang = useLang();
  return useQuery({
    queryKey: ["job", id, lang],
    queryFn: () => jobService.detail(id),
    enabled: Number.isFinite(id) && id > 0,
    staleTime: 5 * 60_000,
  });
}

export function useInfiniteJobs(params: JobSearchParams) {
  const lang = useLang();
  return useInfiniteQuery({
    queryKey: ["jobs-infinite", params, lang],
    initialPageParam: 1,
    queryFn: ({ pageParam }) =>
      jobService.search({ ...params, page: pageParam as number, page_size: params.page_size ?? PAGE_SIZE }),
    getNextPageParam: (lastPage) => (lastPage.page < lastPage.pages ? lastPage.page + 1 : undefined),
  });
}

export function useAdmitCards(params: { q?: string; category?: string; page?: number } = {}): UseQueryResult<Page<Job>> {
  const lang = useLang();
  return useQuery({
    queryKey: ["admit-cards", params, lang],
    queryFn: () => jobService.admitCards({ ...params, page_size: PAGE_SIZE }),
    staleTime: 5 * 60_000,
  });
}

export function useResults(params: { q?: string; category?: string; page?: number } = {}): UseQueryResult<Page<Job>> {
  const lang = useLang();
  return useQuery({
    queryKey: ["results", params, lang],
    queryFn: () => jobService.results({ ...params, page_size: PAGE_SIZE }),
    staleTime: 5 * 60_000,
  });
}

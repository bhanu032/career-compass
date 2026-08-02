import { useMutation, useQuery, useQueryClient, type UseQueryResult } from "@tanstack/react-query";

import { adminService } from "@/services/adminService";
import type { AdminStats, Job, Page, ScraperLog, User } from "@/types";

// ── Dashboard stats ──────────────────────────────────────────────────────────

export function useAdminStats(): UseQueryResult<AdminStats & {
  active_jobs: number;
  recent_scraper_runs: (ScraperLog & { jobs_found: number; jobs_created: number })[];
}> {
  return useQuery({
    queryKey: ["admin", "stats"],
    queryFn: async () => {
      const stats = await adminService.stats();
      const logs = await adminService.logs(1, 10);
      return {
        ...stats,
        active_jobs: stats.total_jobs,
        recent_scraper_runs: logs.items.map((log) => ({
          ...log,
          jobs_found: log.items_found,
          jobs_created: log.items_created,
        })),
      };
    },
    staleTime: 30_000,
  });
}

// ── Jobs ─────────────────────────────────────────────────────────────────────

export function useAdminJobs(params: { page?: number; q?: string } = {}): UseQueryResult<Page<Job>> {
  return useQuery({
    queryKey: ["admin", "jobs", params],
    queryFn: () => adminService.jobs(params.page ?? 1, 20, params.q),
    staleTime: 15_000,
  });
}

export function useDeleteJob() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => adminService.deleteJob(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["admin", "jobs"] });
    },
  });
}

// ── Users ─────────────────────────────────────────────────────────────────────

export function useAdminUsers(page = 1): UseQueryResult<Page<User>> {
  return useQuery({
    queryKey: ["admin", "users", page],
    queryFn: () => adminService.users(page, 20),
    staleTime: 15_000,
  });
}

export function useToggleUserActive() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, is_active }: { id: number; is_active: boolean }) =>
      adminService.updateUser(id, { is_active }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
    },
  });
}

// ── Scrapers ──────────────────────────────────────────────────────────────────

export function useScraperLogs(): UseQueryResult<Page<ScraperLog & { jobs_found: number; jobs_created: number }>> {
  return useQuery({
    queryKey: ["admin", "scraper-logs"],
    queryFn: async () => {
      const page = await adminService.logs(1, 50);
      return {
        ...page,
        items: page.items.map((log) => ({
          ...log,
          jobs_found: log.items_found,
          jobs_created: log.items_created,
        })),
      };
    },
    staleTime: 15_000,
  });
}

export function useRunScraper() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (source: string) => adminService.runScraper([source]),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["admin", "scraper-logs"] });
      void queryClient.invalidateQueries({ queryKey: ["admin", "stats"] });
    },
  });
}

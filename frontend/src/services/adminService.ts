import { apiClient } from "@/services/apiClient";
import type { AdminStats, ApiMessage, Job, Page, ScraperLog, ScraperRunResult, User } from "@/types";

export const adminService = {
  async stats(): Promise<AdminStats> {
    const { data } = await apiClient.get<AdminStats>("/admin/stats");
    return data;
  },

  async jobs(page = 1, pageSize = 20, q?: string): Promise<Page<Job>> {
    const { data } = await apiClient.get<Page<Job>>("/admin/jobs", {
      params: { page, page_size: pageSize, q },
    });
    return data;
  },

  async deleteJob(id: number): Promise<ApiMessage> {
    const { data } = await apiClient.delete<ApiMessage>(`/admin/jobs/${id}`);
    return data;
  },

  async users(page = 1, pageSize = 20, q?: string): Promise<Page<User>> {
    const { data } = await apiClient.get<Page<User>>("/admin/users", {
      params: { page, page_size: pageSize, q },
    });
    return data;
  },

  async updateUser(id: number, payload: { role?: "admin" | "user"; is_active?: boolean }): Promise<User> {
    const { data } = await apiClient.put<User>(`/admin/users/${id}`, payload);
    return data;
  },

  async sources(): Promise<string[]> {
    const { data } = await apiClient.get<string[]>("/admin/scrapers");
    return data;
  },

  async runScraper(sources?: string[]): Promise<ScraperRunResult[]> {
    const { data } = await apiClient.post<ScraperRunResult[]>("/admin/run-scraper", { sources });
    return data;
  },

  async logs(page = 1, pageSize = 20): Promise<Page<ScraperLog>> {
    const { data } = await apiClient.get<Page<ScraperLog>>("/admin/scraper-logs", {
      params: { page, page_size: pageSize },
    });
    return data;
  },
};

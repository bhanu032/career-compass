import { apiClient } from "@/services/apiClient";
import type { HomeData, Job, JobSearchParams, Page } from "@/types";
import i18n from "@/i18n";

/** Returns the current i18next language for passing to the backend. */
function lang(): string {
  return i18n.language || "en";
}

export const jobService = {
  async list(params: JobSearchParams = {}): Promise<Page<Job>> {
    const { data } = await apiClient.get<Page<Job>>("/jobs", { params: { ...params, lang: lang() } });
    return data;
  },

  async search(params: JobSearchParams): Promise<Page<Job>> {
    const { data } = await apiClient.get<Page<Job>>("/search", { params: { ...params, lang: lang() } });
    return data;
  },

  async detail(id: number): Promise<Job> {
    const { data } = await apiClient.get<Job>(`/jobs/${id}`, { params: { lang: lang() } });
    return data;
  },

  async home(): Promise<HomeData> {
    const { data } = await apiClient.get<HomeData>("/home", { params: { lang: lang() } });
    return data;
  },

  async admitCards(params: { q?: string; category?: string; page?: number; page_size?: number } = {}): Promise<Page<Job>> {
    const { data } = await apiClient.get<Page<Job>>("/admit-cards", { params: { ...params, lang: lang() } });
    return data;
  },

  async results(params: { q?: string; category?: string; page?: number; page_size?: number } = {}): Promise<Page<Job>> {
    const { data } = await apiClient.get<Page<Job>>("/results", { params: { ...params, lang: lang() } });
    return data;
  },
};

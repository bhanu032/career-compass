import { apiClient } from "@/services/apiClient";
import type { HomeData, Job, JobSearchParams, Page } from "@/types";

export const jobService = {
  async list(params: JobSearchParams = {}): Promise<Page<Job>> {
    const { data } = await apiClient.get<Page<Job>>("/jobs", { params });
    return data;
  },

  async search(params: JobSearchParams): Promise<Page<Job>> {
    const { data } = await apiClient.get<Page<Job>>("/search", { params });
    return data;
  },

  async detail(id: number): Promise<Job> {
    const { data } = await apiClient.get<Job>(`/jobs/${id}`);
    return data;
  },

  async home(): Promise<HomeData> {
    const { data } = await apiClient.get<HomeData>("/home");
    return data;
  },
};

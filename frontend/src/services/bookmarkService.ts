import { apiClient } from "@/services/apiClient";
import type { ApiMessage, Job, Page } from "@/types";

export const bookmarkService = {
  async list(page = 1, pageSize = 12): Promise<Page<Job>> {
    const { data } = await apiClient.get<Page<Job>>("/bookmarks", {
      params: { page, page_size: pageSize },
    });
    return data;
  },

  async ids(): Promise<number[]> {
    const { data } = await apiClient.get<number[]>("/bookmarks/ids");
    return data;
  },

  async add(jobId: number): Promise<ApiMessage> {
    const { data } = await apiClient.post<ApiMessage>(`/bookmarks/${jobId}`);
    return data;
  },

  async remove(jobId: number): Promise<ApiMessage> {
    const { data } = await apiClient.delete<ApiMessage>(`/bookmarks/${jobId}`);
    return data;
  },
};

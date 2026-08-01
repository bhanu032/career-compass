import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";

import { clearSession, getAccessToken, getRefreshToken, setAccessToken } from "@/utils/storage";

export const API_BASE_URL: string =
  (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? "/api";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 20000,
});

apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = getAccessToken();
  if (token) {
    config.headers.set("Authorization", `Bearer ${token}`);
  }
  return config;
});

interface RetriableConfig extends InternalAxiosRequestConfig {
  _retried?: boolean;
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<{ detail?: string }>) => {
    const original = error.config as RetriableConfig | undefined;
    const refreshToken = getRefreshToken();

    if (error.response?.status === 401 && original && !original._retried && refreshToken) {
      original._retried = true;
      try {
        const { data } = await axios.post<{ access_token: string }>(
          `${API_BASE_URL}/refresh`,
          { refresh_token: refreshToken },
          { headers: { "Content-Type": "application/json" } },
        );
        setAccessToken(data.access_token);
        original.headers.set("Authorization", `Bearer ${data.access_token}`);
        return apiClient.request(original);
      } catch {
        clearSession();
      }
    }
    return Promise.reject(error);
  },
);

export function extractErrorMessage(error: unknown, fallback = "Something went wrong"): string {
  if (axios.isAxiosError<{ detail?: string }>(error)) {
    return error.response?.data?.detail ?? error.message ?? fallback;
  }
  if (error instanceof Error) return error.message;
  return fallback;
}

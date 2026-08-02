import type { User } from "@/types";

const ACCESS_KEY = "deshkiseva.access_token";
const REFRESH_KEY = "deshkiseva.refresh_token";
const USER_KEY = "deshkiseva.user";
const RECENT_KEY = "deshkiseva.recently_viewed";
const THEME_KEY = "deshkiseva.theme";

const isBrowser = typeof window !== "undefined";

export function getAccessToken(): string | null {
  return isBrowser ? window.localStorage.getItem(ACCESS_KEY) : null;
}

export function setAccessToken(token: string): void {
  if (isBrowser) window.localStorage.setItem(ACCESS_KEY, token);
}

export function getRefreshToken(): string | null {
  return isBrowser ? window.localStorage.getItem(REFRESH_KEY) : null;
}

export function saveSession(accessToken: string, refreshToken: string, user: User): void {
  if (!isBrowser) return;
  window.localStorage.setItem(ACCESS_KEY, accessToken);
  window.localStorage.setItem(REFRESH_KEY, refreshToken);
  window.localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function getStoredUser(): User | null {
  if (!isBrowser) return null;
  const raw = window.localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as User;
  } catch {
    return null;
  }
}

export function setStoredUser(user: User): void {
  if (isBrowser) window.localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearSession(): void {
  if (!isBrowser) return;
  window.localStorage.removeItem(ACCESS_KEY);
  window.localStorage.removeItem(REFRESH_KEY);
  window.localStorage.removeItem(USER_KEY);
}

export function getRecentlyViewed(): number[] {
  if (!isBrowser) return [];
  try {
    return JSON.parse(window.localStorage.getItem(RECENT_KEY) ?? "[]") as number[];
  } catch {
    return [];
  }
}

export function pushRecentlyViewed(jobId: number, limit = 8): number[] {
  if (!isBrowser) return [];
  const next = [jobId, ...getRecentlyViewed().filter((id) => id !== jobId)].slice(0, limit);
  window.localStorage.setItem(RECENT_KEY, JSON.stringify(next));
  return next;
}

export function getStoredTheme(): "light" | "dark" | "tricolor" | null {
  if (!isBrowser) return null;
  const value = window.localStorage.getItem(THEME_KEY);
  return value === "dark" || value === "light" || value === "tricolor" ? value : null;
}

export function setStoredTheme(theme: "light" | "dark" | "tricolor"): void {
  if (isBrowser) window.localStorage.setItem(THEME_KEY, theme);
}

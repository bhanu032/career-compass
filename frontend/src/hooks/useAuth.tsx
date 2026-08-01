import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

import { authService, type RegisterPayload } from "@/services/authService";
import type { User } from "@/types";
import { clearSession, getAccessToken, getStoredUser, saveSession, setStoredUser } from "@/utils/storage";

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => void;
  updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }): JSX.Element {
  const [user, setUser] = useState<User | null>(() => getStoredUser());
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    let cancelled = false;
    async function hydrate(): Promise<void> {
      if (!getAccessToken()) {
        setIsLoading(false);
        return;
      }
      try {
        const fresh = await authService.profile();
        if (!cancelled) {
          setUser(fresh);
          setStoredUser(fresh);
        }
      } catch {
        if (!cancelled) {
          clearSession();
          setUser(null);
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }
    void hydrate();
    return () => {
      cancelled = true;
    };
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const tokens = await authService.login(email, password);
    saveSession(tokens.access_token, tokens.refresh_token, tokens.user);
    setUser(tokens.user);
  }, []);

  const register = useCallback(async (payload: RegisterPayload) => {
    const tokens = await authService.register(payload);
    saveSession(tokens.access_token, tokens.refresh_token, tokens.user);
    setUser(tokens.user);
  }, []);

  const logout = useCallback(() => {
    clearSession();
    setUser(null);
  }, []);

  const updateUser = useCallback((next: User) => {
    setUser(next);
    setStoredUser(next);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: user !== null,
      isAdmin: user?.role === "admin",
      isLoading,
      login,
      register,
      logout,
      updateUser,
    }),
    [user, isLoading, login, register, logout, updateUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside an AuthProvider");
  return context;
}

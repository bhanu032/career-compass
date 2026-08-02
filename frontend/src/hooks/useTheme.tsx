import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

import { getStoredTheme, setStoredTheme } from "@/utils/storage";

export type Theme = "light" | "dark" | "tricolor";

interface ThemeContextValue {
  theme: Theme;
  cycleTheme: () => void;
  /** @deprecated kept for backward-compat — calls cycleTheme */
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

const CYCLE: Theme[] = ["light", "tricolor", "dark"];

function initialTheme(): Theme {
  const stored = getStoredTheme();
  if (stored) return stored;
  return "light";
}

function applyTheme(theme: Theme): void {
  const html = document.documentElement;
  // Remove all theme classes first
  html.classList.remove("dark", "tricolor");
  if (theme === "dark")      html.classList.add("dark");
  if (theme === "tricolor")  html.classList.add("tricolor");
  html.style.colorScheme = theme === "dark" ? "dark" : "light";
}

export function ThemeProvider({ children }: { children: ReactNode }): JSX.Element {
  const [theme, setTheme] = useState<Theme>(initialTheme);

  useEffect(() => {
    applyTheme(theme);
    setStoredTheme(theme);
  }, [theme]);

  const cycleTheme = useCallback(() => {
    setTheme((current) => {
      const idx = CYCLE.indexOf(current);
      return CYCLE[(idx + 1) % CYCLE.length];
    });
  }, []);

  const value = useMemo<ThemeContextValue>(
    () => ({ theme, cycleTheme, toggleTheme: cycleTheme }),
    [theme, cycleTheme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used inside a ThemeProvider");
  return context;
}

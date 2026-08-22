import {
  Briefcase,
  Building2,
  CheckCircle2,
  FileCheck,
  FileText,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Menu,
  Mic,
  Search,
  Star,
  Trophy,
  User as UserIcon,
  X,
  Zap,
} from "lucide-react";
import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { Logo } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/hooks/useTheme";
import { classNames } from "@/utils/format";

export function Navbar(): JSX.Element {
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const { t } = useTranslation();
  const { theme } = useTheme();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const isTricolor = theme === "tricolor";
  const isDark = theme === "dark";

  // 3 Primary Navbar Pillars
  const PRIMARY_LINKS = [
    { to: "/jobs", label: "Jobs", icon: Briefcase },
    { to: "/mock-tests", label: "Mock Tests", icon: GraduationCap },
    { to: "/resume-builder", label: "Resume Builder", icon: FileText },
  ];

  // Secondary Quick Links
  const QUICK_LINKS = [
    { to: "/avoice", label: "AuraVoice AI", icon: Mic },
    { to: "/admit-cards", label: "Admit Cards", icon: FileCheck },
    { to: "/results", label: "Results", icon: Trophy },
    { to: "/search", label: "Search", icon: Search },
  ];

  function handleLogout(): void {
    logout();
    setOpen(false);
    navigate("/");
  }

  const navStyle: React.CSSProperties = isTricolor
    ? {
        background: "rgba(255,255,255,0.97)",
        borderBottom: "1px solid rgba(255,153,51,0.22)",
        boxShadow: "0 2px 16px rgba(255,153,51,0.08)",
        backdropFilter: "blur(16px)",
      }
    : isDark
    ? {
        background: "rgba(2,3,8,0.88)",
        borderBottom: "1px solid rgba(99,102,241,0.15)",
        boxShadow: "0 1px 40px rgba(0,0,0,0.5)",
        backdropFilter: "blur(20px)",
      }
    : {
        background: "rgba(255,255,255,0.92)",
        borderBottom: "1px solid #e2e8f0",
        boxShadow: "0 1px 8px rgba(0,0,0,0.06)",
        backdropFilter: "blur(16px)",
      };

  const topLineStyle: React.CSSProperties = isTricolor
    ? {
        background:
          "linear-gradient(to right, #FF9933 33.33%, #ffffff 33.33% 66.66%, #138808 66.66%)",
        height: 3,
      }
    : isDark
    ? {
        background:
          "linear-gradient(90deg, transparent, rgba(124,58,237,0.7), rgba(0,212,255,0.4), transparent)",
        height: 1,
      }
    : { display: "none" };

  function activeStyle(): React.CSSProperties {
    if (isTricolor) return {
      background: "rgba(255,153,51,0.12)",
      border: "1px solid rgba(255,153,51,0.35)",
      color: "#C87000",
    };
    if (isDark) return {
      background: "rgba(124,58,237,0.2)",
      border: "1px solid rgba(124,58,237,0.4)",
      color: "#fff",
    };
    return {
      background: "#f5f3ff",
      border: "1px solid #ddd6fe",
      color: "#6d28d9",
    };
  }

  const inactiveClass = isTricolor
    ? "text-gray-700 hover:text-[#C87000] hover:bg-[rgba(255,153,51,0.07)]"
    : isDark
    ? "text-slate-300 hover:text-white hover:bg-white/[0.06]"
    : "text-slate-700 hover:text-slate-900 hover:bg-slate-100";

  const mobileMenuStyle: React.CSSProperties = isTricolor
    ? {
        background: "rgba(255,253,248,0.98)",
        borderTop: "1px solid rgba(255,153,51,0.18)",
        backdropFilter: "blur(16px)",
      }
    : isDark
    ? {
        background: "rgba(2,3,8,0.97)",
        borderTop: "1px solid rgba(99,102,241,0.15)",
        backdropFilter: "blur(20px)",
      }
    : {
        background: "#ffffff",
        borderTop: "1px solid #e2e8f0",
      };

  return (
    <header className="sticky top-0 z-40" style={navStyle}>
      <div className="absolute top-0 left-0 right-0 pointer-events-none" style={topLineStyle} />

      <div className="container-page flex h-16 items-center justify-between gap-4">
        <Logo />

        {/* ── Desktop Primary 3 Pillars Navigation ─────────────────────── */}
        <nav className="hidden items-center gap-1.5 md:flex">
          {PRIMARY_LINKS.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  classNames(
                    "relative flex items-center gap-2 rounded-xl px-3.5 py-2 text-sm font-bold transition-all duration-200 whitespace-nowrap",
                    isActive ? "" : inactiveClass,
                  )
                }
                style={({ isActive }) =>
                  isActive ? activeStyle() : { border: "1px solid transparent" }
                }
              >
                <Icon className="h-4 w-4 text-violet-500 shrink-0" />
                <span>{link.label}</span>
              </NavLink>
            );
          })}

          {/* Quick Sub-links: Admit Cards & Results */}
          <div className="ml-2 flex items-center gap-1 border-l border-slate-200 dark:border-slate-800 pl-2">
            {QUICK_LINKS.map((link) => {
              const Icon = link.icon;
              return (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    classNames(
                      "flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-all",
                      isActive ? "bg-slate-100 dark:bg-slate-800 text-violet-600 dark:text-violet-400 font-bold" : inactiveClass,
                    )
                  }
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span>{link.label}</span>
                </NavLink>
              );
            })}
          </div>
        </nav>

        {/* Desktop actions */}
        <div className="hidden items-center gap-2 md:flex">
          <LanguageSwitcher />
          <ThemeToggle />
          {isAuthenticated && (
            <>
              <Link to="/profile" className="btn-secondary flex items-center gap-2 text-sm">
                <span
                  className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
                  style={
                    isTricolor
                      ? { background: "linear-gradient(135deg,#FF9933,#138808)" }
                      : { background: "linear-gradient(135deg,#7c3aed,#00d4ff)" }
                  }
                >
                  {user?.full_name.charAt(0).toUpperCase()}
                </span>
                {user?.full_name.split(" ")[0]}
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="btn-ghost h-9 w-9 p-0"
                aria-label={t("nav.logout")}
              >
                <LogOut className="h-4 w-4" />
              </button>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <div className="flex items-center gap-1 md:hidden">
          <LanguageSwitcher />
          <ThemeToggle />
          <button
            type="button"
            className="btn-ghost h-10 w-10 p-0"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle navigation"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div style={mobileMenuStyle}>
          <div className="container-page flex flex-col gap-1 py-3">
            {/* Primary 3 Pillars */}
            <div className="mb-2 pb-2 border-b border-slate-200 dark:border-slate-800 space-y-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-3">Main Portals</span>
              {PRIMARY_LINKS.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-bold text-slate-800 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    <Icon className="h-4 w-4 text-violet-500" />
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </div>

            {/* Quick Govt Sections */}
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-3">Government Updates</span>
            {QUICK_LINKS.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <Icon className="h-4 w-4 text-slate-500" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
}

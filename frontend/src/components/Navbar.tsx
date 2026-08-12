import {
  FileCheck,
  LayoutDashboard,
  LogOut,
  Menu,
  Star,
  Trophy,
  User as UserIcon,
  X,
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
  const isDark     = theme === "dark";

  const LINKS = [
    { to: "/",                label: t("nav.home") },
    { to: "/jobs",            label: t("nav.latestJobs") },
    { to: "/admit-cards",     label: t("nav.admitCards") },
    { to: "/results",         label: t("nav.results") },
    { to: "/search",          label: t("nav.search") },
    { to: "/resume-builder",  label: "Resume Builder" },
  ];

  function handleLogout(): void {
    logout();
    setOpen(false);
    navigate("/");
  }

  /* ── Navbar background ────────────────────────────────────────────────── */
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

  /* ── Top accent line ──────────────────────────────────────────────────── */
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

  /* ── Active nav link style ────────────────────────────────────────────── */
  function activeStyle(): React.CSSProperties {
    if (isTricolor) return {
      background: "rgba(255,153,51,0.1)",
      border: "1px solid rgba(255,153,51,0.28)",
      color: "#C87000",
    };
    if (isDark) return {
      background: "rgba(124,58,237,0.15)",
      border: "1px solid rgba(124,58,237,0.28)",
      color: "#fff",
    };
    return {
      background: "#f5f3ff",
      border: "1px solid #ddd6fe",
      color: "#6d28d9",
    };
  }

  /* ── Inactive link text ───────────────────────────────────────────────── */
  const inactiveClass = isTricolor
    ? "text-gray-600 hover:text-[#C87000] hover:bg-[rgba(255,153,51,0.07)]"
    : isDark
    ? "text-slate-400 hover:text-slate-200 hover:bg-white/[0.05]"
    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100";

  /* ── Mobile menu bg ───────────────────────────────────────────────────── */
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
      {/* Top accent line */}
      <div
        className="absolute top-0 left-0 right-0 pointer-events-none"
        style={topLineStyle}
      />

      <div className="container-page flex h-16 items-center justify-between gap-4">
        <Logo />

        {/* Desktop nav */}
        <nav className="hidden items-center gap-0.5 md:flex">
          {LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === "/"}
              className={({ isActive }) =>
                classNames(
                  "relative rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200",
                  isActive ? "" : inactiveClass,
                )
              }
              style={({ isActive }) =>
                isActive
                  ? activeStyle()
                  : { border: "1px solid transparent" }
              }
            >
              {link.label}
            </NavLink>
          ))}
          {isAuthenticated && (
            <NavLink
              to="/bookmarks"
              className={({ isActive }) =>
                classNames(
                  "relative rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200",
                  isActive ? "" : inactiveClass,
                )
              }
              style={({ isActive }) =>
                isActive
                  ? activeStyle()
                  : { border: "1px solid transparent" }
              }
            >
              {t("nav.bookmarks")}
            </NavLink>
          )}
          {isAdmin && (
            <NavLink
              to="/admin"
              className={classNames(
                "rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200",
                inactiveClass,
              )}
              style={{ border: "1px solid transparent" }}
            >
              {t("nav.admin")}
            </NavLink>
          )}
        </nav>

        {/* Desktop actions — only shown when authenticated */}
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
          <div className="container-page flex flex-col gap-0.5 py-3">
            {LINKS.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setOpen(false)}
                className={classNames(
                  "rounded-lg px-3 py-2.5 text-sm font-medium transition",
                  isTricolor
                    ? "text-gray-700 hover:bg-[rgba(255,153,51,0.08)] hover:text-[#C87000]"
                    : isDark
                    ? "text-slate-300 hover:bg-white/[0.05] hover:text-white"
                    : "text-slate-700 hover:bg-slate-100 hover:text-slate-900",
                )}
              >
                {link.to === "/admit-cards" && (
                  <FileCheck className="mr-2 inline h-4 w-4 text-blue-500" />
                )}
                {link.to === "/results" && (
                  <Trophy className="mr-2 inline h-4 w-4 text-emerald-500" />
                )}
                {link.label}
              </Link>
            ))}
            {isAuthenticated && (
              <>
                <Link
                  to="/bookmarks"
                  onClick={() => setOpen(false)}
                  className={classNames(
                    "rounded-lg px-3 py-2.5 text-sm font-medium transition",
                    isTricolor
                      ? "text-gray-700 hover:bg-[rgba(255,153,51,0.08)]"
                      : isDark
                      ? "text-slate-300 hover:bg-white/[0.05]"
                      : "text-slate-700 hover:bg-slate-100",
                  )}
                >
                  <Star className="mr-2 inline h-4 w-4 text-yellow-500" />
                  {t("nav.bookmarks")}
                </Link>
                <Link
                  to="/profile"
                  onClick={() => setOpen(false)}
                  className={classNames(
                    "rounded-lg px-3 py-2.5 text-sm font-medium transition",
                    isTricolor
                      ? "text-gray-700 hover:bg-[rgba(255,153,51,0.08)]"
                      : isDark
                      ? "text-slate-300 hover:bg-white/[0.05]"
                      : "text-slate-700 hover:bg-slate-100",
                  )}
                >
                  <UserIcon className="mr-2 inline h-4 w-4" />
                  {t("nav.profile")}
                </Link>
                {isAdmin && (
                  <Link
                    to="/admin"
                    onClick={() => setOpen(false)}
                    className={classNames(
                      "rounded-lg px-3 py-2.5 text-sm font-medium transition",
                      isTricolor
                        ? "text-gray-700 hover:bg-[rgba(255,153,51,0.08)]"
                        : isDark
                        ? "text-slate-300 hover:bg-white/[0.05]"
                        : "text-slate-700 hover:bg-slate-100",
                    )}
                  >
                    <LayoutDashboard className="mr-2 inline h-4 w-4" />
                    {t("nav.admin")}
                  </Link>
                )}
                <button
                  type="button"
                  onClick={handleLogout}
                  className="rounded-lg px-3 py-2.5 text-left text-sm font-medium text-red-500 transition hover:bg-red-50"
                >
                  <LogOut className="mr-2 inline h-4 w-4" />
                  {t("nav.logout")}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

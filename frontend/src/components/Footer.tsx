import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { Logo } from "@/components/Logo";
import { useTheme } from "@/hooks/useTheme";
import { CATEGORIES } from "@/utils/constants";

export function Footer(): JSX.Element {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const isTricolor = theme === "tricolor";
  const isDark     = theme === "dark";

  const bg = isTricolor
    ? "#fffdf8"
    : isDark
    ? "rgba(2,3,8,0.98)"
    : "#ffffff";

  const borderTop = isTricolor
    ? "1px solid rgba(255,153,51,0.2)"
    : isDark
    ? "1px solid rgba(99,102,241,0.15)"
    : "1px solid #e2e8f0";

  const textMuted = isTricolor ? "#8B6914" : isDark ? "#475569" : "#64748b";

  /* Section header accent colors */
  const sections = [
    {
      key: "browse",
      label: t("footer.browse"),
      color: isTricolor ? "#C87000" : isDark ? "#a78bfa" : "#7c3aed",
      bullet: isTricolor ? "rgba(255,153,51,0.6)" : isDark ? "rgba(167,139,250,0.5)" : "rgba(124,58,237,0.4)",
      links: [
        { to: "/jobs",   label: t("footer.latestJobs") },
        { to: "/search", label: t("footer.advancedSearch") },
        { to: "/avoice", label: "AuraVoice AI Studio" },
        { to: "/amobile", label: "aMobile PC Bridge" },
        { to: "/translify", label: "Translify Extension" },
      ],
    },
    {
      key: "categories",
      label: t("footer.categories"),
      color: isTricolor ? "#0D6006" : isDark ? "#00d4ff" : "#0369a1",
      bullet: isTricolor ? "rgba(19,136,8,0.6)" : isDark ? "rgba(0,212,255,0.4)" : "rgba(3,105,161,0.4)",
      links: CATEGORIES.slice(0, 6).map((c) => ({
        to: `/search?category=${encodeURIComponent(c)}`,
        label: c,
      })),
    },
  ];

  return (
    <footer
      className="relative mt-20 overflow-hidden"
      style={{ background: bg, borderTop }}
    >
      {/* Tricolor top bar / Dark glow line / Light nothing */}
      <div
        className="absolute top-0 left-0 right-0 pointer-events-none"
        style={
          isTricolor
            ? {
                height: 3,
                background:
                  "linear-gradient(to right, #FF9933 33.33%, #ffffff 33.33% 66.66%, #138808 66.66%)",
              }
            : isDark
            ? {
                height: 1,
                background:
                  "linear-gradient(90deg, transparent, rgba(124,58,237,0.5), rgba(0,212,255,0.3), transparent)",
              }
            : { display: "none" }
        }
      />

      {/* Tricolor decorative orbs */}
      {isTricolor && (
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div
            className="absolute rounded-full"
            style={{
              width: 400,
              height: 400,
              left: "-8%",
              bottom: "-30%",
              background: "radial-gradient(circle, rgba(255,153,51,0.07) 0%, transparent 65%)",
              filter: "blur(40px)",
            }}
          />
          <div
            className="absolute rounded-full"
            style={{
              width: 300,
              height: 300,
              right: "5%",
              top: "-20%",
              background: "radial-gradient(circle, rgba(19,136,8,0.07) 0%, transparent 65%)",
              filter: "blur(40px)",
            }}
          />
        </div>
      )}

      {/* Dark ambient orbs */}
      {isDark && (
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div
            className="absolute rounded-full"
            style={{
              width: 400,
              height: 400,
              left: "-10%",
              bottom: "-40%",
              background: "radial-gradient(circle, rgba(124,58,237,0.07) 0%, transparent 70%)",
              filter: "blur(40px)",
            }}
          />
        </div>
      )}

      <div className="container-page relative grid gap-10 py-14 md:grid-cols-4">
        {/* Brand */}
        <div className="md:col-span-1">
          <Logo />
          <p className="mt-4 text-sm leading-relaxed" style={{ color: textMuted }}>
            {t("footer.tagline")}
          </p>

          {/* Live indicator */}
          <div className="mt-5 flex items-center gap-2">
            <span
              className="flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium"
              style={{
                background: isTricolor
                  ? "rgba(19,136,8,0.1)"
                  : isDark
                  ? "rgba(16,185,129,0.1)"
                  : "#f0fdf4",
                border: isTricolor
                  ? "1px solid rgba(19,136,8,0.25)"
                  : isDark
                  ? "1px solid rgba(16,185,129,0.25)"
                  : "1px solid #bbf7d0",
                color: isTricolor ? "#0D6006" : isDark ? "#34d399" : "#166534",
              }}
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-60"
                  style={{ background: isTricolor ? "#138808" : "#34d399" }} />
                <span className="relative inline-flex h-2 w-2 rounded-full"
                  style={{ background: isTricolor ? "#138808" : "#34d399" }} />
              </span>
              Live Updates
            </span>
          </div>

          {/* Tricolor accent bar */}
          {isTricolor && (
            <div className="mt-4 h-1 w-16 overflow-hidden rounded-full">
              <div
                className="h-full w-full"
                style={{
                  background: "linear-gradient(to right, #FF9933 33.33%, #fff 33.33% 66.66%, #138808 66.66%)",
                }}
              />
            </div>
          )}
        </div>

        {/* Browse + Categories */}
        {sections.map((sec) => (
          <div key={sec.key}>
            <h3
              className="mb-4 text-xs font-semibold uppercase tracking-widest"
              style={{ color: sec.color }}
            >
              {sec.label}
            </h3>
            <ul className="space-y-2.5 text-sm" style={{ color: textMuted }}>
              {sec.links.map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className="group flex items-center gap-2 transition-colors duration-150"
                    style={{ color: textMuted }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLAnchorElement).style.color = sec.color;
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLAnchorElement).style.color = textMuted;
                    }}
                  >
                    <span
                      className="h-px w-3 shrink-0 transition-all duration-200 group-hover:w-5"
                      style={{ background: sec.bullet }}
                    />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

        {/* Disclaimer */}
        <div>
          <h3
            className="mb-4 text-xs font-semibold uppercase tracking-widest"
            style={{ color: isTricolor ? "#8B2020" : isDark ? "#fb923c" : "#92400e" }}
          >
            {t("footer.disclaimer")}
          </h3>
          <p className="text-sm leading-relaxed" style={{ color: textMuted }}>
            {t("footer.disclaimerText")}
          </p>
        </div>
      </div>

      {/* Bottom bar */}
      <div
        style={{
          borderTop: isTricolor
            ? "1px solid rgba(255,153,51,0.12)"
            : isDark
            ? "1px solid rgba(99,102,241,0.1)"
            : "1px solid #f1f5f9",
        }}
      >
        <div className="container-page flex flex-col items-center justify-between gap-3 py-5 sm:flex-row">
          <p className="text-xs" style={{ color: textMuted }}>
            © {new Date().getFullYear()}{" "}
            {isTricolor ? (
              <span
                className="font-semibold bg-clip-text text-transparent"
                style={{ backgroundImage: "linear-gradient(135deg, #FF9933, #138808)" }}
              >
                DeshKiSeva
              </span>
            ) : isDark ? (
              <span
                className="font-medium bg-clip-text text-transparent"
                style={{ backgroundImage: "linear-gradient(135deg, #a78bfa, #00d4ff)" }}
              >
                DeshKiSeva
              </span>
            ) : (
              <span className="font-medium text-brand-600">DeshKiSeva</span>
            )}
            . {t("footer.rights")}
          </p>

          <p className="flex items-center gap-1.5 text-xs" style={{ color: textMuted }}>
            {isTricolor ? "🇮🇳 Made for India" : "⚡ Powered by AI scrapers"}
          </p>
        </div>
      </div>
    </footer>
  );
}

import { Outlet } from "react-router-dom";

import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { TranslationLoader } from "@/components/TranslationLoader";
import { useTheme } from "@/hooks/useTheme";
import { useJobQueryInvalidatorOnLangChange } from "@/hooks/useJobs";

export function MainLayout(): JSX.Element {
  useJobQueryInvalidatorOnLangChange();
  const { theme } = useTheme();
  const isTricolor = theme === "tricolor";
  const isDark     = theme === "dark";

  return (
    <div className="relative flex min-h-screen flex-col">

      {/* ── Tricolor ambient background ───────────────────────────────────── */}
      {isTricolor && (
        <div className="pointer-events-none fixed inset-0 z-0" aria-hidden="true">
          {/* Soft saffron wash — top-left */}
          <div
            className="absolute"
            style={{
              top: 0,
              left: 0,
              width: "55%",
              height: "45%",
              background:
                "radial-gradient(ellipse at 20% 10%, rgba(255,153,51,0.1) 0%, transparent 65%)",
              filter: "blur(40px)",
            }}
          />
          {/* Soft green wash — bottom-right */}
          <div
            className="absolute"
            style={{
              bottom: 0,
              right: 0,
              width: "50%",
              height: "45%",
              background:
                "radial-gradient(ellipse at 80% 90%, rgba(19,136,8,0.09) 0%, transparent 65%)",
              filter: "blur(40px)",
            }}
          />
          {/* Very faint navy center tint */}
          <div
            className="absolute"
            style={{
              top: "30%",
              left: "30%",
              width: "40%",
              height: "40%",
              background:
                "radial-gradient(ellipse, rgba(0,0,128,0.04) 0%, transparent 70%)",
              filter: "blur(60px)",
            }}
          />
        </div>
      )}

      {/* ── Dark ambient mesh + glow orbs ─────────────────────────────────── */}
      {isDark && (
        <>
          <div
            className="pointer-events-none fixed inset-0 z-0"
            aria-hidden="true"
            style={{
              backgroundImage:
                "linear-gradient(rgba(99,102,241,0.055) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.055) 1px, transparent 1px)",
              backgroundSize: "56px 56px",
              maskImage:
                "radial-gradient(ellipse 90% 70% at 50% 50%, black 30%, transparent 100%)",
              WebkitMaskImage:
                "radial-gradient(ellipse 90% 70% at 50% 50%, black 30%, transparent 100%)",
            }}
          />
          <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
            <div
              className="absolute rounded-full"
              style={{
                width: 700, height: 700,
                top: "-20%", left: "-15%",
                background: "radial-gradient(circle, rgba(124,58,237,0.07) 0%, transparent 65%)",
                animation: "glow-pulse 8s ease-in-out infinite",
              }}
            />
            <div
              className="absolute rounded-full"
              style={{
                width: 500, height: 500,
                top: "-10%", right: "-10%",
                background: "radial-gradient(circle, rgba(0,212,255,0.05) 0%, transparent 65%)",
                animation: "glow-pulse 10s ease-in-out infinite 2s",
              }}
            />
          </div>
        </>
      )}

      <Navbar />
      <TranslationLoader />
      <main className="relative z-10 flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

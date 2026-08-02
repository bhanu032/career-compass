import { Landmark } from "lucide-react";
import { Link } from "react-router-dom";

import { useTheme } from "@/hooks/useTheme";

export function Logo(): JSX.Element {
  const { theme } = useTheme();
  const isTricolor = theme === "tricolor";
  const isDark     = theme === "dark";

  const iconBg = isTricolor
    ? "linear-gradient(135deg, #FF9933 0%, #e07a00 50%, #138808 100%)"
    : isDark
    ? "linear-gradient(135deg, #7c3aed 0%, #4f46e5 50%, #0ea5e9 100%)"
    : "linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)";

  const iconShadow = isTricolor
    ? "0 0 16px rgba(255,153,51,0.4), 0 0 6px rgba(19,136,8,0.2)"
    : isDark
    ? "0 0 20px rgba(124,58,237,0.4), 0 0 8px rgba(14,165,233,0.2)"
    : "0 2px 10px rgba(124,58,237,0.3)";

  const iconBorder = isTricolor
    ? "1px solid rgba(255,153,51,0.35)"
    : isDark
    ? "1px solid rgba(167,139,250,0.3)"
    : "1px solid rgba(124,58,237,0.2)";

  return (
    <Link to="/" className="flex items-center gap-2.5 group">
      <span
        className="grid h-9 w-9 shrink-0 place-items-center rounded-xl transition-all duration-300 group-hover:scale-105"
        style={{ background: iconBg, boxShadow: iconShadow, border: iconBorder }}
      >
        <Landmark className="h-5 w-5 text-white" />
      </span>

      <span
        className="text-lg font-bold tracking-tight"
        style={{ color: isTricolor ? "#1a1a2e" : isDark ? "#fff" : "#0f172a" }}
      >
        DeshKi
        {isTricolor ? (
          <span
            className="bg-clip-text text-transparent"
            style={{ backgroundImage: "linear-gradient(135deg, #FF9933, #138808)" }}
          >
            Seva
          </span>
        ) : isDark ? (
          <span
            className="bg-clip-text text-transparent"
            style={{ backgroundImage: "linear-gradient(135deg, #a78bfa, #00d4ff)" }}
          >
            Seva
          </span>
        ) : (
          <span className="text-brand-600">Seva</span>
        )}
      </span>
    </Link>
  );
}

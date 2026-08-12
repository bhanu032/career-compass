import { CheckCircle2 } from "lucide-react";
import type { TemplateId } from "@/types/resume";
import { RESUME_TEMPLATES } from "@/types/resume";
import { classNames } from "@/utils/format";
import { useTheme } from "@/hooks/useTheme";

interface Props {
  selected: TemplateId;
  onSelect: (id: TemplateId) => void;
}

// Accent color map for each template preview key
const PREVIEW_COLORS: Record<string, { bg: string; accent: string; side: string }> = {
  blue:   { bg: "#f0f4ff", accent: "#1e3a5f", side: "#dde4f0" },
  purple: { bg: "#faf5ff", accent: "#7c3aed", side: "#ede9fe" },
  teal:   { bg: "#f0fdfa", accent: "#0f766e", side: "#ccfbf1" },
  amber:  { bg: "#fffbeb", accent: "#92400e", side: "#fef3c7" },
  red:    { bg: "#fff1f2", accent: "#b91c1c", side: "#fee2e2" },
  cyan:   { bg: "#ecfeff", accent: "#0891b2", side: "#cffafe" },
  green:  { bg: "#f0fdf4", accent: "#059669", side: "#dcfce7" },
  navy:   { bg: "#eff6ff", accent: "#1d4ed8", side: "#dbeafe" },
};

function MiniPreview({ color, layout }: { color: string; layout: "sidebar" | "single" | "timeline" }) {
  const c = PREVIEW_COLORS[color] ?? PREVIEW_COLORS["blue"];

  if (layout === "single") {
    return (
      <div className="w-full overflow-hidden rounded-lg border" style={{ background: c.bg, aspectRatio: "210/297" }}>
        <div className="px-3 pt-3 text-center">
          <div className="mx-auto h-2.5 w-3/5 rounded-full" style={{ background: c.accent }} />
          <div className="mx-auto mt-1 h-1.5 w-2/5 rounded-full opacity-60" style={{ background: c.accent }} />
          <div className="mx-auto mt-1 h-px w-4/5 opacity-30" style={{ background: c.accent }} />
        </div>
        <div className="mt-3 space-y-1.5 px-3">
          {[0.9, 0.7, 0.85, 0.6, 0.75, 0.8].map((w, i) => (
            <div key={i} className="h-1 rounded-full" style={{ background: c.accent, opacity: 0.1, width: `${w * 100}%` }} />
          ))}
        </div>
        <div className="mt-3 px-3">
          <div className="h-1.5 w-1/3 rounded-full" style={{ background: c.accent, opacity: 0.5 }} />
          <div className="mt-2 space-y-1">
            {[0.85, 0.65, 0.75, 0.7].map((w, i) => (
              <div key={i} className="h-1 rounded-full" style={{ background: c.accent, opacity: 0.1, width: `${w * 100}%` }} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (layout === "timeline") {
    return (
      <div className="w-full overflow-hidden rounded-lg border" style={{ background: c.bg, aspectRatio: "210/297" }}>
        <div className="px-3 pt-3">
          <div className="h-3 w-full rounded" style={{ background: c.accent }} />
          <div className="mt-1 h-1.5 w-3/4 rounded opacity-60" style={{ background: "#fff" }} />
        </div>
        <div className="mt-3 flex gap-1 px-3">
          <div className="flex flex-col items-center" style={{ width: 8 }}>
            <div className="h-2 w-2 rounded-full" style={{ background: c.accent }} />
            <div className="mt-1 w-px flex-1 opacity-30" style={{ background: c.accent, height: 24 }} />
            <div className="h-2 w-2 rounded-full" style={{ background: c.accent }} />
            <div className="mt-1 w-px flex-1 opacity-30" style={{ background: c.accent, height: 16 }} />
            <div className="h-2 w-2 rounded-full" style={{ background: c.accent }} />
          </div>
          <div className="flex-1 space-y-3 pl-1">
            {[0.8, 0.6, 0.7].map((w, i) => (
              <div key={i}>
                <div className="h-1.5 rounded-full" style={{ background: c.accent, opacity: 0.6, width: `${w * 100}%` }} />
                <div className="mt-1 h-1 rounded-full opacity-20" style={{ background: c.accent, width: "60%" }} />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // sidebar layout (default for most templates)
  return (
    <div className="w-full overflow-hidden rounded-lg border" style={{ background: c.bg, aspectRatio: "210/297", display: "flex" }}>
      {/* Sidebar strip */}
      <div style={{ width: "35%", background: c.side, padding: "8px 6px" }}>
        <div className="h-5 w-5 rounded-full mx-auto" style={{ background: c.accent }} />
        <div className="mt-1.5 mx-auto h-1.5 w-4/5 rounded-full" style={{ background: c.accent, opacity: 0.7 }} />
        <div className="mt-1 mx-auto h-1 w-3/5 rounded-full opacity-50" style={{ background: c.accent }} />
        <div className="mt-3 space-y-1.5">
          {[0.9, 0.7, 0.8, 0.65].map((w, i) => (
            <div key={i}>
              <div className="h-1 rounded-full" style={{ background: c.accent, opacity: 0.3, width: `${w * 100}%` }} />
              <div className="mt-0.5 h-1.5 rounded-full opacity-20" style={{ background: c.accent, width: "95%" }}>
                <div style={{ width: `${w * 80}%`, height: "100%", background: c.accent, borderRadius: 99 }} />
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Main area */}
      <div style={{ flex: 1, padding: "8px 6px" }}>
        <div className="h-2 w-4/5 rounded-full" style={{ background: c.accent }} />
        <div className="mt-1 h-1.5 w-3/5 rounded-full opacity-50" style={{ background: c.accent }} />
        <div className="mt-2 space-y-1">
          {[0.9, 0.7, 0.85, 0.6, 0.75].map((w, i) => (
            <div key={i} className="h-1 rounded-full" style={{ background: c.accent, opacity: 0.1, width: `${w * 100}%` }} />
          ))}
        </div>
        <div className="mt-2">
          <div className="h-1.5 w-1/3 rounded-full opacity-40" style={{ background: c.accent }} />
          <div className="mt-1 space-y-1">
            {[0.85, 0.7].map((w, i) => (
              <div key={i} className="h-1 rounded-full" style={{ background: c.accent, opacity: 0.1, width: `${w * 100}%` }} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const LAYOUT_MAP: Record<TemplateId, "sidebar" | "single" | "timeline"> = {
  classic:   "sidebar",
  modern:    "sidebar",
  minimal:   "single",
  executive: "sidebar",
  sharp:     "sidebar",
  slate:     "sidebar",
  timeline:  "timeline",
  compact:   "single",
};

export function StepTemplate({ selected, onSelect }: Props): JSX.Element {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div>
      <h2 className={classNames("text-xl font-bold", isDark ? "text-white" : "text-slate-900")}>
        Choose a Template
      </h2>
      <p className={classNames("mt-1 text-sm", isDark ? "text-slate-400" : "text-slate-500")}>
        8 professional designs — pick one that fits the job you're applying for
      </p>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {RESUME_TEMPLATES.map((tpl) => {
          const isSelected = selected === tpl.id;
          return (
            <button
              key={tpl.id}
              type="button"
              onClick={() => onSelect(tpl.id)}
              className={classNames(
                "group relative flex flex-col overflow-hidden rounded-xl border-2 p-2.5 text-left transition-all duration-200",
                isSelected
                  ? isDark
                    ? "border-indigo-500 shadow-lg shadow-indigo-900/30"
                    : "border-violet-500 shadow-lg shadow-violet-200/60"
                  : isDark
                  ? "border-slate-700 hover:border-slate-500"
                  : "border-slate-200 hover:border-slate-300 hover:shadow-sm"
              )}
            >
              {isSelected && (
                <div className="absolute right-2 top-2 z-10">
                  <CheckCircle2
                    className={classNames(
                      "h-5 w-5",
                      isDark ? "text-indigo-400" : "text-violet-600"
                    )}
                  />
                </div>
              )}

              <MiniPreview color={tpl.preview} layout={LAYOUT_MAP[tpl.id]} />

              <div className="mt-2.5 px-0.5">
                <p className={classNames(
                  "text-sm font-semibold leading-tight",
                  isDark ? "text-slate-100" : "text-slate-800"
                )}>
                  {tpl.name}
                </p>
                <p className={classNames(
                  "mt-0.5 text-[11px] leading-snug",
                  isDark ? "text-slate-400" : "text-slate-500"
                )}>
                  {tpl.description}
                </p>
              </div>

              {/* Accent dot */}
              <div
                className="absolute bottom-2 right-2.5 h-2 w-2 rounded-full opacity-60"
                style={{ background: tpl.accent }}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}

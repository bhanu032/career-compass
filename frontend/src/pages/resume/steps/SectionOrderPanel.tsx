/**
 * SectionOrderPanel
 *
 * Lets the user reorder resume sections with ↑ ↓ arrow buttons.
 * "Personal Info" (name, contact, header) is always pinned at the top.
 * Works for all templates — single-column templates render sections in
 * exactly this order; two-column templates follow it for the main column.
 */
import { ArrowUp, ArrowDown, Lock } from "lucide-react";
import { useAppDispatch, useAppSelector, selectResume, moveSectionInOrder } from "@/store";
import type { ResumeSectionKey } from "@/types/resume";
import { DEFAULT_SECTION_ORDER } from "@/types/resume";
import { classNames } from "@/utils/format";
import { useTheme } from "@/hooks/useTheme";

const SECTION_LABELS: Record<ResumeSectionKey, string> = {
  summary:      "Summary / Profile",
  experience:   "Experience",
  education:    "Education",
  skills:       "Skills",
  projects:     "Projects",
  certificates: "Certifications",
};

const SECTION_ICONS: Record<ResumeSectionKey, string> = {
  summary:      "📝",
  experience:   "💼",
  education:    "🎓",
  skills:       "⚡",
  projects:     "🚀",
  certificates: "🏅",
};

export function SectionOrderPanel(): JSX.Element {
  const dispatch = useAppDispatch();
  const { customization } = useAppSelector(selectResume);
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // Merge stored order with defaults (handles missing keys from older saved states)
  const stored = customization.sectionOrder ?? [];
  const order: ResumeSectionKey[] = [
    ...stored.filter((k) => DEFAULT_SECTION_ORDER.includes(k)),
    ...DEFAULT_SECTION_ORDER.filter((k) => !stored.includes(k)),
  ];

  const move = (key: ResumeSectionKey, dir: -1 | 1) => {
    dispatch(moveSectionInOrder({ key, direction: dir }));
  };

  const rowBase = classNames(
    "flex items-center gap-3 rounded-lg border px-3 py-2.5 transition-all",
    isDark
      ? "border-slate-700 bg-slate-800/60"
      : "border-slate-200 bg-white"
  );

  const btnBase = classNames(
    "flex h-7 w-7 shrink-0 items-center justify-center rounded-md border transition disabled:opacity-30 disabled:cursor-not-allowed",
    isDark
      ? "border-slate-600 bg-slate-700 hover:bg-slate-600 text-slate-300"
      : "border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-600"
  );

  return (
    <div className="space-y-2">
      {/* Locked: Personal Info */}
      <div
        className={classNames(
          rowBase,
          isDark
            ? "border-indigo-800/50 bg-indigo-950/40"
            : "border-violet-200 bg-violet-50/60"
        )}
      >
        <span className="text-base">👤</span>
        <span
          className={classNames(
            "flex-1 text-sm font-semibold",
            isDark ? "text-indigo-300" : "text-violet-700"
          )}
        >
          Personal Info &amp; Contact
        </span>
        <div
          className={classNames(
            "flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium",
            isDark
              ? "bg-indigo-900/60 text-indigo-400"
              : "bg-violet-100 text-violet-500"
          )}
        >
          <Lock className="h-3 w-3" />
          Pinned
        </div>
      </div>

      {/* Reorderable sections */}
      {order.map((key, idx) => (
        <div key={key} className={rowBase}>
          {/* Drag handle visual */}
          <span
            className={classNames(
              "shrink-0 select-none text-xs",
              isDark ? "text-slate-500" : "text-slate-300"
            )}
            title="Drag to reorder"
          >
            ⠿
          </span>

          <span className="text-base">{SECTION_ICONS[key]}</span>

          <span
            className={classNames(
              "flex-1 text-sm font-medium",
              isDark ? "text-slate-200" : "text-slate-700"
            )}
          >
            {SECTION_LABELS[key]}
          </span>

          {/* Position badge */}
          <span
            className={classNames(
              "shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold tabular-nums",
              isDark
                ? "bg-slate-700 text-slate-400"
                : "bg-slate-100 text-slate-400"
            )}
          >
            {idx + 1}
          </span>

          {/* Up / Down buttons */}
          <div className="flex shrink-0 gap-1">
            <button
              type="button"
              title="Move up"
              disabled={idx === 0}
              onClick={() => move(key, -1)}
              className={btnBase}
            >
              <ArrowUp className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              title="Move down"
              disabled={idx === order.length - 1}
              onClick={() => move(key, 1)}
              className={btnBase}
            >
              <ArrowDown className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      ))}

      <p
        className={classNames(
          "pt-1 text-xs",
          isDark ? "text-slate-500" : "text-slate-400"
        )}
      >
        Reorder reflects instantly in the live preview. Personal info is always pinned to the header.
      </p>
    </div>
  );
}

import { CheckCircle2 } from "lucide-react";
import type { TemplateId } from "@/types/resume";
import { RESUME_TEMPLATES } from "@/types/resume";
import { classNames } from "@/utils/format";
import { useTheme } from "@/hooks/useTheme";
import { TemplatePreviewThumbnail } from "@/pages/resume/TemplatePreviewThumbnail";

interface Props {
  selected: TemplateId;
  onSelect: (id: TemplateId) => void;
  compact?: boolean;
}

export function StepTemplate({ selected, onSelect, compact = false }: Props): JSX.Element {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div>
      {!compact && (
        <>
          <h2 className={classNames("text-xl font-bold", isDark ? "text-white" : "text-slate-900")}>
            Choose a Template
          </h2>
          <p className={classNames("mt-1 text-sm", isDark ? "text-slate-400" : "text-slate-500")}>
            {RESUME_TEMPLATES.length} professional designs — live previews with sample data
          </p>
        </>
      )}

      {compact && (
        <p className={classNames("mb-3 text-xs font-semibold uppercase tracking-wide", isDark ? "text-slate-400" : "text-slate-500")}>
          Switch Template
        </p>
      )}
      <div className={classNames(compact ? "mt-0 grid grid-cols-2 gap-3 sm:grid-cols-3" : "mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4")}>
        {RESUME_TEMPLATES.map((tpl) => {
          const isSelected = selected === tpl.id;

          if (compact) {
            return (
              <button
                key={tpl.id}
                type="button"
                onClick={() => onSelect(tpl.id)}
                className={classNames(
                  "group relative aspect-[3/4] w-full overflow-hidden rounded-xl border-2 text-left transition-all duration-200",
                  isSelected
                    ? isDark
                      ? "border-indigo-500 shadow-lg shadow-indigo-900/30"
                      : "border-violet-500 shadow-lg shadow-violet-200/60"
                    : isDark
                    ? "border-slate-700 hover:border-slate-500"
                    : "border-slate-200 hover:border-slate-300 hover:shadow-sm"
                )}
              >
                {/* Full-bleed thumbnail */}
                <div className="absolute inset-0 overflow-hidden rounded-xl">
                  <TemplatePreviewThumbnail templateId={tpl.id} fill fillMode="cover" />
                </div>

                {/* Selected overlay */}
                {isSelected && (
                  <>
                    <div className="absolute inset-0 bg-violet-500/10" />
                    <div className="absolute right-2 top-2 z-10">
                      <CheckCircle2
                        className={classNames(
                          "h-5 w-5 drop-shadow",
                          isDark ? "text-indigo-400" : "text-violet-600"
                        )}
                      />
                    </div>
                  </>
                )}

                {/* Name label at bottom */}
                <div
                  className={classNames(
                    "absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-2 pb-2 pt-8",
                    "opacity-0 transition-opacity group-hover:opacity-100",
                    isSelected && "opacity-100"
                  )}
                >
                  <p className="text-xs font-semibold text-white">{tpl.name}</p>
                </div>
              </button>
            );
          }

          return (
            <button
              key={tpl.id}
              type="button"
              onClick={() => onSelect(tpl.id)}
              className={classNames(
                "group relative flex flex-col overflow-hidden rounded-xl border-2 p-2 text-left transition-all duration-200",
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

              <div className="relative aspect-[3/4] w-full overflow-hidden rounded-lg bg-white">
                <TemplatePreviewThumbnail templateId={tpl.id} fill />
              </div>

              <div className="mt-2 px-0.5">
                <p className={classNames(
                  "text-sm font-semibold leading-tight",
                  isDark ? "text-slate-100" : "text-slate-800"
                )}>
                  {tpl.name}
                </p>
                <p className={classNames(
                  "mt-0.5 text-[11px] leading-snug line-clamp-2",
                  isDark ? "text-slate-400" : "text-slate-500"
                )}>
                  {tpl.description}
                </p>
              </div>

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

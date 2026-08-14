/**
 * ResumePreviewStep — Beautiful full-width preview with:
 * - Live A4 preview in a "paper" frame with shadow
 * - Template switcher strip at the top
 * - Zoom in / out
 * - Download PDF button
 * - Back to edit
 */
import { useState } from "react";
import { ChevronLeft, Download, ZoomIn, ZoomOut, RotateCcw, Loader2 } from "lucide-react";
import type { ResumeCustomization, ResumeData, TemplateId } from "@/types/resume";
import { RESUME_TEMPLATES } from "@/types/resume";
import { ResumePreview } from "@/pages/resume/ResumePreview";
import { useTheme } from "@/hooks/useTheme";
import { classNames } from "@/utils/format";
import { useResumeDownload } from "@/hooks/useResumeDownload";

interface Props {
  data: ResumeData;
  templateId: TemplateId;
  customization?: ResumeCustomization;
  onTemplateChange: (id: TemplateId) => void;
  onBack: () => void;
}

const ZOOM_LEVELS = [0.5, 0.6, 0.7, 0.8, 0.9, 1.0, 1.1, 1.2];

export function ResumePreviewStep({ data, templateId, customization, onTemplateChange, onBack }: Props): JSX.Element {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const isTricolor = theme === "tricolor";
  const [zoomIdx, setZoomIdx] = useState(4); // default 0.9
  const zoom = ZOOM_LEVELS[zoomIdx];

  const { isDownloading, progress, triggerDownload } = useResumeDownload();

  function handleDownload() {
    void triggerDownload(data, templateId, customization);
  }

  const accentBg = isDark
    ? "bg-[#0d0e1a] border-b border-indigo-900/30"
    : isTricolor
    ? "bg-white border-b border-orange-100"
    : "bg-white border-b border-slate-200";

  const canvasBg = isDark ? "bg-slate-900" : "bg-slate-200";

  return (
    <div className="flex h-[calc(100vh-64px)] flex-col overflow-hidden">
      {/* ── Top toolbar ─────────────────────────────────────────────── */}
      <div className={classNames("flex flex-col gap-3 px-4 py-3 shadow-sm sm:flex-row sm:items-center sm:justify-between", accentBg)}>
        {/* Template switcher */}
        <div className="flex items-center gap-2 overflow-x-auto pb-0.5">
          <span className={classNames("shrink-0 text-xs font-semibold", isDark ? "text-slate-400" : "text-slate-500")}>
            Template:
          </span>
          {RESUME_TEMPLATES.map((tpl) => (
            <button
              key={tpl.id}
              type="button"
              onClick={() => onTemplateChange(tpl.id)}
              className={classNames(
                "shrink-0 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all whitespace-nowrap",
                templateId === tpl.id
                  ? isDark
                    ? "bg-indigo-600 text-white shadow"
                    : isTricolor
                    ? "bg-orange-500 text-white shadow"
                    : "bg-violet-600 text-white shadow"
                  : isDark
                  ? "bg-slate-800 text-slate-300 hover:bg-slate-700"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              )}
              style={templateId === tpl.id ? {} : { borderLeft: `3px solid ${tpl.accent}` }}
            >
              {tpl.name}
            </button>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Zoom */}
          <div className={classNames(
            "flex items-center gap-1 rounded-lg border px-1",
            isDark ? "border-slate-700 bg-slate-800" : "border-slate-200 bg-slate-50"
          )}>
            <button
              type="button"
              disabled={zoomIdx === 0}
              onClick={() => setZoomIdx((i) => Math.max(0, i - 1))}
              className={classNames("p-1.5 rounded transition disabled:opacity-40", isDark ? "hover:bg-slate-700" : "hover:bg-slate-200")}
              title="Zoom out"
            >
              <ZoomOut className="h-3.5 w-3.5" />
            </button>
            <span className={classNames("min-w-[40px] text-center text-xs font-semibold", isDark ? "text-slate-300" : "text-slate-600")}>
              {Math.round(zoom * 100)}%
            </span>
            <button
              type="button"
              disabled={zoomIdx === ZOOM_LEVELS.length - 1}
              onClick={() => setZoomIdx((i) => Math.min(ZOOM_LEVELS.length - 1, i + 1))}
              className={classNames("p-1.5 rounded transition disabled:opacity-40", isDark ? "hover:bg-slate-700" : "hover:bg-slate-200")}
              title="Zoom in"
            >
              <ZoomIn className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setZoomIdx(4)}
              className={classNames("p-1.5 rounded transition", isDark ? "hover:bg-slate-700" : "hover:bg-slate-200")}
              title="Reset zoom"
            >
              <RotateCcw className="h-3.5 w-3.5" />
            </button>
          </div>

          <button
            type="button"
            onClick={onBack}
            className="btn-secondary flex items-center gap-1.5 text-sm py-2"
          >
            <ChevronLeft className="h-4 w-4" />
            Edit
          </button>

          <button
            type="button"
            onClick={handleDownload}
            disabled={isDownloading}
            className="btn-primary flex items-center gap-1.5 text-sm py-2"
          >
            {isDownloading
              ? <Loader2 className="h-4 w-4 animate-spin" />
              : <Download className="h-4 w-4" />
            }
            {isDownloading ? `${progress}%…` : "Download PDF"}
          </button>
        </div>
      </div>

      {/* ── A4 Canvas ───────────────────────────────────────────────── */}
      <div className={classNames("flex flex-1 items-start justify-center overflow-auto py-8 px-4", canvasBg)}>
        <div
          style={{
            transform: `scale(${zoom})`,
            transformOrigin: "top center",
            transition: "transform 0.2s ease",
            // A4 dimensions at 96dpi: 794px × 1123px
            width: 794,
            minHeight: 1123,
            background: "#fff",
            boxShadow: "0 4px 60px rgba(0,0,0,0.25), 0 1px 8px rgba(0,0,0,0.15)",
            borderRadius: 4,
            overflow: "hidden",
            marginBottom: zoom < 1 ? `${(1 - zoom) * -1123 * 0.5}px` : 0,
          }}
        >
          <ResumePreview data={data} templateId={templateId} printMode={false} />
        </div>
      </div>

    </div>
  );
}

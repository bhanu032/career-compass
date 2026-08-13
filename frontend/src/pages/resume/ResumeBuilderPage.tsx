/**
 * Resume Builder — split-pane editor inspired by ig-frontend's ResumeDashboard flow.
 * Left: form steps with collapsible sections
 * Right: live A4 preview with template switcher
 */
import { useState, useRef, useCallback } from "react";
import {
  CheckCircle2, ChevronDown, ChevronLeft, ChevronRight,
  Download, Eye, FileText, Palette, Sparkles, X, ZoomIn, ZoomOut,
} from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import { classNames } from "@/utils/format";
import type { ResumeData, TemplateId } from "@/types/resume";
import { EMPTY_RESUME, RESUME_TEMPLATES } from "@/types/resume";
import { StepPersonal }   from "@/pages/resume/steps/StepPersonal";
import { StepExperience } from "@/pages/resume/steps/StepExperience";
import { StepEducation }  from "@/pages/resume/steps/StepEducation";
import { StepSkills }     from "@/pages/resume/steps/StepSkills";
import { StepExtras }     from "@/pages/resume/steps/StepExtras";
import { StepTemplate }   from "@/pages/resume/steps/StepTemplate";
import { StepATS }        from "@/pages/resume/steps/StepATS";
import { ResumeEntryPage } from "@/pages/resume/ResumeEntryPage";
import { ResumePreview }  from "@/pages/resume/ResumePreview";

// ── Wizard steps ──────────────────────────────────────────────────────────────
const STEPS = [
  { id: 0, label: "Template",   short: "Tmpl"  },
  { id: 1, label: "Personal",   short: "Info"  },
  { id: 2, label: "Experience", short: "Exp"   },
  { id: 3, label: "Education",  short: "Edu"   },
  { id: 4, label: "Skills",     short: "Skills"},
  { id: 5, label: "Extras",     short: "Extra" },
  { id: 6, label: "ATS Score",  short: "ATS"   },
];

const ZOOM_STEPS = [0.45, 0.55, 0.65, 0.75, 0.85, 0.95];

export function ResumeBuilderPage(): JSX.Element {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const isTricolor = theme === "tricolor";

  const [mode, setMode] = useState<"entry" | "builder">("entry");
  const [step, setStep] = useState(0);
  const [templateId, setTemplateId] = useState<TemplateId>("classic");
  const [data, setData] = useState<ResumeData>(EMPTY_RESUME);
  const [zoomIdx, setZoomIdx] = useState(2);          // default 65%
  const [showPreviewMobile, setShowPreviewMobile] = useState(false);
  const [showTemplatePicker, setShowTemplatePicker] = useState(false);

  const zoom = ZOOM_STEPS[zoomIdx];

  function update(partial: Partial<ResumeData>) {
    setData((prev) => ({ ...prev, ...partial }));
  }
  function next() { setStep((s) => Math.min(s + 1, STEPS.length - 1)); }
  function prev() { setStep((s) => Math.max(s - 1, 0)); }

  function handleBuildNew() {
    setData(EMPTY_RESUME);
    setStep(0);
    setMode("builder");
  }
  function handleUpload(parsed: ResumeData) {
    setData(parsed);
    setStep(1);
    setMode("builder");
  }

  function handlePrint() {
    window.print();
  }

  // ── Entry screen ─────────────────────────────────────────────────────────
  if (mode === "entry") {
    return <ResumeEntryPage onBuildNew={handleBuildNew} onUpload={handleUpload} />;
  }

  // ── Theme tokens ──────────────────────────────────────────────────────────
  const pageBg = isDark ? "bg-[#020308]" : isTricolor ? "bg-[#FFFDF5]" : "bg-slate-100";
  const sidebarBg = isDark ? "bg-[#0d0e1a] border-r border-indigo-900/30" : isTricolor ? "bg-white border-r border-orange-100" : "bg-white border-r border-slate-200";
  const previewBg = isDark ? "bg-slate-900" : "bg-slate-300";
  const headerBg = isDark ? "bg-[#0a0b15] border-b border-indigo-900/30" : isTricolor ? "bg-white border-b border-orange-100" : "bg-white border-b border-slate-200";

  const stepActive = isDark ? "bg-indigo-600 text-white" : isTricolor ? "bg-orange-500 text-white" : "bg-violet-600 text-white";
  const stepDone  = isDark ? "bg-indigo-900/60 text-indigo-300" : isTricolor ? "bg-green-100 text-green-700" : "bg-violet-100 text-violet-700";
  const stepIdle  = isDark ? "bg-slate-800 text-slate-400" : isTricolor ? "bg-gray-100 text-gray-400" : "bg-slate-100 text-slate-400";

  const accentBtn = isDark ? "bg-indigo-600 hover:bg-indigo-500 text-white" : isTricolor ? "bg-orange-500 hover:bg-orange-600 text-white" : "bg-violet-600 hover:bg-violet-700 text-white";

  return (
    <div className={classNames("flex h-[calc(100vh-64px)] flex-col overflow-hidden", pageBg)}>

      {/* ── Top toolbar ────────────────────────────────────────────────── */}
      <div className={classNames("flex h-12 items-center justify-between gap-3 px-4 shadow-sm shrink-0", headerBg)}>
        {/* Left: back + steps */}
        <div className="flex items-center gap-2 overflow-x-auto">
          <button
            type="button"
            onClick={() => setMode("entry")}
            className={classNames("flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition", isDark ? "hover:bg-white/10 text-slate-400" : "hover:bg-slate-100 text-slate-500")}
            title="Back to start"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          <div className="flex items-center gap-1">
            {STEPS.map((s, i) => (
              <div key={s.id} className="flex items-center gap-0.5">
                <button
                  type="button"
                  onClick={() => setStep(s.id)}
                  className={classNames(
                    "flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold whitespace-nowrap transition-all",
                    step === s.id ? stepActive : step > s.id ? stepDone : stepIdle
                  )}
                >
                  {step > s.id
                    ? <CheckCircle2 className="h-3 w-3 shrink-0" />
                    : <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-black/10 text-[9px] font-bold">{s.id + 1}</span>
                  }
                  <span className="hidden sm:inline">{s.label}</span>
                  <span className="sm:hidden">{s.short}</span>
                </button>
                {i < STEPS.length - 1 && (
                  <div className={classNames("h-px w-2 shrink-0", isDark ? "bg-slate-700" : "bg-slate-200")} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right: template + zoom + actions */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Template switcher */}
          <button
            type="button"
            onClick={() => setShowTemplatePicker(true)}
            className={classNames(
              "hidden sm:flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-semibold transition",
              isDark ? "border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700" : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
            )}
          >
            <Palette className="h-3.5 w-3.5" />
            <span>{RESUME_TEMPLATES.find((t) => t.id === templateId)?.name ?? "Template"}</span>
          </button>

          {/* Zoom */}
          <div className={classNames(
            "hidden sm:flex items-center gap-0.5 rounded-lg border px-1",
            isDark ? "border-slate-700 bg-slate-800" : "border-slate-200 bg-slate-50"
          )}>
            <button type="button" disabled={zoomIdx === 0} onClick={() => setZoomIdx((i) => Math.max(0, i - 1))}
              className={classNames("p-1 rounded transition disabled:opacity-40", isDark ? "hover:bg-slate-700 text-slate-300" : "hover:bg-slate-200 text-slate-600")}>
              <ZoomOut className="h-3.5 w-3.5" />
            </button>
            <span className={classNames("w-9 text-center text-[11px] font-semibold tabular-nums", isDark ? "text-slate-300" : "text-slate-600")}>
              {Math.round(zoom * 100)}%
            </span>
            <button type="button" disabled={zoomIdx === ZOOM_STEPS.length - 1} onClick={() => setZoomIdx((i) => Math.min(ZOOM_STEPS.length - 1, i + 1))}
              className={classNames("p-1 rounded transition disabled:opacity-40", isDark ? "hover:bg-slate-700 text-slate-300" : "hover:bg-slate-200 text-slate-600")}>
              <ZoomIn className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Mobile preview toggle */}
          <button
            type="button"
            onClick={() => setShowPreviewMobile(true)}
            className={classNames("flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition lg:hidden", accentBtn)}
          >
            <Eye className="h-3.5 w-3.5" />
            Preview
          </button>

          {/* Download */}
          <button
            type="button"
            onClick={handlePrint}
            className={classNames("flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition", accentBtn)}
          >
            <Download className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Download PDF</span>
          </button>
        </div>
      </div>

      {/* ── Body: form + preview ────────────────────────────────────────── */}
      <div className="flex flex-1 overflow-hidden">

        {/* ── Left: form ───────────────────────────────────────────────── */}
        <div className={classNames("flex w-full flex-col overflow-hidden lg:w-[440px] xl:w-[480px] shrink-0", sidebarBg)}>
          {/* Scrollable form area */}
          <div className="flex-1 overflow-y-auto p-5">
            {step === 0 && <StepTemplate selected={templateId} onSelect={setTemplateId} />}
            {step === 1 && <StepPersonal data={data.personal} onChange={(p) => update({ personal: p })} />}
            {step === 2 && <StepExperience data={data.experience} onChange={(e) => update({ experience: e })} />}
            {step === 3 && <StepEducation data={data.education} onChange={(e) => update({ education: e })} />}
            {step === 4 && <StepSkills data={data.skills} onChange={(s) => update({ skills: s })} />}
            {step === 5 && (
              <StepExtras
                projects={data.projects}
                certificates={data.certificates}
                onProjectsChange={(p) => update({ projects: p })}
                onCertificatesChange={(c) => update({ certificates: c })}
              />
            )}
            {step === 6 && <StepATS data={data} onApply={(updated) => setData(updated)} />}
          </div>

          {/* Navigation bar */}
          <div className={classNames(
            "flex items-center justify-between gap-3 border-t px-5 py-3 shrink-0",
            isDark ? "border-indigo-900/30 bg-[#0a0b15]" : isTricolor ? "border-orange-100 bg-white" : "border-slate-200 bg-white"
          )}>
            <button
              type="button"
              onClick={prev}
              disabled={step === 0}
              className="btn-secondary flex items-center gap-1.5 py-2 text-sm disabled:opacity-40"
            >
              <ChevronLeft className="h-4 w-4" />
              Back
            </button>
            <span className={classNames("text-xs", isDark ? "text-slate-500" : "text-slate-400")}>
              {step + 1} / {STEPS.length}
            </span>
            {step < STEPS.length - 1 ? (
              <button type="button" onClick={next} className="btn-primary flex items-center gap-1.5 py-2 text-sm">
                Next
                <ChevronRight className="h-4 w-4" />
              </button>
            ) : (
              <button type="button" onClick={handlePrint} className="btn-primary flex items-center gap-1.5 py-2 text-sm">
                <Download className="h-4 w-4" />
                Download
              </button>
            )}
          </div>
        </div>

        {/* ── Right: live preview ───────────────────────────────────────── */}
        <div className={classNames("hidden flex-1 flex-col overflow-hidden lg:flex", previewBg)}>
          {/* Preview toolbar */}
          <div className={classNames(
            "flex h-10 items-center justify-between gap-3 px-4 shrink-0 border-b",
            isDark ? "bg-slate-800 border-slate-700" : isTricolor ? "bg-slate-200 border-slate-300" : "bg-slate-200 border-slate-300"
          )}>
            <span className={classNames("text-xs font-semibold", isDark ? "text-slate-400" : "text-slate-500")}>
              Live Preview
            </span>
            <div className="flex flex-wrap items-center gap-1">
              {RESUME_TEMPLATES.map((tpl) => (
                <button
                  key={tpl.id}
                  type="button"
                  onClick={() => setTemplateId(tpl.id)}
                  className={classNames(
                    "rounded-full px-2.5 py-0.5 text-[11px] font-semibold transition whitespace-nowrap",
                    templateId === tpl.id
                      ? isDark ? "bg-indigo-600 text-white" : isTricolor ? "bg-orange-500 text-white" : "bg-violet-600 text-white"
                      : isDark ? "bg-slate-700 text-slate-300 hover:bg-slate-600" : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-300"
                  )}
                  style={templateId !== tpl.id ? { borderLeftColor: tpl.accent, borderLeftWidth: 2 } : {}}
                >
                  {tpl.name}
                </button>
              ))}
            </div>
          </div>

          {/* A4 paper */}
          <div className="flex flex-1 items-start justify-center overflow-auto py-6 px-4">
            <div
              style={{
                transform: `scale(${zoom})`,
                transformOrigin: "top center",
                transition: "transform 0.2s ease",
                width: 794,
                minHeight: 1123,
                background: "#fff",
                boxShadow: "0 4px 60px rgba(0,0,0,0.3), 0 1px 8px rgba(0,0,0,0.2)",
                borderRadius: 3,
                overflow: "hidden",
                // Compensate for scale so container doesn't leave huge gap
                marginBottom: zoom < 0.8 ? `${(zoom - 1) * 1123 * 0.5}px` : 0,
              }}
            >
              <ResumePreview data={data} templateId={templateId} printMode={false} />
            </div>
          </div>
        </div>
      </div>

      {/* ── Mobile preview overlay ──────────────────────────────────────── */}
      {showPreviewMobile && (
        <div className="fixed inset-0 z-50 flex flex-col bg-black/80 lg:hidden">
          {/* Toolbar */}
          <div className="flex h-12 items-center justify-between gap-3 bg-slate-900 px-4">
            <div className="flex gap-1 overflow-x-auto">
              {RESUME_TEMPLATES.map((tpl) => (
                <button
                  key={tpl.id}
                  type="button"
                  onClick={() => setTemplateId(tpl.id)}
                  className={classNames(
                    "rounded-full px-2.5 py-1 text-xs font-semibold whitespace-nowrap transition",
                    templateId === tpl.id ? "bg-violet-600 text-white" : "bg-white/10 text-white hover:bg-white/20"
                  )}
                >
                  {tpl.name}
                </button>
              ))}
            </div>
            <button type="button" onClick={() => setShowPreviewMobile(false)}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20">
              <X className="h-4 w-4" />
            </button>
          </div>
          {/* Paper */}
          <div className="flex flex-1 items-start justify-center overflow-auto py-4 px-2">
            <div style={{ transform: "scale(0.42)", transformOrigin: "top center", width: 794, minHeight: 1123, background: "#fff", boxShadow: "0 4px 40px rgba(0,0,0,0.4)", borderRadius: 3, overflow: "hidden", marginBottom: "-650px" }}>
              <ResumePreview data={data} templateId={templateId} printMode={false} />
            </div>
          </div>
          {/* Download */}
          <div className="flex gap-3 bg-slate-900 p-4">
            <button type="button" onClick={handlePrint} className="btn-primary flex flex-1 items-center justify-center gap-2">
              <Download className="h-4 w-4" />
              Download PDF
            </button>
          </div>
        </div>
      )}

      {/* ── Template picker modal ────────────────────────────────────────── */}
      {showTemplatePicker && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
          onClick={() => setShowTemplatePicker(false)}
        >
          <div
            className={classNames("w-full max-w-3xl rounded-2xl p-6 shadow-2xl", isDark ? "bg-[#0d0e1a] border border-indigo-900/40" : "bg-white")}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className={classNames("text-lg font-bold", isDark ? "text-white" : "text-slate-900")}>Choose Template</h2>
              <button type="button" onClick={() => setShowTemplatePicker(false)} className={classNames("rounded-lg p-2 transition", isDark ? "hover:bg-white/10 text-slate-400" : "hover:bg-slate-100 text-slate-500")}>
                <X className="h-4 w-4" />
              </button>
            </div>
            <StepTemplate selected={templateId} onSelect={(id) => { setTemplateId(id); setShowTemplatePicker(false); }} />
          </div>
        </div>
      )}

      {/* Print styles — hide everything except resume */}
      <style>{`
        @media print {
          body > *:not(#resume-print-root) { display: none !important; }
          #resume-print-root { display: block !important; position: fixed; inset: 0; z-index: 9999; }
          @page { size: A4; margin: 0; }
        }
      `}</style>
    </div>
  );
}

/**
 * Resume Builder — split-pane editor.
 * Left: form steps  |  Right: live A4 preview
 *
 * All persistent state (data, templateId, customization, step) lives in Redux.
 * localStorage persistence is handled automatically by the store subscriber.
 */
import { useRef, useCallback, useEffect } from "react";
import {
  CheckCircle2, ChevronLeft, ChevronRight,
  Download, Eye, FileText, Palette, Plus, Sparkles, Trash2, X, ZoomIn, ZoomOut,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTheme } from "@/hooks/useTheme";
import { classNames } from "@/utils/format";
import { useState } from "react";
import type { ResumeData, TemplateId } from "@/types/resume";
import { EMPTY_RESUME, RESUME_TEMPLATES, SAMPLE_RESUME } from "@/types/resume";
import { StepPersonal }   from "@/pages/resume/steps/StepPersonal";
import { StepExperience } from "@/pages/resume/steps/StepExperience";
import { StepEducation }  from "@/pages/resume/steps/StepEducation";
import { StepSkills }     from "@/pages/resume/steps/StepSkills";
import { StepExtras }     from "@/pages/resume/steps/StepExtras";
import { StepCustomize }  from "@/pages/resume/steps/StepCustomize";
import { StepATS }        from "@/pages/resume/steps/StepATS";
import { ResumePreview }  from "@/pages/resume/ResumePreview";
import { customizationForTemplate, withTemplateAccent } from "@/pages/resume/resumeTemplateUtils";
import { nanoid } from "@/utils/nanoid";
import { formatResumeData } from "@/utils/resumeParser";

// Redux
import {
  useAppDispatch,
  useAppSelector,
  setResumeData,
  updateResumeData,
  setTemplateId as setTemplateIdAction,
  setCustomization as setCustomizationAction,
  setStep as setStepAction,
  nextStep,
  prevStep,
  selectResume,
} from "@/store";

// ── Wizard steps ──────────────────────────────────────────────────────────────

const STEPS = [
  { id: 0, label: "Customize",  short: "Style" },
  { id: 1, label: "Personal",   short: "Info"  },
  { id: 2, label: "Experience", short: "Exp"   },
  { id: 3, label: "Education",  short: "Edu"   },
  { id: 4, label: "Skills",     short: "Skills"},
  { id: 5, label: "Extras",     short: "Extra" },
  { id: 6, label: "ATS Score",  short: "ATS"   },
];

const ZOOM_STEPS = [0.45, 0.55, 0.65, 0.75, 0.85, 0.95];

interface EditorLocationState {
  data?: ResumeData;
  templateId?: TemplateId;
  customization?: ReturnType<typeof customizationForTemplate>;
  /** When true the editor was reached from an uploaded-file flow */
  fromUpload?: boolean;
}

export function ResumeEditorPage(): JSX.Element {
  const navigate   = useNavigate();
  const location   = useLocation();
  const dispatch   = useAppDispatch();
  const resume     = useAppSelector(selectResume);
  const { theme }  = useTheme();

  const isDark     = theme === "dark";
  const isTricolor = theme === "tricolor";

  // Seed Redux from navigation state if the user arrived via template-picker
  // or upload flow (location.state wins over stored Redux state).
  const locationState = (location.state as EditorLocationState | null) ?? {};
  const seededRef = useRef(false);

  useEffect(() => {
    if (seededRef.current) return;
    seededRef.current = true;

    if (locationState.data)          dispatch(setResumeData(locationState.data));
    if (locationState.templateId)    dispatch(setTemplateIdAction(locationState.templateId));
    if (locationState.customization) dispatch(setCustomizationAction(locationState.customization));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Aliases for brevity
  const data          = resume.data;
  const templateId    = resume.templateId;
  const customization = resume.customization;
  const step          = resume.step;

  // Local UI-only state (no need in Redux)
  const [zoomIdx, setZoomIdx]                   = useState(1);
  const [showPreviewMobile, setShowPreviewMobile] = useState(false);
  const [showTemplatePicker, setShowTemplatePicker] = useState(false);
  const [isDownloading, setIsDownloading]       = useState(false);

  const zoom             = ZOOM_STEPS[zoomIdx];
  const paperWidth       = 794;
  const paperHeight      = 1123;
  const scaledPaperWidth  = Math.round(paperWidth  * zoom);
  const scaledPaperHeight = Math.round(paperHeight * zoom);

  // ── Dispatch helpers ────────────────────────────────────────────────────────

  function update(partial: Partial<ResumeData>) {
    dispatch(updateResumeData(partial));
  }

  const changeTemplate = useCallback((id: TemplateId) => {
    dispatch(setTemplateIdAction(id));
    dispatch(setCustomizationAction(withTemplateAccent(customization, id)));
  }, [customization, dispatch]);

  // ── Section toolbar actions ──────────────────────────────────────────────────

  function addCurrentSectionItem() {
    if (step === 2) update({ experience: [...data.experience, { id: nanoid(), company: "", position: "", startDate: "", endDate: "", current: false, description: "" }] });
    if (step === 3) update({ education:  [...data.education,  { id: nanoid(), institution: "", degree: "", field: "", startDate: "", endDate: "", grade: "" }] });
    if (step === 4) update({ skills:     [...data.skills,     { id: nanoid(), name: "", level: "Intermediate" }] });
    if (step === 5) update({ projects:   [...data.projects,   { id: nanoid(), name: "", description: "", link: "", technologies: "" }] });
  }

  function clearCurrentSection() {
    if (step === 1) update({ personal:      EMPTY_RESUME.personal });
    if (step === 2) update({ experience:    [] });
    if (step === 3) update({ education:     [] });
    if (step === 4) update({ skills:        [] });
    if (step === 5) update({ projects: [], certificates: [] });
  }

  function useSampleForCurrentSection() {
    if (step === 1) update({ personal:      SAMPLE_RESUME.personal });
    if (step === 2) update({ experience:    SAMPLE_RESUME.experience });
    if (step === 3) update({ education:     SAMPLE_RESUME.education });
    if (step === 4) update({ skills:        SAMPLE_RESUME.skills });
    if (step === 5) update({ projects: SAMPLE_RESUME.projects, certificates: SAMPLE_RESUME.certificates });
  }

  function formatCurrentSection() {
    const formatted = formatResumeData(data);
    if (step === 1) update({ personal:      formatted.personal });
    if (step === 2) update({ experience:    formatted.experience });
    if (step === 3) update({ education:     formatted.education });
    if (step === 4) update({ skills:        formatted.skills });
    if (step === 5) update({ projects: formatted.projects, certificates: formatted.certificates });
  }

  // ── Navigation ───────────────────────────────────────────────────────────────

  function handleBack() {
    navigate("/resume-builder/templates", {
      state: { data, fromUpload: resume.fromUpload },
    });
  }

  function handleDownloadPdf() {
    if (isDownloading) return;
    setIsDownloading(true);
    window.open("/resume-builder/print", "_blank");
    setTimeout(() => setIsDownloading(false), 1000);
  }

  const showSectionTools = step >= 1 && step <= 5;
  const canAddSectionItem = step >= 2 && step <= 5;

  // ── Theme tokens ──────────────────────────────────────────────────────────────

  const pageBg    = isDark ? "bg-[#020308]"   : isTricolor ? "bg-[#FFFDF5]"  : "bg-slate-100";
  const sidebarBg = isDark ? "bg-[#0d0e1a] border-r border-indigo-900/30" : isTricolor ? "bg-white border-r border-orange-100" : "bg-white border-r border-slate-200";
  const previewBg = isDark ? "bg-slate-900"   : "bg-slate-300";
  const headerBg  = isDark ? "bg-[#0a0b15] border-b border-indigo-900/30" : isTricolor ? "bg-white border-b border-orange-100" : "bg-white border-b border-slate-200";

  const stepActive = isDark ? "bg-indigo-600 text-white" : isTricolor ? "bg-orange-500 text-white" : "bg-violet-600 text-white";
  const stepDone   = isDark ? "bg-indigo-900/60 text-indigo-300" : isTricolor ? "bg-green-100 text-green-700" : "bg-violet-100 text-violet-700";
  const stepIdle   = isDark ? "bg-slate-800 text-slate-400" : isTricolor ? "bg-gray-100 text-gray-400" : "bg-slate-100 text-slate-400";
  const accentBtn  = isDark ? "bg-indigo-600 hover:bg-indigo-500 text-white" : isTricolor ? "bg-orange-500 hover:bg-orange-600 text-white" : "bg-violet-600 hover:bg-violet-700 text-white";

  // ─────────────────────────────────────────────────────────────────────────────

  return (
    <div className={classNames("flex h-[calc(100vh-64px)] flex-col overflow-hidden", pageBg)}>

      {/* ── Top toolbar ──────────────────────────────────────────────────── */}
      <div className={classNames("flex h-12 items-center justify-between gap-3 px-4 shadow-sm shrink-0", headerBg)}>
        {/* Left: back + steps */}
        <div className="flex items-center gap-2 overflow-x-auto">
          <button
            type="button"
            onClick={handleBack}
            className={classNames("flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition", isDark ? "hover:bg-white/10 text-slate-400" : "hover:bg-slate-100 text-slate-500")}
            title="Back to templates"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          <div className="flex items-center gap-1">
            {STEPS.map((s, i) => (
              <div key={s.id} className="flex items-center gap-0.5">
                <button
                  type="button"
                  onClick={() => dispatch(setStepAction(s.id))}
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
          {/* Template switcher button */}
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

          {/* Zoom controls */}
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

          {/* Download PDF */}
          <button
            type="button"
            onClick={handleDownloadPdf}
            disabled={isDownloading}
            className={classNames("flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition", accentBtn)}
          >
            <Download className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">{isDownloading ? "Opening..." : "Download PDF"}</span>
          </button>
        </div>
      </div>

      {/* ── Body: form + preview ─────────────────────────────────────────── */}
      <div className="flex flex-1 overflow-hidden">

        {/* ── Left: form ──────────────────────────────────────────────────── */}
        <div className={classNames("flex w-full flex-col overflow-hidden lg:w-[60%] shrink-0", sidebarBg)}>
          <div className="flex-1 overflow-y-auto p-5">

            {/* Section toolbar */}
            {showSectionTools && (
              <div className={classNames(
                "mb-4 flex flex-wrap items-center gap-2 rounded-xl border p-2",
                isDark ? "border-slate-700 bg-white/[0.03]" : "border-slate-200 bg-slate-50"
              )}>
                {canAddSectionItem && (
                  <button type="button" onClick={addCurrentSectionItem}
                    className={classNames("flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition",
                      isDark ? "bg-slate-800 text-slate-200 hover:bg-slate-700" : "bg-white text-slate-700 hover:bg-slate-100")}>
                    <Plus className="h-3.5 w-3.5" />
                    Add Section
                  </button>
                )}
                <button type="button" onClick={useSampleForCurrentSection}
                  className={classNames("flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition",
                    isDark ? "bg-indigo-950/50 text-indigo-200 hover:bg-indigo-900/60" : "bg-violet-50 text-violet-700 hover:bg-violet-100")}>
                  <Sparkles className="h-3.5 w-3.5" />
                  Use Dummy
                </button>
                <button type="button" onClick={formatCurrentSection}
                  className={classNames("flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition",
                    isDark ? "bg-emerald-950/50 text-emerald-200 hover:bg-emerald-900/60" : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100")}>
                  <FileText className="h-3.5 w-3.5" />
                  Format Section
                </button>
                <button type="button" onClick={clearCurrentSection}
                  className={classNames("flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition",
                    isDark ? "bg-red-950/40 text-red-200 hover:bg-red-900/60" : "bg-red-50 text-red-700 hover:bg-red-100")}>
                  <Trash2 className="h-3.5 w-3.5" />
                  Clear Section
                </button>
              </div>
            )}

            {/* Step content */}
            {step === 0 && (
              <StepCustomize
                templateId={templateId}
                customization={customization}
                onTemplateChange={changeTemplate}
                onCustomizationChange={(c) => dispatch(setCustomizationAction(c))}
              />
            )}
            {step === 1 && <StepPersonal   data={data.personal}    onChange={(p) => update({ personal:     p })} />}
            {step === 2 && <StepExperience data={data.experience}  onChange={(e) => update({ experience:   e })} />}
            {step === 3 && <StepEducation  data={data.education}   onChange={(e) => update({ education:    e })} />}
            {step === 4 && <StepSkills     data={data.skills}      onChange={(s) => update({ skills:       s })} />}
            {step === 5 && (
              <StepExtras
                projects={data.projects}
                certificates={data.certificates}
                onProjectsChange={(p) => update({ projects:      p })}
                onCertificatesChange={(c) => update({ certificates: c })}
              />
            )}
            {step === 6 && <StepATS data={data} onApply={(updated) => dispatch(setResumeData(updated))} />}
          </div>

          {/* Step navigation bar */}
          <div className={classNames(
            "flex items-center justify-between gap-3 border-t px-5 py-3 shrink-0",
            isDark ? "border-indigo-900/30 bg-[#0a0b15]" : isTricolor ? "border-orange-100 bg-white" : "border-slate-200 bg-white"
          )}>
            <button type="button" onClick={() => dispatch(prevStep())} disabled={step === 0}
              className="btn-secondary flex items-center gap-1.5 py-2 text-sm disabled:opacity-40">
              <ChevronLeft className="h-4 w-4" />
              Back
            </button>
            <span className={classNames("text-xs", isDark ? "text-slate-500" : "text-slate-400")}>
              {step + 1} / {STEPS.length}
            </span>
            {step < STEPS.length - 1 ? (
              <button type="button" onClick={() => dispatch(nextStep())}
                className="btn-primary flex items-center gap-1.5 py-2 text-sm">
                Next
                <ChevronRight className="h-4 w-4" />
              </button>
            ) : (
              <button type="button" onClick={handleDownloadPdf} disabled={isDownloading}
                className="btn-primary flex items-center gap-1.5 py-2 text-sm">
                <Download className="h-4 w-4" />
                {isDownloading ? "Downloading..." : "Download"}
              </button>
            )}
          </div>
        </div>

        {/* ── Right: live preview ──────────────────────────────────────────── */}
        <div className={classNames("hidden w-[40%] flex-col overflow-hidden lg:flex shrink-0", previewBg)}>
          <div className={classNames(
            "flex items-center gap-2 px-3 py-1.5 shrink-0 border-b overflow-x-auto",
            isDark ? "bg-slate-800 border-slate-700" : isTricolor ? "bg-slate-200 border-slate-300" : "bg-slate-200 border-slate-300"
          )}>
            <span className={classNames("text-[11px] font-semibold shrink-0", isDark ? "text-slate-400" : "text-slate-500")}>
              Live Preview
            </span>
            <div className="flex items-center gap-1 overflow-x-auto scrollbar-none whitespace-nowrap">
              {RESUME_TEMPLATES.map((tpl) => (
                <button
                  key={tpl.id}
                  type="button"
                  onClick={() => changeTemplate(tpl.id)}
                  className={classNames(
                    "rounded-full px-2 py-0.5 text-[10px] font-semibold transition shrink-0",
                    templateId === tpl.id
                      ? isDark ? "bg-indigo-600 text-white" : isTricolor ? "bg-orange-500 text-white" : "bg-violet-600 text-white"
                      : isDark ? "bg-slate-700 text-slate-300 hover:bg-slate-600" : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-200"
                  )}
                  style={templateId !== tpl.id ? { borderLeftColor: tpl.accent, borderLeftWidth: 2 } : {}}
                >
                  {tpl.name}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-1 overflow-auto px-6 py-8">
            <div className="mx-auto shrink-0" style={{ width: scaledPaperWidth, minHeight: scaledPaperHeight, transition: "width 0.2s ease, min-height 0.2s ease" }}>
              <div style={{ transform: `scale(${zoom})`, transformOrigin: "top left", width: paperWidth, minHeight: paperHeight, background: "#fff", boxShadow: "0 12px 50px rgba(15,23,42,0.28), 0 2px 10px rgba(15,23,42,0.16)", borderRadius: 3, overflow: "hidden" }}>
                <ResumePreview data={data} templateId={templateId} customization={customization} printMode={false} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Mobile preview overlay ───────────────────────────────────────── */}
      {showPreviewMobile && (
        <div className="fixed inset-0 z-50 flex flex-col bg-black/80 lg:hidden">
          <div className="flex h-12 items-center justify-between gap-3 bg-slate-900 px-4">
            <div className="flex gap-1 overflow-x-auto">
              {RESUME_TEMPLATES.map((tpl) => (
                <button key={tpl.id} type="button" onClick={() => changeTemplate(tpl.id)}
                  className={classNames("rounded-full px-2.5 py-1 text-xs font-semibold whitespace-nowrap transition",
                    templateId === tpl.id ? "bg-violet-600 text-white" : "bg-white/10 text-white hover:bg-white/20")}>
                  {tpl.name}
                </button>
              ))}
            </div>
            <button type="button" onClick={() => setShowPreviewMobile(false)}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20">
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="flex flex-1 overflow-auto px-3 py-5">
            <div className="mx-auto shrink-0" style={{ width: Math.round(paperWidth * 0.42), minHeight: Math.round(paperHeight * 0.42) }}>
              <div style={{ transform: "scale(0.42)", transformOrigin: "top left", width: paperWidth, minHeight: paperHeight, background: "#fff", boxShadow: "0 8px 40px rgba(0,0,0,0.35)", borderRadius: 3, overflow: "hidden" }}>
                <ResumePreview data={data} templateId={templateId} customization={customization} printMode={false} />
              </div>
            </div>
          </div>
          <div className="flex gap-3 bg-slate-900 p-4">
            <button type="button" onClick={handleDownloadPdf} disabled={isDownloading}
              className="btn-primary flex flex-1 items-center justify-center gap-2">
              <Download className="h-4 w-4" />
              {isDownloading ? "Opening..." : "Download PDF"}
            </button>
          </div>
        </div>
      )}

      {/* ── Template picker modal ─────────────────────────────────────────── */}
      {showTemplatePicker && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
          onClick={() => setShowTemplatePicker(false)}>
          <div className={classNames("w-full max-w-3xl rounded-2xl p-6 shadow-2xl", isDark ? "bg-[#0d0e1a] border border-indigo-900/40" : "bg-white")}
            onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className={classNames("text-lg font-bold", isDark ? "text-white" : "text-slate-900")}>Choose Template</h2>
              <button type="button" onClick={() => setShowTemplatePicker(false)}
                className={classNames("rounded-lg p-2 transition", isDark ? "hover:bg-white/10 text-slate-400" : "hover:bg-slate-100 text-slate-500")}>
                <X className="h-4 w-4" />
              </button>
            </div>
            <StepCustomize
              templateId={templateId}
              customization={customization}
              onTemplateChange={(id) => { changeTemplate(id); setShowTemplatePicker(false); }}
              onCustomizationChange={(c) => dispatch(setCustomizationAction(c))}
            />
          </div>
        </div>
      )}

    </div>
  );
}

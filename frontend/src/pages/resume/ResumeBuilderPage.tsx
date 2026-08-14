/**
 * Resume Builder — split-pane editor inspired by ig-frontend's ResumeDashboard flow.
 * Left: form steps with collapsible sections
 * Right: live A4 preview with template switcher
 */
import { useState, useRef, useCallback, useEffect } from "react";
import {
  CheckCircle2, ChevronLeft, ChevronRight,
  Download, Eye, FileText, Palette, Plus, Sparkles, Trash2, X, ZoomIn, ZoomOut,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTheme } from "@/hooks/useTheme";
import { classNames } from "@/utils/format";
import type { ResumeData, TemplateId } from "@/types/resume";
import { DEFAULT_RESUME_CUSTOMIZATION, EMPTY_RESUME, RESUME_TEMPLATES, SAMPLE_RESUME } from "@/types/resume";
import { StepPersonal }   from "@/pages/resume/steps/StepPersonal";
import { StepExperience } from "@/pages/resume/steps/StepExperience";
import { StepEducation }  from "@/pages/resume/steps/StepEducation";
import { StepSkills }     from "@/pages/resume/steps/StepSkills";
import { StepExtras }     from "@/pages/resume/steps/StepExtras";
import { StepCustomize } from "@/pages/resume/steps/StepCustomize";
import { StepATS }        from "@/pages/resume/steps/StepATS";
import { ResumePreview }  from "@/pages/resume/ResumePreview";
import { customizationForTemplate, withTemplateAccent } from "@/pages/resume/resumeTemplateUtils";
import { loadResumeFlowState, saveResumeFlowState } from "@/pages/resume/resumeFlowState";
import { nanoid } from "@/utils/nanoid";
import { formatResumeData } from "@/utils/resumeParser";

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
}

export function ResumeEditorPage(): JSX.Element {
  const navigate = useNavigate();
  const location = useLocation();
  const locationState = (location.state as EditorLocationState | null) ?? {};
  const persisted = loadResumeFlowState();

  const initialTemplate = locationState.templateId ?? persisted?.templateId ?? "classic";
  const initialData =
    locationState.data ??
    persisted?.data ??
    SAMPLE_RESUME;
  const initialCustomization =
    locationState.customization ??
    persisted?.customization ??
    customizationForTemplate(initialTemplate, DEFAULT_RESUME_CUSTOMIZATION);

  const { theme } = useTheme();
  const isDark = theme === "dark";
  const isTricolor = theme === "tricolor";

  const [step, setStep] = useState(0);
  const [templateId, setTemplateId] = useState<TemplateId>(initialTemplate);
  const [customization, setCustomization] = useState(initialCustomization);
  const [data, setData] = useState<ResumeData>(initialData);
  const [zoomIdx, setZoomIdx] = useState(1);          // default 55% fits 40% pane
  const [showPreviewMobile, setShowPreviewMobile] = useState(false);
  const [showTemplatePicker, setShowTemplatePicker] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const exportRef = useRef<HTMLDivElement | null>(null);

  const zoom = ZOOM_STEPS[zoomIdx];
  const paperWidth = 794;
  const paperHeight = 1123;
  const scaledPaperWidth = Math.round(paperWidth * zoom);
  const scaledPaperHeight = Math.round(paperHeight * zoom);

  function update(partial: Partial<ResumeData>) {
    setData((prev) => ({ ...prev, ...partial }));
  }
  function next() { setStep((s) => Math.min(s + 1, STEPS.length - 1)); }
  function prev() { setStep((s) => Math.max(s - 1, 0)); }

  useEffect(() => {
    saveResumeFlowState({ data, templateId, customization });
  }, [data, templateId, customization]);

  function handleBack() {
    navigate("/resume-builder/templates", {
      state: { data, fromUpload: persisted?.fromUpload },
    });
  }

  async function handleDownloadPdf() {
    if (!exportRef.current || isDownloading) return;

    setIsDownloading(true);
    try {
      const importRemote = new Function("url", "return import(url)") as (url: string) => Promise<any>;
      const name = data.personal.fullName.trim().replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "") || "resume";
      const html2pdfModule = await importRemote("https://cdn.jsdelivr.net/npm/html2pdf.js@0.10.2/+esm");
      const html2pdf = html2pdfModule.default ?? html2pdfModule;

      await html2pdf()
        .set({
          filename: `${name}-resume.pdf`,
          margin: [0, 0, 0, 0],
          image: { type: "jpeg", quality: 0.98 },
          html2canvas: {
            backgroundColor: "#ffffff",
            scale: 2,
            useCORS: true,
            logging: false,
            letterRendering: true,
            windowWidth: 794,
          },
          jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
          pagebreak: {
            mode: ["css", "legacy"],
            avoid: [".resume-avoid-break", ".resume-section", ".resume-item", "table", "tr"],
          },
        })
        .from(exportRef.current)
        .save();
    } catch (error) {
      console.error("Paged PDF export failed, trying canvas fallback", error);
      try {
        const importRemote = new Function("url", "return import(url)") as (url: string) => Promise<any>;
        const [{ default: html2canvas }, jspdfModule] = await Promise.all([
          importRemote("https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/+esm"),
          importRemote("https://cdn.jsdelivr.net/npm/jspdf@2.5.1/+esm"),
        ]);
        const JsPdf = jspdfModule.jsPDF;
        const canvas = await html2canvas(exportRef.current, {
          backgroundColor: "#ffffff",
          scale: 2,
          useCORS: true,
          logging: false,
          windowWidth: 794,
          windowHeight: Math.max(exportRef.current.scrollHeight, 1123),
        });

        const pdf = new JsPdf("p", "mm", "a4");
        const pageWidth = 210;
        const pageHeight = 297;
        const imgWidth = pageWidth;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        const imgData = canvas.toDataURL("image/png", 1);
        let remainingHeight = imgHeight;
        let position = 0;

        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        remainingHeight -= pageHeight;

        while (remainingHeight > 0) {
          position -= pageHeight;
          pdf.addPage();
          pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
          remainingHeight -= pageHeight;
        }

        const name = data.personal.fullName.trim().replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "") || "resume";
        pdf.save(`${name}-resume.pdf`);
      } catch (fallbackError) {
        console.error("Canvas PDF fallback failed", fallbackError);
        window.print();
      }
    } finally {
      setIsDownloading(false);
    }
  }

  const changeTemplate = useCallback((id: TemplateId) => {
    setTemplateId(id);
    setCustomization((prev) => withTemplateAccent(prev, id));
  }, []);

  function addCurrentSectionItem() {
    if (step === 2) {
      update({
        experience: [
          ...data.experience,
          { id: nanoid(), company: "", position: "", startDate: "", endDate: "", current: false, description: "" },
        ],
      });
    }
    if (step === 3) {
      update({
        education: [
          ...data.education,
          { id: nanoid(), institution: "", degree: "", field: "", startDate: "", endDate: "", grade: "" },
        ],
      });
    }
    if (step === 4) {
      update({
        skills: [...data.skills, { id: nanoid(), name: "", level: "Intermediate" }],
      });
    }
    if (step === 5) {
      update({
        projects: [...data.projects, { id: nanoid(), name: "", description: "", link: "", technologies: "" }],
      });
    }
  }

  function clearCurrentSection() {
    if (step === 1) update({ personal: EMPTY_RESUME.personal });
    if (step === 2) update({ experience: [] });
    if (step === 3) update({ education: [] });
    if (step === 4) update({ skills: [] });
    if (step === 5) update({ projects: [], certificates: [] });
  }

  function useSampleForCurrentSection() {
    if (step === 1) update({ personal: SAMPLE_RESUME.personal });
    if (step === 2) update({ experience: SAMPLE_RESUME.experience });
    if (step === 3) update({ education: SAMPLE_RESUME.education });
    if (step === 4) update({ skills: SAMPLE_RESUME.skills });
    if (step === 5) update({ projects: SAMPLE_RESUME.projects, certificates: SAMPLE_RESUME.certificates });
  }

  function formatCurrentSection() {
    const formatted = formatResumeData(data);
    if (step === 1) update({ personal: formatted.personal });
    if (step === 2) update({ experience: formatted.experience });
    if (step === 3) update({ education: formatted.education });
    if (step === 4) update({ skills: formatted.skills });
    if (step === 5) update({ projects: formatted.projects, certificates: formatted.certificates });
  }

  const showSectionTools = step >= 1 && step <= 5;
  const canAddSectionItem = step >= 2 && step <= 5;

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
            onClick={handleDownloadPdf}
            disabled={isDownloading}
            className={classNames("flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition", accentBtn)}
          >
            <Download className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">{isDownloading ? "Downloading..." : "Download PDF"}</span>
          </button>
        </div>
      </div>

      {/* ── Body: form + preview ────────────────────────────────────────── */}
      <div className="flex flex-1 overflow-hidden">

        {/* ── Left: form ───────────────────────────────────────────────── */}
        <div className={classNames("flex w-full flex-col overflow-hidden lg:w-[60%] shrink-0", sidebarBg)}>
          {/* Scrollable form area */}
          <div className="flex-1 overflow-y-auto p-5">
            {showSectionTools && (
              <div className={classNames(
                "mb-4 flex flex-wrap items-center gap-2 rounded-xl border p-2",
                isDark ? "border-slate-700 bg-white/[0.03]" : "border-slate-200 bg-slate-50"
              )}>
                {canAddSectionItem && (
                  <button
                    type="button"
                    onClick={addCurrentSectionItem}
                    className={classNames(
                      "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition",
                      isDark ? "bg-slate-800 text-slate-200 hover:bg-slate-700" : "bg-white text-slate-700 hover:bg-slate-100"
                    )}
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Add Section
                  </button>
                )}
                <button
                  type="button"
                  onClick={useSampleForCurrentSection}
                  className={classNames(
                    "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition",
                    isDark ? "bg-indigo-950/50 text-indigo-200 hover:bg-indigo-900/60" : "bg-violet-50 text-violet-700 hover:bg-violet-100"
                  )}
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  Use Dummy
                </button>
                <button
                  type="button"
                  onClick={formatCurrentSection}
                  className={classNames(
                    "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition",
                    isDark ? "bg-emerald-950/50 text-emerald-200 hover:bg-emerald-900/60" : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                  )}
                >
                  <FileText className="h-3.5 w-3.5" />
                  Format Section
                </button>
                <button
                  type="button"
                  onClick={clearCurrentSection}
                  className={classNames(
                    "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition",
                    isDark ? "bg-red-950/40 text-red-200 hover:bg-red-900/60" : "bg-red-50 text-red-700 hover:bg-red-100"
                  )}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Clear Section
                </button>
              </div>
            )}
            {step === 0 && (
              <StepCustomize
                templateId={templateId}
                customization={customization}
                onTemplateChange={changeTemplate}
                onCustomizationChange={setCustomization}
              />
            )}
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
              <button type="button" onClick={handleDownloadPdf} disabled={isDownloading} className="btn-primary flex items-center gap-1.5 py-2 text-sm">
                <Download className="h-4 w-4" />
                {isDownloading ? "Downloading..." : "Download"}
              </button>
            )}
          </div>
        </div>

        {/* ── Right: live preview ───────────────────────────────────────── */}
        <div className={classNames("hidden w-[40%] flex-col overflow-hidden lg:flex shrink-0", previewBg)}>
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
                  onClick={() => changeTemplate(tpl.id)}
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
          <div className="flex flex-1 overflow-auto px-6 py-8">
            <div
              className="mx-auto shrink-0"
              style={{
                width: scaledPaperWidth,
                minHeight: scaledPaperHeight,
                transition: "width 0.2s ease, min-height 0.2s ease",
              }}
            >
              <div
                style={{
                  transform: `scale(${zoom})`,
                  transformOrigin: "top left",
                  width: paperWidth,
                  minHeight: paperHeight,
                  background: "#fff",
                  boxShadow: "0 12px 50px rgba(15,23,42,0.28), 0 2px 10px rgba(15,23,42,0.16)",
                  borderRadius: 3,
                  overflow: "visible",
                }}
              >
                <ResumePreview data={data} templateId={templateId} customization={customization} printMode={false} />
              </div>
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
                  onClick={() => changeTemplate(tpl.id)}
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
          <div className="flex flex-1 overflow-auto px-3 py-5">
            <div className="mx-auto shrink-0" style={{ width: Math.round(paperWidth * 0.42), minHeight: Math.round(paperHeight * 0.42) }}>
              <div style={{ transform: "scale(0.42)", transformOrigin: "top left", width: paperWidth, minHeight: paperHeight, background: "#fff", boxShadow: "0 8px 40px rgba(0,0,0,0.35)", borderRadius: 3, overflow: "visible" }}>
                <ResumePreview data={data} templateId={templateId} customization={customization} printMode={false} />
              </div>
            </div>
          </div>
          {/* Download */}
          <div className="flex gap-3 bg-slate-900 p-4">
            <button type="button" onClick={handleDownloadPdf} disabled={isDownloading} className="btn-primary flex flex-1 items-center justify-center gap-2">
              <Download className="h-4 w-4" />
              {isDownloading ? "Downloading..." : "Download PDF"}
            </button>
          </div>
        </div>
      )}

      <div
        aria-hidden="true"
        style={{
          position: "fixed",
          left: -10000,
          top: 0,
          width: "210mm",
          background: "#ffffff",
          pointerEvents: "none",
          zIndex: -1,
        }}
      >
        <div ref={exportRef} style={{ width: "210mm", minHeight: "297mm", background: "#ffffff" }}>
          <ResumePreview data={data} templateId={templateId} customization={customization} printMode={false} />
        </div>
      </div>

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
            <StepCustomize
              templateId={templateId}
              customization={customization}
              onTemplateChange={(id) => { changeTemplate(id); setShowTemplatePicker(false); }}
              onCustomizationChange={setCustomization}
            />
          </div>
        </div>
      )}

      {/* Print styles — hide everything except resume */}
      <style>{`
        @media print {
          body > *:not(#resume-print-root) { display: none !important; }
          #resume-print-root { display: block !important; position: static !important; inset: auto !important; z-index: 9999; }
          @page { size: A4; margin: 0; }
        }
      `}</style>
    </div>
  );
}

import { useState } from "react";
import {
  CheckCircle2, ChevronLeft, ChevronRight,
  Eye, FileText, Palette, Sparkles,
} from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import { classNames } from "@/utils/format";
import type { ResumeData, TemplateId } from "@/types/resume";
import { EMPTY_RESUME } from "@/types/resume";
import { StepPersonal }   from "@/pages/resume/steps/StepPersonal";
import { StepExperience } from "@/pages/resume/steps/StepExperience";
import { StepEducation }  from "@/pages/resume/steps/StepEducation";
import { StepSkills }     from "@/pages/resume/steps/StepSkills";
import { StepExtras }     from "@/pages/resume/steps/StepExtras";
import { StepTemplate }   from "@/pages/resume/steps/StepTemplate";
import { StepATS }        from "@/pages/resume/steps/StepATS";
import { ResumeEntryPage } from "@/pages/resume/ResumeEntryPage";
import { ResumePreviewStep } from "@/pages/resume/ResumePreviewStep";

// ── Wizard steps (step 0 is template/start, step 7 is preview) ───────────────
const STEPS = [
  { id: 0, label: "Template",  icon: Palette },
  { id: 1, label: "Personal",  icon: FileText },
  { id: 2, label: "Experience",icon: FileText },
  { id: 3, label: "Education", icon: FileText },
  { id: 4, label: "Skills",    icon: FileText },
  { id: 5, label: "Extras",    icon: FileText },
  { id: 6, label: "ATS Score", icon: Sparkles },
  { id: 7, label: "Preview",   icon: Eye },
];

export function ResumeBuilderPage(): JSX.Element {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const isTricolor = theme === "tricolor";

  // "entry" → user is on the landing choice screen
  // "builder" → user is inside the step wizard
  const [mode, setMode] = useState<"entry" | "builder">("entry");
  const [step, setStep] = useState(0);
  const [templateId, setTemplateId] = useState<TemplateId>("classic");
  const [data, setData] = useState<ResumeData>(EMPTY_RESUME);
  const [showQuickPreview, setShowQuickPreview] = useState(false);

  function update(partial: Partial<ResumeData>) {
    setData((prev) => ({ ...prev, ...partial }));
  }

  function next() { setStep((s) => Math.min(s + 1, STEPS.length - 1)); }
  function prev() { setStep((s) => Math.max(s - 1, 0)); }

  // ── Entry handlers ─────────────────────────────────────────────────────────
  function handleBuildNew() {
    setData(EMPTY_RESUME);
    setStep(0);
    setMode("builder");
  }

  function handleUpload(parsed: ResumeData) {
    setData(parsed);
    setStep(1); // skip template step (use default), go straight to Personal to review
    setMode("builder");
  }

  // ── Show entry page ────────────────────────────────────────────────────────
  if (mode === "entry") {
    return <ResumeEntryPage onBuildNew={handleBuildNew} onUpload={handleUpload} />;
  }

  // ── Full-screen preview step ───────────────────────────────────────────────
  if (step === 7) {
    return (
      <ResumePreviewStep
        data={data}
        templateId={templateId}
        onTemplateChange={setTemplateId}
        onBack={() => setStep(6)}
      />
    );
  }

  // ── Theme tokens ───────────────────────────────────────────────────────────
  const isLastContentStep = step === 6;
  const isPreviewStep = step === 7; // handled above, kept for safety

  const pageBg = isDark
    ? "bg-[#020308] text-slate-100"
    : isTricolor
    ? "bg-[#FFFDF5] text-gray-900"
    : "bg-slate-50 text-slate-900";

  const cardBg = isDark
    ? "bg-white/[0.03] border border-indigo-900/30"
    : isTricolor
    ? "bg-white border border-orange-100"
    : "bg-white border border-slate-200";

  const stepperActive = isDark ? "bg-indigo-600 text-white"
    : isTricolor ? "bg-orange-500 text-white" : "bg-violet-600 text-white";
  const stepperDone = isDark ? "bg-indigo-900/60 text-indigo-300"
    : isTricolor ? "bg-green-100 text-green-700" : "bg-violet-100 text-violet-700";
  const stepperIdle = isDark ? "bg-slate-800 text-slate-400"
    : isTricolor ? "bg-gray-100 text-gray-400" : "bg-slate-100 text-slate-400";

  return (
    <div className={classNames("min-h-screen", pageBg)}>
      {/* ── Header ──────────────────────────────────────────────────── */}
      <div className={classNames(
        "border-b py-6",
        isDark ? "border-indigo-900/30 bg-gradient-to-r from-indigo-900/30 to-violet-900/20"
          : isTricolor ? "border-orange-100 bg-gradient-to-r from-orange-50 to-green-50"
          : "border-slate-200 bg-gradient-to-r from-violet-50 to-indigo-50"
      )}>
        <div className="container-page">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              {/* Back to entry */}
              <button
                type="button"
                onClick={() => setMode("entry")}
                className={classNames(
                  "flex h-8 w-8 items-center justify-center rounded-lg transition",
                  isDark ? "hover:bg-white/10 text-slate-400" : "hover:bg-slate-100 text-slate-500"
                )}
                title="Back to start"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <div>
                <h1 className={classNames("text-xl font-bold sm:text-2xl", isDark ? "text-white" : "text-slate-900")}>
                  Resume Builder
                </h1>
                <p className={classNames("text-xs", isDark ? "text-slate-400" : "text-slate-500")}>
                  Step {step + 1} of {STEPS.length}
                </p>
              </div>
            </div>

            {/* Quick preview button */}
            {step > 0 && (
              <button
                type="button"
                onClick={() => setShowQuickPreview(true)}
                className="btn-secondary flex items-center gap-2 text-sm py-2"
              >
                <Eye className="h-4 w-4" />
                <span className="hidden sm:inline">Preview</span>
              </button>
            )}
          </div>

          {/* Stepper */}
          <div className="mt-4 flex items-center gap-1 overflow-x-auto pb-1">
            {STEPS.map((s, i) => (
              <div key={s.id} className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setStep(s.id)}
                  className={classNames(
                    "flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition-all",
                    step === s.id ? stepperActive : step > s.id ? stepperDone : stepperIdle
                  )}
                >
                  {step > s.id
                    ? <CheckCircle2 className="h-3.5 w-3.5" />
                    : <span className={classNames("flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-bold", step === s.id ? "bg-white/20" : "bg-black/10")}>
                        {s.id + 1}
                      </span>
                  }
                  {s.label}
                </button>
                {i < STEPS.length - 1 && (
                  <div className={classNames("h-px w-3 shrink-0", isDark ? "bg-slate-700" : "bg-slate-200")} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Step content ────────────────────────────────────────────── */}
      <div className="container-page py-8">
        <div className={classNames("mx-auto max-w-3xl rounded-2xl p-6 shadow-sm sm:p-8", cardBg)}>

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

          {/* Navigation */}
          {!isPreviewStep && (
            <div
              className="mt-8 flex items-center justify-between border-t pt-6"
              style={{ borderColor: isDark ? "rgba(99,102,241,0.15)" : "#e2e8f0" }}
            >
              <button
                type="button"
                onClick={prev}
                disabled={step === 0}
                className="btn-secondary flex items-center gap-2 disabled:opacity-40"
              >
                <ChevronLeft className="h-4 w-4" />
                Back
              </button>
              <button
                type="button"
                onClick={isLastContentStep ? () => setStep(7) : next}
                className="btn-primary flex items-center gap-2"
              >
                {isLastContentStep ? (
                  <><Eye className="h-4 w-4" /> Preview Resume</>
                ) : (
                  <><span>Next</span><ChevronRight className="h-4 w-4" /></>
                )}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── Quick preview modal ──────────────────────────────────────── */}
      {showQuickPreview && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/70 p-4 backdrop-blur-sm"
          onClick={() => setShowQuickPreview(false)}
        >
          <div
            className="relative my-8 w-full max-w-3xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Toolbar inside modal */}
            <div className="mb-2 flex items-center justify-between gap-4">
              <div className="flex flex-wrap gap-1.5">
                {RESUME_TEMPLATES.map((tpl) => (
                  <button
                    key={tpl.id}
                    type="button"
                    onClick={() => setTemplateId(tpl.id)}
                    className={classNames(
                      "rounded-full px-3 py-1 text-xs font-semibold transition",
                      templateId === tpl.id
                        ? "bg-violet-600 text-white"
                        : "bg-white/10 text-white hover:bg-white/20"
                    )}
                  >
                    {tpl.name}
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={() => setShowQuickPreview(false)}
                className="rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white hover:bg-white/20"
              >
                Close
              </button>
            </div>
            {/* Paper */}
            <div className="overflow-hidden rounded-2xl bg-white shadow-2xl">
              <iframe
                title="resume-preview"
                srcDoc={`<!DOCTYPE html><html><head><style>body{margin:0}</style></head><body>${document.getElementById("resume-preview-hidden")?.innerHTML ?? ""}</body></html>`}
                className="hidden"
              />
              {/* Inline preview */}
              <div style={{ transform: "scale(0.85)", transformOrigin: "top center", width: "100%", overflowX: "hidden" }}>
                {/* We import ResumePreview inline */}
                <ResumePreviewInline data={data} templateId={templateId} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Inline preview component for the modal (avoids import cycle)
import { ResumePreview } from "@/pages/resume/ResumePreview";

function ResumePreviewInline({ data, templateId }: { data: ResumeData; templateId: TemplateId }) {
  return <ResumePreview data={data} templateId={templateId} printMode={false} />;
}

// Re-export RESUME_TEMPLATES for the modal template switcher
import { RESUME_TEMPLATES } from "@/types/resume";

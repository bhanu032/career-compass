/**
 * Dedicated template selection page — live previews with dummy data,
 * category tabs, grid + large preview panel (inspired by ig-frontend flow).
 */
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTheme } from "@/hooks/useTheme";
import { classNames } from "@/utils/format";
import type { ResumeData, TemplateCategory, TemplateId } from "@/types/resume";
import {
  DEFAULT_RESUME_CUSTOMIZATION,
  RESUME_TEMPLATES,
  SAMPLE_RESUME,
  TEMPLATE_CATEGORIES,
} from "@/types/resume";
import { TemplatePreviewThumbnail } from "@/pages/resume/TemplatePreviewThumbnail";
import { customizationForTemplate } from "@/pages/resume/resumeTemplateUtils";
import { loadResumeFlowState, saveResumeFlowState } from "@/pages/resume/resumeFlowState";

interface LocationState {
  data?: ResumeData;
  fromUpload?: boolean;
}

export function ResumeTemplateSelectionPage(): JSX.Element {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const isTricolor = theme === "tricolor";

  const locationState = (location.state as LocationState | null) ?? {};
  const persisted = loadResumeFlowState();
  const initialData = locationState.data ?? persisted?.data;

  const [selectedCategory, setSelectedCategory] = useState<"all" | TemplateCategory>("all");
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateId>(
    persisted?.templateId ?? "classic"
  );

  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });

  useEffect(() => {
    saveResumeFlowState({
      data: initialData,
      templateId: selectedTemplate,
      fromUpload: locationState.fromUpload ?? persisted?.fromUpload,
    });
  }, [initialData, selectedTemplate, locationState.fromUpload, persisted?.fromUpload]);

  useEffect(() => {
    const activeTab = tabRefs.current[selectedCategory];
    if (activeTab) {
      const extraWidth = 24;
      setIndicatorStyle({
        left: activeTab.offsetLeft - extraWidth / 2,
        width: activeTab.offsetWidth + extraWidth,
      });
    }
  }, [selectedCategory]);

  const filteredTemplates =
    selectedCategory === "all"
      ? RESUME_TEMPLATES
      : RESUME_TEMPLATES.filter((tpl) => tpl.category === selectedCategory);

  useEffect(() => {
    if (!filteredTemplates.some((tpl) => tpl.id === selectedTemplate)) {
      setSelectedTemplate(filteredTemplates[0]?.id ?? "classic");
    }
  }, [filteredTemplates, selectedTemplate]);

  const accentBtn = isDark
    ? "bg-indigo-600 hover:bg-indigo-500 text-white"
    : isTricolor
    ? "bg-orange-500 hover:bg-orange-600 text-white"
    : "bg-violet-600 hover:bg-violet-700 text-white";

  const pageBg = isDark
    ? "bg-[#020308] text-slate-100"
    : isTricolor
    ? "bg-[#FFFDF5] text-gray-900"
    : "bg-slate-50 text-slate-900";

  function handleBack() {
    navigate("/resume-builder");
  }

  function handleStartEditing() {
    const customization = customizationForTemplate(selectedTemplate, DEFAULT_RESUME_CUSTOMIZATION);
    const data = initialData && hasResumeContent(initialData) ? initialData : SAMPLE_RESUME;

    saveResumeFlowState({
      data,
      templateId: selectedTemplate,
      customization,
      fromUpload: locationState.fromUpload ?? persisted?.fromUpload,
    });

    navigate("/resume-builder/edit", {
      state: { data, templateId: selectedTemplate, customization },
    });
  }

  const selectedMeta = RESUME_TEMPLATES.find((tpl) => tpl.id === selectedTemplate);
  const previewCustomization = customizationForTemplate(selectedTemplate, DEFAULT_RESUME_CUSTOMIZATION);

  return (
    <div className={classNames("flex min-h-[calc(100vh-64px)] flex-col", pageBg)}>
      {/* Header */}
      <header
        className={classNames(
          "relative flex shrink-0 flex-wrap items-center justify-between gap-4 border-b px-4 py-4 sm:px-6",
          isDark ? "border-indigo-900/30 bg-[#0a0b15]" : isTricolor ? "border-orange-100 bg-white" : "border-slate-200 bg-white"
        )}
      >
        <div className="flex items-start gap-3">
          <button
            type="button"
            onClick={handleBack}
            className={classNames(
              "flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition",
              isDark
                ? "border-slate-700 bg-slate-900 text-slate-300 hover:bg-slate-800"
                : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
            )}
            title="Back"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className={classNames("text-xl font-bold sm:text-2xl", isDark ? "text-white" : "text-slate-900")}>
              Choose Resume Template
            </h1>
            <p className={classNames("mt-0.5 text-sm", isDark ? "text-slate-400" : "text-slate-500")}>
              Select a layout optimized for your role, experience, and ATS compatibility.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleStartEditing}
          disabled={!selectedTemplate}
          className={classNames(
            "flex h-9 items-center justify-center gap-2 rounded-lg px-4 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50",
            accentBtn
          )}
        >
          Start Editing
          <ArrowRight className="h-4 w-4" />
        </button>
      </header>

      {/* Body */}
      <main className="flex flex-1 flex-col overflow-hidden lg:flex-row">
        {/* Left: categories + grid */}
        <div className="flex flex-1 flex-col overflow-hidden lg:max-w-[55%]">
          {/* Category tabs */}
          <div className="relative shrink-0 px-4 pt-3 sm:px-6">
            <div className="flex items-center gap-6 overflow-x-auto whitespace-nowrap sm:gap-10">
              {TEMPLATE_CATEGORIES.map((category) => {
                const isActive = selectedCategory === category.id;
                return (
                  <button
                    key={category.id}
                    ref={(el) => {
                      tabRefs.current[category.id] = el;
                    }}
                    type="button"
                    onClick={() => setSelectedCategory(category.id)}
                    className={classNames(
                      "relative pb-3 text-sm font-medium transition-colors",
                      isActive
                        ? isDark
                          ? "text-indigo-300"
                          : isTricolor
                          ? "text-orange-700"
                          : "text-violet-700"
                        : isDark
                        ? "text-slate-500 hover:text-slate-300"
                        : "text-slate-500 hover:text-slate-800"
                    )}
                  >
                    {category.name}
                  </button>
                );
              })}
            </div>
            <div className={classNames("absolute bottom-0 left-0 h-px w-full", isDark ? "bg-slate-800" : "bg-slate-200")} />
            <div
              className="absolute bottom-0 h-1 rounded-t transition-all duration-300"
              style={{
                left: indicatorStyle.left,
                width: indicatorStyle.width,
                background: isTricolor
                  ? "linear-gradient(90deg, #FF9933 0%, #138808 100%)"
                  : "linear-gradient(90deg, #8715FF 0%, #F56000 100%)",
              }}
            />
          </div>

          {/* Template grid */}
          <div className="flex-1 overflow-y-auto px-4 py-4 sm:px-6">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-3">
              {filteredTemplates.map((tpl) => {
                const isSelected = selectedTemplate === tpl.id;
                return (
                  <button
                    key={tpl.id}
                    type="button"
                    onClick={() => setSelectedTemplate(tpl.id)}
                    className={classNames(
                      "group relative aspect-[3/4] w-full overflow-hidden rounded-lg border-2 text-left transition-all duration-200",
                      isSelected
                        ? isDark
                          ? "border-indigo-500 shadow-lg shadow-indigo-900/40"
                          : isTricolor
                          ? "border-orange-500 shadow-md"
                          : "border-violet-500 shadow-md"
                        : isDark
                        ? "border-slate-700 hover:border-slate-500"
                        : "border-slate-200 hover:border-slate-300 hover:shadow-sm"
                    )}
                  >
                    <div className="absolute inset-0 flex items-start justify-center overflow-hidden bg-white pt-1">
                      <TemplatePreviewThumbnail
                        templateId={tpl.id}
                        scale={0.22}
                        className="mx-auto shadow-sm"
                      />
                    </div>

                    {isSelected && (
                      <>
                        <div className="absolute inset-0 bg-black/10" />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-md">
                            <Check
                              className={classNames(
                                "h-5 w-5",
                                isDark ? "text-indigo-500" : isTricolor ? "text-orange-600" : "text-violet-600"
                              )}
                              strokeWidth={3}
                            />
                          </div>
                        </div>
                      </>
                    )}

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
              })}
            </div>
          </div>
        </div>

        {/* Right: large preview */}
        <div
          className={classNames(
            "hidden shrink-0 flex-col border-l p-5 lg:flex lg:w-[45%]",
            isDark ? "border-indigo-900/30 bg-slate-900/50" : isTricolor ? "border-orange-100 bg-orange-50/30" : "border-slate-200 bg-slate-100"
          )}
        >
          <div className="mb-3">
            <p className={classNames("text-sm font-semibold", isDark ? "text-slate-200" : "text-slate-800")}>
              {selectedMeta?.name ?? "Preview"}
            </p>
            <p className={classNames("mt-0.5 text-xs", isDark ? "text-slate-400" : "text-slate-500")}>
              {selectedMeta?.description}
            </p>
          </div>

          <div
            className={classNames(
              "flex flex-1 items-start justify-center overflow-y-auto rounded-2xl border p-4",
              isDark ? "border-slate-700 bg-slate-800/60" : "border-slate-200 bg-white shadow-inner"
            )}
          >
            <div className="mx-auto shrink-0 overflow-hidden rounded-lg shadow-lg" style={{ width: Math.round(794 * 0.52) }}>
              <TemplatePreviewThumbnail
                templateId={selectedTemplate}
                scale={0.52}
                customization={previewCustomization}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function hasResumeContent(data: ResumeData): boolean {
  return Boolean(
    data.personal.fullName.trim() ||
      data.personal.email.trim() ||
      data.experience.length ||
      data.education.length ||
      data.skills.length
  );
}

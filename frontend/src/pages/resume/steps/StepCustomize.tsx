import { RotateCcw } from "lucide-react";
import type { ReactNode } from "react";
import type { ResumeCustomization, TemplateId } from "@/types/resume";
import { DEFAULT_RESUME_CUSTOMIZATION } from "@/types/resume";
import { classNames } from "@/utils/format";
import { useTheme } from "@/hooks/useTheme";
import { StepTemplate } from "@/pages/resume/steps/StepTemplate";
import {
  ACCENT_PALETTE,
  DATE_FORMAT_OPTIONS,
  FONT_OPTIONS,
  SKILL_STYLE_OPTIONS,
  withTemplateAccent,
} from "@/pages/resume/resumeTemplateUtils";

interface Props {
  templateId: TemplateId;
  customization: ResumeCustomization;
  onTemplateChange: (id: TemplateId) => void;
  onCustomizationChange: (customization: ResumeCustomization) => void;
}

function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}): JSX.Element {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </span>
      {children}
    </label>
  );
}

export function StepCustomize({
  templateId,
  customization,
  onTemplateChange,
  onCustomizationChange,
}: Props): JSX.Element {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const panelClass = isDark
    ? "border-slate-700 bg-slate-900/70 text-slate-100"
    : "border-slate-200 bg-white text-slate-900";

  const update = (partial: Partial<ResumeCustomization>) => {
    onCustomizationChange({ ...customization, ...partial });
  };

  const selectTemplate = (id: TemplateId) => {
    onTemplateChange(id);
    onCustomizationChange(withTemplateAccent(customization, id));
  };

  const reset = () => {
    onCustomizationChange(withTemplateAccent(DEFAULT_RESUME_CUSTOMIZATION, templateId));
  };

  return (
    <div className="space-y-5">
      <div className={classNames("rounded-xl border p-4", panelClass)}>
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <h2 className={classNames("text-xl font-bold", isDark ? "text-white" : "text-slate-900")}>
              Customize Template
            </h2>
            <p className={classNames("mt-1 text-sm", isDark ? "text-slate-400" : "text-slate-500")}>
              Match the layout, typography, and density to your target role.
            </p>
          </div>
          <button
            type="button"
            onClick={reset}
            className={classNames(
              "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border transition",
              isDark ? "border-slate-700 hover:bg-slate-800" : "border-slate-200 hover:bg-slate-50"
            )}
            title="Reset customization"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Accent">
            <div className="flex flex-wrap gap-2">
              {ACCENT_PALETTE.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => update({ accentColor: color })}
                  className={classNames(
                    "h-8 w-8 rounded-full border-2 transition",
                    customization.accentColor.toLowerCase() === color.toLowerCase()
                      ? "border-slate-900 ring-2 ring-offset-2"
                      : "border-white/80"
                  )}
                  style={{ background: color }}
                  title={color}
                />
              ))}
            </div>
          </Field>

          <Field label="Font">
            <select
              value={customization.fontFamily}
              onChange={(event) => update({ fontFamily: event.target.value })}
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900"
            >
              {FONT_OPTIONS.map((font) => (
                <option key={font.value} value={font.value}>
                  {font.label}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Date Format">
            <select
              value={customization.dateFormat}
              onChange={(event) => update({ dateFormat: event.target.value as ResumeCustomization["dateFormat"] })}
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900"
            >
              {DATE_FORMAT_OPTIONS.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Skills">
            <select
              value={customization.skillStyle}
              onChange={(event) => update({ skillStyle: event.target.value as ResumeCustomization["skillStyle"] })}
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900"
            >
              {SKILL_STYLE_OPTIONS.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </Field>
        </div>

        <div className="mt-5 space-y-4">
          <Field label={`Font Size ${Math.round(customization.fontScale * 100)}%`}>
            <input
              type="range"
              min="0.88"
              max="1.16"
              step="0.02"
              value={customization.fontScale}
              onChange={(event) => update({ fontScale: Number(event.target.value) })}
              className="w-full accent-slate-900"
            />
          </Field>

          <Field label={`Line Height ${customization.lineHeight.toFixed(2)}`}>
            <input
              type="range"
              min="1.35"
              max="1.95"
              step="0.05"
              value={customization.lineHeight}
              onChange={(event) => update({ lineHeight: Number(event.target.value) })}
              className="w-full accent-slate-900"
            />
          </Field>

          <Field label={`Section Space ${Math.round(customization.sectionSpacing * 100)}%`}>
            <input
              type="range"
              min="0.75"
              max="1.35"
              step="0.05"
              value={customization.sectionSpacing}
              onChange={(event) => update({ sectionSpacing: Number(event.target.value) })}
              className="w-full accent-slate-900"
            />
          </Field>

          <Field label={`Page Margin ${Math.round(customization.pageMargin * 100)}%`}>
            <input
              type="range"
              min="0.75"
              max="1.3"
              step="0.05"
              value={customization.pageMargin}
              onChange={(event) => update({ pageMargin: Number(event.target.value) })}
              className="w-full accent-slate-900"
            />
          </Field>
        </div>

        <label className="mt-5 flex items-center gap-3 text-sm font-medium">
          <input
            type="checkbox"
            checked={customization.showSkillLevels}
            onChange={(event) => update({ showSkillLevels: event.target.checked })}
            className="h-4 w-4 rounded border-slate-300"
          />
          Show skill levels
        </label>
      </div>

      <StepTemplate selected={templateId} onSelect={selectTemplate} compact />
    </div>
  );
}

import type { CSSProperties } from "react";
import type {
  ResumeCustomization,
  ResumeDateFormat,
  ResumeSkillStyle,
  TemplateId,
} from "@/types/resume";
import { DEFAULT_RESUME_CUSTOMIZATION, RESUME_TEMPLATES } from "@/types/resume";

export const FONT_OPTIONS = [
  { label: "Inter", value: "Inter, Arial, sans-serif" },
  { label: "Serif", value: "Georgia, 'Times New Roman', serif" },
  { label: "System", value: "'Segoe UI', Arial, sans-serif" },
  { label: "Classic", value: "'Times New Roman', Georgia, serif" },
  { label: "Clean", value: "'Helvetica Neue', Arial, sans-serif" },
];

export const ACCENT_PALETTE = [
  "#1e3a5f",
  "#0f766e",
  "#7c3aed",
  "#2563eb",
  "#b91c1c",
  "#92400e",
  "#0891b2",
  "#059669",
  "#1d4ed8",
  "#db2777",
  "#db5a2a",
  "#334155",
  "#0f172a",
];

export const DATE_FORMAT_OPTIONS: Array<{ label: string; value: ResumeDateFormat }> = [
  { label: "Aug 2026", value: "MMM YYYY" },
  { label: "August 2026", value: "MMMM YYYY" },
  { label: "08/2026", value: "MM/YYYY" },
  { label: "2026", value: "YYYY" },
];

export const SKILL_STYLE_OPTIONS: Array<{ label: string; value: ResumeSkillStyle }> = [
  { label: "Bars", value: "bars" },
  { label: "Chips", value: "chips" },
  { label: "Comma list", value: "comma" },
];

/** Base horizontal page margin in px (scales with pageMargin multiplier) — Standard MS Word ~22mm. */
export const PAGE_MARGIN_H_BASE = 32;
/** Base vertical page margin in px (scales with pageMargin multiplier) — Standard MS Word ~20mm. */
export const PAGE_MARGIN_V_BASE = 28;

/** Compute scaled page margins from customization. */
export function pageMargins(customization?: ResumeCustomization): {
  h: number;
  v: number;
} {
  const scale = customization?.pageMargin ?? DEFAULT_RESUME_CUSTOMIZATION.pageMargin;
  return {
    h: Math.round(PAGE_MARGIN_H_BASE * scale),
    v: Math.round(PAGE_MARGIN_V_BASE * scale),
  };
}

export function customizationForTemplate(
  templateId: TemplateId,
  current?: ResumeCustomization
): ResumeCustomization {
  const template = RESUME_TEMPLATES.find((item) => item.id === templateId);

  return {
    ...DEFAULT_RESUME_CUSTOMIZATION,
    ...current,
    accentColor: current?.accentColor || template?.accent || DEFAULT_RESUME_CUSTOMIZATION.accentColor,
  };
}

export function withTemplateAccent(
  customization: ResumeCustomization,
  templateId: TemplateId
): ResumeCustomization {
  const template = RESUME_TEMPLATES.find((item) => item.id === templateId);
  return {
    ...customization,
    accentColor: template?.accent || customization.accentColor,
  };
}

export function formatResumeDate(
  value: string,
  format: ResumeDateFormat = DEFAULT_RESUME_CUSTOMIZATION.dateFormat
): string {
  if (!value) return "";

  const parts = value.split("-");
  if (parts.length < 2) return value;

  const year = parts[0];
  const month = Number.parseInt(parts[1], 10);
  if (!year || Number.isNaN(month) || month < 1 || month > 12) return value;

  const shortMonths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const longMonths = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];

  if (format === "MM/YYYY") return `${String(month).padStart(2, "0")}/${year}`;
  if (format === "YYYY") return year;
  if (format === "MMMM YYYY") return `${longMonths[month - 1]} ${year}`;
  return `${shortMonths[month - 1]} ${year}`;
}

/**
 * Returns the base wrapper style for any resume template.
 *
 * - In printMode the wrapper is exactly A4 (210mm × min 297mm) with margin:auto
 *   so the browser/PDF engine renders one natural page width.
 * - In preview mode the wrapper fills its container (the scaled preview pane).
 * - `padded: true` means the template handles its own top-level padding here
 *   (single-column layouts). Two-column templates with a full-bleed header
 *   set padded:false and manage padding per-region themselves.
 */
export function resumeShellStyle(
  customization: ResumeCustomization | undefined,
  defaults: {
    fontFamily: string;
    fontSize: number;
    color: string;
    printMode?: boolean;
    /** Apply scaled page margins as padding (single-column templates). */
    padded?: boolean;
    display?: CSSProperties["display"];
    flexDirection?: CSSProperties["flexDirection"];
  }
): CSSProperties {
  const settings = { ...DEFAULT_RESUME_CUSTOMIZATION, ...customization };
  const { h, v } = pageMargins(customization);

  return {
    width: defaults.printMode ? "210mm" : "100%",
    minHeight: defaults.printMode ? "297mm" : undefined,
    margin: defaults.printMode ? "0 auto" : undefined,
    fontFamily: settings.fontFamily || defaults.fontFamily,
    fontSize: defaults.fontSize * settings.fontScale,
    lineHeight: settings.lineHeight,
    color: defaults.color,
    background: "#fff",
    boxSizing: "border-box",
    borderRadius: defaults.printMode ? undefined : 8,
    overflow: "hidden",
    padding: defaults.padded ? `${v}px ${h}px` : undefined,
    display: defaults.display,
    flexDirection: defaults.flexDirection,
  };
}

export function sectionGap(customization?: ResumeCustomization, base = 18): number {
  return Math.round(base * (customization?.sectionSpacing ?? DEFAULT_RESUME_CUSTOMIZATION.sectionSpacing));
}

export function lightAccent(accent: string): string {
  return `${accent}12`;
}

/**
 * resumeFlowState — legacy compatibility shim.
 *
 * The canonical source of truth is now the Redux store (persisted to
 * localStorage under "career-compass-resume-redux").
 *
 * This module provides thin helpers so existing call-sites (print page,
 * template selection page) keep working without change.
 *
 * New code should import directly from "@/store" instead.
 */

import type { ResumeCustomization, ResumeData, TemplateId } from "@/types/resume";
import type { ResumeState } from "@/store/resumeSlice";

const LS_KEY = "career-compass-resume-redux";   // must match store.ts
const SS_LEGACY_KEY = "career-compass-resume-flow"; // old sessionStorage key — kept for one-time read

export interface ResumeFlowState {
  data?: ResumeData;
  templateId?: TemplateId;
  customization?: ResumeCustomization;
  fromUpload?: boolean;
}

/** Read the current resume state from localStorage (written by the Redux store subscriber). */
export function loadResumeFlowState(): ResumeFlowState | null {
  // 1. Try new localStorage key first (Redux persisted state)
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<ResumeState>;
      return {
        data:          parsed.data,
        templateId:    parsed.templateId,
        customization: parsed.customization,
        fromUpload:    parsed.fromUpload,
      };
    }
  } catch { /* ignore */ }

  // 2. Fall back to old sessionStorage key (one-time migration path)
  try {
    const raw = sessionStorage.getItem(SS_LEGACY_KEY);
    if (raw) return JSON.parse(raw) as ResumeFlowState;
  } catch { /* ignore */ }

  return null;
}

/**
 * @deprecated State is now managed by the Redux store.
 * Kept so existing call-sites compile. Writes are intentionally no-ops —
 * the Redux subscriber writes to localStorage automatically.
 */
export function saveResumeFlowState(_state: ResumeFlowState): void {
  // no-op: Redux store handles persistence
}

/**
 * @deprecated Clears only the legacy sessionStorage key.
 * To fully reset, dispatch resetResume() from the Redux store.
 */
export function clearResumeFlowState(): void {
  try { sessionStorage.removeItem(SS_LEGACY_KEY); } catch { /* ignore */ }
}

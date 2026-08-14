import type { ResumeCustomization, ResumeData, TemplateId } from "@/types/resume";

const STORAGE_KEY = "career-compass-resume-flow";

export interface ResumeFlowState {
  data?: ResumeData;
  templateId?: TemplateId;
  customization?: ResumeCustomization;
  fromUpload?: boolean;
}

export function saveResumeFlowState(state: ResumeFlowState): void {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore quota errors
  }
}

export function loadResumeFlowState(): ResumeFlowState | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as ResumeFlowState;
  } catch {
    return null;
  }
}

export function clearResumeFlowState(): void {
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}

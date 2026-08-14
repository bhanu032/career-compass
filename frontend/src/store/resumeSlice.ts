/**
 * resumeSlice — Redux state for the entire resume builder flow.
 *
 * Holds:
 *   data         – ResumeData (personal, experience, education, skills, projects, certificates)
 *   templateId   – selected template
 *   customization – colors, fonts, spacing
 *   step         – current wizard step (0-6)
 *   fromUpload   – whether the resume was loaded from an uploaded file
 *
 * Persistence is handled externally in store.ts via a subscribe listener
 * that writes to localStorage, so state survives full page refreshes AND
 * back/forward navigation (unlike sessionStorage which is tab-scoped).
 */

import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { ResumeCustomization, ResumeData, TemplateId, ResumeSectionKey } from "@/types/resume";
import {
  DEFAULT_RESUME_CUSTOMIZATION,
  DEFAULT_SECTION_ORDER,
  SAMPLE_RESUME,
} from "@/types/resume";
import { customizationForTemplate } from "@/pages/resume/resumeTemplateUtils";

// ── Initial state ─────────────────────────────────────────────────────────────

export interface ResumeState {
  data: ResumeData;
  templateId: TemplateId;
  customization: ResumeCustomization;
  step: number;
  fromUpload: boolean;
}

const DEFAULT_TEMPLATE: TemplateId = "classic";

export const RESUME_INITIAL_STATE: ResumeState = {
  data: SAMPLE_RESUME,
  templateId: DEFAULT_TEMPLATE,
  customization: customizationForTemplate(DEFAULT_TEMPLATE, DEFAULT_RESUME_CUSTOMIZATION),
  step: 0,
  fromUpload: false,
};

// ── Slice ────────────────────────────────────────────────────────────────────

const resumeSlice = createSlice({
  name: "resume",
  initialState: RESUME_INITIAL_STATE,
  reducers: {
    /** Replace the entire resume data (used by upload flow & ATS apply) */
    setResumeData(state, action: PayloadAction<ResumeData>) {
      state.data = action.payload;
    },

    /** Merge a partial update into data (used by each step's onChange) */
    updateResumeData(state, action: PayloadAction<Partial<ResumeData>>) {
      state.data = { ...state.data, ...action.payload };
    },

    /** Switch template */
    setTemplateId(state, action: PayloadAction<TemplateId>) {
      state.templateId = action.payload;
    },

    /** Update customization (colors, font, spacing, etc.) */
    setCustomization(state, action: PayloadAction<ResumeCustomization>) {
      state.customization = action.payload;
    },

    /** Navigate to a specific wizard step */
    setStep(state, action: PayloadAction<number>) {
      state.step = action.payload;
    },

    /** Increment step (Next button) */
    nextStep(state) {
      state.step = Math.min(state.step + 1, 6);
    },

    /** Decrement step (Back button) */
    prevStep(state) {
      state.step = Math.max(state.step - 1, 0);
    },

    /** Mark whether resume came from file upload */
    setFromUpload(state, action: PayloadAction<boolean>) {
      state.fromUpload = action.payload;
    },

    /**
     * Hydrate the whole slice at once — used on app boot to restore
     * persisted state from localStorage (or migrated sessionStorage).
     */
    hydrateResume(state, action: PayloadAction<Partial<ResumeState>>) {
      const p = action.payload;
      if (p.data)          state.data          = p.data;
      if (p.templateId)    state.templateId    = p.templateId;
      if (p.customization) state.customization = p.customization;
      if (typeof p.step === "number") state.step = p.step;
      if (typeof p.fromUpload === "boolean") state.fromUpload = p.fromUpload;
    },

    /** Hard reset — clears everything back to defaults */
    resetResume() {
      return RESUME_INITIAL_STATE;
    },

    /**
     * Move a section up or down in sectionOrder.
     * direction: -1 = up, +1 = down
     */
    moveSectionInOrder(
      state,
      action: PayloadAction<{ key: ResumeSectionKey; direction: -1 | 1 }>
    ) {
      const { key, direction } = action.payload;
      const order: ResumeSectionKey[] = [
        ...(state.customization.sectionOrder?.length
          ? state.customization.sectionOrder
          : DEFAULT_SECTION_ORDER),
      ];
      const idx = order.indexOf(key);
      if (idx === -1) return;
      const newIdx = idx + direction;
      if (newIdx < 0 || newIdx >= order.length) return;
      // Swap
      [order[idx], order[newIdx]] = [order[newIdx], order[idx]];
      state.customization = { ...state.customization, sectionOrder: order };
    },

    /** Directly set the full section order array */
    setSectionOrder(state, action: PayloadAction<ResumeSectionKey[]>) {
      state.customization = {
        ...state.customization,
        sectionOrder: action.payload,
      };
    },
  },
});

export const {
  setResumeData,
  updateResumeData,
  setTemplateId,
  setCustomization,
  setStep,
  nextStep,
  prevStep,
  setFromUpload,
  hydrateResume,
  resetResume,
  moveSectionInOrder,
  setSectionOrder,
} = resumeSlice.actions;

export default resumeSlice.reducer;

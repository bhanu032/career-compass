// Barrel export — import everything from "@/store"
export { store, selectResume } from "./store";
export type { RootState, AppDispatch } from "./store";
export { useAppDispatch, useAppSelector } from "./hooks";
export {
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
} from "./resumeSlice";
export type { ResumeState } from "./resumeSlice";

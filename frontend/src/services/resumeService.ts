import { apiClient, extractErrorMessage } from "@/services/apiClient";
import type { ResumeData } from "@/types/resume";

export interface SuggestedChange {
  section: "summary" | "skills" | "experience" | "jobTitle";
  field: string;       // "summary" | "jobTitle" | "skill_add" | "exp_0_description" etc.
  original: string;
  suggested: string;
  reason: string;
}

export interface OptimizeResponse {
  changes: SuggestedChange[];
  ats_score_before: number;
  ats_score_after: number;
  ai_powered: boolean;
}

export const resumeService = {
  async optimize(resume: ResumeData, jdText: string): Promise<OptimizeResponse> {
    try {
      const { data } = await apiClient.post<OptimizeResponse>("/resume/optimize", {
        resume,
        jd_text: jdText,
      });
      return data;
    } catch (error) {
      throw new Error(extractErrorMessage(error, "Failed to analyse resume. Try again."));
    }
  },
};

/**
 * Resume landing — choose build from scratch or upload existing resume.
 */
import { useNavigate } from "react-router-dom";
import { ResumeEntryPage } from "@/pages/resume/ResumeEntryPage";
import { saveResumeFlowState } from "@/pages/resume/resumeFlowState";
import type { ResumeData } from "@/types/resume";

export function ResumeLandingPage(): JSX.Element {
  const navigate = useNavigate();

  function handleBuildNew() {
    saveResumeFlowState({ fromUpload: false });
    navigate("/resume-builder/templates");
  }

  function handleUpload(data: ResumeData) {
    saveResumeFlowState({ data, fromUpload: true });
    navigate("/resume-builder/templates", { state: { data, fromUpload: true } });
  }

  return <ResumeEntryPage onBuildNew={handleBuildNew} onUpload={handleUpload} />;
}

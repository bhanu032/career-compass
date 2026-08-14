/**
 * Dedicated print/PDF page — loads resume state from sessionStorage,
 * renders the full A4 resume, and triggers window.print() automatically.
 * Opened via window.open() from the Download PDF button.
 */
import { useEffect } from "react";
import { ResumePreview } from "@/pages/resume/ResumePreview";
import { loadResumeFlowState } from "@/pages/resume/resumeFlowState";
import { customizationForTemplate } from "@/pages/resume/resumeTemplateUtils";
import { DEFAULT_RESUME_CUSTOMIZATION, SAMPLE_RESUME } from "@/types/resume";

export function ResumePrintPage(): JSX.Element {
  const state = loadResumeFlowState();
  const templateId = state?.templateId ?? "classic";
  const data = state?.data ?? SAMPLE_RESUME;
  const customization =
    state?.customization ??
    customizationForTemplate(templateId, DEFAULT_RESUME_CUSTOMIZATION);

  useEffect(() => {
    // Give fonts and layout time to settle, then print
    const timer = setTimeout(() => {
      window.print();
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html, body { background: #fff; }
        @page { size: A4; margin: 0; }
        @media print {
          html, body { margin: 0; padding: 0; background: #fff; }
        }
        @media screen {
          body { background: #e2e8f0; display: flex; justify-content: center; padding: 40px 0; }
          #resume-print-wrapper {
            box-shadow: 0 8px 40px rgba(0,0,0,0.18);
            border-radius: 3px;
          }
        }
        .resume-avoid-break, .resume-section, .resume-item, table, tr {
          break-inside: avoid;
          page-break-inside: avoid;
        }
        .resume-section { break-after: auto; page-break-after: auto; }
        .resume-page-break { break-before: page; page-break-before: always; }
      `}</style>

      <div id="resume-print-wrapper" style={{ width: "210mm", background: "#fff" }}>
        <ResumePreview
          data={data}
          templateId={templateId}
          customization={customization}
          printMode={true}
        />
      </div>
    </>
  );
}

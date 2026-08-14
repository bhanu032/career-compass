/**
 * Dedicated print/PDF page — loads resume state from the Redux-persisted
 * localStorage entry, renders the full A4 resume, and triggers window.print().
 * Opened via window.open() from the Download PDF button.
 */
import { useEffect, useState } from "react";
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

  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Wait for two animation frames so React has fully painted the resume
    let raf1: number;
    let raf2: number;
    raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => {
        setReady(true);
      });
    });
    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
    };
  }, []);

  useEffect(() => {
    if (!ready) return;
    // Small extra delay to let fonts/images settle
    const timer = setTimeout(() => {
      window.print();
    }, 400);
    return () => clearTimeout(timer);
  }, [ready]);

  return (
    <>
      <style>{`
        * { box-sizing: border-box; }
        html, body { margin: 0; padding: 0; background: #fff; }
        @page { size: A4 portrait; margin: 12mm 15mm 12mm 15mm; }
        @media print {
          html, body { margin: 0; padding: 0; background: #fff !important; }
          #print-toolbar { display: none !important; }
          #resume-print-root {
            margin: 0 !important;
            box-shadow: none !important;
            width: 100% !important;
          }
        }
        @media screen {
          body { background: #cbd5e1; display: flex; flex-direction: column; align-items: center; padding: 24px 0 60px; gap: 16px; }
          #print-toolbar {
            position: fixed;
            top: 0; left: 0; right: 0;
            z-index: 100;
            background: #1e293b;
            color: #fff;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 10px 20px;
            font-family: system-ui, sans-serif;
            font-size: 14px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          }
          #print-toolbar button {
            background: #f97316;
            color: #fff;
            border: none;
            border-radius: 8px;
            padding: 8px 20px;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 8px;
          }
          #print-toolbar button:hover { background: #ea580c; }
          #resume-print-root {
            margin-top: 56px;
            width: 210mm !important;
            box-shadow: 0 8px 40px rgba(0,0,0,0.22);
            border-radius: 3px;
          }
        }
        .resume-avoid-break, .resume-section, .resume-item, table, tr, li {
          break-inside: avoid !important;
          page-break-inside: avoid !important;
        }
        h1, h2, h3, h4, .section-title, .section-header {
          break-after: avoid !important;
          page-break-after: avoid !important;
          break-inside: avoid !important;
        }
        p, li { orphans: 3; widows: 3; }
        .resume-section { break-after: auto; page-break-after: auto; }
        .resume-page-break { break-before: page !important; page-break-before: always !important; }
      `}</style>

      {/* Toolbar — only visible on screen, hidden on print */}
      <div id="print-toolbar">
        <span>Resume Preview</span>
        <button type="button" onClick={() => window.print()}>
          ⬇ Download PDF
        </button>
      </div>

      <ResumePreview
        data={data}
        templateId={templateId}
        customization={customization}
        printMode={true}
      />
    </>
  );
}

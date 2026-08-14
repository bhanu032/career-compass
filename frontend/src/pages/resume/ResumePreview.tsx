import type { ResumeCustomization, ResumeData, TemplateId } from "@/types/resume";
import { TemplateClassic }   from "@/pages/resume/templates/TemplateClassic";
import { TemplateModern }    from "@/pages/resume/templates/TemplateModern";
import { TemplateMinimal }   from "@/pages/resume/templates/TemplateMinimal";
import { TemplateExecutive } from "@/pages/resume/templates/TemplateExecutive";
import { TemplateSharp }     from "@/pages/resume/templates/TemplateSharp";
import { TemplateSlate }     from "@/pages/resume/templates/TemplateSlate";
import { TemplateTimeline }  from "@/pages/resume/templates/TemplateTimeline";
import { TemplateCompact }   from "@/pages/resume/templates/TemplateCompact";
import { TemplateProfessional } from "@/pages/resume/templates/TemplateProfessional";
import { TemplateLato }      from "@/pages/resume/templates/TemplateLato";
import { TemplateSidebar }   from "@/pages/resume/templates/TemplateSidebar";
import { TemplateCard }      from "@/pages/resume/templates/TemplateCard";

interface Props {
  data: ResumeData;
  templateId: TemplateId;
  customization?: ResumeCustomization;
  printMode?: boolean;
}

export function ResumePreview({ data, templateId, customization, printMode = true }: Props): JSX.Element {
  const props = { data, customization, printMode };
  return (
    <>
      <style>{`
        .resume-preview-root {
          background: #ffffff;
          color: #0f172a;
          position: relative;
        }
        .resume-preview-root * {
          box-sizing: border-box;
        }
        .resume-preview-root p,
        .resume-preview-root h1,
        .resume-preview-root h2,
        .resume-preview-root h3,
        .resume-preview-root h4 {
          overflow-wrap: anywhere;
        }
        
        /* ── Standard MS Word Automatic Page Break & Pagination Rules ── */
        .resume-avoid-break,
        .resume-section,
        .resume-item,
        .resume-preview-root table,
        .resume-preview-root tr,
        .resume-preview-root li {
          break-inside: avoid !important;
          page-break-inside: avoid !important;
        }
        
        /* Prevent orphan section titles at page bottom */
        .resume-preview-root h1,
        .resume-preview-root h2,
        .resume-preview-root h3,
        .resume-preview-root h4,
        .section-title,
        .section-header {
          break-after: avoid !important;
          page-break-after: avoid !important;
          break-inside: avoid !important;
        }

        .resume-preview-root p,
        .resume-preview-root li {
          orphans: 3;
          widows: 3;
        }

        .resume-section {
          break-after: auto;
          page-break-after: auto;
        }
        
        .resume-page-break {
          break-before: page !important;
          page-break-before: always !important;
        }

        /* Screen Word-style A4 visual page-break divider line at 1123px (A4 page height) */
        @media screen {
          #resume-print-root {
            position: relative;
          }
          #resume-print-root::after {
            content: "--- MS Word Standard Page Break (Page 2) ---";
            position: absolute;
            top: 1123px;
            left: 0;
            right: 0;
            height: 24px;
            background: rgba(226, 232, 240, 0.95);
            border-top: 2px dashed #94a3b8;
            border-bottom: 2px dashed #94a3b8;
            color: #475569;
            font-size: 11px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.08em;
            display: flex;
            align-items: center;
            justify-content: center;
            pointer-events: none;
            z-index: 50;
            box-shadow: 0 2px 4px rgba(0,0,0,0.05);
          }
        }
      `}</style>

      {printMode && (
        <style>{`
          @media print {
            body > * { display: none !important; }
            body > #resume-print-root,
            body > * > #resume-print-root { display: block !important; }
            #resume-print-root { position: static !important; inset: auto !important; background: #fff !important; }
            #resume-print-root * { display: revert; }
            #resume-print-root::after { display: none !important; }
            @page {
              size: A4 portrait;
              margin: 12mm 15mm 12mm 15mm;
            }
          }
        `}</style>
      )}

      <div id="resume-print-root" className="resume-preview-root">
        {templateId === "classic"   && <TemplateClassic   {...props} />}
        {templateId === "modern"    && <TemplateModern    {...props} />}
        {templateId === "minimal"   && <TemplateMinimal   {...props} />}
        {templateId === "executive" && <TemplateExecutive {...props} />}
        {templateId === "sharp"     && <TemplateSharp     {...props} />}
        {templateId === "slate"     && <TemplateSlate     {...props} />}
        {templateId === "timeline"  && <TemplateTimeline  {...props} />}
        {templateId === "compact"   && <TemplateCompact   {...props} />}
        {templateId === "ats"       && <TemplateProfessional {...props} templateId="ats" />}
        {templateId === "consulting" && <TemplateProfessional {...props} templateId="consulting" />}
        {templateId === "academic"  && <TemplateProfessional {...props} templateId="academic" />}
        {templateId === "portfolio" && <TemplateProfessional {...props} templateId="portfolio" />}
        {templateId === "custom"    && <TemplateProfessional {...props} templateId="custom" />}
        {templateId === "lato"      && <TemplateLato      {...props} />}
        {templateId === "sidebar"   && <TemplateSidebar   {...props} />}
        {templateId === "card"      && <TemplateCard      {...props} />}
      </div>
    </>
  );
}

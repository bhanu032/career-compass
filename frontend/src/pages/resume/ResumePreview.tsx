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
        
        /* ── Standard Page Break & Section Protection Rules ── */
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
          orphans: 2;
          widows: 2;
        }

        .resume-section {
          break-after: auto;
          page-break-after: auto;
        }
        
        .resume-page-break {
          break-before: page !important;
          page-break-before: always !important;
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
            @page {
              size: A4 portrait;
              margin: 10mm 12mm 10mm 12mm;
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

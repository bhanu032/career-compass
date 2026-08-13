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
        }
        .resume-preview-root * {
          box-sizing: border-box;
        }
        .resume-preview-root p,
        .resume-preview-root h1,
        .resume-preview-root h2,
        .resume-preview-root h3 {
          overflow-wrap: anywhere;
        }
        .resume-avoid-break,
        .resume-section,
        .resume-item,
        .resume-preview-root table,
        .resume-preview-root tr {
          break-inside: avoid;
          page-break-inside: avoid;
        }
        .resume-section {
          break-after: auto;
          page-break-after: auto;
        }
        .resume-page-break {
          break-before: page;
          page-break-before: always;
        }
      `}</style>
      {printMode && (
        <style>{`
          @media print {
            body > *:not(#resume-print-root) { display: none !important; }
            #resume-print-root { display: block !important; position: static !important; inset: auto !important; z-index: 9999; background: #fff; }
            @page { size: A4; margin: 0; }
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
      </div>
    </>
  );
}

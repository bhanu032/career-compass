import type { ResumeData, TemplateId } from "@/types/resume";
import { TemplateClassic }   from "@/pages/resume/templates/TemplateClassic";
import { TemplateModern }    from "@/pages/resume/templates/TemplateModern";
import { TemplateMinimal }   from "@/pages/resume/templates/TemplateMinimal";
import { TemplateExecutive } from "@/pages/resume/templates/TemplateExecutive";
import { TemplateSharp }     from "@/pages/resume/templates/TemplateSharp";
import { TemplateSlate }     from "@/pages/resume/templates/TemplateSlate";
import { TemplateTimeline }  from "@/pages/resume/templates/TemplateTimeline";
import { TemplateCompact }   from "@/pages/resume/templates/TemplateCompact";

interface Props {
  data: ResumeData;
  templateId: TemplateId;
  printMode?: boolean;
}

export function ResumePreview({ data, templateId, printMode = true }: Props): JSX.Element {
  const props = { data, printMode };
  return (
    <>
      {printMode && (
        <style>{`
          @media print {
            body > *:not(#resume-print-root) { display: none !important; }
            #resume-print-root { display: block !important; position: fixed; inset: 0; z-index: 9999; }
            @page { size: A4; margin: 0; }
          }
        `}</style>
      )}
      <div id="resume-print-root">
        {templateId === "classic"   && <TemplateClassic   {...props} />}
        {templateId === "modern"    && <TemplateModern    {...props} />}
        {templateId === "minimal"   && <TemplateMinimal   {...props} />}
        {templateId === "executive" && <TemplateExecutive {...props} />}
        {templateId === "sharp"     && <TemplateSharp     {...props} />}
        {templateId === "slate"     && <TemplateSlate     {...props} />}
        {templateId === "timeline"  && <TemplateTimeline  {...props} />}
        {templateId === "compact"   && <TemplateCompact   {...props} />}
      </div>
    </>
  );
}

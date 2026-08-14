import type { CSSProperties } from "react";
import type { ResumeCustomization, TemplateId } from "@/types/resume";
import { DEFAULT_RESUME_CUSTOMIZATION, SAMPLE_RESUME } from "@/types/resume";
import { ResumePreview } from "@/pages/resume/ResumePreview";
import { customizationForTemplate } from "@/pages/resume/resumeTemplateUtils";

export const A4_WIDTH = 794;
export const A4_HEIGHT = 1123;

interface Props {
  templateId: TemplateId;
  scale?: number;
  customization?: ResumeCustomization;
  className?: string;
  style?: CSSProperties;
}

export function TemplatePreviewThumbnail({
  templateId,
  scale = 0.18,
  customization,
  className,
  style,
}: Props): JSX.Element {
  const resolvedCustomization =
    customization ?? customizationForTemplate(templateId, DEFAULT_RESUME_CUSTOMIZATION);

  const scaledWidth = Math.round(A4_WIDTH * scale);
  const scaledHeight = Math.round(A4_HEIGHT * scale);

  return (
    <div
      className={className}
      style={{
        width: scaledWidth,
        height: scaledHeight,
        overflow: "hidden",
        background: "#fff",
        ...style,
      }}
    >
      <div
        style={{
          transform: `scale(${scale})`,
          transformOrigin: "top left",
          width: A4_WIDTH,
          minHeight: A4_HEIGHT,
          pointerEvents: "none",
        }}
      >
        <ResumePreview
          data={SAMPLE_RESUME}
          templateId={templateId}
          customization={resolvedCustomization}
          printMode={false}
        />
      </div>
    </div>
  );
}

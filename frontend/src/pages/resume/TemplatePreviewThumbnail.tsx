import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import type { ResumeCustomization, TemplateId } from "@/types/resume";
import { DEFAULT_RESUME_CUSTOMIZATION, SAMPLE_RESUME } from "@/types/resume";
import { ResumePreview } from "@/pages/resume/ResumePreview";
import { customizationForTemplate } from "@/pages/resume/resumeTemplateUtils";

export const A4_WIDTH = 794;
export const A4_HEIGHT = 1123;

interface Props {
  templateId: TemplateId;
  /** Fixed scale — ignored when `fill` is true. */
  scale?: number;
  /** Scale to fill the parent box as much as possible. */
  fill?: boolean;
  /**
   * How to scale when `fill` is true.
   * - "cover"  → fills the entire box (default for grid cards, may clip edges)
   * - "contain" → fits fully inside the box (default for large preview panel)
   */
  fillMode?: FillMode;
  customization?: ResumeCustomization;
  className?: string;
  style?: CSSProperties;
}

type FillMode = "contain" | "cover";

function useFitScale(enabled: boolean, mode: FillMode = "cover") {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.2);

  useEffect(() => {
    if (!enabled) return;

    const el = containerRef.current;
    if (!el) return;

    const update = () => {
      const width = el.clientWidth;
      const height = el.clientHeight;
      if (width <= 0 || height <= 0) return;

      // cover → scale to fill width (card aspect is 3:4, A4 is ~0.707:1 — width is the binding axis)
      // contain → scale to fit fully (use the smaller axis)
      const scaleX = width / A4_WIDTH;
      const scaleY = height / A4_HEIGHT;
      setScale(mode === "cover" ? scaleX : Math.min(scaleX, scaleY));
    };

    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, [enabled, mode]);

  return { containerRef, scale };
}

export function TemplatePreviewThumbnail({
  templateId,
  scale = 0.18,
  fill = false,
  fillMode = "cover",
  customization,
  className,
  style,
}: Props): JSX.Element {
  const resolvedCustomization =
    customization ?? customizationForTemplate(templateId, DEFAULT_RESUME_CUSTOMIZATION);

  const { containerRef, scale: fitScale } = useFitScale(fill, fillMode);

  const preview = (
    <ResumePreview
      data={SAMPLE_RESUME}
      templateId={templateId}
      customization={resolvedCustomization}
      printMode={false}
    />
  );

  if (fill) {
    return (
      <div
        ref={containerRef}
        className={className}
        style={{
          width: "100%",
          height: "100%",
          overflow: "hidden",
          background: "#fff",
          position: "relative",
          ...style,
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            transform: `scale(${fitScale})`,
            transformOrigin: "top left",
            width: A4_WIDTH,
            height: A4_HEIGHT,
            pointerEvents: "none",
          }}
        >
          {preview}
        </div>
      </div>
    );
  }

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
        {preview}
      </div>
    </div>
  );
}

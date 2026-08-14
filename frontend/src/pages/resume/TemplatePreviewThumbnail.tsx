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
   * - "cover"   → scale to fill width, clip height (grid cards)
   * - "contain" → scale to fit inside fixed-height box (no scroll)
   * - "scroll"  → scale to fill width, natural height (scrollable preview panel)
   */
  fillMode?: FillMode;
  customization?: ResumeCustomization;
  /** Resume data to preview. Defaults to SAMPLE_RESUME if not provided. */
  data?: import("@/types/resume").ResumeData;
  className?: string;
  style?: CSSProperties;
}

type FillMode = "contain" | "cover" | "scroll";

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
      if (width <= 0) return;

      const scaleX = width / A4_WIDTH;

      if (mode === "cover" || mode === "scroll") {
        setScale(scaleX);
      } else {
        // contain — fit inside both dimensions
        if (height <= 0) return;
        const scaleY = height / A4_HEIGHT;
        setScale(Math.min(scaleX, scaleY));
      }
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
  data,
  className,
  style,
}: Props): JSX.Element {
  const resolvedCustomization =
    customization ?? customizationForTemplate(templateId, DEFAULT_RESUME_CUSTOMIZATION);

  const previewData = data ?? SAMPLE_RESUME;

  const { containerRef, scale: fitScale } = useFitScale(fill, fillMode);

  const preview = (
    <ResumePreview
      data={previewData}
      templateId={templateId}
      customization={resolvedCustomization}
      printMode={false}
    />
  );

  if (fill) {
    // "scroll" mode: scale to width, natural height — parent must handle overflow-y-auto
    if (fillMode === "scroll") {
      const scaledH = Math.round(A4_HEIGHT * fitScale);
      return (
        <div
          ref={containerRef}
          className={className}
          style={{
            width: "100%",
            background: "#fff",
            position: "relative",
            ...style,
          }}
        >
          {/* spacer to give natural height */}
          <div style={{ height: scaledH, pointerEvents: "none" }} />
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              transform: `scale(${fitScale})`,
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

    // "cover" / "contain" mode: fixed-height container
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

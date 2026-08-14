/**
 * useResumeDownload
 *
 * Renders a hidden full-A4 resume node, captures it pixel-perfectly
 * with html2canvas, then downloads a PDF directly — no new tab, no
 * print dialog.
 *
 * Usage:
 *   const { isDownloading, progress, triggerDownload } = useResumeDownload();
 *   <button onClick={() => triggerDownload(data, templateId, customization)} />
 *
 * The hook injects a hidden 794px container, renders ResumePreview into it
 * via a portal, waits for paint, then calls exportResumeToPdf.
 */

import { useCallback, useRef, useState } from "react";
import ReactDOM from "react-dom/client";
import React from "react";
import type { ResumeCustomization, ResumeData, TemplateId } from "@/types/resume";
import { exportResumeToPdf } from "@/utils/pdfExport";
import { ResumePreview } from "@/pages/resume/ResumePreview";

export interface DownloadState {
  isDownloading: boolean;
  progress: number;  // 0–100
  error: string | null;
}

function buildFilename(data: ResumeData): string {
  const name  = (data.personal.fullName  || "Resume").trim().replace(/\s+/g, "_");
  const title = (data.personal.jobTitle || "").trim().replace(/\s+/g, "_");
  return title ? `${name}_${title}_Resume` : `${name}_Resume`;
}

export function useResumeDownload() {
  const [state, setState] = useState<DownloadState>({
    isDownloading: false,
    progress: 0,
    error: null,
  });
  const busyRef = useRef(false);

  const triggerDownload = useCallback(
    async (
      data: ResumeData,
      templateId: TemplateId,
      customization: ResumeCustomization | undefined,
      filename?: string,
    ) => {
      if (busyRef.current) return;
      busyRef.current = true;
      setState({ isDownloading: true, progress: 0, error: null });

      // ── Create hidden container ─────────────────────────────────────────
      const container = document.createElement("div");
      Object.assign(container.style, {
        position:      "fixed",
        top:           "0",
        left:          "0",
        width:         "794px",
        minHeight:     "1123px",
        background:    "#ffffff",
        zIndex:        "-9999",
        pointerEvents: "none",
        overflow:      "visible",
      });
      document.body.appendChild(container);

      const reactRoot = ReactDOM.createRoot(container);

      try {
        // ── Render ResumePreview into the hidden container ─────────────────
        await new Promise<void>((resolve) => {
          reactRoot.render(
            React.createElement(ResumePreview, {
              data,
              templateId,
              customization,
              printMode: false,
            })
          );
          // Two rAFs + small delay to let React paint + fonts load
          requestAnimationFrame(() =>
            requestAnimationFrame(() => setTimeout(resolve, 250))
          );
        });

        // ── Find the resume root element ───────────────────────────────────
        const el =
          (container.querySelector("#resume-print-root") as HTMLElement | null) ??
          (container.firstElementChild as HTMLElement | null);

        if (!el) throw new Error("Resume element not found after render.");

        // ── Export to PDF ──────────────────────────────────────────────────
        await exportResumeToPdf({
          element: el,
          filename: filename ?? buildFilename(data),
          onProgress: (pct) => {
            setState((s) => ({ ...s, progress: pct }));
          },
        });

        setState({ isDownloading: false, progress: 100, error: null });
      } catch (err) {
        setState({
          isDownloading: false,
          progress: 0,
          error:
            err instanceof Error
              ? err.message
              : "PDF export failed. Please try again.",
        });
      } finally {
        busyRef.current = false;
        try { reactRoot.unmount(); }   catch { /* ignore */ }
        try { document.body.removeChild(container); } catch { /* ignore */ }
      }
    },
    [],
  );

  const clearError = useCallback(
    () => setState((s) => ({ ...s, error: null })),
    [],
  );

  return { ...state, triggerDownload, clearError };
}

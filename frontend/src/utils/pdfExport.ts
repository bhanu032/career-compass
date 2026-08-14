/**
 * pdfExport — pixel-perfect browser-direct PDF download.
 *
 * Strategy:
 *   1. Accept a pre-rendered HTMLElement (the resume DOM node).
 *   2. Clone it into a hidden off-screen container at full A4 width (794px).
 *   3. Capture with html2canvas at 3× DPI for crisp text.
 *   4. Slice into A4-sized pages and assemble with jsPDF.
 *   5. Trigger a direct browser download — no dialog, no new tab.
 *
 * Why html2canvas + jsPDF instead of window.print():
 *   - Zero print-dialog; fully automatic download.
 *   - CSS (including Tailwind utility classes) is captured as rendered pixels —
 *     no CSS reset or @media print surprises.
 *   - Inline styles (all our templates use them) render perfectly.
 *   - Works across Chrome, Firefox, Edge, Safari.
 */

import html2canvas from "html2canvas";
import jsPDF from "jspdf";

// A4 dimensions
const A4_WIDTH_MM  = 210;
const A4_HEIGHT_MM = 297;
const A4_PX_WIDTH  = 794;   // ~210mm @ 96 dpi
const A4_PX_HEIGHT = 1123;  // ~297mm @ 96 dpi

const SCALE = 3; // 3× for crisp retina-quality output

export interface ExportOptions {
  /** The resume's root HTMLElement to capture */
  element: HTMLElement;
  /** Filename without extension */
  filename?: string;
  /** Progress callback 0-100 */
  onProgress?: (pct: number) => void;
}

export async function exportResumeToPdf({
  element,
  filename = "Resume",
  onProgress,
}: ExportOptions): Promise<void> {
  onProgress?.(5);

  // ── 1. Build an off-screen clone at exact A4 width ───────────────────────
  const wrapper = document.createElement("div");
  Object.assign(wrapper.style, {
    position:      "fixed",
    top:           "0px",
    left:          "0px",
    width:         `${A4_PX_WIDTH}px`,
    minHeight:     `${A4_PX_HEIGHT}px`,
    background:    "#ffffff",
    zIndex:        "-9999",
    pointerEvents: "none",
    overflow:      "visible",
  });

  const clone = element.cloneNode(true) as HTMLElement;
  Object.assign(clone.style, {
    width:     `${A4_PX_WIDTH}px`,
    minHeight: `${A4_PX_HEIGHT}px`,
    transform: "none",
    position:  "static",
    margin:    "0",
    padding:   clone.style.padding || "0",
  });

  wrapper.appendChild(clone);
  document.body.appendChild(wrapper);

  onProgress?.(15);

  // Wait two frames so layout fully settles
  await new Promise<void>((res) =>
    requestAnimationFrame(() => requestAnimationFrame(() => res()))
  );

  // ── 2. Capture with html2canvas ──────────────────────────────────────────
  let canvas: HTMLCanvasElement;
  try {
    canvas = await html2canvas(wrapper, {
      scale:           SCALE,
      useCORS:         true,
      allowTaint:      false,
      backgroundColor: "#ffffff",
      logging:         false,
      windowWidth:     A4_PX_WIDTH,
      windowHeight:    wrapper.scrollHeight,
      width:           A4_PX_WIDTH,
      height:          wrapper.scrollHeight,
      x: 0,
      y: 0,
    });
  } finally {
    try { document.body.removeChild(wrapper); } catch { /* ignore */ }
  }

  onProgress?.(65);

  // ── 3. Assemble PDF ──────────────────────────────────────────────────────
  const pdf = new jsPDF({
    orientation: "portrait",
    unit:        "mm",
    format:      "a4",
    compress:    true,
  });

  const canvasWidth    = canvas.width;
  const canvasHeight   = canvas.height;
  const pageHeightPx   = A4_PX_HEIGHT * SCALE;
  const totalPages     = Math.ceil(canvasHeight / pageHeightPx);
  const progressSlice  = 28 / totalPages; // 65-93 allocated to page building

  for (let page = 0; page < totalPages; page++) {
    if (page > 0) pdf.addPage("a4", "portrait");

    const srcY      = page * pageHeightPx;
    const srcHeight = Math.min(pageHeightPx, canvasHeight - srcY);

    // Slice this page from the full canvas
    const pageCanvas = document.createElement("canvas");
    pageCanvas.width  = canvasWidth;
    pageCanvas.height = pageHeightPx;
    const ctx = pageCanvas.getContext("2d")!;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvasWidth, pageHeightPx);
    ctx.drawImage(
      canvas,
      0, srcY, canvasWidth, srcHeight,  // source rect
      0, 0,    canvasWidth, srcHeight,  // dest rect (top of page canvas)
    );

    pdf.addImage(
      pageCanvas.toDataURL("image/jpeg", 0.97),
      "JPEG",
      0, 0,
      A4_WIDTH_MM,
      A4_HEIGHT_MM,
    );

    onProgress?.(65 + Math.round((page + 1) * progressSlice));
  }

  onProgress?.(95);

  // ── 4. Direct download ───────────────────────────────────────────────────
  const safe = filename.replace(/[^a-z0-9_\-. ]/gi, "_").trim() || "Resume";
  pdf.save(`${safe}.pdf`);

  onProgress?.(100);
}

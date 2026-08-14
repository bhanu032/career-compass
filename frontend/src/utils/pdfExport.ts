/**
 * pdfExport — pixel-perfect, section-aware PDF export.
 *
 * Key improvement over naive slicing:
 *   Instead of cutting the canvas at fixed A4-height intervals (which splits
 *   rows/sections mid-element), we:
 *     1. Capture the full resume as one tall canvas at 3× DPI.
 *     2. Walk every .resume-section and .resume-item element in the DOM clone
 *        to find their actual rendered top/bottom positions.
 *     3. Build page-break points that always fall in the whitespace GAP between
 *        sections — never through a skill row, experience block, etc.
 *     4. Slice the canvas at those smart break points and write one jsPDF page
 *        per slice (each slice is padded to full A4 height with white fill).
 */

import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const A4_W_MM  = 210;
const A4_H_MM  = 297;
const A4_W_PX  = 794;
const A4_H_PX  = 1123;
const SCALE    = 3;          // 3× for crisp retina output
const SAFE_PX  = 20;        // minimum gap (px) to leave at top/bottom of each page

export interface ExportOptions {
  element: HTMLElement;
  filename?: string;
  onProgress?: (pct: number) => void;
}

// ─── helpers ─────────────────────────────────────────────────────────────────

/**
 * Collect the top/bottom pixel positions (relative to `root`) of every
 * element that must not be split across pages.
 */
function collectProtectedRanges(
  root: HTMLElement,
  container: HTMLElement,
): Array<{ top: number; bottom: number }> {
  const containerTop = container.getBoundingClientRect().top;

  const selector = [
    ".resume-section",
    ".resume-item",
    ".resume-avoid-break",
  ].join(",");

  const elements = root.querySelectorAll<HTMLElement>(selector);
  const ranges: Array<{ top: number; bottom: number }> = [];

  elements.forEach((el) => {
    const rect = el.getBoundingClientRect();
    const top    = rect.top    - containerTop;
    const bottom = rect.bottom - containerTop;
    if (bottom > top && bottom > 0) {
      ranges.push({ top: Math.floor(top), bottom: Math.ceil(bottom) });
    }
  });

  return ranges;
}

/**
 * Given the total canvas height (at 1× logical px, i.e. ÷ SCALE) and the
 * list of protected ranges, compute the best y-positions to cut pages.
 *
 * Rules:
 *   - Each page is at most A4_H_PX tall.
 *   - A cut is only valid if it falls outside every protected range.
 *   - We try to cut as close to A4_H_PX as possible, scanning backward from
 *     the ideal cut point until we find a gap between elements.
 */
function computePageBreaks(
  totalHeightPx: number,
  protected_: Array<{ top: number; bottom: number }>,
): number[] {
  const breaks: number[] = [0];
  let pageStart = 0;

  while (pageStart < totalHeightPx) {
    const idealEnd = pageStart + A4_H_PX;
    if (idealEnd >= totalHeightPx) break; // last page — no break needed

    // Scan backward from idealEnd to find the nearest safe cut point
    let cut = idealEnd;
    let found = false;

    // Try positions from idealEnd down to (pageStart + SAFE_PX)
    for (let y = idealEnd; y > pageStart + SAFE_PX; y -= 1) {
      const blocked = protected_.some(
        (r) => y > r.top + SAFE_PX && y < r.bottom - SAFE_PX,
      );
      if (!blocked) {
        cut = y;
        found = true;
        break;
      }
    }

    if (!found) {
      // No safe cut found — fall back to ideal to avoid infinite loop
      cut = idealEnd;
    }

    breaks.push(cut);
    pageStart = cut;
  }

  breaks.push(totalHeightPx);
  return breaks;
}

// ─── main export ─────────────────────────────────────────────────────────────

export async function exportResumeToPdf({
  element,
  filename = "Resume",
  onProgress,
}: ExportOptions): Promise<void> {
  onProgress?.(5);

  // ── 1. Build hidden off-screen clone at A4 width ─────────────────────────
  const container = document.createElement("div");
  Object.assign(container.style, {
    position:      "fixed",
    top:           "0px",
    left:          "0px",
    width:         `${A4_W_PX}px`,
    minHeight:     `${A4_H_PX}px`,
    background:    "#ffffff",
    zIndex:        "-9999",
    pointerEvents: "none",
    overflow:      "visible",
  });

  const clone = element.cloneNode(true) as HTMLElement;
  Object.assign(clone.style, {
    width:     `${A4_W_PX}px`,
    minHeight: `${A4_H_PX}px`,
    transform: "none",
    position:  "static",
    margin:    "0",
  });

  container.appendChild(clone);
  document.body.appendChild(container);

  onProgress?.(10);

  // Wait two rAFs for layout + fonts to settle
  await new Promise<void>((res) =>
    requestAnimationFrame(() => requestAnimationFrame(() => setTimeout(res, 150))),
  );

  onProgress?.(15);

  // ── 2. Collect protected element ranges BEFORE capturing canvas ──────────
  const logicalHeight = container.scrollHeight;
  const protectedRanges = collectProtectedRanges(clone, container);

  // ── 3. Capture full canvas ───────────────────────────────────────────────
  let canvas: HTMLCanvasElement;
  try {
    canvas = await html2canvas(container, {
      scale:           SCALE,
      useCORS:         true,
      allowTaint:      false,
      backgroundColor: "#ffffff",
      logging:         false,
      windowWidth:     A4_W_PX,
      windowHeight:    logicalHeight,
      width:           A4_W_PX,
      height:          logicalHeight,
      x: 0,
      y: 0,
    });
  } finally {
    try { document.body.removeChild(container); } catch { /* ignore */ }
  }

  onProgress?.(60);

  // ── 4. Compute smart page breaks ─────────────────────────────────────────
  const pageBreaks = computePageBreaks(logicalHeight, protectedRanges);

  // ── 5. Build PDF ──────────────────────────────────────────────────────────
  const pdf = new jsPDF({
    orientation: "portrait",
    unit:        "mm",
    format:      "a4",
    compress:    true,
  });

  const totalPages   = pageBreaks.length - 1;
  const progressPer  = 35 / Math.max(totalPages, 1);

  for (let i = 0; i < totalPages; i++) {
    if (i > 0) pdf.addPage("a4", "portrait");

    const sliceTopPx    = pageBreaks[i]    * SCALE;  // canvas coords
    const sliceBottomPx = pageBreaks[i + 1] * SCALE;
    const sliceHeightPx = sliceBottomPx - sliceTopPx;

    // Draw this slice onto a fresh A4-sized canvas (white background)
    const pageCanvas = document.createElement("canvas");
    pageCanvas.width  = canvas.width;           // A4_W_PX * SCALE
    pageCanvas.height = A4_H_PX * SCALE;        // always full A4 height
    const ctx = pageCanvas.getContext("2d")!;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, pageCanvas.width, pageCanvas.height);

    ctx.drawImage(
      canvas,
      0,           sliceTopPx,    // source x, y
      canvas.width, sliceHeightPx, // source w, h
      0,           0,             // dest x, y
      canvas.width, sliceHeightPx, // dest w, h (keep same scale, white fills rest)
    );

    pdf.addImage(
      pageCanvas.toDataURL("image/jpeg", 0.96),
      "JPEG",
      0, 0,
      A4_W_MM, A4_H_MM,
    );

    onProgress?.(60 + Math.round((i + 1) * progressPer));
  }

  onProgress?.(97);

  // ── 6. Direct download ────────────────────────────────────────────────────
  const safe = (filename || "Resume").replace(/[^a-z0-9_\-. ]/gi, "_").trim();
  pdf.save(`${safe}.pdf`);

  onProgress?.(100);
}

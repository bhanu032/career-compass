/**
 * pdfExport — pixel-perfect, section-aware PDF export with zero blank gaps.
 *
 * Page-break strategy (FORWARD PUSH — no blank gaps):
 *   1. Capture the full resume as one tall canvas at 3× DPI.
 *   2. Walk every .resume-section / .resume-item / .resume-avoid-break element
 *      to get their exact bounding boxes inside the container.
 *   3. For each A4 page boundary, check if it would cut through a protected
 *      element. If yes, push the CUT POINT FORWARD to just AFTER the last
 *      element that fits entirely on the current page — meaning the cut is
 *      always in the WHITESPACE BELOW a section, not inside it.
 *   4. Slice canvas at those clean cut points. No blank trailing space.
 */

import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const A4_W_MM  = 210;
const A4_H_MM  = 297;
const A4_W_PX  = 794;
const A4_H_PX  = 1123;
const SCALE    = 3;
const MIN_MARGIN = 8;  // px — minimum gap to leave at bottom of page before cut

export interface ExportOptions {
  element: HTMLElement;
  filename?: string;
  onProgress?: (pct: number) => void;
}

// ── helpers ───────────────────────────────────────────────────────────────────

interface Range { top: number; bottom: number; }

function collectProtectedRanges(root: HTMLElement, containerTop: number): Range[] {
  const sel = ".resume-section, .resume-item, .resume-avoid-break";
  const ranges: Range[] = [];
  root.querySelectorAll<HTMLElement>(sel).forEach((el) => {
    const r = el.getBoundingClientRect();
    const top    = Math.floor(r.top    - containerTop);
    const bottom = Math.ceil (r.bottom - containerTop);
    if (bottom > top && bottom > 0) ranges.push({ top, bottom });
  });
  // Also treat every direct child as protected so headers never get split
  Array.from(root.children).forEach((el) => {
    const r = (el as HTMLElement).getBoundingClientRect();
    const top    = Math.floor(r.top    - containerTop);
    const bottom = Math.ceil (r.bottom - containerTop);
    if (bottom > top && bottom > 0) ranges.push({ top, bottom });
  });
  return ranges;
}

/**
 * Forward-push page break computation.
 *
 * For each page:
 *   - idealCut = pageStart + A4_H_PX
 *   - Find the last element whose BOTTOM is ≤ idealCut - MIN_MARGIN
 *   - Cut right after that element (i.e. cut = element.bottom + 1)
 *   - This means the next page starts with the element that wouldn't fit,
 *     and the current page has NO orphaned blank space.
 */
function computePageBreaks(totalPx: number, ranges: Range[]): number[] {
  const breaks: number[] = [0];
  let pageStart = 0;

  while (pageStart < totalPx) {
    const idealCut = pageStart + A4_H_PX;
    if (idealCut >= totalPx) break;

    // Find all elements that START within this page
    // The last one whose BOTTOM fits entirely is our cut anchor
    let bestCut = pageStart + MIN_MARGIN; // fallback: cut as early as possible
    for (const r of ranges) {
      // Element starts on this page
      if (r.top >= pageStart && r.bottom <= idealCut - MIN_MARGIN) {
        // It fits entirely — record its bottom as a potential cut
        if (r.bottom > bestCut) bestCut = r.bottom;
      }
    }

    // If no element fits at all (one giant element), force cut at idealCut
    if (bestCut === pageStart + MIN_MARGIN) bestCut = idealCut;

    breaks.push(bestCut);
    pageStart = bestCut;
  }

  breaks.push(totalPx);
  return breaks;
}

// ── main ──────────────────────────────────────────────────────────────────────

export async function exportResumeToPdf({
  element,
  filename = "Resume",
  onProgress,
}: ExportOptions): Promise<void> {
  onProgress?.(5);

  // 1. Off-screen clone at A4 width
  // Positioned far off-screen to the left so it's never visible to the user,
  // but NOT visibility:hidden — html2canvas needs the element to be in the
  // normal rendering pipeline to capture CSS correctly.
  const container = document.createElement("div");
  Object.assign(container.style, {
    position:      "fixed",
    top:           "0px",
    left:          "-9999px",
    width:         `${A4_W_PX}px`,
    minHeight:     `${A4_H_PX}px`,
    background:    "#ffffff",
    zIndex:        "9999",          // high z-index so it paints above everything
    pointerEvents: "none",
    overflow:      "visible",
  });

  const clone = element.cloneNode(true) as HTMLElement;
  Object.assign(clone.style, {
    width:      `${A4_W_PX}px`,
    minHeight:  `${A4_H_PX}px`,
    transform:  "none",
    position:   "static",
    margin:     "0",
    padding:    "0",
    boxShadow:  "none",
    border:     "none",
    visibility: "visible",
    opacity:    "1",
    webkitPrintColorAdjust: "exact",
    printColorAdjust: "exact",
  });
  container.appendChild(clone);
  document.body.appendChild(container);

  onProgress?.(10);

  // Wait for layout + fonts
  await new Promise<void>((res) =>
    requestAnimationFrame(() => requestAnimationFrame(() => setTimeout(res, 400))),
  );

  onProgress?.(15);

  // 2. Collect protected ranges from the LIVE clone (before canvas capture)
  // getBoundingClientRect() returns coords relative to viewport.
  // Since the container is position:fixed at top:0,left:-9999px,
  // we need the container's rect to compute relative positions correctly.
  const containerRect = container.getBoundingClientRect();
  const protectedRanges = collectProtectedRanges(clone, containerRect.top);
  const logicalHeight   = container.scrollHeight;

  // 3. Capture full canvas
  // scrollX/scrollY = 0 because our container is fixed and off-screen to the left;
  // its getBoundingClientRect() already reflects its viewport position.
  let canvas: HTMLCanvasElement;
  try {
    canvas = await html2canvas(container, {
      scale:         SCALE,
      useCORS:       true,
      allowTaint:    false,
      backgroundColor: "#ffffff",
      logging:       false,
      scrollX:       0,
      scrollY:       0,
      windowWidth:   A4_W_PX,
      windowHeight:  logicalHeight,
      width:         A4_W_PX,
      height:        logicalHeight,
      x:             0,
      y:             0,
    });
  } finally {
    try { document.body.removeChild(container); } catch { /* ignore */ }
  }

  onProgress?.(60);

  // 4. Compute smart page breaks
  const pageBreaks  = computePageBreaks(logicalHeight, protectedRanges);
  const totalPages  = pageBreaks.length - 1;

  // 5. Build PDF
  const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4", compress: true });

  for (let i = 0; i < totalPages; i++) {
    if (i > 0) pdf.addPage("a4", "portrait");

    const topPx    = pageBreaks[i]     * SCALE;
    const bottomPx = pageBreaks[i + 1] * SCALE;
    const sliceH   = bottomPx - topPx;

    // Draw slice onto a fresh A4 canvas (white-filled so last page looks clean)
    const pc = document.createElement("canvas");
    pc.width  = canvas.width;
    pc.height = A4_H_PX * SCALE;
    const ctx = pc.getContext("2d")!;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, pc.width, pc.height);
    ctx.drawImage(canvas, 0, topPx, canvas.width, sliceH, 0, 0, canvas.width, sliceH);

    pdf.addImage(pc.toDataURL("image/jpeg", 0.97), "JPEG", 0, 0, A4_W_MM, A4_H_MM);
    onProgress?.(60 + Math.round(((i + 1) / totalPages) * 35));
  }

  onProgress?.(97);

  const safe = (filename || "Resume").replace(/[^a-z0-9_\-. ]/gi, "_").trim();
  pdf.save(`${safe}.pdf`);

  onProgress?.(100);
}

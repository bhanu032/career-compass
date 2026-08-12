/**
 * Resume parser — extracts structured ResumeData from a plain-text resume.
 * Works 100% in the browser using FileReader, no backend needed.
 *
 * Supports: .txt, .pdf (text layer via PDF.js), and copy-pasted text.
 *
 * Strategy: regex heuristics to find sections, then extract fields.
 */

import type { ResumeData, Experience, Education, Skill } from "@/types/resume";
import { nanoid } from "@/utils/nanoid";

// ── Text extraction ───────────────────────────────────────────────────────────

export async function extractTextFromFile(file: File): Promise<string> {
  if (file.type === "application/pdf" || file.name.endsWith(".pdf")) {
    return extractTextFromPdf(file);
  }
  // Plain text / .txt / .docx text fallback
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve((e.target?.result as string) ?? "");
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsText(file, "utf-8");
  });
}

async function extractTextFromPdf(file: File): Promise<string> {
  // Try to use PDF.js if available, otherwise fall back to raw text extraction
  try {
    const arrayBuffer = await file.arrayBuffer();
    // Simple text extraction from PDF byte stream (looks for text objects)
    const decoder = new TextDecoder("latin1");
    const raw = decoder.decode(arrayBuffer);
    // Extract text between BT/ET markers and clean up
    const matches = raw.match(/BT[\s\S]*?ET/g) ?? [];
    const lines: string[] = [];
    matches.forEach((block) => {
      const texts = block.match(/\((.*?)\)\s*Tj/g) ?? [];
      texts.forEach((t) => {
        const content = t.replace(/^\(/, "").replace(/\)\s*Tj$/, "").trim();
        if (content.length > 1) lines.push(content);
      });
    });
    if (lines.length > 10) return lines.join("\n");
  } catch {
    // ignore
  }
  // Final fallback — read as text (works for text-based PDFs)
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve((e.target?.result as string) ?? "");
    reader.onerror = () => reject(new Error("Failed to read PDF"));
    reader.readAsText(file, "utf-8");
  });
}

// ── Section detection ─────────────────────────────────────────────────────────

const SECTION_PATTERNS: Record<string, RegExp> = {
  experience:   /\b(work\s*experience|employment|career|professional\s*experience|work\s*history)\b/i,
  education:    /\b(education|academic|qualification|degree|university|college)\b/i,
  skills:       /\b(skills?|technical\s*skills?|core\s*competencies|expertise)\b/i,
  projects:     /\b(projects?|portfolio|work\s*samples?)\b/i,
  certificates: /\b(certifications?|certificates?|licen[sc]es?|awards?)\b/i,
  summary:      /\b(summary|objective|profile|about\s*me|overview|introduction)\b/i,
};

function splitIntoSections(text: string): Record<string, string> {
  const lines = text.split(/\n/);
  const sections: Record<string, string> = { header: "", experience: "", education: "", skills: "", projects: "", certificates: "", summary: "" };
  let current = "header";

  lines.forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed) return;

    // Detect section headings (short line, mostly uppercase or matches pattern)
    const isHeading = trimmed.length < 50 && (
      trimmed === trimmed.toUpperCase() ||
      Object.entries(SECTION_PATTERNS).some(([key, pat]) => {
        if (pat.test(trimmed)) { current = key; return true; }
        return false;
      })
    );

    if (!isHeading) {
      sections[current] = (sections[current] ?? "") + "\n" + line;
    }
  });

  return sections;
}

// ── Field extractors ──────────────────────────────────────────────────────────

function extractEmail(text: string): string {
  const m = text.match(/[\w.+%-]+@[\w.-]+\.[a-z]{2,}/i);
  return m?.[0] ?? "";
}

function extractPhone(text: string): string {
  const m = text.match(/(\+?91[-\s]?)?[6-9]\d{9}|(\+?1[-\s]?)?\(?\d{3}\)?[-\s]?\d{3}[-\s]?\d{4}/);
  return m?.[0]?.trim() ?? "";
}

function extractLinkedIn(text: string): string {
  const m = text.match(/linkedin\.com\/in\/[\w-]+/i);
  return m?.[0] ?? "";
}

function extractName(headerText: string): string {
  const lines = headerText.split("\n").map((l) => l.trim()).filter(Boolean);
  // First non-empty line that isn't an email/phone/url is likely the name
  for (const line of lines.slice(0, 5)) {
    if (!line.includes("@") && !line.match(/^\+?\d/) && !line.includes("http") && line.length > 3 && line.length < 60) {
      // Looks like a name (title-cased words)
      if (/^[A-Z][a-z]+(\s[A-Z][a-z]+){0,3}$/.test(line) || line.split(" ").length <= 4) {
        return line;
      }
    }
  }
  return lines[0] ?? "";
}

function extractJobTitle(headerText: string): string {
  const lines = headerText.split("\n").map((l) => l.trim()).filter(Boolean);
  const titlePatterns = [
    /\b(software\s*engineer|developer|analyst|manager|consultant|designer|architect|officer|executive|specialist|coordinator|administrator)\b/i,
    /\b(senior|junior|lead|principal|associate|assistant|chief)[\w\s]+/i,
  ];
  for (const line of lines.slice(0, 6)) {
    for (const pat of titlePatterns) {
      if (pat.test(line) && line.length < 80) return line.trim();
    }
  }
  return "";
}

function parseExperience(text: string): Experience[] {
  const experiences: Experience[] = [];
  const blocks = text.split(/\n(?=[A-Z]|\d{4})/);

  blocks.forEach((block) => {
    const lines = block.split("\n").map((l) => l.trim()).filter(Boolean);
    if (lines.length < 2) return;

    const dateMatch = block.match(/(\b(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\.?\s*\d{4}|\d{4})\s*[-–to]+\s*(\b(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\.?\s*\d{4}|\d{4}|present|current)/i);

    const companyLine = lines[0] ?? "";
    const positionLine = lines[1] ?? lines[0];

    experiences.push({
      id: nanoid(),
      position: positionLine.length < 80 ? positionLine : companyLine.slice(0, 80),
      company: companyLine.length < 80 ? companyLine : "",
      startDate: dateMatch?.[1] ? formatParsedDate(dateMatch[1]) : "",
      endDate: (dateMatch?.[2] && !/present|current/i.test(dateMatch[2])) ? formatParsedDate(dateMatch[2]) : "",
      current: /present|current/i.test(dateMatch?.[2] ?? ""),
      description: lines.slice(2).join("\n").slice(0, 600),
    });
  });

  return experiences.filter((e) => e.position || e.company).slice(0, 5);
}

function formatParsedDate(raw: string): string {
  const months: Record<string, string> = { jan:"01",feb:"02",mar:"03",apr:"04",may:"05",jun:"06",jul:"07",aug:"08",sep:"09",oct:"10",nov:"11",dec:"12" };
  const m = raw.match(/^(\d{4})$/) ;
  if (m) return `${m[1]}-01`;
  const m2 = raw.match(/^([a-z]{3})[a-z]*\.?\s*(\d{4})$/i);
  if (m2) return `${m2[2]}-${months[m2[1].toLowerCase()] ?? "01"}`;
  return "";
}

function parseEducation(text: string): Education[] {
  const edus: Education[] = [];
  const blocks = text.split(/\n(?=[A-Z]|\d{4})/);

  blocks.forEach((block) => {
    const lines = block.split("\n").map((l) => l.trim()).filter(Boolean);
    if (lines.length < 1) return;

    const gradeMatch = block.match(/(\d+(?:\.\d+)?)\s*(?:cgpa|%|percent|grade)/i);
    const yearMatch = block.match(/(\d{4})/g);
    const degreeMatch = block.match(/\b(b\.?tech|b\.?e|b\.?sc|b\.?com|b\.?a|m\.?tech|m\.?sc|m\.?com|m\.?b\.?a|ph\.?d|diploma|bachelor|master|degree)\b/i);

    edus.push({
      id: nanoid(),
      institution: lines[0] ?? "",
      degree: degreeMatch?.[0] ?? "",
      field: "",
      startDate: yearMatch?.[0] ? `${yearMatch[0]}-01` : "",
      endDate: yearMatch?.[1] ? `${yearMatch[1]}-01` : (yearMatch?.[0] ? `${yearMatch[0]}-01` : ""),
      grade: gradeMatch ? `${gradeMatch[1]}${gradeMatch[0].toLowerCase().includes("%") ? "%" : " CGPA"}` : "",
    });
  });

  return edus.filter((e) => e.institution).slice(0, 4);
}

function parseSkills(text: string): Skill[] {
  // Remove common headers and split by commas, bullets, pipes, newlines
  const cleaned = text.replace(/skills?:?/gi, "").replace(/[-•*]/g, ",");
  const tokens = cleaned.split(/[,|\n/]+/).map((t) => t.trim()).filter((t) => t.length > 1 && t.length < 40);

  return [...new Set(tokens)].slice(0, 20).map((name) => ({
    id: nanoid(),
    name: name.charAt(0).toUpperCase() + name.slice(1),
    level: "Intermediate" as const,
  }));
}

function extractSummary(summarySection: string): string {
  return summarySection.trim().slice(0, 500);
}

// ── Main parser ───────────────────────────────────────────────────────────────

export function parseResumeText(text: string): ResumeData {
  const sections = splitIntoSections(text);

  const name = extractName(sections.header ?? text);
  const email = extractEmail(text);
  const phone = extractPhone(text);
  const linkedin = extractLinkedIn(text);
  const jobTitle = extractJobTitle(sections.header ?? text);
  const summary = extractSummary(sections.summary ?? "");

  const experience = parseExperience(sections.experience ?? "");
  const education = parseEducation(sections.education ?? "");
  const skills = parseSkills(sections.skills ?? "");

  return {
    personal: {
      fullName: name,
      email,
      phone,
      address: "",
      linkedin,
      website: "",
      jobTitle,
      summary,
    },
    experience,
    education,
    skills,
    projects: [],
    certificates: [],
  };
}

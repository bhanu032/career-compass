/**
 * Resume parser - extracts structured ResumeData from uploaded resume text.
 * Browser-only by design: no backend dependency and no changes to ig-frontend.
 */

import type {
  Certificate,
  Education,
  Experience,
  Project,
  ResumeData,
  Skill,
} from "@/types/resume";
import { nanoid } from "@/utils/nanoid";

export async function extractTextFromFile(file: File): Promise<string> {
  if (file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf")) {
    return extractTextFromPdf(file);
  }

  if (/\.(doc|docx)$/i.test(file.name)) {
    throw new Error("DOC/DOCX text extraction is not reliable in this browser parser. Please upload a text-based PDF or TXT file.");
  }

  const text = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => resolve((event.target?.result as string) ?? "");
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsText(file, "utf-8");
  });

  if (isBadExtraction(text)) {
    throw new Error("Could not extract clean resume text from this file.");
  }

  return text;
}

async function extractTextFromPdf(file: File): Promise<string> {
  const pdfJsText = await extractTextWithPdfJs(file);
  if (pdfJsText && !isBadExtraction(pdfJsText)) {
    return pdfJsText;
  }

  try {
    const arrayBuffer = await file.arrayBuffer();
    const decoder = new TextDecoder("latin1");
    const raw = decoder.decode(arrayBuffer);
    const blocks = raw.match(/BT[\s\S]*?ET/g) ?? [];
    const lines: string[] = [];

    blocks.forEach((block) => {
      const tj = block.match(/\((.*?)\)\s*Tj/g) ?? [];
      const tjArray = block.match(/\[(.*?)\]\s*TJ/g) ?? [];

      tj.forEach((item) => {
        const content = cleanText(item.replace(/^\(/, "").replace(/\)\s*Tj$/, ""));
        if (content.length > 1) lines.push(content);
      });

      tjArray.forEach((item) => {
        const content = cleanText(
          [...item.matchAll(/\((.*?)\)/g)].map((match) => match[1]).join("")
        );
        if (content.length > 1) lines.push(content);
      });
    });

    const extracted = lines.join("\n");
    if (lines.length > 8 && !isBadExtraction(extracted)) return extracted;
  } catch {
    // Fall through to raw text fallback.
  }

  throw new Error("This PDF does not expose clean selectable text. Please upload a text-based PDF or TXT resume.");
}

async function extractTextWithPdfJs(file: File): Promise<string> {
  try {
    const importRemote = new Function("url", "return import(url)") as (url: string) => Promise<any>;
    const pdfjs = await importRemote("https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.10.38/pdf.min.mjs");

    pdfjs.GlobalWorkerOptions.workerSrc =
      "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.10.38/pdf.worker.min.mjs";

    const arrayBuffer = await file.arrayBuffer();
    const documentTask = pdfjs.getDocument({ data: arrayBuffer });
    const pdf = await documentTask.promise;
    const pages: string[] = [];

    for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
      const page = await pdf.getPage(pageNumber);
      const content = await page.getTextContent();
      const lines: string[] = [];
      let lastY: number | null = null;

      for (const item of content.items ?? []) {
        const text = stripNoise(String(item.str ?? ""));
        if (!text) continue;

        const y = Array.isArray(item.transform) ? Math.round(item.transform[5]) : null;
        if (lastY !== null && y !== null && Math.abs(y - lastY) > 4) {
          lines.push("\n");
        }
        lines.push(text);
        lastY = y;
      }

      pages.push(lines.join(" ").replace(/\s*\n\s*/g, "\n"));
    }

    return cleanText(pages.join("\n\n"));
  } catch {
    return "";
  }
}

const SECTION_PATTERNS: Record<keyof ResumeSections, RegExp> = {
  header: /^$/,
  summary: /\b(summary|objective|profile|professional\s+summary|about\s+me|overview|introduction)\b/i,
  experience: /\b(work\s+experience|professional\s+experience|employment|career|work\s+history|internships?)\b/i,
  education: /\b(education|academic|qualification|qualifications|degree|university|college)\b/i,
  skills: /\b(skills?|technical\s+skills?|core\s+competencies|competencies|expertise|technologies|tools)\b/i,
  projects: /\b(projects?|academic\s+projects?|personal\s+projects?|portfolio|work\s+samples?)\b/i,
  certificates: /\b(certifications?|certificates?|licenses?|licences?|awards?|achievements?|honou?rs)\b/i,
};

interface ResumeSections {
  header: string;
  summary: string;
  experience: string;
  education: string;
  skills: string;
  projects: string;
  certificates: string;
}

function cleanText(text: string): string {
  return text
    .replace(/\r/g, "\n")
    .replace(/[•●▪◆]/g, "-")
    .replace(/[–—]/g, "-")
    .replace(/\u00a0/g, " ")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function stripNoise(value: string): string {
  return cleanText(value)
    .replace(/[^\S\n]+/g, " ")
    .replace(/\s+([,.;:])/g, "$1")
    .replace(/([,.;:])(?=\S)/g, "$1 ")
    .replace(/\s{2,}/g, " ")
    .trim();
}

function titleCase(value: string): string {
  const keepUpper = new Set(["AI", "API", "AWS", "CSS", "DBMS", "GCP", "HTML", "HR", "IIT", "IIIT", "JSON", "ML", "NIT", "PDF", "REST", "SQL", "UI", "UX"]);

  return stripNoise(value)
    .split(/\s+/)
    .map((word) => {
      const cleaned = word.replace(/[^a-zA-Z0-9.+#/-]/g, "");
      if (!cleaned) return "";
      if (keepUpper.has(cleaned.toUpperCase())) return cleaned.toUpperCase();
      if (/^[A-Z0-9.+#/-]{2,}$/.test(cleaned)) return cleaned;
      return cleaned.charAt(0).toUpperCase() + cleaned.slice(1).toLowerCase();
    })
    .filter(Boolean)
    .join(" ")
    .trim();
}

function normalizeUrl(value: string): string {
  return stripNoise(value)
    .replace(/^https?:\/\//i, "")
    .replace(/^www\./i, "")
    .replace(/\/$/g, "");
}

function normalizePhone(value: string): string {
  return stripNoise(value).replace(/[^\d+]/g, " ").replace(/\s+/g, " ").trim();
}

function sentenceCase(value: string): string {
  const clean = stripNoise(value);
  if (!clean) return "";
  const fixed = clean.charAt(0).toUpperCase() + clean.slice(1);
  return /[.!?]$/.test(fixed) ? fixed : `${fixed}.`;
}

function formatParagraph(value: string, maxLength = 700): string {
  const paragraph = usefulLines(value)
    .map((line) => line.replace(/^[-*]\s*/, ""))
    .filter((line) => !findSectionKey(line))
    .join(" ");
  return sentenceCase(paragraph).slice(0, maxLength).trim();
}

function formatBulletText(value: string, maxLength = 900): string {
  return usefulLines(value)
    .map((line) => line.replace(/^[-*]\s*/, ""))
    .map((line) => sentenceCase(line))
    .filter(Boolean)
    .slice(0, 5)
    .join("\n")
    .slice(0, maxLength)
    .trim();
}

function formatCommaListValue(value: string): string {
  return titleCase(value.replace(/\s+/g, " ")).replace(/\s*\/\s*/g, "/");
}

function isBadExtraction(text: string): boolean {
  const trimmed = text.trim();
  if (!trimmed) return true;
  if (trimmed.startsWith("%PDF-")) return true;

  const sample = trimmed.slice(0, 3000);
  const replacementChars = (sample.match(/�/g) ?? []).length;
  const controlChars = (sample.match(/[\x00-\x08\x0E-\x1F]/g) ?? []).length;
  const readableChars = (sample.match(/[a-zA-Z0-9@.,:;/()\-\s]/g) ?? []).length;
  const readableRatio = readableChars / Math.max(sample.length, 1);

  return replacementChars > 8 || controlChars > 8 || readableRatio < 0.65;
}

function hasMeaningfulResumeData(data: ResumeData): boolean {
  return Boolean(
    data.personal.fullName ||
    data.personal.email ||
    data.experience.length ||
    data.education.length ||
    data.skills.length ||
    data.projects.length ||
    data.certificates.length
  );
}

function findSectionKey(line: string): keyof ResumeSections | null {
  const normalized = line.replace(/[:\-]+$/g, "").trim();
  if (!normalized || normalized.length > 70) return null;

  for (const [key, pattern] of Object.entries(SECTION_PATTERNS)) {
    if (key !== "header" && pattern.test(normalized)) {
      return key as keyof ResumeSections;
    }
  }

  return null;
}

function splitIntoSections(text: string): ResumeSections {
  const sections: ResumeSections = {
    header: "",
    summary: "",
    experience: "",
    education: "",
    skills: "",
    projects: "",
    certificates: "",
  };
  let current: keyof ResumeSections = "header";

  cleanText(text)
    .split("\n")
    .map((line) => line.trim())
    .forEach((line) => {
      if (!line) {
        if (sections[current]) sections[current] += "\n";
        return;
      }

      const sectionKey = findSectionKey(line);
      if (sectionKey) {
        current = sectionKey;
        return;
      }

      sections[current] += `${sections[current] ? "\n" : ""}${line}`;
    });

  return sections;
}

function extractEmail(text: string): string {
  return text.match(/[\w.+%-]+@[\w.-]+\.[a-z]{2,}/i)?.[0] ?? "";
}

function extractPhone(text: string): string {
  const match = text.match(/(?:\+?\d{1,3}[-.\s]?)?(?:\(?\d{3,5}\)?[-.\s]?)?\d{3,5}[-.\s]?\d{4,6}/)?.[0] ?? "";
  return normalizePhone(match);
}

function extractLinkedIn(text: string): string {
  const match = text.match(/(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/[\w-]+\/?/i);
  return match?.[0] ? normalizeUrl(match[0]) : "";
}

function extractWebsite(text: string): string {
  const urls = text.match(/(?:https?:\/\/)?(?:www\.)?[\w.-]+\.[a-z]{2,}(?:\/[^\s]*)?/gi) ?? [];
  const website = urls.find((url) => !url.includes("@") && !/linkedin\.com/i.test(url)) ?? "";
  return website ? normalizeUrl(website) : "";
}

function extractAddress(headerText: string): string {
  const lines = headerText.split("\n").map((line) => line.trim()).filter(Boolean);
  const addressLine = lines.find((line) =>
    !line.includes("@") &&
    !/linkedin|github|http|www\./i.test(line) &&
    !/^\+?\d/.test(line) &&
    /\b(india|usa|canada|remote|delhi|mumbai|pune|bangalore|bengaluru|hyderabad|chennai|kolkata|noida|gurgaon|new york|toronto)\b/i.test(line)
  );
  return addressLine ? stripNoise(addressLine) : "";
}

function extractName(headerText: string): string {
  const lines = headerText.split("\n").map((line) => line.trim()).filter(Boolean);
  for (const line of lines.slice(0, 8)) {
    if (line.includes("@") || /linkedin|github|http|www\./i.test(line) || /^\+?\d/.test(line)) continue;
    if (line.length > 2 && line.length < 60 && line.split(/\s+/).length <= 5) return titleCase(line);
  }
  return "";
}

function extractJobTitle(headerText: string): string {
  const lines = headerText.split("\n").map((line) => line.trim()).filter(Boolean);
  const titlePattern = /\b(engineer|developer|analyst|manager|consultant|designer|architect|officer|executive|specialist|coordinator|administrator|intern|trainee|associate|lead|director|teacher|accountant)\b/i;
  const title = lines.slice(0, 10).find((line) =>
    titlePattern.test(line) &&
    !line.includes("@") &&
    !/linkedin|github|http|www\./i.test(line) &&
    line.length < 90
  ) ?? "";
  return titleCase(title);
}

function formatParsedDate(raw: string): string {
  const value = raw.trim();
  const months: Record<string, string> = {
    jan: "01", feb: "02", mar: "03", apr: "04", may: "05", jun: "06",
    jul: "07", aug: "08", sep: "09", oct: "10", nov: "11", dec: "12",
  };

  const yearOnly = value.match(/\b(19|20)\d{2}\b/);
  const monthYear = value.match(/\b(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\.?\s+((?:19|20)\d{2})\b/i);
  const numeric = value.match(/\b(0?[1-9]|1[0-2])[\/-]((?:19|20)\d{2})\b/);

  if (monthYear) return `${monthYear[2]}-${months[monthYear[1].slice(0, 3).toLowerCase()] ?? "01"}`;
  if (numeric) return `${numeric[2]}-${numeric[1].padStart(2, "0")}`;
  if (yearOnly) return `${yearOnly[0]}-01`;
  return "";
}

function extractDateRange(text: string): { startDate: string; endDate: string; current: boolean } {
  const dateToken = String.raw`(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\.?\s+(?:19|20)\d{2}|(?:0?[1-9]|1[0-2])[\/-](?:19|20)\d{2}|(?:19|20)\d{2}`;
  const match = text.match(new RegExp(`(${dateToken})\\s*(?:-|to|until|through)\\s*(${dateToken}|present|current|now)`, "i"));
  const single = text.match(new RegExp(`(${dateToken})`, "i"));

  if (!match) {
    return {
      startDate: single ? formatParsedDate(single[1]) : "",
      endDate: "",
      current: false,
    };
  }

  return {
    startDate: formatParsedDate(match[1]),
    endDate: /present|current|now/i.test(match[2]) ? "" : formatParsedDate(match[2]),
    current: /present|current|now/i.test(match[2]),
  };
}

function usefulLines(text: string): string[] {
  return cleanText(text)
    .split("\n")
    .map((line) => line.trim().replace(/^[-*]\s*/, ""))
    .filter(Boolean);
}

function splitBlocks(sectionText: string): string[] {
  const normalized = cleanText(sectionText);
  if (!normalized) return [];

  const blankBlocks = normalized.split(/\n{2,}/).map((block) => block.trim()).filter(Boolean);
  if (blankBlocks.length > 1) return blankBlocks;

  const lines = usefulLines(normalized);
  const blocks: string[] = [];
  let current: string[] = [];

  lines.forEach((line, index) => {
    const startsNew = index > 0 && !line.startsWith("-") && (
      extractDateRange(line).startDate ||
      /^[A-Z][\w .,&()/-]{3,80}$/.test(line)
    );
    if (startsNew && current.length >= 2) {
      blocks.push(current.join("\n"));
      current = [];
    }
    current.push(line);
  });

  if (current.length) blocks.push(current.join("\n"));
  return blocks;
}

function parseExperience(text: string): Experience[] {
  return splitBlocks(text)
    .map((block) => {
      const lines = usefulLines(block);
      if (!lines.length) return null;

      const dates = extractDateRange(block);
      const nonDateLines = lines.filter((line) => !extractDateRange(line).startDate || line.length > 55);
      const header = nonDateLines[0] ?? lines[0] ?? "";
      const second = nonDateLines[1] ?? "";
      const headerParts = header.split(/\s+\|\s+|\s+-\s+|,\s+/).map((part) => part.trim()).filter(Boolean);

      const position = headerParts.length > 1 ? headerParts[0] : header;
      const company = headerParts.length > 1 ? headerParts.slice(1).join(", ") : second;
      const description = lines
        .filter((line) => line !== header && line !== second && !/^\(?\d{4}\)?$/.test(line))
        .join("\n");

      return {
        id: nanoid(),
        position: titleCase(position).slice(0, 90),
        company: titleCase(company).slice(0, 90),
        startDate: dates.startDate,
        endDate: dates.endDate,
        current: dates.current,
        description: formatBulletText(description, 900),
      };
    })
    .filter((item): item is Experience => Boolean(item && (item.position || item.company || item.description)))
    .slice(0, 8);
}

function parseEducation(text: string): Education[] {
  return splitBlocks(text)
    .map((block) => {
      const lines = usefulLines(block);
      if (!lines.length) return null;

      const degreeLine = lines.find((line) => /\b(b\.?tech|b\.?e|b\.?sc|b\.?com|b\.?a|m\.?tech|m\.?sc|m\.?com|m\.?b\.?a|ph\.?d|diploma|bachelor|master|degree|class\s+xii|class\s+x|higher\s+secondary)\b/i.test(line)) ?? "";
      const institution = lines.find((line) => line !== degreeLine && /\b(university|college|school|institute|academy|iit|nit|iiit)\b/i.test(line)) ?? lines[0];
      const fieldMatch = degreeLine.match(/\b(?:in|of)\s+([A-Za-z &]+?)(?:,|\||-|$)/i);
      const gradeMatch = block.match(/(?:cgpa|gpa|percentage|percent|grade|score)[:\s-]*(\d+(?:\.\d+)?\s*(?:\/\s*10|%|cgpa)?)/i) ?? block.match(/(\d+(?:\.\d+)?)\s*(?:cgpa|%)/i);
      const years = [...block.matchAll(/\b(?:19|20)\d{2}\b/g)].map((match) => match[0]);

      return {
        id: nanoid(),
        institution: titleCase(institution).slice(0, 100),
        degree: titleCase(degreeLine || lines[0]).slice(0, 80),
        field: fieldMatch?.[1] ? titleCase(fieldMatch[1]).slice(0, 60) : "",
        startDate: years[0] ? `${years[0]}-01` : "",
        endDate: years[1] ? `${years[1]}-01` : years[0] ? `${years[0]}-01` : "",
        grade: gradeMatch?.[1] ? stripNoise(gradeMatch[1]) : "",
      };
    })
    .filter((item): item is Education => Boolean(item && item.institution))
    .slice(0, 6);
}

const KNOWN_SKILLS = [
  "React", "TypeScript", "JavaScript", "Python", "Java", "C++", "C#", "SQL",
  "HTML", "CSS", "Tailwind CSS", "Node.js", "Express", "FastAPI", "Django",
  "Flask", "PostgreSQL", "MySQL", "MongoDB", "AWS", "Azure", "GCP", "Docker",
  "Kubernetes", "Git", "REST API", "GraphQL", "Excel", "Power BI", "Tableau",
  "Tally", "GST Filing", "Communication", "Leadership", "Problem Solving",
  "Data Analysis", "Machine Learning", "Figma", "AutoCAD", "MATLAB",
];

function parseSkills(text: string, fullText: string): Skill[] {
  const source = text;
  if (!source.trim()) {
    const lower = fullText.toLowerCase();
    return KNOWN_SKILLS
      .filter((skill) => lower.includes(skill.toLowerCase()))
      .slice(0, 18)
      .map((name) => ({
        id: nanoid(),
        name,
        level: "Intermediate" as const,
      }));
  }

  const cleaned = source
    .replace(SECTION_PATTERNS.skills, "")
    .replace(/\b(languages?|frameworks?|tools|databases?)\b[:\-]?/gi, ",");
  const tokens = cleaned
    .split(/[,|;/\n]+/)
    .map((token) => token.replace(/^[-*]\s*/, "").trim())
    .filter((token) => token.length > 1 && token.length < 42 && !/\d{4}/.test(token));

  return [...new Set(tokens.map((token) => token.replace(/\s+/g, " ")))]
    .slice(0, 28)
    .map((name) => ({
      id: nanoid(),
      name: formatCommaListValue(name),
      level: "Intermediate" as const,
    }));
}

function parseProjects(text: string): Project[] {
  return splitBlocks(text)
    .map((block) => {
      const lines = usefulLines(block);
      if (!lines.length) return null;

      const link = block.match(/(?:https?:\/\/)?(?:www\.)?[\w.-]+\.[a-z]{2,}(?:\/[^\s]*)?/i)?.[0] ?? "";
      const techLine = lines.find((line) => /\b(tech|technologies|stack|tools|built with)\b/i.test(line));
      const technologies = techLine?.replace(/^(tech(?:nologies)?|stack|tools|built with)[:\s-]*/i, "").trim() ?? "";
      const name = lines[0].replace(/\s+\|\s+.*$/, "").slice(0, 90);
      const description = lines
        .filter((line) => line !== lines[0] && line !== techLine && line !== link)
        .join("\n")
        .replace(link, "")
        .trim();

      return {
        id: nanoid(),
        name: titleCase(name),
        description: formatBulletText(description, 700),
        link: link ? normalizeUrl(link) : "",
        technologies: technologies
          .split(/[,;/|]+/)
          .map((item) => formatCommaListValue(item))
          .filter(Boolean)
          .join(", "),
      };
    })
    .filter((item): item is Project => Boolean(item && (item.name || item.description)))
    .slice(0, 6);
}

function parseCertificates(text: string): Certificate[] {
  const blocks = splitBlocks(text);
  const candidates = blocks.length ? blocks : usefulLines(text);

  return candidates
    .map((block) => {
      const lines = usefulLines(block);
      const line = lines.join(" - ");
      if (!line || /^(certifications?|certificates?|awards?|achievements?)$/i.test(line)) return null;

      const dateMatch = line.match(/\b(?:(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\.?\s+)?(?:19|20)\d{2}\b/i);
      const date = dateMatch ? formatParsedDate(dateMatch[0]) : "";
      const withoutDate = dateMatch ? line.replace(dateMatch[0], "").trim() : line;
      const parts = withoutDate.split(/\s+\|\s+|\s+-\s+|,\s+/).map((part) => part.trim()).filter(Boolean);

      return {
        id: nanoid(),
        name: titleCase(parts[0] ?? withoutDate).slice(0, 100),
        issuer: titleCase(parts.slice(1).join(", ") || "").slice(0, 100),
        date,
      };
    })
    .filter((item): item is Certificate => Boolean(item && item.name))
    .slice(0, 8);
}

function extractSummary(summarySection: string, headerText: string): string {
  const direct = cleanText(summarySection);
  if (direct) return formatParagraph(direct, 700);

  const lines = usefulLines(headerText);
  const afterTitle = lines.slice(2).filter((line) =>
    !line.includes("@") &&
    !/linkedin|github|http|www\./i.test(line) &&
    !/^\+?\d/.test(line) &&
    line.length > 45
  );
  return formatParagraph(afterTitle.join(" "), 700);
}

export function parseResumeText(text: string): ResumeData {
  const cleaned = cleanText(text);
  if (isBadExtraction(cleaned)) {
    throw new Error("The extracted text looks corrupted, so it was not loaded into the resume preview.");
  }

  const sections = splitIntoSections(cleaned);

  const headerText = sections.header || cleaned.split("\n").slice(0, 12).join("\n");
  const email = extractEmail(cleaned);
  const phone = extractPhone(cleaned);
  const linkedin = extractLinkedIn(cleaned);
  const website = extractWebsite(cleaned);

  const data: ResumeData = {
    personal: {
      fullName: extractName(headerText),
      email,
      phone,
      address: extractAddress(headerText),
      linkedin,
      website,
      jobTitle: extractJobTitle(headerText),
      summary: extractSummary(sections.summary, headerText),
    },
    experience: parseExperience(sections.experience),
    education: parseEducation(sections.education),
    skills: parseSkills(sections.skills, cleaned),
    projects: parseProjects(sections.projects),
    certificates: parseCertificates(sections.certificates),
  };

  if (!hasMeaningfulResumeData(data)) {
    throw new Error("No usable resume sections were found in the extracted text.");
  }

  return formatResumeData(data);
}

export function formatResumeData(data: ResumeData): ResumeData {
  return {
    personal: {
      fullName: titleCase(data.personal.fullName),
      email: stripNoise(data.personal.email).toLowerCase(),
      phone: normalizePhone(data.personal.phone),
      address: stripNoise(data.personal.address),
      linkedin: normalizeUrl(data.personal.linkedin),
      website: normalizeUrl(data.personal.website),
      jobTitle: titleCase(data.personal.jobTitle),
      summary: formatParagraph(data.personal.summary, 700),
    },
    experience: data.experience.map((item) => ({
      ...item,
      position: titleCase(item.position),
      company: titleCase(item.company),
      description: formatBulletText(item.description, 900),
    })),
    education: data.education.map((item) => ({
      ...item,
      institution: titleCase(item.institution),
      degree: titleCase(item.degree),
      field: titleCase(item.field),
      grade: stripNoise(item.grade),
    })),
    skills: data.skills.map((item) => ({
      ...item,
      name: formatCommaListValue(item.name),
    })),
    projects: data.projects.map((item) => ({
      ...item,
      name: titleCase(item.name),
      description: formatBulletText(item.description, 700),
      link: normalizeUrl(item.link),
      technologies: item.technologies
        .split(/[,;/|]+/)
        .map((value) => formatCommaListValue(value))
        .filter(Boolean)
        .join(", "),
    })),
    certificates: data.certificates.map((item) => ({
      ...item,
      name: titleCase(item.name),
      issuer: titleCase(item.issuer),
    })),
  };
}

function joinLines(lines: Array<string | false | null | undefined>): string {
  return lines.filter(Boolean).join("\n");
}

export function resumeDataToText(data: ResumeData): string {
  const formatted = formatResumeData(data);
  const sections: string[] = [];

  const contact = [
    formatted.personal.email,
    formatted.personal.phone,
    formatted.personal.address,
    formatted.personal.linkedin,
    formatted.personal.website,
  ].filter(Boolean).join(" | ");

  sections.push(joinLines([
    formatted.personal.fullName,
    formatted.personal.jobTitle,
    contact,
  ]));

  if (formatted.personal.summary) {
    sections.push(joinLines([
      "PROFESSIONAL SUMMARY",
      formatted.personal.summary,
    ]));
  }

  if (formatted.experience.length) {
    sections.push(joinLines([
      "WORK EXPERIENCE",
      ...formatted.experience.map((item) => joinLines([
        `${item.position}${item.company ? ` | ${item.company}` : ""}`,
        `${item.startDate}${item.endDate ? ` - ${item.endDate}` : item.current ? " - Present" : ""}`,
        item.description,
      ])),
    ]));
  }

  if (formatted.education.length) {
    sections.push(joinLines([
      "EDUCATION",
      ...formatted.education.map((item) => joinLines([
        `${item.degree}${item.field ? ` in ${item.field}` : ""}`,
        item.institution,
        `${item.startDate}${item.endDate ? ` - ${item.endDate}` : ""}${item.grade ? ` | ${item.grade}` : ""}`,
      ])),
    ]));
  }

  if (formatted.skills.length) {
    sections.push(joinLines([
      "SKILLS",
      formatted.skills.map((item) => item.name).join(", "),
    ]));
  }

  if (formatted.projects.length) {
    sections.push(joinLines([
      "PROJECTS",
      ...formatted.projects.map((item) => joinLines([
        `${item.name}${item.technologies ? ` | ${item.technologies}` : ""}`,
        item.description,
        item.link,
      ])),
    ]));
  }

  if (formatted.certificates.length) {
    sections.push(joinLines([
      "CERTIFICATIONS",
      ...formatted.certificates.map((item) =>
        [item.name, item.issuer, item.date].filter(Boolean).join(" | ")
      ),
    ]));
  }

  return sections.filter(Boolean).join("\n\n").trim();
}

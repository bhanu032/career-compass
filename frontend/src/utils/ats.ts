/**
 * ATS Scoring Engine — 100% frontend, no API needed.
 *
 * Scores a resume against a job description across 8 weighted categories.
 * Total score = 0-100.
 */

import type { ResumeData } from "@/types/resume";

// ── Types ─────────────────────────────────────────────────────────────────────

export interface ATSCategory {
  key: string;
  label: string;
  score: number;      // 0-100 for this category
  weight: number;     // how much it contributes to total
  feedback: string;   // one-line explanation
  issues: string[];   // specific problems found
  tips: string[];     // actionable suggestions
}

export interface ATSResult {
  total: number;            // 0-100 weighted total
  grade: "A" | "B" | "C" | "D" | "F";
  categories: ATSCategory[];
  matchedKeywords: string[];
  missingKeywords: string[];
  jdKeywords: string[];     // all keywords extracted from JD
}

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Normalise text: lowercase, strip punctuation, collapse whitespace */
function norm(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9\s+#.]/g, " ").replace(/\s+/g, " ").trim();
}

/** Extract meaningful keywords from a block of text */
export function extractKeywords(text: string): string[] {
  const normalised = norm(text);

  // Common stop words to ignore
  const STOP = new Set([
    "the","and","for","with","that","this","have","from","will","your","are","our",
    "you","can","all","has","its","not","but","was","were","been","they","their",
    "who","how","what","when","where","which","while","both","each","such","than",
    "into","only","other","some","any","also","more","most","over","then","there",
    "these","those","about","above","after","before","being","between","during",
    "should","would","could","shall","must","may","might","need","work","role",
    "team","good","able","new","use","using","used","make","take","give","look",
    "year","years","month","months","day","days","per","via","etc","e.g","i.e",
    "please","apply","company","position","job","candidate","required","preferred",
    "experience","knowledge","skills","ability","proficiency","strong","excellent",
    "minimum","maximum","highly","including","following","responsible","responsibilities",
  ]);

  // Bigrams and trigrams worth keeping as phrases
  const words = normalised.split(" ").filter((w) => w.length > 2 && !STOP.has(w));

  const uniq = new Set<string>();
  words.forEach((w) => uniq.add(w));

  // Also extract common tech/domain phrases (2-word combos)
  const raw = normalised.split(" ");
  for (let i = 0; i < raw.length - 1; i++) {
    const bigram = `${raw[i]} ${raw[i + 1]}`;
    if (!STOP.has(raw[i]) && !STOP.has(raw[i + 1]) && raw[i].length > 2 && raw[i + 1].length > 2) {
      uniq.add(bigram);
    }
  }

  return [...uniq].filter((k) => k.length > 2);
}

/** Flatten all resume text into one searchable string */
function resumeText(data: ResumeData): string {
  const parts: string[] = [
    data.personal.fullName,
    data.personal.jobTitle,
    data.personal.summary,
    ...data.experience.map((e) => `${e.position} ${e.company} ${e.description}`),
    ...data.education.map((e) => `${e.degree} ${e.field} ${e.institution}`),
    ...data.skills.map((s) => s.name),
    ...data.projects.map((p) => `${p.name} ${p.description} ${p.technologies}`),
    ...data.certificates.map((c) => `${c.name} ${c.issuer}`),
  ];
  return norm(parts.join(" "));
}

// ── Scoring categories ────────────────────────────────────────────────────────

function scoreKeywordMatch(resumeNorm: string, jdKeywords: string[]): ATSCategory {
  if (jdKeywords.length === 0) {
    return {
      key: "keywords", label: "Keyword Match", score: 50, weight: 30,
      feedback: "No JD provided — upload a job description to get a keyword score.",
      issues: [], tips: ["Upload a job description to analyse keyword match."],
    };
  }
  const matched = jdKeywords.filter((kw) => resumeNorm.includes(kw));
  const pct = Math.round((matched.length / jdKeywords.length) * 100);
  const score = Math.min(100, pct);
  const missing = jdKeywords.filter((kw) => !resumeNorm.includes(kw)).slice(0, 15);

  const issues: string[] = [];
  const tips: string[] = [];
  if (pct < 40) {
    issues.push(`Only ${matched.length} of ${jdKeywords.length} JD keywords found in your resume.`);
    tips.push(`Add these missing keywords naturally: ${missing.slice(0, 5).join(", ")}`);
  } else if (pct < 65) {
    issues.push(`${jdKeywords.length - matched.length} JD keywords are missing.`);
    tips.push("Weave missing keywords into your summary and experience bullet points.");
  } else {
    tips.push("Good keyword coverage! Ensure keywords appear in context, not just as a list.");
  }

  return {
    key: "keywords", label: "Keyword Match", score, weight: 30,
    feedback: `${matched.length}/${jdKeywords.length} JD keywords matched (${pct}%)`,
    issues, tips,
  };
}

function scoreContactInfo(data: ResumeData): ATSCategory {
  const p = data.personal;
  const issues: string[] = [];
  const tips: string[] = [];
  let score = 100;

  if (!p.fullName)  { issues.push("Full name is missing."); score -= 25; }
  if (!p.email)     { issues.push("Email address is missing."); score -= 25; }
  if (!p.phone)     { issues.push("Phone number is missing."); score -= 20; }
  if (!p.address)   { tips.push("Adding your city/state helps location-based filters."); score -= 5; }
  if (!p.linkedin)  { tips.push("A LinkedIn URL increases credibility."); score -= 10; }
  if (!p.jobTitle)  { issues.push("Professional title is missing from header."); score -= 15; }

  return {
    key: "contact", label: "Contact Info", score: Math.max(0, score), weight: 10,
    feedback: issues.length === 0 ? "All key contact fields are present." : `${issues.length} contact field(s) missing.`,
    issues, tips,
  };
}

function scoreSummary(data: ResumeData, jdKeywords: string[]): ATSCategory {
  const summary = norm(data.personal.summary);
  const issues: string[] = [];
  const tips: string[] = [];
  let score = 0;

  if (!summary) {
    issues.push("No professional summary found — ATS systems prioritise resumes with summaries.");
    tips.push("Write a 2–3 sentence summary mentioning your title, years of experience, and top skills.");
    return { key: "summary", label: "Professional Summary", score: 0, weight: 15, feedback: "Summary is missing.", issues, tips };
  }

  const wordCount = summary.split(" ").length;
  if (wordCount >= 30) score += 40;
  else if (wordCount >= 15) { score += 25; tips.push("Expand your summary to at least 30 words."); }
  else { issues.push("Summary is too short (under 15 words)."); score += 10; }

  // Keyword hits in summary
  const kwHits = jdKeywords.filter((kw) => summary.includes(kw)).length;
  const kwBonus = Math.min(60, Math.round((kwHits / Math.max(1, jdKeywords.length)) * 120));
  score += kwBonus;

  if (kwHits === 0 && jdKeywords.length > 0) {
    issues.push("No JD keywords appear in your summary.");
    tips.push("Open with a sentence that includes your target job title and 2–3 key skills from the JD.");
  }

  return {
    key: "summary", label: "Professional Summary", score: Math.min(100, score), weight: 15,
    feedback: summary ? `Summary has ${wordCount} words with ${kwHits} JD keyword(s).` : "No summary.",
    issues, tips,
  };
}

function scoreExperience(data: ResumeData, jdKeywords: string[]): ATSCategory {
  const issues: string[] = [];
  const tips: string[] = [];
  let score = 0;

  if (data.experience.length === 0) {
    issues.push("No work experience listed.");
    tips.push("Add at least one work experience entry, even internships or government exam preparation roles.");
    return { key: "experience", label: "Work Experience", score: 0, weight: 20, feedback: "No experience added.", issues, tips };
  }

  score += Math.min(40, data.experience.length * 15);

  let kwHits = 0;
  let hasDescriptions = 0;

  data.experience.forEach((e) => {
    const expNorm = norm(`${e.position} ${e.company} ${e.description}`);
    kwHits += jdKeywords.filter((kw) => expNorm.includes(kw)).length;
    if (e.description && e.description.trim().length > 40) hasDescriptions++;
    if (!e.description || e.description.trim().length < 20) {
      tips.push(`Add bullet points for "${e.position}" — describe achievements and tools used.`);
    }
  });

  const descScore = Math.round((hasDescriptions / data.experience.length) * 30);
  score += descScore;

  const kwScore = Math.min(30, Math.round((kwHits / Math.max(1, jdKeywords.length * data.experience.length)) * 100));
  score += kwScore;

  if (hasDescriptions < data.experience.length) {
    issues.push(`${data.experience.length - hasDescriptions} job(s) have missing or thin descriptions.`);
  }
  if (jdKeywords.length > 0 && kwHits === 0) {
    issues.push("No JD keywords found in your experience descriptions.");
  }

  return {
    key: "experience", label: "Work Experience", score: Math.min(100, score), weight: 20,
    feedback: `${data.experience.length} job(s) with ${kwHits} JD keyword hit(s).`,
    issues, tips,
  };
}

function scoreSkills(data: ResumeData, jdKeywords: string[]): ATSCategory {
  const issues: string[] = [];
  const tips: string[] = [];
  let score = 0;

  if (data.skills.length === 0) {
    issues.push("No skills listed.");
    tips.push("Add at least 5–8 skills from the job description.");
    return { key: "skills", label: "Skills", score: 0, weight: 15, feedback: "Skills section is empty.", issues, tips };
  }

  score += Math.min(40, data.skills.length * 5);

  const skillNames = data.skills.map((s) => norm(s.name));
  const skillText = skillNames.join(" ");
  const kwHits = jdKeywords.filter((kw) => skillText.includes(kw)).length;
  const kwScore = Math.min(60, Math.round((kwHits / Math.max(1, jdKeywords.length)) * 120));
  score += kwScore;

  if (data.skills.length < 5) {
    issues.push(`Only ${data.skills.length} skill(s) — ATS expects at least 5.`);
  }
  if (jdKeywords.length > 0 && kwHits < 3) {
    const jdSkillTerms = jdKeywords.filter((kw) => !skillText.includes(kw)).slice(0, 5);
    tips.push(`Add JD-specific skills: ${jdSkillTerms.join(", ")}`);
  }

  return {
    key: "skills", label: "Skills", score: Math.min(100, score), weight: 15,
    feedback: `${data.skills.length} skill(s), ${kwHits} match JD keywords.`,
    issues, tips,
  };
}

function scoreEducation(data: ResumeData): ATSCategory {
  const issues: string[] = [];
  const tips: string[] = [];
  let score = 0;

  if (data.education.length === 0) {
    issues.push("No education entries found.");
    return { key: "education", label: "Education", score: 0, weight: 5, feedback: "Education is missing.", issues, tips };
  }

  data.education.forEach((e) => {
    if (e.institution) score += 30;
    if (e.degree)      score += 30;
    if (e.endDate)     score += 20;
    else tips.push("Add graduation year/expected date to your education.");
    if (!e.grade)      tips.push("Consider adding CGPA or percentage if it's above 60%.");
  });

  return {
    key: "education", label: "Education", score: Math.min(100, score), weight: 5,
    feedback: `${data.education.length} education entry/entries.`,
    issues, tips,
  };
}

function scoreLength(data: ResumeData): ATSCategory {
  const issues: string[] = [];
  const tips: string[] = [];

  const text = resumeText(data);
  const wordCount = text.split(" ").filter(Boolean).length;

  let score: number;
  let feedback: string;

  if (wordCount < 100) {
    score = 20;
    feedback = `Resume is very thin (${wordCount} words). ATS needs content to parse.`;
    issues.push("Resume has too little content — under 100 words.");
    tips.push("Aim for 300–600 words for optimal ATS parsing.");
  } else if (wordCount < 200) {
    score = 55;
    feedback = `Resume content is short (${wordCount} words).`;
    tips.push("Expand experience descriptions to 50–80 words per role.");
  } else if (wordCount <= 700) {
    score = 100;
    feedback = `Good length — ${wordCount} words. Fits on 1–2 pages.`;
  } else {
    score = 75;
    feedback = `Resume may be too long (${wordCount} words). ATS may truncate after page 2.`;
    tips.push("Trim older or less relevant experience to keep under 700 words.");
  }

  return {
    key: "length", label: "Content Length", score, weight: 3,
    feedback, issues, tips,
  };
}

function scoreExtras(data: ResumeData): ATSCategory {
  const issues: string[] = [];
  const tips: string[] = [];
  let score = 40; // base for having a resume

  if (data.projects.length > 0) { score += 30; }
  else { tips.push("Add 1–2 projects — especially relevant for fresher/tech roles."); }

  if (data.certificates.length > 0) { score += 30; }
  else { tips.push("Add certifications — government exam scores, online courses, or professional licenses boost ATS ranking."); }

  return {
    key: "extras", label: "Projects & Certs", score: Math.min(100, score), weight: 2,
    feedback: `${data.projects.length} project(s), ${data.certificates.length} certificate(s).`,
    issues, tips,
  };
}

// ── Main scoring function ─────────────────────────────────────────────────────

export function scoreResume(data: ResumeData, jdText: string): ATSResult {
  const jdKeywords = jdText.trim() ? extractKeywords(jdText) : [];
  const resumeNorm = resumeText(data);

  const categories: ATSCategory[] = [
    scoreKeywordMatch(resumeNorm, jdKeywords),
    scoreContactInfo(data),
    scoreSummary(data, jdKeywords),
    scoreExperience(data, jdKeywords),
    scoreSkills(data, jdKeywords),
    scoreEducation(data),
    scoreLength(data),
    scoreExtras(data),
  ];

  const totalWeight = categories.reduce((s, c) => s + c.weight, 0);
  const total = Math.round(
    categories.reduce((s, c) => s + (c.score * c.weight) / totalWeight, 0)
  );

  const matchedKeywords = jdKeywords.filter((kw) => resumeNorm.includes(kw));
  const missingKeywords = jdKeywords
    .filter((kw) => !resumeNorm.includes(kw))
    .slice(0, 20);

  const grade: ATSResult["grade"] =
    total >= 80 ? "A" :
    total >= 65 ? "B" :
    total >= 50 ? "C" :
    total >= 35 ? "D" : "F";

  return { total, grade, categories, matchedKeywords, missingKeywords, jdKeywords };
}

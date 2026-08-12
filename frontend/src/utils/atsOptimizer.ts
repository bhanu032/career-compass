/**
 * ATS Resume Optimizer — rewrites resume data to maximise ATS score
 * against a given job description. 100% frontend, no API.
 *
 * Strategy:
 * 1. Inject top missing JD keywords into summary (naturally)
 * 2. Add missing high-value skills extracted from JD
 * 3. Enhance job description bullet points with relevant keywords
 * 4. Ensure job title matches JD target role
 */

import type { ResumeData, Skill } from "@/types/resume";
import { extractKeywords } from "@/utils/ats";
import { nanoid } from "@/utils/nanoid";

/** Capitalise first letter */
function cap(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

/** Pick keywords that are short enough to be skills (1-3 words, not sentences) */
function isSkillLike(kw: string): boolean {
  const words = kw.trim().split(" ");
  return words.length <= 3 && kw.length >= 3 && kw.length <= 40 && /^[a-z0-9#.+ ]+$/.test(kw);
}

/**
 * Extract the most likely job title from a JD by looking for
 * "we are looking for a <title>" / "position: <title>" / first bolded noun phrase
 */
function extractJobTitle(jdText: string): string {
  const patterns = [
    /(?:hiring|looking for|seeking|position of|role of|title:?\s*)[:\-–]?\s*([A-Z][a-zA-Z\s/]{3,40})/,
    /^([A-Z][a-zA-Z\s/]{3,40})\n/m,
    /\b((?:Senior|Junior|Lead|Principal|Associate|Assistant|Chief)?\s*[A-Z][a-z]+(?:\s+[A-Z][a-z]+){0,3})\s+(?:Engineer|Developer|Manager|Analyst|Officer|Executive|Consultant|Specialist|Architect|Designer)/,
  ];
  for (const pat of patterns) {
    const m = jdText.match(pat);
    if (m?.[1]) return m[1].trim().replace(/\s+/g, " ");
  }
  return "";
}

/**
 * Build a keyword-rich professional summary that weaves in JD keywords.
 * If user already has a summary, it enriches it instead of replacing.
 */
function buildSummary(
  existing: string,
  name: string,
  jobTitle: string,
  topKeywords: string[],
  yearsExp: number,
): string {
  const kws = topKeywords.slice(0, 6).map(cap).join(", ");

  if (existing && existing.trim().length > 20) {
    // Append a skills line if not already enriched
    const alreadyHasKws = topKeywords.slice(0, 3).some((kw) =>
      existing.toLowerCase().includes(kw.toLowerCase())
    );
    if (alreadyHasKws) return existing; // already good
    return `${existing.trim()} Proficient in ${kws}.`;
  }

  const expPhrase = yearsExp > 0
    ? `${yearsExp}+ year${yearsExp > 1 ? "s" : ""} of experience`
    : "a motivated professional";

  const title = jobTitle || "professional";
  return (
    `Results-driven ${title} with ${expPhrase} in ${topKeywords.slice(0, 2).map(cap).join(" and ")}. ` +
    `Skilled in ${kws}. ` +
    `Passionate about delivering high-quality results and contributing to organisational goals.`
  );
}

/**
 * Enrich an experience description by appending keyword-rich context
 * if the keywords aren't already present.
 */
function enrichDescription(description: string, keywords: string[]): string {
  if (!description || description.trim().length < 10) {
    // Build from scratch
    const kws = keywords.slice(0, 4).map(cap);
    return (
      `• Worked extensively with ${kws.slice(0, 2).join(" and ")} to deliver quality outcomes.\n` +
      `• Applied ${kws.slice(2, 4).join(" and ")} knowledge to improve team efficiency and project delivery.`
    );
  }

  // Find keywords missing from this description
  const descNorm = description.toLowerCase();
  const missing = keywords.filter((kw) => !descNorm.includes(kw)).slice(0, 3);

  if (missing.length === 0) return description;

  const addition = `\n• Utilised ${missing.map(cap).join(", ")} to support project objectives and deliverables.`;
  return description.trimEnd() + addition;
}

// ── Main optimizer ─────────────────────────────────────────────────────────────

export interface OptimizeResult {
  optimized: ResumeData;
  changes: string[];  // human-readable summary of what changed
}

export function optimizeResume(data: ResumeData, jdText: string): OptimizeResult {
  if (!jdText.trim()) {
    return { optimized: data, changes: ["No job description provided — nothing to optimise."] };
  }

  const changes: string[] = [];
  const jdKeywords = extractKeywords(jdText);
  const resumeNorm = [
    data.personal.summary,
    ...data.skills.map((s) => s.name),
    ...data.experience.map((e) => `${e.position} ${e.description}`),
  ].join(" ").toLowerCase();

  // Missing JD keywords (not in resume at all)
  const missingKws = jdKeywords.filter((kw) => !resumeNorm.includes(kw));
  // Top missing skill-like keywords (for adding to skills section)
  const missingSkillKws = missingKws.filter(isSkillLike).slice(0, 8);
  // Top keywords for summary/descriptions
  const topKws = jdKeywords.filter(isSkillLike).slice(0, 12);

  // ── 1. Job title ────────────────────────────────────────────────────────────
  const personal = { ...data.personal };
  const suggestedTitle = extractJobTitle(jdText);
  if (suggestedTitle && !personal.jobTitle) {
    personal.jobTitle = suggestedTitle;
    changes.push(`Set job title to "${suggestedTitle}" from JD.`);
  }

  // ── 2. Summary ──────────────────────────────────────────────────────────────
  const yearsExp = data.experience.length > 0
    ? Math.max(1, data.experience.length * 1.5)
    : 0;

  const newSummary = buildSummary(personal.summary, personal.fullName, personal.jobTitle, topKws, Math.floor(yearsExp));
  if (newSummary !== personal.summary) {
    personal.summary = newSummary;
    changes.push("Enhanced professional summary with JD-relevant keywords.");
  }

  // ── 3. Skills ───────────────────────────────────────────────────────────────
  const existingSkillNames = new Set(data.skills.map((s) => s.name.toLowerCase()));
  const newSkills: Skill[] = [];

  missingSkillKws.forEach((kw) => {
    if (!existingSkillNames.has(kw)) {
      newSkills.push({ id: nanoid(), name: cap(kw), level: "Intermediate" });
      existingSkillNames.add(kw);
    }
  });

  const skills = [...data.skills, ...newSkills];
  if (newSkills.length > 0) {
    changes.push(`Added ${newSkills.length} JD-matched skill(s): ${newSkills.map((s) => s.name).join(", ")}.`);
  }

  // ── 4. Experience descriptions ──────────────────────────────────────────────
  const expKws = topKws.filter((kw) => !existingSkillNames.has(kw)).slice(0, 6);
  const experience = data.experience.map((exp) => {
    const expNorm = `${exp.position} ${exp.description}`.toLowerCase();
    const expMissing = expKws.filter((kw) => !expNorm.includes(kw));

    if (expMissing.length === 0 && exp.description.trim().length > 30) return exp;

    const enriched = enrichDescription(exp.description, expMissing.length > 0 ? expMissing : topKws.slice(0, 3));
    if (enriched !== exp.description) {
      changes.push(`Enriched description for "${exp.position}" at "${exp.company}".`);
    }
    return { ...exp, description: enriched };
  });

  // ── 5. Finalise ─────────────────────────────────────────────────────────────
  const optimized: ResumeData = {
    ...data,
    personal,
    skills,
    experience,
  };

  if (changes.length === 0) {
    changes.push("Your resume is already well-optimised for this JD. Minor tweaks only.");
  }

  return { optimized, changes };
}

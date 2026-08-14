import type { Job } from "@/types";
import type { PrivateJob } from "@/data/privateJobs";

export interface UserJobProfile {
  targetRole: string;
  experience: string;
  location: string;
  sector: "all" | "govt" | "private";
  skills: string[];
}

export const DEFAULT_USER_PROFILE: UserJobProfile = {
  targetRole: "Software Engineer",
  experience: "1-3 yrs",
  location: "Bangalore",
  sector: "all",
  skills: ["React", "Python", "SQL", "Communication"],
};

const USER_PROFILE_STORAGE_KEY = "deshkiseva_user_job_profile";

export function getUserJobProfile(): UserJobProfile {
  try {
    const stored = localStorage.getItem(USER_PROFILE_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error("Failed to load user profile from storage", e);
  }
  return DEFAULT_USER_PROFILE;
}

export function saveUserJobProfile(profile: UserJobProfile): void {
  try {
    localStorage.setItem(USER_PROFILE_STORAGE_KEY, JSON.stringify(profile));
  } catch (e) {
    console.error("Failed to save user profile to storage", e);
  }
}

/**
 * Calculates match score % (0 - 100%) for Private Job
 */
export function calculatePrivateJobMatch(job: PrivateJob, profile: UserJobProfile): number {
  let score = 50; // base score

  // Title match
  if (profile.targetRole) {
    const roleLower = profile.targetRole.toLowerCase();
    const titleLower = job.title.toLowerCase();
    if (titleLower.includes(roleLower) || roleLower.includes(job.category.toLowerCase())) {
      score += 25;
    }
  }

  // Location match
  if (profile.location && profile.location !== "All India") {
    const locLower = profile.location.toLowerCase();
    const jobLoc = job.location.toLowerCase();
    if (jobLoc.includes(locLower) || jobLoc.includes("remote") || locLower.includes("remote")) {
      score += 15;
    }
  }

  // Skills match
  if (profile.skills && profile.skills.length > 0) {
    const matchedSkills = job.tags.filter(tag =>
      profile.skills.some(userSkill => userSkill.toLowerCase() === tag.toLowerCase() || tag.toLowerCase().includes(userSkill.toLowerCase()))
    );
    score += Math.min(matchedSkills.length * 5, 10);
  }

  return Math.min(score, 98);
}

/**
 * Calculates match score % for Govt Job
 */
export function calculateGovtJobMatch(job: Job, profile: UserJobProfile): number {
  let score = 55;

  if (profile.targetRole) {
    const roleLower = profile.targetRole.toLowerCase();
    const titleLower = job.title.toLowerCase();
    const orgLower = job.organization.toLowerCase();
    if (titleLower.includes(roleLower) || orgLower.includes(roleLower)) {
      score += 25;
    }
  }

  if (profile.location && profile.location !== "All India") {
    const locLower = profile.location.toLowerCase();
    const stateLower = (job.state || "").toLowerCase();
    const cityLower = (job.city || "").toLowerCase();
    if (stateLower.includes(locLower) || cityLower.includes(locLower) || locLower.includes(stateLower)) {
      score += 15;
    }
  }

  return Math.min(score, 99);
}

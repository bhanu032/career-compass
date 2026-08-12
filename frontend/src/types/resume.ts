export interface PersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  linkedin: string;
  website: string;
  jobTitle: string;
  summary: string;
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  grade: string;
}

export interface Skill {
  id: string;
  name: string;
  level: "Beginner" | "Intermediate" | "Advanced" | "Expert";
}

export interface Project {
  id: string;
  name: string;
  description: string;
  link: string;
  technologies: string;
}

export interface Certificate {
  id: string;
  name: string;
  issuer: string;
  date: string;
}

export interface ResumeData {
  personal: PersonalInfo;
  experience: Experience[];
  education: Education[];
  skills: Skill[];
  projects: Project[];
  certificates: Certificate[];
}

export type TemplateId =
  | "classic"
  | "modern"
  | "minimal"
  | "executive"
  | "sharp"
  | "slate"
  | "timeline"
  | "compact";

export interface ResumeTemplate {
  id: TemplateId;
  name: string;
  description: string;
  accent: string;
  preview: string; // color key for MiniPreview
}

export const RESUME_TEMPLATES: ResumeTemplate[] = [
  {
    id: "classic",
    name: "Classic",
    description: "Traditional two-column layout, perfect for government & PSU jobs",
    accent: "#1e3a5f",
    preview: "blue",
  },
  {
    id: "modern",
    name: "Modern",
    description: "Clean sidebar design with bold typography for tech & private sector",
    accent: "#7c3aed",
    preview: "purple",
  },
  {
    id: "minimal",
    name: "Minimal",
    description: "Elegant single-column with clean lines — universally accepted ATS",
    accent: "#0f766e",
    preview: "teal",
  },
  {
    id: "executive",
    name: "Executive",
    description: "Premium gold accents — ideal for senior & director-level positions",
    accent: "#92400e",
    preview: "amber",
  },
  {
    id: "sharp",
    name: "Sharp",
    description: "Bold red accent — great for banking, SSC CGL & fresh graduates",
    accent: "#b91c1c",
    preview: "red",
  },
  {
    id: "slate",
    name: "Slate",
    description: "Dark charcoal header with cyan highlights — corporate & management",
    accent: "#0891b2",
    preview: "cyan",
  },
  {
    id: "timeline",
    name: "Timeline",
    description: "Dot-and-line timeline layout — stands out for experienced profiles",
    accent: "#059669",
    preview: "green",
  },
  {
    id: "compact",
    name: "Compact",
    description: "Dense ATS-optimised single column — maximum content on one page",
    accent: "#1d4ed8",
    preview: "navy",
  },
];

export const EMPTY_RESUME: ResumeData = {
  personal: {
    fullName: "",
    email: "",
    phone: "",
    address: "",
    linkedin: "",
    website: "",
    jobTitle: "",
    summary: "",
  },
  experience: [],
  education: [],
  skills: [],
  projects: [],
  certificates: [],
};

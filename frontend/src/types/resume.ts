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

export type ResumeDateFormat = "MMM YYYY" | "MMMM YYYY" | "MM/YYYY" | "YYYY";
export type ResumeSkillStyle = "bars" | "chips" | "comma";

export interface ResumeCustomization {
  schemaVersion: 1;
  accentColor: string;
  fontFamily: string;
  fontScale: number;
  lineHeight: number;
  sectionSpacing: number;
  pageMargin: number;
  dateFormat: ResumeDateFormat;
  skillStyle: ResumeSkillStyle;
  showSkillLevels: boolean;
}

export type TemplateId =
  | "classic"
  | "modern"
  | "minimal"
  | "executive"
  | "sharp"
  | "slate"
  | "timeline"
  | "compact"
  | "ats"
  | "consulting"
  | "academic"
  | "portfolio"
  | "custom"
  | "lato"
  | "sidebar"
  | "card";

export type TemplateCategory =
  | "professional"
  | "modern"
  | "tech"
  | "student"
  | "creative";

export interface ResumeTemplate {
  id: TemplateId;
  name: string;
  description: string;
  accent: string;
  preview: string; // color key for legacy fallback
  category: TemplateCategory;
}

export const TEMPLATE_CATEGORIES: Array<{ id: "all" | TemplateCategory; name: string }> = [
  { id: "all", name: "All Templates" },
  { id: "professional", name: "Professional" },
  { id: "modern", name: "Modern" },
  { id: "tech", name: "Tech" },
  { id: "student", name: "Student" },
  { id: "creative", name: "Creative" },
];

export const RESUME_TEMPLATES: ResumeTemplate[] = [
  {
    id: "classic",
    name: "Classic",
    description: "Traditional two-column layout, perfect for government & PSU jobs",
    accent: "#1e3a5f",
    preview: "blue",
    category: "professional",
  },
  {
    id: "modern",
    name: "Modern",
    description: "Clean sidebar design with bold typography for tech & private sector",
    accent: "#7c3aed",
    preview: "purple",
    category: "modern",
  },
  {
    id: "minimal",
    name: "Minimal",
    description: "Elegant single-column with clean lines - universally accepted ATS",
    accent: "#0f766e",
    preview: "teal",
    category: "student",
  },
  {
    id: "executive",
    name: "Executive",
    description: "Premium gold accents - ideal for senior & director-level positions",
    accent: "#92400e",
    preview: "amber",
    category: "professional",
  },
  {
    id: "sharp",
    name: "Sharp",
    description: "Bold red accent - great for banking, SSC CGL & fresh graduates",
    accent: "#b91c1c",
    preview: "red",
    category: "student",
  },
  {
    id: "slate",
    name: "Slate",
    description: "Dark charcoal header with cyan highlights - corporate & management",
    accent: "#0891b2",
    preview: "cyan",
    category: "modern",
  },
  {
    id: "timeline",
    name: "Timeline",
    description: "Dot-and-line timeline layout - stands out for experienced profiles",
    accent: "#059669",
    preview: "green",
    category: "creative",
  },
  {
    id: "compact",
    name: "Compact",
    description: "Dense ATS-optimised single column - maximum content on one page",
    accent: "#1d4ed8",
    preview: "navy",
    category: "tech",
  },
  {
    id: "ats",
    name: "ATS Pro",
    description: "Recruiter-friendly, single-column format for job portals and ATS systems",
    accent: "#2563eb",
    preview: "blue",
    category: "tech",
  },
  {
    id: "consulting",
    name: "Consulting",
    description: "Polished business resume for analyst, MBA, finance, and consulting roles",
    accent: "#0f172a",
    preview: "slate",
    category: "professional",
  },
  {
    id: "academic",
    name: "Academic",
    description: "CV-style layout for research, teaching, fellowships, and higher studies",
    accent: "#475569",
    preview: "gray",
    category: "professional",
  },
  {
    id: "portfolio",
    name: "Portfolio",
    description: "Modern project-forward format for tech, design, and product profiles",
    accent: "#db2777",
    preview: "pink",
    category: "creative",
  },
  {
    id: "custom",
    name: "Custom",
    description: "Build your own look with selected font, color, spacing, and skill style",
    accent: "#7c3aed",
    preview: "custom",
    category: "creative",
  },
  {
    id: "lato",
    name: "Lato",
    description: "Clean two-column card layout with skill dots — great for developers",
    accent: "#54AFE4",
    preview: "blue",
    category: "modern",
  },
  {
    id: "sidebar",
    name: "Sidebar",
    description: "Dark sidebar with coloured top bar — bold and distinctive design",
    accent: "#5695cd",
    preview: "blue",
    category: "creative",
  },
  {
    id: "card",
    name: "Card",
    description: "Profile-card layout with avatar, skill bars, and timeline education",
    accent: "#4682bf",
    preview: "blue",
    category: "modern",
  },
];

export const DEFAULT_RESUME_CUSTOMIZATION: ResumeCustomization = {
  schemaVersion: 1,
  accentColor: RESUME_TEMPLATES[0].accent,
  fontFamily: "Inter, Arial, sans-serif",
  fontScale: 1,
  lineHeight: 1.5,
  sectionSpacing: 0.85,
  pageMargin: 1,
  dateFormat: "MMM YYYY",
  skillStyle: "bars",
  showSkillLevels: true,
};

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

export const SAMPLE_RESUME: ResumeData = {
  personal: {
    fullName: "Aarav Mehta",
    email: "aarav.mehta@email.com",
    phone: "+91 98765 43210",
    address: "New Delhi, India",
    linkedin: "linkedin.com/in/aarav-mehta",
    website: "aaravmehta.dev",
    jobTitle: "Software Engineer",
    summary:
      "Software Engineer with experience building responsive web applications, REST APIs, and data-driven dashboards. Strong foundation in React, TypeScript, Python, SQL, and cloud deployment with a focus on measurable product impact.",
  },
  experience: [
    {
      id: "sample-exp-1",
      position: "Software Engineer",
      company: "CivicTech Solutions",
      startDate: "2024-01",
      endDate: "",
      current: true,
      description:
        "Built reusable React components for applicant workflows and analytics dashboards.\nImproved page load performance by 32% through code splitting and API caching.\nCollaborated with product and backend teams to ship secure resume and job matching features.",
    },
    {
      id: "sample-exp-2",
      position: "Frontend Developer Intern",
      company: "Digital India Labs",
      startDate: "2023-05",
      endDate: "2023-12",
      current: false,
      description:
        "Implemented responsive pages using React, Tailwind CSS, and TypeScript.\nIntegrated REST APIs and handled form validation, loading states, and error feedback.",
    },
  ],
  education: [
    {
      id: "sample-edu-1",
      institution: "Delhi Technological University",
      degree: "B.Tech",
      field: "Computer Science",
      startDate: "2020-08",
      endDate: "2024-06",
      grade: "8.4 CGPA",
    },
  ],
  skills: [
    { id: "sample-skill-1", name: "React", level: "Advanced" },
    { id: "sample-skill-2", name: "TypeScript", level: "Advanced" },
    { id: "sample-skill-3", name: "Python", level: "Intermediate" },
    { id: "sample-skill-4", name: "FastAPI", level: "Intermediate" },
    { id: "sample-skill-5", name: "SQL", level: "Intermediate" },
    { id: "sample-skill-6", name: "Communication", level: "Advanced" },
  ],
  projects: [
    {
      id: "sample-project-1",
      name: "Career Compass Resume Builder",
      technologies: "React, TypeScript, Tailwind CSS",
      link: "github.com/aarav/resume-builder",
      description:
        "Created a resume builder with live preview, template customization, ATS scoring, and PDF export.",
    },
    {
      id: "sample-project-2",
      name: "Government Job Tracker",
      technologies: "Python, PostgreSQL, React",
      link: "",
      description:
        "Built a dashboard to track job openings, eligibility filters, saved jobs, and application deadlines.",
    },
  ],
  certificates: [
    {
      id: "sample-cert-1",
      name: "AWS Cloud Practitioner",
      issuer: "Amazon Web Services",
      date: "2024-03",
    },
    {
      id: "sample-cert-2",
      name: "Advanced React",
      issuer: "Coursera",
      date: "2023-11",
    },
  ],
};

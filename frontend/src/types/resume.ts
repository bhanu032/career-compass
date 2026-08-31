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

/** The reorderable resume section keys (personal is always pinned to header) */
export type ResumeSectionKey =
  | "summary"
  | "experience"
  | "education"
  | "skills"
  | "projects"
  | "certificates";

/** Default render order for sections */
export const DEFAULT_SECTION_ORDER: ResumeSectionKey[] = [
  "summary",
  "experience",
  "education",
  "skills",
  "projects",
  "certificates",
];

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
  /** Ordered list of sections to render. Personal info is always pinned. */
  sectionOrder: ResumeSectionKey[];
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
  sectionOrder: [...DEFAULT_SECTION_ORDER],
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
    fullName: "BHANU PRATAP SINGH",
    email: "rankush248@gmail.com",
    phone: "+91 6376548862",
    address: "Jaipur, Rajasthan, India",
    linkedin: "linkedin.com/in/bhanu032",
    website: "https://career-compass-b8z9kvsla-bhanu-pratap-singhs-projects-e705f4e9.vercel.app/",
    jobTitle: "ReactJS Developer | MERN Stack Developer | Full-Stack (.NET / MERN)",
    summary:
      "Software Development Engineer with 2+ years of experience in Reactive Programming (React JS) and UI & Markup Language (TypeScript), building scalable, AI-powered HRTech platforms across React.js, Node.js, Express.js, and MongoDB, deployed on Linux (Ubuntu) servers with Docker and Nginx. Skilled across the full Software Development Life Cycle (SDLC) — from understanding design specifications and writing test cases/scenarios to implementing designs, developing high-quality programs, and responding to production issues. Delivers end-to-end features spanning REST APIs, WebSocket-based real-time systems, and production-grade React/TypeScript interfaces.",
  },
  experience: [
    {
      id: "exp-1",
      position: "Frontend Developer (MERN Stack)",
      company: "DarpanAI Technologies (InterviewGhost.ai)",
      startDate: "2026-01",
      endDate: "2026-07",
      current: false,
      description:
        "Built and maintained InterviewGhost.ai, an AI-powered hiring and career-automation platform, using React.js, TypeScript, Next.js, Node.js/Express REST APIs, Vite, Bootstrap, and Tailwind CSS across B2C, B2B/HR, and scheduling route groups.\nDeveloped ATS-focused resume workflows: resume dashboard, template rendering, ATS score/keyword analysis, cover-letter generation, and print-ready PDF export via jsPDF, react-to-print, and html2canvas.\nImplemented real-time AI interview experiences using WebSockets, speech recognition, live transcription, audio capture, and candidate verification/hardware-check flows with face-api.js.\nManaged application state with Redux Toolkit, React Query, and Context API; owned CI/CD delivery with Docker, Nginx, Vercel, and GitHub Actions.",
    },
    {
      id: "exp-2",
      position: "Software Developer / Full-Stack Developer (MERN & .NET/Angular)",
      company: "Sysmorph",
      startDate: "2024-06",
      endDate: "2025-12",
      current: false,
      description:
        "Architected, developed, and deployed full-stack client solutions and enterprise tools across MERN, Python, and .NET/Angular stacks.\nSwiftERP Suite: Developed an enterprise ERP suite featuring .NET 8 Web API (Clean Architecture), Angular 18+ (Signals & Reactive Forms), MSSQL with EF Core, and React Native companion app with atomic stock deduction and HR workflows.\nCareer Compass (GovJobs Portal): Built a government job aggregation platform using React 19, TypeScript, Tailwind CSS, and Python (FastAPI/PostgreSQL) with automated multi-portal scrapers.\nTranslify & AMobile: Built in-browser contextual translation extension (Manifest V3) and low-latency USB input hardware bridge (C++/Win32).",
    },
  ],
  education: [
    {
      id: "edu-1",
      institution: "JK Lakshmipat University",
      degree: "B.Tech",
      field: "Computer Science and Engineering",
      startDate: "2021-08",
      endDate: "2025-06",
      grade: "7.0 CGPA",
    },
  ],
  skills: [
    { id: "skill-1", name: "Reactive Programming (React JS)", level: "Advanced" },
    { id: "skill-2", name: "UI & Markup (TypeScript)", level: "Advanced" },
    { id: "skill-3", name: "MERN Stack (Node, Express, MongoDB)", level: "Advanced" },
    { id: "skill-4", name: ".NET 8 Web API & C#", level: "Advanced" },
    { id: "skill-5", name: "Angular 18+ & RxJS", level: "Advanced" },
    { id: "skill-6", name: "Redux Toolkit & React Query", level: "Advanced" },
    { id: "skill-7", name: "Tailwind CSS, Bootstrap & Radix UI", level: "Advanced" },
    { id: "skill-8", name: "WebSockets & REST APIs", level: "Advanced" },
    { id: "skill-9", name: "Docker, Nginx & CI/CD", level: "Advanced" },
    { id: "skill-10", name: "Vitest, Testing Library & xUnit", level: "Advanced" },
  ],
  projects: [
    {
      id: "proj-1",
      name: "InterviewGhost.ai — AI-Powered HRTech Platform",
      technologies: "React.js, Next.js, TypeScript, Redux Toolkit, WebSockets, Vitest",
      link: "https://interviewghost.ai",
      description:
        "AI hiring and career-automation platform covering resume optimization, ATS scoring, interview simulation, screen-sharing validation, and candidate/HR dashboards.",
    },
    {
      id: "proj-2",
      name: "SwiftERP — Enterprise Resource Planning Suite",
      technologies: ".NET 8 Web API, Angular 18+, React Native, MSSQL, EF Core",
      link: "",
      description:
        "Full-stack ERP platform with atomic stock logic, concurrency tokens, multi-tier approval workflows for sales orders and employee leaves, and real-time KPI reporting.",
    },
    {
      id: "proj-3",
      name: "Career Compass — Automated Government Job Portal",
      technologies: "React 19, TypeScript, FastAPI, PostgreSQL, Tailwind CSS",
      link: "https://career-compass-b8z9kvsla-bhanu-pratap-singhs-projects-e705f4e9.vercel.app/",
      description:
        "Centralized job portal with automated periodic scrapers across 10+ government portals, advanced search and filtering, bookmarking, and instant notification PDF generation.",
    },
    {
      id: "proj-4",
      name: "Translify — In-Browser Real-Time Translation Extension",
      technologies: "JavaScript, Chrome Manifest V3, Web DOM APIs, CSS3",
      link: "",
      description:
        "Contextual browser extension providing real-time text translation, custom floating popovers, and seamless multi-language switching with zero page layout shift.",
    },
    {
      id: "proj-5",
      name: "AMobile — Low-Latency USB Input & Device Bridge",
      technologies: "C++, Win32 APIs, Android ADB / Reverse Socket, PowerShell",
      link: "",
      description:
        "Lightweight background hardware input emulation and low-latency USB communication bridge connecting Android and Windows machines.",
    },
  ],
  certificates: [
    {
      id: "cert-1",
      name: "Advanced React & Reactive Systems",
      issuer: "Meta / Coursera",
      date: "2024-05",
    },
    {
      id: "cert-2",
      name: "Full-Stack Development with MERN & .NET",
      issuer: "Sysmorph Technologies",
      date: "2024-12",
    },
  ],
};

/**
 * ATS Resume Optimizer — 100% frontend, no API needed.
 *
 * Generates SuggestedChange[] objects (same shape as backend) that cover:
 *   • Job title alignment to JD
 *   • Professional summary enrichment
 *   • Missing skills (one card per skill)
 *   • Experience description enrichment (one card per job)
 *   • Dummy project suggestions tailored to JD
 *   • Dummy certification suggestions tailored to JD
 */

import type { ResumeData } from "@/types/resume";
import type { SuggestedChange } from "@/services/resumeService";
import { extractKeywords, scoreResume } from "@/utils/ats";
import { nanoid } from "@/utils/nanoid";

// ─── helpers ────────────────────────────────────────────────────────────────

function cap(s: string): string {
  if (!s) return s;
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function titleCase(s: string): string {
  return s.split(" ").map(cap).join(" ");
}

/** A keyword counts as "skill-like" if it's ≤3 words, sensible length, tech-safe chars */
function isSkillLike(kw: string): boolean {
  const words = kw.trim().split(" ");
  return (
    words.length <= 3 &&
    kw.length >= 2 &&
    kw.length <= 40 &&
    /^[a-z0-9#.+\- ]+$/i.test(kw)
  );
}

/** Pull likely job title out of JD text */
function extractJdTitle(jdText: string): string {
  const patterns: RegExp[] = [
    /(?:position|role|title|job)[:\s-–]+([A-Z][a-zA-Z\s/()]{3,55})/i,
    /(?:hiring|looking for|seeking)\s+(?:an?\s+)?([A-Z][a-zA-Z\s/]{3,50})/i,
    /^([A-Z][a-zA-Z\s/]{3,50})\s*\n/m,
    /\b((?:Senior|Junior|Lead|Principal|Associate|Staff|Chief|Head of)?\s*[A-Z][a-z]+(?:\s+[A-Z][a-z]+){0,4})\s+(?:Engineer|Developer|Manager|Analyst|Officer|Executive|Consultant|Specialist|Architect|Designer|Scientist|Administrator)\b/,
  ];
  for (const pat of patterns) {
    const m = jdText.match(pat);
    if (m?.[1]) {
      const title = m[1].trim().replace(/\s+/g, " ").replace(/[.,]+$/, "");
      if (title.length > 3 && title.length < 60) return title;
    }
  }
  return "";
}

/** Count approximate years of experience from experience array */
function approxYearsExp(data: ResumeData): number {
  if (data.experience.length === 0) return 0;
  return Math.min(15, Math.max(1, Math.round(data.experience.length * 1.5)));
}

// ─── domain lookup tables ─────────────────────────────────────────────────────

interface DomainProfile {
  skills: string[];
  certs: Array<{ name: string; issuer: string }>;
  projectTemplates: Array<{ name: string; technologies: string; description: string }>;
  expBullets: string[];
}

const DOMAIN_PROFILES: Array<{ keywords: string[]; profile: DomainProfile }> = [
  {
    keywords: ["react", "typescript", "javascript", "frontend", "vue", "angular", "next.js", "webpack", "vite", "css", "html"],
    profile: {
      skills: ["React", "TypeScript", "JavaScript", "Next.js", "Tailwind CSS", "REST APIs", "Git", "Vite", "Webpack", "Jest"],
      certs: [
        { name: "Meta Front-End Developer Certificate", issuer: "Meta / Coursera" },
        { name: "JavaScript Algorithms & Data Structures", issuer: "freeCodeCamp" },
        { name: "React – The Complete Guide", issuer: "Udemy" },
      ],
      projectTemplates: [
        {
          name: "Job Portal UI",
          technologies: "React, TypeScript, Tailwind CSS, React Query",
          description: "Built a responsive job portal with real-time search, filters, and saved-jobs feature. Achieved 95+ Lighthouse performance score.",
        },
        {
          name: "E-Commerce Dashboard",
          technologies: "Next.js, TypeScript, Zustand, ShadCN UI",
          description: "Developed a full-featured admin dashboard with dynamic charts, order management, and role-based access control.",
        },
      ],
      expBullets: [
        "Developed reusable React component library reducing UI development time by 35%.",
        "Implemented code-splitting and lazy loading, improving initial load time from 4.2s to 1.8s.",
        "Integrated REST APIs with React Query for efficient server-state management and caching.",
        "Maintained 90%+ test coverage using Jest and React Testing Library.",
        "Led migration from JavaScript to TypeScript across 3 projects, reducing runtime errors by 40%.",
      ],
    },
  },
  {
    keywords: ["python", "django", "fastapi", "flask", "backend", "rest api", "postgresql", "mysql", "mongodb", "celery"],
    profile: {
      skills: ["Python", "FastAPI", "Django", "PostgreSQL", "Redis", "Docker", "REST API", "Celery", "SQLAlchemy", "Pytest"],
      certs: [
        { name: "Python Professional Certificate", issuer: "Python Institute" },
        { name: "Django Web Development", issuer: "Coursera / University of Michigan" },
        { name: "AWS Certified Developer – Associate", issuer: "Amazon Web Services" },
      ],
      projectTemplates: [
        {
          name: "Microservices Backend API",
          technologies: "FastAPI, PostgreSQL, Redis, Docker, Celery",
          description: "Designed and built a scalable REST API serving 10k+ requests/day with JWT authentication, rate limiting, and async task processing.",
        },
        {
          name: "Data Pipeline & Analytics Service",
          technologies: "Python, Pandas, PostgreSQL, Airflow",
          description: "Built an automated ETL pipeline processing 500k+ records daily with data validation, deduplication, and dashboard reporting.",
        },
      ],
      expBullets: [
        "Engineered RESTful APIs using FastAPI with JWT-based authentication and role-based access control.",
        "Optimised PostgreSQL queries with proper indexing, reducing average query latency by 60%.",
        "Implemented background task processing with Celery and Redis for async email and report generation.",
        "Containerised services using Docker and Docker Compose, streamlining local development.",
        "Wrote comprehensive unit and integration tests achieving 85%+ code coverage with Pytest.",
      ],
    },
  },
  {
    keywords: ["data science", "machine learning", "deep learning", "tensorflow", "pytorch", "pandas", "numpy", "sklearn", "nlp", "ai", "data analyst"],
    profile: {
      skills: ["Python", "Pandas", "NumPy", "Scikit-learn", "TensorFlow", "PyTorch", "SQL", "Tableau", "Jupyter", "Git"],
      certs: [
        { name: "Machine Learning Specialization", issuer: "DeepLearning.AI / Coursera" },
        { name: "Google Data Analytics Professional Certificate", issuer: "Google / Coursera" },
        { name: "TensorFlow Developer Certificate", issuer: "Google" },
      ],
      projectTemplates: [
        {
          name: "Churn Prediction Model",
          technologies: "Python, Scikit-learn, Pandas, Matplotlib",
          description: "Built a customer churn prediction model with 87% accuracy using Random Forest and XGBoost; deployed as a REST API.",
        },
        {
          name: "Sentiment Analysis Pipeline",
          technologies: "Python, NLTK, TensorFlow, Flask",
          description: "Developed an NLP pipeline for real-time product review sentiment analysis, processing 1M+ reviews with 91% accuracy.",
        },
      ],
      expBullets: [
        "Developed machine learning models for classification and regression achieving >85% accuracy on validation sets.",
        "Performed exploratory data analysis and feature engineering on datasets with 1M+ records using Pandas and NumPy.",
        "Built interactive dashboards in Tableau to surface business insights, reducing report generation time by 70%.",
        "Applied NLP techniques including tokenisation, stemming, and TF-IDF for text classification tasks.",
        "Automated model retraining and evaluation pipelines, cutting deployment time from days to hours.",
      ],
    },
  },
  {
    keywords: ["devops", "kubernetes", "docker", "aws", "azure", "gcp", "terraform", "ci/cd", "jenkins", "ansible", "cloud", "infrastructure"],
    profile: {
      skills: ["Docker", "Kubernetes", "AWS", "Terraform", "GitHub Actions", "Jenkins", "Ansible", "Linux", "Python", "Bash"],
      certs: [
        { name: "AWS Solutions Architect – Associate", issuer: "Amazon Web Services" },
        { name: "Certified Kubernetes Administrator (CKA)", issuer: "CNCF" },
        { name: "HashiCorp Terraform Associate", issuer: "HashiCorp" },
      ],
      projectTemplates: [
        {
          name: "Kubernetes Microservices Deployment",
          technologies: "Kubernetes, Docker, Helm, GitHub Actions, AWS EKS",
          description: "Designed and deployed a 12-service microservices architecture on AWS EKS with auto-scaling, zero-downtime deploys, and centralised logging.",
        },
        {
          name: "Infrastructure as Code Platform",
          technologies: "Terraform, AWS, Ansible, Python",
          description: "Automated provisioning of multi-environment cloud infrastructure reducing setup time from 3 days to 45 minutes.",
        },
      ],
      expBullets: [
        "Built and maintained CI/CD pipelines using GitHub Actions and Jenkins, reducing deployment frequency from weekly to daily.",
        "Managed Kubernetes clusters on AWS EKS, handling auto-scaling, rolling updates, and blue-green deployments.",
        "Authored Terraform modules for reusable AWS infrastructure, cutting provisioning time by 80%.",
        "Implemented monitoring and alerting with Prometheus, Grafana, and PagerDuty, reducing MTTR by 45%.",
        "Containerised legacy applications using Docker, enabling consistent environments across dev/staging/production.",
      ],
    },
  },
  {
    keywords: ["java", "spring", "spring boot", "hibernate", "microservices", "rest", "maven", "gradle", "jpa"],
    profile: {
      skills: ["Java", "Spring Boot", "Hibernate", "Maven", "PostgreSQL", "Docker", "REST APIs", "JUnit", "Kafka", "Redis"],
      certs: [
        { name: "Oracle Certified Professional: Java SE Developer", issuer: "Oracle" },
        { name: "Spring Boot Masterclass", issuer: "Udemy" },
        { name: "AWS Certified Developer – Associate", issuer: "Amazon Web Services" },
      ],
      projectTemplates: [
        {
          name: "Banking Microservices System",
          technologies: "Java, Spring Boot, PostgreSQL, Kafka, Docker",
          description: "Architected a microservices-based banking system with event-driven communication via Kafka, achieving 99.9% uptime.",
        },
        {
          name: "Order Management REST API",
          technologies: "Spring Boot, JPA, PostgreSQL, Redis, JUnit",
          description: "Built a high-throughput order management API handling 50k+ daily orders with Redis caching and robust error handling.",
        },
      ],
      expBullets: [
        "Developed RESTful microservices with Spring Boot, handling 100k+ API requests per day.",
        "Implemented event-driven architecture using Apache Kafka for asynchronous inter-service communication.",
        "Optimised JPA/Hibernate queries and introduced Redis caching, reducing database load by 55%.",
        "Achieved 90%+ test coverage using JUnit 5 and Mockito for unit and integration tests.",
        "Migrated monolithic application to microservices architecture, improving release cadence from monthly to weekly.",
      ],
    },
  },
  {
    keywords: ["product manager", "product management", "agile", "scrum", "roadmap", "stakeholder", "user story", "backlog", "kpi", "okr"],
    profile: {
      skills: ["Product Roadmapping", "Agile/Scrum", "Stakeholder Management", "JIRA", "User Story Mapping", "A/B Testing", "SQL", "Figma", "OKRs", "Data Analysis"],
      certs: [
        { name: "Certified Scrum Product Owner (CSPO)", issuer: "Scrum Alliance" },
        { name: "Product Management Certificate", issuer: "Product School" },
        { name: "Google Project Management Certificate", issuer: "Google / Coursera" },
      ],
      projectTemplates: [
        {
          name: "Feature Discovery & Launch",
          technologies: "Mixpanel, JIRA, Figma, Google Analytics",
          description: "Led end-to-end discovery, prioritisation, and launch of a core feature increasing user retention by 22% and reducing churn by 15%.",
        },
        {
          name: "Agile Transformation Initiative",
          technologies: "JIRA, Confluence, Miro",
          description: "Drove Agile adoption across 4 cross-functional teams, improving sprint velocity by 35% over 6 months.",
        },
      ],
      expBullets: [
        "Defined and maintained the product roadmap aligned to company OKRs, balancing short-term wins with long-term strategy.",
        "Ran structured customer discovery interviews and synthesised insights to prioritise backlog for 3-month sprint cycles.",
        "Collaborated with engineering and design on 12 feature launches, achieving 95% on-time delivery.",
        "Tracked product KPIs using Mixpanel and Google Analytics, publishing weekly data-driven dashboards to leadership.",
        "Facilitated sprint planning, retrospectives, and stakeholder demos for cross-functional teams of 15+ members.",
      ],
    },
  },
  {
    keywords: ["finance", "accounting", "tally", "gst", "tax", "audit", "chartered accountant", "ca", "financial analysis", "excel", "balance sheet"],
    profile: {
      skills: ["Tally ERP 9", "GST Filing", "MS Excel", "Financial Analysis", "SAP FICO", "TDS", "MIS Reporting", "Income Tax", "Accounts Payable", "Bank Reconciliation"],
      certs: [
        { name: "Chartered Accountant (CA)", issuer: "Institute of Chartered Accountants of India" },
        { name: "GST Practitioner Certificate", issuer: "GSTN / NACIN" },
        { name: "Advanced Excel & Financial Modelling", issuer: "IIM Skills" },
      ],
      projectTemplates: [
        {
          name: "Automated GST Reconciliation Tool",
          technologies: "Excel VBA, Python, GSTN APIs",
          description: "Built an automated tool to reconcile GSTR-2A vs purchase register, reducing manual effort by 80% and improving compliance accuracy.",
        },
        {
          name: "Financial Dashboard for SME",
          technologies: "Excel, Tally, Power BI",
          description: "Designed a monthly MIS dashboard covering P&L, cash flow, and budget vs. actual analysis for a ₹50 Cr revenue business.",
        },
      ],
      expBullets: [
        "Managed end-to-end GST compliance including GSTR-1, GSTR-3B, and annual return filing for 10+ entities.",
        "Prepared monthly MIS reports and financial statements in compliance with Ind-AS standards.",
        "Conducted internal audits identifying ₹12L in cost savings through process improvement recommendations.",
        "Handled TDS deduction, filing, and reconciliation on a monthly basis with zero penalty incidences.",
        "Streamlined accounts payable cycle using Tally ERP 9, reducing payment processing time by 30%.",
      ],
    },
  },
];

/** Generic fallback profile used when no domain is matched */
const GENERIC_PROFILE: DomainProfile = {
  skills: ["Microsoft Office", "Communication", "Problem Solving", "Data Analysis", "Project Management", "Leadership", "Teamwork", "Time Management"],
  certs: [
    { name: "Project Management Professional (PMP)", issuer: "PMI" },
    { name: "Google Analytics Certification", issuer: "Google" },
  ],
  projectTemplates: [
    {
      name: "Process Improvement Initiative",
      technologies: "Excel, PowerPoint, Process Mapping Tools",
      description: "Identified and eliminated operational bottlenecks through data analysis, reducing turnaround time by 25%.",
    },
  ],
  expBullets: [
    "Collaborated across departments to deliver project milestones on time and within budget.",
    "Prepared detailed reports and presentations for senior leadership, aiding strategic decision-making.",
    "Identified process gaps and implemented improvements, increasing team productivity by 20%.",
  ],
};

/** Pick the best matching domain profile based on JD keywords */
function getDomainProfile(jdKeywords: string[]): DomainProfile {
  let bestMatch = 0;
  let bestProfile: DomainProfile = GENERIC_PROFILE;

  for (const domain of DOMAIN_PROFILES) {
    const hits = domain.keywords.filter((k) => jdKeywords.some((jk) => jk.includes(k) || k.includes(jk)));
    if (hits.length > bestMatch) {
      bestMatch = hits.length;
      bestProfile = domain.profile;
    }
  }

  return bestProfile;
}

// ─── suggestion builders ─────────────────────────────────────────────────────

function buildJobTitleChange(data: ResumeData, jdText: string, jdKeywords: string[]): SuggestedChange | null {
  const suggested = extractJdTitle(jdText);
  if (!suggested) return null;
  if (data.personal.jobTitle.toLowerCase() === suggested.toLowerCase()) return null;

  return {
    section: "jobTitle",
    field: "jobTitle",
    original: data.personal.jobTitle,
    suggested,
    reason: `Align your job title to match the target role "${suggested}" so ATS parsers immediately recognise the position match.`,
  };
}

function buildSummaryChange(data: ResumeData, jdKeywords: string[], domainProfile: DomainProfile): SuggestedChange | null {
  const jobTitle = data.personal.jobTitle || extractJdTitle("") || "professional";
  const years = approxYearsExp(data);
  const expPhrase = years > 0 ? `${years}+ year${years > 1 ? "s" : ""} of hands-on experience` : "a results-oriented professional";

  // Pick the top 6 skill-like JD keywords + 3 from domain
  const topJdSkills = jdKeywords.filter(isSkillLike).slice(0, 6).map(titleCase);
  const domainSkills = domainProfile.skills.slice(0, 3);
  const allSkills = [...new Set([...topJdSkills, ...domainSkills])].slice(0, 6).join(", ");

  const suggested =
    `Results-driven ${jobTitle} with ${expPhrase} in building scalable, impactful solutions. ` +
    `Proficient in ${allSkills}. ` +
    `Adept at collaborating with cross-functional teams to translate business requirements into high-quality deliverables. ` +
    `Passionate about continuous learning and contributing to organisational success.`;

  const existing = data.personal.summary.trim();

  // Check if summary already has enough JD keywords
  const kwHits = jdKeywords.slice(0, 8).filter((kw) => existing.toLowerCase().includes(kw)).length;
  if (existing && kwHits >= 4 && existing.length > 80) return null;

  return {
    section: "summary",
    field: "summary",
    original: existing,
    suggested,
    reason: "Replace or enhance your professional summary with JD-matched keywords to immediately signal relevance to ATS scanners.",
  };
}

function buildSkillChanges(data: ResumeData, jdKeywords: string[], domainProfile: DomainProfile): SuggestedChange[] {
  const changes: SuggestedChange[] = [];
  const existingNames = new Set(data.skills.map((s) => s.name.toLowerCase()));

  // JD-extracted skills missing from resume
  const missingJdSkills = jdKeywords
    .filter(isSkillLike)
    .filter((kw) => !existingNames.has(kw.toLowerCase()))
    .slice(0, 6)
    .map(titleCase);

  // Domain-recommended skills missing from resume
  const missingDomainSkills = domainProfile.skills
    .filter((s) => !existingNames.has(s.toLowerCase()))
    .slice(0, 5);

  const allMissing = [...new Set([...missingJdSkills, ...missingDomainSkills])].slice(0, 8);

  for (const skillName of allMissing) {
    changes.push({
      section: "skills",
      field: "skill_add",
      original: "",
      suggested: skillName,
      reason: `"${skillName}" appears in the job description and is expected by ATS for this role. Adding it increases keyword match score.`,
    });
  }

  return changes;
}

function buildExperienceChanges(data: ResumeData, jdKeywords: string[], domainProfile: DomainProfile): SuggestedChange[] {
  const changes: SuggestedChange[] = [];

  if (data.experience.length === 0) return changes;

  data.experience.forEach((exp, idx) => {
    const expNorm = `${exp.position} ${exp.description}`.toLowerCase();
    const missingKws = jdKeywords.filter(isSkillLike).filter((kw) => !expNorm.includes(kw)).slice(0, 4);

    // Pick bullets to inject from domain profile
    const relevantBullets = domainProfile.expBullets
      .filter((b) => !exp.description.toLowerCase().includes(b.toLowerCase().slice(0, 30)))
      .slice(0, 2);

    // Build enriched description
    let enriched = exp.description.trim();

    if (!enriched || enriched.length < 30) {
      // Build from scratch using domain bullets
      enriched = domainProfile.expBullets
        .slice(0, 4)
        .map((b) => `• ${b}`)
        .join("\n");
    } else {
      // Append missing keyword bullets
      if (missingKws.length > 0) {
        enriched +=
          `\n• Leveraged ${missingKws.slice(0, 2).map(titleCase).join(" and ")} to deliver key project milestones on schedule.`;
      }
      if (relevantBullets.length > 0) {
        enriched += `\n• ${relevantBullets[0]}`;
      }
    }

    if (enriched === exp.description) return;

    changes.push({
      section: "experience",
      field: `exp_${idx}`,
      original: exp.description,
      suggested: enriched,
      reason: `Enrich "${exp.position}" at "${exp.company || "your company"}" with JD-aligned keywords and achievement-oriented bullet points to pass ATS screening.`,
    });
  });

  return changes;
}

function buildProjectChanges(data: ResumeData, domainProfile: DomainProfile, jdKeywords: string[]): SuggestedChange[] {
  const changes: SuggestedChange[] = [];

  const existingProjectNames = new Set(data.projects.map((p) => p.name.toLowerCase()));

  // Suggest up to 2 domain-relevant project templates not already in resume
  const toAdd = domainProfile.projectTemplates.filter(
    (pt) => !existingProjectNames.has(pt.name.toLowerCase())
  ).slice(0, 2);

  for (const tpl of toAdd) {
    // Inject top JD keywords into the description
    const topKws = jdKeywords.filter(isSkillLike).slice(0, 3).map(titleCase);
    const description = topKws.length > 0
      ? `${tpl.description} Utilised ${topKws.join(", ")} as core technologies.`
      : tpl.description;

    changes.push({
      section: "experience",
      field: `project_add`,
      original: "",
      suggested: JSON.stringify({ name: tpl.name, technologies: tpl.technologies, description, link: "" }),
      reason: `Adding a relevant project "${tpl.name}" demonstrates hands-on experience with technologies required in the JD, boosting your ATS score.`,
    });
  }

  return changes;
}

function buildCertChanges(data: ResumeData, domainProfile: DomainProfile): SuggestedChange[] {
  const changes: SuggestedChange[] = [];

  const existingCertNames = new Set(data.certificates.map((c) => c.name.toLowerCase()));

  const toAdd = domainProfile.certs.filter(
    (c) => !existingCertNames.has(c.name.toLowerCase())
  ).slice(0, 2);

  for (const cert of toAdd) {
    changes.push({
      section: "experience",
      field: "cert_add",
      original: "",
      suggested: JSON.stringify({ name: cert.name, issuer: cert.issuer, date: "" }),
      reason: `"${cert.name}" is a recognised certification for this role. Adding it signals credibility and can help you pass ATS and recruiter screening.`,
    });
  }

  return changes;
}

// ─── score projection ────────────────────────────────────────────────────────

/**
 * Estimate what the score would be after applying all accepted changes.
 * We build a lightweight projected ResumeData and re-score.
 */
function projectScore(data: ResumeData, changes: SuggestedChange[], jdText: string): number {
  let projected = { ...data, personal: { ...data.personal }, skills: [...data.skills], experience: data.experience.map((e) => ({ ...e })), projects: [...data.projects], certificates: [...data.certificates] };

  for (const change of changes) {
    if (change.field === "summary") {
      projected.personal.summary = change.suggested;
    } else if (change.field === "jobTitle") {
      projected.personal.jobTitle = change.suggested;
    } else if (change.field === "skill_add") {
      const already = projected.skills.some((s) => s.name.toLowerCase() === change.suggested.toLowerCase());
      if (!already) projected.skills = [...projected.skills, { id: nanoid(), name: change.suggested, level: "Intermediate" as const }];
    } else if (change.field.startsWith("exp_")) {
      const idx = parseInt(change.field.split("_")[1], 10);
      if (projected.experience[idx]) projected.experience[idx] = { ...projected.experience[idx], description: change.suggested };
    } else if (change.field === "project_add") {
      try {
        const p = JSON.parse(change.suggested);
        projected.projects = [...projected.projects, { id: nanoid(), name: p.name ?? "", description: p.description ?? "", technologies: p.technologies ?? "", link: p.link ?? "" }];
      } catch { /* ignore */ }
    } else if (change.field === "cert_add") {
      try {
        const c = JSON.parse(change.suggested);
        projected.certificates = [...projected.certificates, { id: nanoid(), name: c.name ?? "", issuer: c.issuer ?? "", date: c.date ?? "" }];
      } catch { /* ignore */ }
    }
  }

  return scoreResume(projected, jdText).total;
}

// ─── public API ──────────────────────────────────────────────────────────────

export interface FrontendOptimizeResult {
  changes: SuggestedChange[];
  scoreBefore: number;
  scoreAfter: number;
}

/**
 * Generate a full set of SuggestedChange[] for the given resume vs JD.
 * This is the frontend fallback when the backend AI is unavailable.
 */
export function generateFrontendSuggestions(data: ResumeData, jdText: string): FrontendOptimizeResult {
  const jdKeywords = extractKeywords(jdText);
  const domainProfile = getDomainProfile(jdKeywords);
  const scoreBefore = scoreResume(data, jdText).total;

  const changes: SuggestedChange[] = [
    buildJobTitleChange(data, jdText, jdKeywords),
    buildSummaryChange(data, jdKeywords, domainProfile),
    ...buildSkillChanges(data, jdKeywords, domainProfile),
    ...buildExperienceChanges(data, jdKeywords, domainProfile),
    ...buildProjectChanges(data, domainProfile, jdKeywords),
    ...buildCertChanges(data, domainProfile),
  ].filter((c): c is SuggestedChange => c !== null);

  const scoreAfter = changes.length > 0 ? projectScore(data, changes, jdText) : scoreBefore;

  return { changes, scoreBefore, scoreAfter };
}

// ─── legacy export (kept for backwards compatibility) ─────────────────────────

export interface OptimizeResult {
  optimized: ResumeData;
  changes: string[];
}

/** @deprecated Use generateFrontendSuggestions instead */
export function optimizeResume(data: ResumeData, jdText: string): OptimizeResult {
  const { changes, ...rest } = generateFrontendSuggestions(data, jdText);
  // Apply all changes automatically (legacy behaviour)
  let optimized = { ...data };
  for (const change of changes) {
    if (change.field === "summary") optimized = { ...optimized, personal: { ...optimized.personal, summary: change.suggested } };
    if (change.field === "jobTitle") optimized = { ...optimized, personal: { ...optimized.personal, jobTitle: change.suggested } };
  }
  return { optimized, changes: changes.map((c) => c.reason) };
}

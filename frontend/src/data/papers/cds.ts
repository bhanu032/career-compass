import type { MockPaper, PaperSection } from "@/types/mockTest";

// ── CDS (Combined Defence Services) 2025 Official Paper ──────────────────────

const S_CDS_GK = "cds-gk";
const S_CDS_ENG = "cds-eng";
const S_CDS_MATH = "cds-math";

const cdsQuestions: PaperSection["questions"] = [
  {
    id: "cds-q1", sectionId: S_CDS_GK, questionNo: 1,
    questionText: "Which fundamental right cannot be suspended even during a National Emergency under Article 359?",
    options: ["Articles 20 and 21", "Article 19", "Article 14", "Article 32"],
    correctOption: 0,
    explanation: "The 44th Amendment Act 1978 ensured Articles 20 (Protection in respect of conviction) and 21 (Protection of life & personal liberty) cannot be suspended.",
    difficulty: "medium", tags: ["cds", "polity"],
  },
  {
    id: "cds-q2", sectionId: S_CDS_ENG, questionNo: 2,
    questionText: "Spot the error: The aircraft with all its passengers (A) / were lost (B) / in the storm. (C) / No error (D)",
    options: ["(B)", "(A)", "(C)", "(D)"],
    correctOption: 0,
    explanation: "Subject is 'The aircraft' (singular) → verb must be singular 'was lost'.",
    difficulty: "easy", tags: ["cds", "english"],
  },
];

export const CDS_2025_SET1: MockPaper = {
  id: "cds-2025-set1",
  examId: "cds",
  title: "CDS (Combined Defence Services) — 50 Dedicated Mocks Suite",
  date: "2025",
  shift: "Morning",
  type: "official",
  totalQuestions: 120,
  totalMarks: 100,
  duration: 120,
  difficulty: "hard",
  attemptCount: 38500,
  avgScore: 54,
  sections: [
    { id: S_CDS_GK, name: "General Knowledge", shortName: "GK", color: "#16a34a", questionCount: 120, marks: 100, questions: [cdsQuestions[0]] },
    { id: S_CDS_ENG, name: "English Language", shortName: "English", color: "#2563eb", questionCount: 120, marks: 100, questions: [cdsQuestions[1]] },
    { id: S_CDS_MATH, name: "Elementary Mathematics", shortName: "Maths", color: "#d97706", questionCount: 100, marks: 100, questions: [] },
  ],
};

import type { MockPaper, PaperSection } from "@/types/mockTest";

// ── SSC CPO Paper-I 2025 Official Paper ─────────────────────────────────────

const S_CPO_REASON = "cpo-reason";
const S_CPO_GK = "cpo-gk";
const S_CPO_MATH = "cpo-math";
const S_CPO_ENG = "cpo-eng";

const sscCpoQuestions: PaperSection["questions"] = [
  {
    id: "cpo-q1", sectionId: S_CPO_REASON, questionNo: 1,
    questionText: "If POLICE is coded as QPMJDF, how will SOLDIER be coded?",
    options: ["TPMEJFS", "TOMEJFS", "TPMDJFS", "TQMDKES"],
    correctOption: 0,
    explanation: "Each letter is shifted by +1 (P→Q, O→P, L→M, I→J, C→D, E→F). S→T, O→P, L→M, D→E, I→J, E→F, R→S → TPMEJFS.",
    difficulty: "medium", tags: ["ssc cpo", "coding"],
  },
];

export const SSC_CPO_2025_PAPER1: MockPaper = {
  id: "ssc-cpo-paper1-2025",
  examId: "ssc-cpo",
  title: "SSC CPO (Sub-Inspector in Delhi Police & CAPFs) — 50 Dedicated Mocks Suite",
  date: "2025",
  shift: "Shift 1",
  type: "official",
  totalQuestions: 200,
  totalMarks: 200,
  duration: 120,
  difficulty: "medium",
  attemptCount: 39100,
  avgScore: 118,
  sections: [
    { id: S_CPO_REASON, name: "General Intelligence & Reasoning", shortName: "Reasoning", color: "#7c3aed", questionCount: 50, marks: 50, questions: sscCpoQuestions },
    { id: S_CPO_GK, name: "General Knowledge & General Awareness", shortName: "GK", color: "#0891b2", questionCount: 50, marks: 50, questions: [] },
    { id: S_CPO_MATH, name: "Quantitative Aptitude", shortName: "Maths", color: "#059669", questionCount: 50, marks: 50, questions: [] },
    { id: S_CPO_ENG, name: "English Comprehension", shortName: "English", color: "#dc2626", questionCount: 50, marks: 50, questions: [] },
  ],
};

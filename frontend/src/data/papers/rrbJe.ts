import type { MockPaper, PaperSection } from "@/types/mockTest";

// ── RRB JE CBT-1 2025 Official Paper ───────────────────────────────────────

const S_JE_MATH = "rrbje-math";
const S_JE_REASON = "rrbje-reason";
const S_JE_SCIENCE = "rrbje-science";
const S_JE_GA = "rrbje-ga";

const rrbJeQuestions: PaperSection["questions"] = [
  {
    id: "rrbje-q1", sectionId: S_JE_SCIENCE, questionNo: 1,
    questionText: "What is the SI unit of Electrical Resistance?",
    options: ["Ohm (Ω)", "Volt", "Ampere", "Watt"],
    correctOption: 0,
    explanation: "Resistance R = V/I. Unit is Ohm (Ω).",
    difficulty: "easy", tags: ["rrb je", "physics"],
  },
];

export const RRB_JE_2025_CBT1: MockPaper = {
  id: "rrb-je-cbt1-2025",
  examId: "rrb-je",
  title: "RRB Junior Engineer (JE) CBT-1 — 50 Dedicated Mocks Suite",
  date: "2025",
  shift: "Shift 1",
  type: "official",
  totalQuestions: 100,
  totalMarks: 100,
  duration: 90,
  difficulty: "medium",
  attemptCount: 33400,
  avgScore: 62,
  sections: [
    { id: S_JE_MATH, name: "Mathematics", shortName: "Maths", color: "#059669", questionCount: 30, marks: 30, questions: [] },
    { id: S_JE_REASON, name: "General Intelligence & Reasoning", shortName: "Reasoning", color: "#7c3aed", questionCount: 25, marks: 25, questions: [] },
    { id: S_JE_GA, name: "General Awareness", shortName: "GK", color: "#ea580c", questionCount: 15, marks: 15, questions: [] },
    { id: S_JE_SCIENCE, name: "General Science", shortName: "Science", color: "#0891b2", questionCount: 30, marks: 30, questions: rrbJeQuestions },
  ],
};

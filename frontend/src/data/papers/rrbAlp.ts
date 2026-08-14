import type { MockPaper, PaperSection } from "@/types/mockTest";

// ── RRB ALP 2024 CBT-1 Official Paper ──────────────────────────────────────

const S_MATH = "alp-math";
const S_REASON = "alp-reason";
const S_SCIENCE = "alp-science";
const S_GA = "alp-ga";

const alpMathQuestions: PaperSection["questions"] = [
  {
    id: "alp-q1", sectionId: S_MATH, questionNo: 1,
    questionText: "If the radius of a sphere is doubled, its surface area increases by what percentage?",
    options: ["300%", "400%", "200%", "100%"],
    correctOption: 0,
    explanation: "Surface area A ∝ r². If r becomes 2r, A becomes 4A (400% of original). Increase = (4 − 1) × 100% = 300%.",
    difficulty: "medium", tags: ["mensuration"],
  },
  {
    id: "alp-q2", sectionId: S_MATH, questionNo: 2,
    questionText: "Find the square root of 5776.",
    options: ["76", "74", "78", "82"],
    correctOption: 0,
    explanation: "70² = 4900, 80² = 6400. Unit digit 6 implies 74 or 76. 75² = 5625 → √5776 = 76.",
    difficulty: "easy", tags: ["square roots"],
  },
];

const alpScienceQuestions: PaperSection["questions"] = [
  {
    id: "alp-q3", sectionId: S_SCIENCE, questionNo: 3,
    questionText: "Which law states that 'at constant temperature, the current flowing through a conductor is directly proportional to the potential difference across it'?",
    options: ["Ohm's Law (V = IR)", "Joule's Law", "Faraday's Law", "Ampere's Law"],
    correctOption: 0,
    explanation: "Ohm's Law: V = I × R at constant temperature.",
    difficulty: "easy", tags: ["physics", "rrb alp"],
  },
  {
    id: "alp-q4", sectionId: S_SCIENCE, questionNo: 4,
    questionText: "What is the chemical formula of Washing Soda?",
    options: ["Na₂CO₃·10H₂O", "NaHCO₃", "NaOH", "CaOCL₂"],
    correctOption: 0,
    explanation: "Washing Soda is Sodium Carbonate Decahydrate: Na₂CO₃·10H₂O.",
    difficulty: "easy", tags: ["chemistry"],
  },
];

export const RRB_ALP_2024_CBT1: MockPaper = {
  id: "rrb-alp-cbt1-2024",
  examId: "rrb-alp",
  title: "RRB Assistant Loco Pilot (ALP) — 2024 Official Paper CBT-1",
  date: "2024",
  shift: "Shift 1",
  type: "official",
  totalQuestions: 75,
  totalMarks: 75,
  duration: 60,
  difficulty: "medium",
  attemptCount: 29800,
  avgScore: 48,
  sections: [
    { id: S_MATH, name: "Mathematics", shortName: "Maths", color: "#059669", questionCount: 20, marks: 20, questions: alpMathQuestions },
    { id: S_REASON, name: "Mental Ability", shortName: "Reasoning", color: "#7c3aed", questionCount: 25, marks: 25, questions: [] },
    { id: S_SCIENCE, name: "General Science", shortName: "Science", color: "#0891b2", questionCount: 20, marks: 20, questions: alpScienceQuestions },
    { id: S_GA, name: "General Awareness", shortName: "GK", color: "#ea580c", questionCount: 10, marks: 10, questions: [] },
  ],
};

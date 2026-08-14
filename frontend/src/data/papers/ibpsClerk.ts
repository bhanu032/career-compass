import type { MockPaper, PaperSection } from "@/types/mockTest";

// ── IBPS Clerk 2024 Prelims Official Paper ──────────────────────────────────

const S_ENG = "clk-eng";
const S_NUM = "clk-num";
const S_REASON = "clk-reason";

const engQuestions: PaperSection["questions"] = [
  {
    id: "clk-q1", sectionId: S_ENG, questionNo: 1,
    questionText: "Find the error in the sentence:\nNeither the manager nor (A) / the employees was aware (B) / of the sudden audit (C) / scheduled for Monday. (D)",
    options: ["(B)", "(A)", "(C)", "(D)"],
    correctOption: 0,
    explanation: "With 'neither...nor', verb agrees with subject closest to it ('employees' = plural) → should be 'were aware'.",
    difficulty: "medium", tags: ["ibps clerk", "grammar"],
  },
  {
    id: "clk-q2", sectionId: S_ENG, questionNo: 2,
    questionText: "Synonym of the word: FRUGAL",
    options: ["Thrifty / Economical", "Extravagant", "Generous", "Wasteful"],
    correctOption: 0,
    explanation: "Frugal means sparing or economical with regard to money or food — synonym: Thrifty.",
    difficulty: "easy", tags: ["vocabulary"],
  },
];

const numQuestions: PaperSection["questions"] = [
  {
    id: "clk-q3", sectionId: S_NUM, questionNo: 3,
    questionText: "Simplify: (45% of 800) + (25% of 640) = ?",
    options: ["520", "480", "560", "500"],
    correctOption: 0,
    explanation: "(0.45 × 800) + (0.25 × 640) = 360 + 160 = 520.",
    difficulty: "easy", tags: ["simplification"],
  },
  {
    id: "clk-q4", sectionId: S_NUM, questionNo: 4,
    questionText: "The ratio of ages of A and B is 4:5. After 6 years, the ratio becomes 5:6. What is A's present age?",
    options: ["24 years", "20 years", "30 years", "18 years"],
    correctOption: 0,
    explanation: "Let ages be 4x and 5x. (4x + 6)/(5x + 6) = 5/6 → 24x + 36 = 25x + 30 → x = 6. A's age = 4 × 6 = 24 years.",
    difficulty: "easy", tags: ["ages"],
  },
];

const reasonQuestions: PaperSection["questions"] = [
  {
    id: "clk-q5", sectionId: S_REASON, questionNo: 5,
    questionText: "In a row of 40 students, Rahul is 14th from the left end. What is his rank from the right end?",
    options: ["27th", "26th", "28th", "25th"],
    correctOption: 0,
    explanation: "Rank from right = (Total + 1) − Rank from left = (40 + 1) − 14 = 27th.",
    difficulty: "easy", tags: ["ranking"],
  },
];

export const IBPS_CLERK_2024_PRE: MockPaper = {
  id: "ibps-clerk-prelims-2024",
  examId: "ibps-clerk",
  title: "IBPS Clerk Prelims — 2024 Official Paper Set 1",
  date: "2024",
  shift: "Shift 1",
  type: "official",
  totalQuestions: 100,
  totalMarks: 100,
  duration: 60,
  difficulty: "easy",
  attemptCount: 34500,
  avgScore: 72,
  sections: [
    { id: S_ENG, name: "English Language", shortName: "English", color: "#dc2626", questionCount: 30, marks: 30, questions: engQuestions },
    { id: S_NUM, name: "Numerical Ability", shortName: "Maths", color: "#059669", questionCount: 35, marks: 35, questions: numQuestions },
    { id: S_REASON, name: "Reasoning Ability", shortName: "Reasoning", color: "#7c3aed", questionCount: 35, marks: 35, questions: reasonQuestions },
  ],
};

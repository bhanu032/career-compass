import type { MockPaper, PaperSection } from "@/types/mockTest";

// ── RRB Group D CBT 2024 Official Paper ────────────────────────────────────

const S_MATH = "gpd-math";
const S_GI = "gpd-gi";
const S_GS = "gpd-gs";
const S_GA = "gpd-ga";

const gpdMathQuestions: PaperSection["questions"] = [
  {
    id: "gpd-q1", sectionId: S_MATH, questionNo: 1,
    questionText: "What is the LCM of 14, 21, and 28?",
    options: ["84", "42", "112", "56"],
    correctOption: 0,
    explanation: "14 = 2×7, 21 = 3×7, 28 = 2²×7. LCM = 2² × 3 × 7 = 84.",
    difficulty: "easy", tags: ["lcm hcf"],
  },
  {
    id: "gpd-q2", sectionId: S_MATH, questionNo: 2,
    questionText: "A pipe can fill a cistern in 6 hours and another pipe can empty it in 12 hours. If both pipes are opened together, the cistern will be filled in:",
    options: ["12 hours", "8 hours", "10 hours", "14 hours"],
    correctOption: 0,
    explanation: "Net rate = 1/6 − 1/12 = 1/12. Time = 12 hours.",
    difficulty: "easy", tags: ["pipes cisterns"],
  },
];

const gpdGsQuestions: PaperSection["questions"] = [
  {
    id: "gpd-q3", sectionId: S_GS, questionNo: 3,
    questionText: "Which device is used to convert Electrical Energy into Mechanical Energy?",
    options: ["Electric Motor", "Electric Generator / Dynamo", "Transformer", "Solar Cell"],
    correctOption: 0,
    explanation: "Electric Motor converts Electrical energy into Mechanical energy. Generator does the reverse.",
    difficulty: "easy", tags: ["physics", "science"],
  },
  {
    id: "gpd-q4", sectionId: S_GS, questionNo: 4,
    questionText: "What is the pH value of pure water at 25°C?",
    options: ["7", "0", "14", "5.6"],
    correctOption: 0,
    explanation: "Pure water is neutral with a pH of exactly 7 at 25°C.",
    difficulty: "easy", tags: ["chemistry"],
  },
  {
    id: "gpd-q5", sectionId: S_GS, questionNo: 5,
    questionText: "Which part of the human brain controls balance and posture of the body?",
    options: ["Cerebellum", "Cerebrum", "Medulla Oblongata", "Hypothalamus"],
    correctOption: 0,
    explanation: "Cerebellum (hindbrain) coordinates motor movements, balance, and posture.",
    difficulty: "easy", tags: ["biology"],
  },
];

export const RRB_GROUPD_2024_CBT: MockPaper = {
  id: "rrb-groupd-cbt-2024",
  examId: "rrb-groupd",
  title: "RRB Group D — 2024 Official Paper CBT",
  date: "2024",
  shift: "Shift 2",
  type: "official",
  totalQuestions: 100,
  totalMarks: 100,
  duration: 90,
  difficulty: "medium",
  attemptCount: 31200,
  avgScore: 68,
  sections: [
    { id: S_MATH, name: "Mathematics", shortName: "Maths", color: "#059669", questionCount: 25, marks: 25, questions: gpdMathQuestions },
    { id: S_GS, name: "General Science", shortName: "Science", color: "#0891b2", questionCount: 25, marks: 25, questions: gpdGsQuestions },
    { id: S_GI, name: "General Intelligence & Reasoning", shortName: "Reasoning", color: "#7c3aed", questionCount: 30, marks: 30, questions: [] },
    { id: S_GA, name: "General Awareness & Current Affairs", shortName: "GK", color: "#ea580c", questionCount: 20, marks: 20, questions: [] },
  ],
};

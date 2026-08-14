import type { MockPaper, PaperSection } from "@/types/mockTest";

// ── SBI PO Prelims 2024 Official Pattern ────────────────────────────────────

const S_ENG = "sbi-eng";
const S_QUANT = "sbi-quant";
const S_REASON = "sbi-reason";

const sbiEngQuestions: PaperSection["questions"] = [
  {
    id: "sbi-q1", sectionId: S_ENG, questionNo: 1,
    questionText: "Read the sentence and choose the grammatically correct option:\n'Scarcely had he entered the cabin ____ the phone began to ring.'",
    options: ["when", "than", "then", "after"],
    correctOption: 0,
    explanation: "'Scarcely...when' and 'Hardly...when' are correct correlative conjunction pairs.",
    difficulty: "medium", tags: ["banking", "grammar"],
  },
  {
    id: "sbi-q2", sectionId: S_ENG, questionNo: 2,
    questionText: "Synonym of the word: IMPEDIMENT",
    options: ["Obstacle / Hindrance", "Assistance", "Advantage", "Support"],
    correctOption: 0,
    explanation: "Impediment means a hindrance or obstruction in doing something.",
    difficulty: "easy", tags: ["vocabulary"],
  },
];

const sbiQuantQuestions: PaperSection["questions"] = [
  {
    id: "sbi-q3", sectionId: S_QUANT, questionNo: 3,
    questionText: "A sum of ₹10,000 becomes ₹13,310 at 10% per annum compound interest compounded annually. Find the duration in years.",
    options: ["3 years", "2 years", "4 years", "2.5 years"],
    correctOption: 0,
    explanation: "13310 / 10000 = (1.1)ⁿ → 1.331 = (1.1)³ → n = 3 years.",
    difficulty: "easy", tags: ["compound interest"],
  },
  {
    id: "sbi-q4", sectionId: S_QUANT, questionNo: 4,
    questionText: "In a 100 m race, A beats B by 10 m and B beats C by 10 m. By how many metres does A beat C?",
    options: ["19 m", "20 m", "18 m", "15 m"],
    correctOption: 0,
    explanation: "When A runs 100m, B runs 90m. When B runs 100m, C runs 90m → when B runs 90m, C runs (90×90)/100 = 81m. A beats C by 100 − 81 = 19 m.",
    difficulty: "medium", tags: ["races"],
  },
];

const sbiReasonQuestions: PaperSection["questions"] = [
  {
    id: "sbi-q5", sectionId: S_REASON, questionNo: 5,
    questionText: "8 persons A, B, C, D, E, F, G, H sit around a circular table facing centre. A is 3rd to right of B. C is 2nd to left of A. Who is facing A?",
    options: ["E", "F", "D", "G"],
    correctOption: 0,
    explanation: "In an 8-person circular table facing centre, opposite position is 4 places away. Solving the given positions yields E opposite A.",
    difficulty: "hard", tags: ["seating arrangement"],
  },
];

export const SBI_PO_2024_PRELIMS: MockPaper = {
  id: "sbi-po-prelims-2024",
  examId: "sbi-po",
  title: "SBI PO Prelims — 2024 Official Paper Set 1",
  date: "2024",
  shift: "Morning Shift",
  type: "official",
  totalQuestions: 100,
  totalMarks: 100,
  duration: 60,
  difficulty: "hard",
  attemptCount: 28500,
  avgScore: 56,
  sections: [
    { id: S_ENG, name: "English Language", shortName: "English", color: "#dc2626", questionCount: 30, marks: 30, questions: sbiEngQuestions },
    { id: S_QUANT, name: "Quantitative Aptitude", shortName: "Maths", color: "#059669", questionCount: 35, marks: 35, questions: sbiQuantQuestions },
    { id: S_REASON, name: "Reasoning Ability", shortName: "Reasoning", color: "#7c3aed", questionCount: 35, marks: 35, questions: sbiReasonQuestions },
  ],
};

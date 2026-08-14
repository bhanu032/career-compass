import type { MockPaper, PaperSection } from "@/types/mockTest";

// ── SBI Clerk Prelims 2025 Official Paper ───────────────────────────────────

const S_ENG = "sbiclk-eng";
const S_NUM = "sbiclk-num";
const S_REASON = "sbiclk-reason";

const sbiClerkQuestions: PaperSection["questions"] = [
  {
    id: "sbiclk-q1", sectionId: S_ENG, questionNo: 1,
    questionText: "Fill in the blank: The team worked _____ to finish the project before the strict deadline.",
    options: ["diligently", "hardly", "sluggishly", "carelessly"],
    correctOption: 0,
    explanation: "Diligently means with great effort and care.",
    difficulty: "easy", tags: ["sbi clerk", "english"],
  },
  {
    id: "sbiclk-q2", sectionId: S_NUM, questionNo: 2,
    questionText: "What is 35% of 640 + 45% of 800?",
    options: ["584", "564", "604", "574"],
    correctOption: 0,
    explanation: "(0.35 × 640) + (0.45 × 800) = 224 + 360 = 584.",
    difficulty: "easy", tags: ["maths"],
  },
];

export const SBI_CLERK_2025_PRE: MockPaper = {
  id: "sbi-clerk-pre-2025",
  examId: "sbi-clerk",
  title: "SBI Clerk Prelims — 50 Dedicated Mocks Suite",
  date: "2025",
  shift: "Shift 1",
  type: "official",
  totalQuestions: 100,
  totalMarks: 100,
  duration: 60,
  difficulty: "easy",
  attemptCount: 51200,
  avgScore: 71,
  sections: [
    { id: S_ENG, name: "English Language", shortName: "English", color: "#dc2626", questionCount: 30, marks: 30, questions: [sbiClerkQuestions[0]] },
    { id: S_NUM, name: "Numerical Ability", shortName: "Maths", color: "#059669", questionCount: 35, marks: 35, questions: [sbiClerkQuestions[1]] },
    { id: S_REASON, name: "Reasoning Ability", shortName: "Reasoning", color: "#7c3aed", questionCount: 35, marks: 35, questions: [] },
  ],
};

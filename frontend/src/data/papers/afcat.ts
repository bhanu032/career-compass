import type { MockPaper, PaperSection } from "@/types/mockTest";

// ── AFCAT 2025 Official Paper ────────────────────────────────────────────────

const S_AFCAT_GA = "afcat-ga";
const S_AFCAT_VERBAL = "afcat-verbal";
const S_AFCAT_MATH = "afcat-math";
const S_AFCAT_REASON = "afcat-reason";

const afcatQuestions: PaperSection["questions"] = [
  {
    id: "afcat-q1", sectionId: S_AFCAT_GA, questionNo: 1,
    questionText: "What is the motto of the Indian Air Force?",
    options: ["Nabhaḥ Sparśaṁ Dīptam (Touch the Sky with Glory)", "Seva Paramo Dharma", "Samyak Jnanam", "Shaṁ No Varuṇaḥ"],
    correctOption: 0,
    explanation: "The motto of Indian Air Force is 'Nabhaḥ Sparśaṁ Dīptam' taken from the Bhagavad Gita.",
    difficulty: "easy", tags: ["afcat", "defence"],
  },
  {
    id: "afcat-q2", sectionId: S_AFCAT_VERBAL, questionNo: 2,
    questionText: "Select the synonym of the word: CAMOUFLAGE",
    options: ["Disguise", "Reveal", "Expose", "Display"],
    correctOption: 0,
    explanation: "Camouflage means to hide or disguise the presence of something.",
    difficulty: "easy", tags: ["english"],
  },
  {
    id: "afcat-q3", sectionId: S_AFCAT_MATH, questionNo: 3,
    questionText: "A train running at 72 km/h crosses a 200m long platform in 22 seconds. What is the length of the train?",
    options: ["240 meters", "200 meters", "220 meters", "250 meters"],
    correctOption: 0,
    explanation: "Speed = 72 × (5/18) = 20 m/s. Total distance = 20 × 22 = 440m. Train length = 440 − 200 = 240m.",
    difficulty: "medium", tags: ["speed & distance"],
  },
];

export const AFCAT_2025_SET1: MockPaper = {
  id: "afcat-2025-set1",
  examId: "afcat",
  title: "AFCAT (Air Force Common Admission Test) — 50 Dedicated Mocks Suite",
  date: "2025",
  shift: "Shift 1",
  type: "official",
  totalQuestions: 100,
  totalMarks: 300,
  duration: 120,
  difficulty: "medium",
  attemptCount: 42000,
  avgScore: 168,
  sections: [
    { id: S_AFCAT_GA, name: "General Awareness", shortName: "GA", color: "#0284c7", questionCount: 25, marks: 75, questions: [afcatQuestions[0]] },
    { id: S_AFCAT_VERBAL, name: "Verbal Ability", shortName: "English", color: "#7c3aed", questionCount: 30, marks: 90, questions: [afcatQuestions[1]] },
    { id: S_AFCAT_MATH, name: "Numerical Ability", shortName: "Maths", color: "#059669", questionCount: 20, marks: 60, questions: [afcatQuestions[2]] },
    { id: S_AFCAT_REASON, name: "Reasoning & Military Aptitude", shortName: "Reasoning", color: "#ea580c", questionCount: 25, marks: 75, questions: [] },
  ],
};

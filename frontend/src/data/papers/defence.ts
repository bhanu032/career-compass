import type { MockPaper, PaperSection } from "@/types/mockTest";

// ── NDA & NA 2024 GAT Official Paper ───────────────────────────────────────

const S_NDA_ENG = "nda-eng";
const S_NDA_GK = "nda-gk";

const ndaEngQuestions: PaperSection["questions"] = [
  {
    id: "nda-q1", sectionId: S_NDA_ENG, questionNo: 1,
    questionText: "Spot the error in the sentence:\nNeither the teacher (A) / nor the students (B) / was present (C) / at the drill. (D)",
    options: ["(C)", "(A)", "(B)", "(D)"],
    correctOption: 0,
    explanation: "With 'neither...nor', the verb agrees with the subject closest to it ('students' = plural) → should be 'were present'.",
    difficulty: "medium", tags: ["nda", "grammar"],
  },
  {
    id: "nda-q2", sectionId: S_NDA_ENG, questionNo: 2,
    questionText: "Antonym of the word: STEADFAST",
    options: ["Fickle / Wavering", "Loyal", "Firm", "Resolute"],
    correctOption: 0,
    explanation: "Steadfast means firm and unwavering; its antonym is Fickle or Wavering.",
    difficulty: "easy", tags: ["vocabulary"],
  },
];

const ndaGkQuestions: PaperSection["questions"] = [
  {
    id: "nda-q3", sectionId: S_NDA_GK, questionNo: 3,
    questionText: "What is the escape velocity from the surface of Earth?",
    options: ["11.2 km/s", "9.8 km/s", "7.9 km/s", "15.0 km/s"],
    correctOption: 0,
    explanation: "The escape velocity from Earth's surface is approximately 11.2 km/s (or 11,200 m/s).",
    difficulty: "easy", tags: ["physics"],
  },
  {
    id: "nda-q4", sectionId: S_NDA_GK, questionNo: 4,
    questionText: "The Indian Military Academy (IMA) is located at —",
    options: ["Dehradun", "Khadakwasla", "Ezhimala", "Dungigal"],
    correctOption: 0,
    explanation: "The Indian Military Academy (IMA) is located in Dehradun, Uttarakhand. NDA is in Khadakwasla, Pune.",
    difficulty: "easy", tags: ["defence", "general knowledge"],
  },
  {
    id: "nda-q5", sectionId: S_NDA_GK, questionNo: 5,
    questionText: "Which chemical compound is known as 'Plaster of Paris'?",
    options: ["Calcium Sulphate Hemihydrate (CaSO₄·½H₂O)", "Calcium Carbonate (CaCO₃)", "Calcium Chloride (CaCl₂)", "Sodium Bicarbonate"],
    correctOption: 0,
    explanation: "Plaster of Paris is Calcium Sulphate Hemihydrate: CaSO₄·½H₂O.",
    difficulty: "medium", tags: ["chemistry"],
  },
];

export const NDA_2024_GAT: MockPaper = {
  id: "nda-gat-2024",
  examId: "nda-gat",
  title: "NDA & NA — 2024 Official Paper General Ability Test (GAT)",
  date: "2024",
  shift: "Afternoon",
  type: "official",
  totalQuestions: 150,
  totalMarks: 600,
  duration: 150,
  difficulty: "medium",
  attemptCount: 16800,
  avgScore: 280,
  sections: [
    { id: S_NDA_ENG, name: "English Language", shortName: "English", color: "#dc2626", questionCount: 50, marks: 200, questions: ndaEngQuestions },
    { id: S_NDA_GK, name: "General Knowledge & Science", shortName: "GK & Science", color: "#15803d", questionCount: 100, marks: 400, questions: ndaGkQuestions },
  ],
};

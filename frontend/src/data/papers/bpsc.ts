import type { MockPaper, PaperSection } from "@/types/mockTest";

// ── 70th BPSC Prelims 2024 Official Paper ──────────────────────────────────

const S_BPSC_GS = "bpsc-gs1";

const bpscQuestions: PaperSection["questions"] = [
  {
    id: "bpsc-q1", sectionId: S_BPSC_GS, questionNo: 1,
    questionText: "Who led the Revolt of 1857 in Jagdishpur, Bihar?",
    options: ["Kunwar Singh", "Nana Saheb", "Tantia Tope", "Maulvi Ahmadullah"],
    correctOption: 0,
    explanation: "Veer Kunwar Singh of Jagdishpur, Arrah led the 1857 revolt in Bihar against British rule.",
    difficulty: "easy", tags: ["bpsc", "history", "bihar"],
  },
  {
    id: "bpsc-q2", sectionId: S_BPSC_GS, questionNo: 2,
    questionText: "Which Bihar district records the highest literacy rate as per Census 2011?",
    options: ["Rohtas", "Patna", "Munger", "Gaya"],
    correctOption: 0,
    explanation: "Rohtas district has the highest overall literacy rate (73.37%) in Bihar as per Census 2011.",
    difficulty: "medium", tags: ["bpsc", "census", "bihar"],
  },
  {
    id: "bpsc-q3", sectionId: S_BPSC_GS, questionNo: 3,
    questionText: "Where was the Champaran Satyagraha launched by Mahatma Gandhi in 1917 against the Tinkathia system?",
    options: ["Champaran, Bihar", "Kheda, Gujarat", "Bardoli, Gujarat", "Ahmedabad"],
    correctOption: 0,
    explanation: "Gandhi launched his first civil disobedience movement in India at Champaran, Bihar in 1917.",
    difficulty: "easy", tags: ["history", "gandhi"],
  },
];

export const BPSC_70TH_PRE_2024: MockPaper = {
  id: "bpsc-70th-prelims-2024",
  examId: "bpsc-pre",
  title: "70th BPSC Prelims — 2024 Official Paper GS",
  date: "2024",
  shift: "Morning",
  type: "official",
  totalQuestions: 150,
  totalMarks: 150,
  duration: 120,
  difficulty: "medium",
  attemptCount: 18400,
  avgScore: 92,
  sections: [
    {
      id: S_BPSC_GS,
      name: "General Studies (Bihar Special & India)",
      shortName: "GS",
      color: "#0d9488",
      questionCount: 150,
      marks: 150,
      questions: bpscQuestions,
    },
  ],
};

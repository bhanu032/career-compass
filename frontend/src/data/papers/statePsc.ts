import type { MockPaper, PaperSection } from "@/types/mockTest";

// ── UPPSC PCS Prelims 2024 Official Paper ──────────────────────────────────

const S_UPPSC_GS = "uppsc-gs1";

const uppscQuestions: PaperSection["questions"] = [
  {
    id: "uppsc-q1", sectionId: S_UPPSC_GS, questionNo: 1,
    questionText: "Which district of Uttar Pradesh has the highest forest cover percentage as per India State of Forest Report (ISFR)?",
    options: ["Sonbhadra", "Chitrakoot", "Lakhimpur Kheri", "Mirzapur"],
    correctOption: 0,
    explanation: "Sonbhadra district has the maximum forest cover in terms of area and percentage in Uttar Pradesh.",
    difficulty: "medium", tags: ["state psc", "uppsc", "geography"],
  },
  {
    id: "uppsc-q2", sectionId: S_UPPSC_GS, questionNo: 2,
    questionText: "The 'One District One Product' (ODOP) scheme was launched by the Uttar Pradesh Government on which occasion?",
    options: ["UP Diwas (24 January 2018)", "Independence Day 2017", "Gandhi Jayanti 2018", "Republic Day 2019"],
    correctOption: 0,
    explanation: "ODOP scheme was launched on UP Diwas, 24 January 2018, to promote traditional local crafts.",
    difficulty: "easy", tags: ["uppsc", "schemes"],
  },
  {
    id: "uppsc-q3", sectionId: S_UPPSC_GS, questionNo: 3,
    questionText: "Which ruler built the famous 'Buland Darwaza' at Fatehpur Sikri to commemorate his victory over Gujarat?",
    options: ["Akbar", "Shah Jahan", "Jahangir", "Babur"],
    correctOption: 0,
    explanation: "Mughal Emperor Akbar constructed Buland Darwaza in 1601 to commemorate his conquest of Gujarat.",
    difficulty: "easy", tags: ["history", "mughal"],
  },
  {
    id: "uppsc-q4", sectionId: S_UPPSC_GS, questionNo: 4,
    questionText: "The Biosphere Reserve 'Panna' is situated in which state?",
    options: ["Madhya Pradesh", "Uttar Pradesh", "Chhattisgarh", "Odisha"],
    correctOption: 0,
    explanation: "Panna Biosphere Reserve is located in Panna and Chhatarpur districts of Madhya Pradesh.",
    difficulty: "easy", tags: ["geography", "environment"],
  },
  {
    id: "uppsc-q5", sectionId: S_UPPSC_GS, questionNo: 5,
    questionText: "Which Article of the Constitution deals with the creation or abolition of Legislative Councils in States?",
    options: ["Article 169", "Article 170", "Article 168", "Article 171"],
    correctOption: 0,
    explanation: "Article 169 empowers Parliament to create or abolish the Legislative Council (Vidhan Parishad) in a State.",
    difficulty: "medium", tags: ["polity"],
  },
];

export const UPPSC_PCS_2024_PRE: MockPaper = {
  id: "uppsc-pcs-prelims-2024",
  examId: "uppsc-pre",
  title: "UPPSC PCS Prelims — 2024 Official Paper GS-1",
  date: "2024",
  shift: "Morning",
  type: "official",
  totalQuestions: 150,
  totalMarks: 200,
  duration: 120,
  difficulty: "medium",
  attemptCount: 14200,
  avgScore: 110,
  sections: [
    {
      id: S_UPPSC_GS,
      name: "General Studies Paper I",
      shortName: "GS-1",
      color: "#0d9488",
      questionCount: 150,
      marks: 200,
      questions: uppscQuestions,
    },
  ],
};

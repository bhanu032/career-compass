import type { MockPaper, PaperSection } from "@/types/mockTest";

// ── SSC CGL Tier-I 2024 Official Paper Set 1 ───────────────────────────────

const S_REASON = "cgl-reasoning";
const S_GK = "cgl-gk";
const S_QUANT = "cgl-quant";
const S_ENG = "cgl-english";

const reasoningQuestions: PaperSection["questions"] = [
  {
    id: "cgl1-q1", sectionId: S_REASON, questionNo: 1,
    questionText: "Select the option that is related to the third word in the same way as the second word is related to the first word:\nArchitect : Building :: Sculptor : ?",
    options: ["Statue", "Canvas", "Museum", "Chisel"],
    correctOption: 0,
    explanation: "An Architect designs a Building; a Sculptor creates a Statue.",
    difficulty: "easy", tags: ["analogy"],
  },
  {
    id: "cgl1-q2", sectionId: S_REASON, questionNo: 2,
    questionText: "Select the letter-cluster that can replace the question mark (?) in the following series:\nBDF, CFI, DHL, EJO, ?",
    options: ["FLR", "FKR", "GMS", "EKN"],
    correctOption: 0,
    explanation: "1st letters: B,C,D,E → F (+1). 2nd letters: D,F,H,J → L (+2). 3rd letters: F,I,L,O → R (+3). Result = FLR.",
    difficulty: "easy", tags: ["series"],
  },
  {
    id: "cgl1-q3", sectionId: S_REASON, questionNo: 3,
    questionText: "Three of the following four number-pairs are alike in a certain way and one is different. Find the odd pair:",
    options: ["14 - 196", "12 - 144", "16 - 256", "18 - 320"],
    correctOption: 3,
    explanation: "14² = 196, 12² = 144, 16² = 256. But 18² = 324 (not 320). So 18-320 is odd.",
    difficulty: "easy", tags: ["odd one out"],
  },
  {
    id: "cgl1-q4", sectionId: S_REASON, questionNo: 4,
    questionText: "If '+' means '−', '−' means '×', '×' means '÷', and '÷' means '+', then what is the value of: 40 × 5 − 3 + 12 ÷ 6?",
    options: ["18", "24", "16", "20"],
    correctOption: 0,
    explanation: "Expression: 40 ÷ 5 × 3 − 12 + 6 = 8 × 3 − 12 + 6 = 24 − 12 + 6 = 18.",
    difficulty: "medium", tags: ["operations"],
  },
  {
    id: "cgl1-q5", sectionId: S_REASON, questionNo: 5,
    questionText: "Statements: All cars are vehicles. Some vehicles are electric.\nConclusions: I. Some electric are vehicles. II. All electric are cars.",
    options: ["Only conclusion I follows", "Only conclusion II follows", "Both I and II follow", "Neither I nor II follows"],
    correctOption: 0,
    explanation: "Some vehicles are electric implies some electric are vehicles (I follows). II does not follow.",
    difficulty: "medium", tags: ["syllogism"],
  },
  {
    id: "cgl1-q6", sectionId: S_REASON, questionNo: 6,
    questionText: "Pointing to a man, a woman said, 'His mother is the only daughter of my father.' How is the woman related to the man?",
    options: ["Mother", "Sister", "Aunt", "Daughter"],
    correctOption: 0,
    explanation: "Only daughter of my father = me (the woman). So his mother is me → the woman is his Mother.",
    difficulty: "easy", tags: ["blood relations"],
  },
  {
    id: "cgl1-q7", sectionId: S_REASON, questionNo: 7,
    questionText: "In a code language, SYSTEM is written as SYSMET. How is FRACTION written in that code?",
    options: ["CARFNOIT", "ARFCNOIT", "CARFNOIT", "FARCONIT"],
    correctOption: 0,
    explanation: "SYSTEM divided into SYS and TEM. SYS stays SYS, TEM is reversed to MET → SYSMET. FRACTION (8 letters): FRAC + TION → FRAC reversed = CARF, TION reversed = NOIT → CARFNOIT.",
    difficulty: "medium", tags: ["coding-decoding"],
  },
  {
    id: "cgl1-q8", sectionId: S_REASON, questionNo: 8,
    questionText: "Select the correct mirror image of the given figure when the mirror is placed at MN (right side):\n'7 8 K L 9'",
    options: ["9 L K 8 7 reversed", "7 8 K L 9 reversed", "9 K L 8 7 reversed", "L K 9 8 7 reversed"],
    correctOption: 0,
    explanation: "Mirror image reverses character order and flips each letter horizontally.",
    difficulty: "easy", tags: ["mirror image"],
  },
  {
    id: "cgl1-q9", sectionId: S_REASON, questionNo: 9,
    questionText: "Complete the series: 7, 10, 16, 25, 37, ?",
    options: ["52", "49", "50", "55"],
    correctOption: 0,
    explanation: "Differences: +3, +6, +9, +12, +15. 37 + 15 = 52.",
    difficulty: "medium", tags: ["number series"],
  },
  {
    id: "cgl1-q10", sectionId: S_REASON, questionNo: 10,
    questionText: "Which Venn diagram best represents the relationship among: Musicians, Violinists, Women?",
    options: [
      "All Violinists inside Musicians, overlapping with Women",
      "Three separate circles",
      "Three concentric circles",
      "Violinists and Women inside Musicians",
    ],
    correctOption: 0,
    explanation: "All Violinists are Musicians (concentric subset), and Women overlap with both Musicians and Violinists.",
    difficulty: "medium", tags: ["venn diagram"],
  },
];

const gkQuestions: PaperSection["questions"] = [
  {
    id: "cgl1-gk-q11", sectionId: S_GK, questionNo: 11,
    questionText: "Which Article of the Indian Constitution provides for the establishment of the Finance Commission?",
    options: ["Article 280", "Article 324", "Article 315", "Article 110"],
    correctOption: 0,
    explanation: "Article 280 mandates the President to constitute a Finance Commission every 5 years.",
    difficulty: "easy", tags: ["polity"],
  },
  {
    id: "cgl1-gk-q12", sectionId: S_GK, questionNo: 12,
    questionText: "The Harappan site of Dholavira, known for its water management system, is located in which state?",
    options: ["Gujarat", "Rajasthan", "Haryana", "Punjab"],
    correctOption: 0,
    explanation: "Dholavira is located in Rann of Kutch, Gujarat. It is a UNESCO World Heritage Site.",
    difficulty: "easy", tags: ["history", "ancient india"],
  },
  {
    id: "cgl1-gk-q13", sectionId: S_GK, questionNo: 13,
    questionText: "Which fundamental property of light is responsible for the twinkling of stars?",
    options: ["Atmospheric Refraction", "Total Internal Reflection", "Diffraction", "Dispersion"],
    correctOption: 0,
    explanation: "Twinkling of stars is due to atmospheric refraction of starlight passing through layers of varying air density.",
    difficulty: "easy", tags: ["physics", "science"],
  },
  {
    id: "cgl1-gk-q14", sectionId: S_GK, questionNo: 14,
    questionText: "Who won the Nobel Prize in Literature 2024?",
    options: ["Han Kang", "Jon Fosse", "Annie Ernaux", "Abdulrazak Gurnah"],
    correctOption: 0,
    explanation: "South Korean author Han Kang was awarded the 2024 Nobel Prize in Literature for her intense poetic prose.",
    difficulty: "medium", tags: ["current affairs"],
  },
  {
    id: "cgl1-gk-q15", sectionId: S_GK, questionNo: 15,
    questionText: "Which gas is released during photosynthesis by green plants?",
    options: ["Oxygen", "Carbon Dioxide", "Nitrogen", "Methane"],
    correctOption: 0,
    explanation: "During photosynthesis, plants take in CO₂ and water in sunlight to produce glucose and release Oxygen.",
    difficulty: "easy", tags: ["biology"],
  },
];

const quantQuestions: PaperSection["questions"] = [
  {
    id: "cgl1-q16", sectionId: S_QUANT, questionNo: 16,
    questionText: "A train 300 metres long crosses a pole in 15 seconds. What is its speed in km/h?",
    options: ["72 km/h", "60 km/h", "80 km/h", "54 km/h"],
    correctOption: 0,
    explanation: "Speed in m/s = 300/15 = 20 m/s. Speed in km/h = 20 × (18/5) = 72 km/h.",
    difficulty: "easy", tags: ["speed distance time"],
  },
  {
    id: "cgl1-q17", sectionId: S_QUANT, questionNo: 17,
    questionText: "If x + 1/x = 5, find the value of x² + 1/x².",
    options: ["23", "25", "27", "21"],
    correctOption: 0,
    explanation: "(x + 1/x)² = x² + 1/x² + 2 → 5² = x² + 1/x² + 2 → x² + 1/x² = 25 − 2 = 23.",
    difficulty: "easy", tags: ["algebra"],
  },
  {
    id: "cgl1-q18", sectionId: S_QUANT, questionNo: 18,
    questionText: "A shopkeeper marks an item 40% above cost price and offers 20% discount. Profit percentage is:",
    options: ["12%", "15%", "20%", "10%"],
    correctOption: 0,
    explanation: "CP = 100. MP = 140. SP = 140 × 0.80 = 112. Profit % = 112 − 100 = 12%.",
    difficulty: "easy", tags: ["profit loss"],
  },
  {
    id: "cgl1-q19", sectionId: S_QUANT, questionNo: 19,
    questionText: "In a circle of radius 10 cm, find the length of a chord which is at a distance of 6 cm from the centre.",
    options: ["16 cm", "12 cm", "8 cm", "14 cm"],
    correctOption: 0,
    explanation: "Half chord = √(10² − 6²) = √(100 − 36) = √64 = 8 cm. Total chord length = 8 × 2 = 16 cm.",
    difficulty: "medium", tags: ["geometry", "circle"],
  },
  {
    id: "cgl1-q20", sectionId: S_QUANT, questionNo: 20,
    questionText: "If sin θ = 4/5 and θ is acute, find tan θ.",
    options: ["4/3", "3/4", "5/3", "3/5"],
    correctOption: 0,
    explanation: "Opposite = 4, Hypotenuse = 5 → Adjacent = √(25 − 16) = 3. tan θ = 4/3.",
    difficulty: "easy", tags: ["trigonometry"],
  },
];

const englishQuestions: PaperSection["questions"] = [
  {
    id: "cgl1-eng-q21", sectionId: S_ENG, questionNo: 21,
    questionText: "Select the correct Synonym of the given word:\nEPHEMERAL",
    options: ["Transient / Short-lived", "Permanent", "Eternal", "Substantial"],
    correctOption: 0,
    explanation: "Ephemeral means lasting for a very short time — synonym: Transient.",
    difficulty: "medium", tags: ["vocabulary"],
  },
  {
    id: "cgl1-eng-q22", sectionId: S_ENG, questionNo: 22,
    questionText: "Select the correct Antonym of the given word:\nCANDID",
    options: ["Deceitful / Secretive", "Frank", "Honest", "Direct"],
    correctOption: 0,
    explanation: "Candid means truthful and straightforward; its antonym is Deceitful or Secretive.",
    difficulty: "easy", tags: ["vocabulary"],
  },
  {
    id: "cgl1-eng-q23", sectionId: S_ENG, questionNo: 23,
    questionText: "Choose the correct meaning of idiom: 'To spill the beans'",
    options: ["To reveal a secret prematurely", "To waste food", "To cook meals", "To perform a trick"],
    correctOption: 0,
    explanation: "'Spill the beans' means to disclose confidential information.",
    difficulty: "easy", tags: ["idioms"],
  },
  {
    id: "cgl1-eng-q24", sectionId: S_ENG, questionNo: 24,
    questionText: "Select the correctly spelt word:",
    options: ["Bureaucracy", "Beureaucracy", "Bureaucracyy", "Burocracy"],
    correctOption: 0,
    explanation: "Correct spelling: Bureaucracy (B-U-R-E-A-U-C-R-A-C-Y).",
    difficulty: "medium", tags: ["spelling"],
  },
  {
    id: "cgl1-eng-q25", sectionId: S_ENG, questionNo: 25,
    questionText: "Change to Passive Voice: 'The committee is reviewing the project proposal.'",
    options: [
      "The project proposal is being reviewed by the committee.",
      "The project proposal was reviewed by the committee.",
      "The project proposal has been reviewed by the committee.",
      "The project proposal will be reviewed by the committee.",
    ],
    correctOption: 0,
    explanation: "Present continuous active (is reviewing) → passive (is being reviewed).",
    difficulty: "easy", tags: ["active passive"],
  },
];

export const SSC_CGL_2024_SET1: MockPaper = {
  id: "ssc-cgl-tier1-2024-s1",
  examId: "ssc-cgl",
  title: "SSC CGL Tier-I — 2024 Official Paper Set 1",
  date: "2024",
  shift: "Shift 1",
  type: "official",
  totalQuestions: 25,
  totalMarks: 50,
  duration: 30,
  difficulty: "medium",
  attemptCount: 22400,
  avgScore: 32,
  sections: [
    { id: S_REASON, name: "General Intelligence & Reasoning", shortName: "Reasoning", color: "#7c3aed", questionCount: 10, marks: 20, questions: reasoningQuestions },
    { id: S_GK, name: "General Awareness", shortName: "GK", color: "#0891b2", questionCount: 5, marks: 10, questions: gkQuestions },
    { id: S_QUANT, name: "Quantitative Aptitude", shortName: "Maths", color: "#059669", questionCount: 5, marks: 10, questions: quantQuestions },
    { id: S_ENG, name: "English Comprehension", shortName: "English", color: "#dc2626", questionCount: 5, marks: 10, questions: englishQuestions },
  ],
};

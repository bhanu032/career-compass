// ── Mock Test Types ─────────────────────────────────────────────────────────

export type ExamCategory =
  | "ssc"
  | "upsc"
  | "banking"
  | "railways"
  | "state_psc"
  | "defence"
  | "teaching";

export interface ExamGroup {
  id: ExamCategory;
  name: string;
  shortName: string;
  description: string;
  icon: string; // emoji
  color: string; // tailwind bg class
  accentHex: string;
  totalPapers: number;
  exams: MockExam[];
}

export interface MockExam {
  id: string;
  examGroupId: ExamCategory;
  name: string;           // e.g. "SSC CGL"
  tier: string;           // e.g. "Tier-I"
  description: string;
  totalPapers: number;
  papers: MockPaper[];
}

export interface MockPaper {
  id: string;
  examId: string;
  title: string;           // e.g. "SSC CGL Tier-I — 12 Sept 2025 Shift 2"
  date: string;            // e.g. "12 Sept, 2025"
  shift: string;           // e.g. "Shift 2"
  type: "similar" | "official" | "practice";
  totalQuestions: number;
  totalMarks: number;
  duration: number;        // in minutes
  sections: PaperSection[];
  difficulty: "easy" | "medium" | "hard";
  attemptCount?: number;   // how many users attempted
  avgScore?: number;
}

export interface PaperSection {
  id: string;
  name: string;            // e.g. "General Intelligence & Reasoning"
  shortName: string;       // e.g. "Reasoning"
  color: string;           // hex
  questionCount: number;
  marks: number;
  questions: MockQuestion[];
}

export interface MockQuestion {
  id: string;
  sectionId: string;
  questionNo: number;
  questionText: string;
  options: string[];        // 4 options
  correctOption: number;    // 0-indexed
  explanation?: string;
  difficulty?: "easy" | "medium" | "hard";
  tags?: string[];
}

// ── Attempt / Session types ──────────────────────────────────────────────────

export type AnswerState = "answered" | "marked" | "skipped" | "not_visited";

export interface QuestionAttempt {
  questionId: string;
  selectedOption: number | null;   // 0-indexed, null = skipped
  state: AnswerState;
  timeSpentSeconds: number;
  markedForReview: boolean;
}

export interface TestAttempt {
  id: string;
  paperId: string;
  startedAt: number;       // Date.now()
  submittedAt?: number;
  answers: Record<string, QuestionAttempt>;  // questionId → attempt
  currentSectionId: string;
  currentQuestionId: string;
  totalTimeSpentSeconds: number;
  status: "in_progress" | "submitted";
}

// ── Result types ─────────────────────────────────────────────────────────────

export interface SectionResult {
  sectionId: string;
  sectionName: string;
  correct: number;
  incorrect: number;
  skipped: number;
  marks: number;
  maxMarks: number;
  accuracy: number;        // %
  timeSpentSeconds: number;
}

export interface TestResult {
  attemptId: string;
  paperId: string;
  paperTitle: string;
  totalQuestions: number;
  attempted: number;
  correct: number;
  incorrect: number;
  skipped: number;
  totalMarks: number;
  maxMarks: number;
  percentage: number;
  timeTakenSeconds: number;
  sectionResults: SectionResult[];
  submittedAt: number;
  rank?: number;            // out of total attempts
}

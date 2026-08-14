/**
 * Mock Test Result Page — detailed score analysis after submission
 */
import { ArrowLeft, CheckCircle2, ChevronDown, ChevronUp, Clock, Target, TrendingUp, XCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { classNames } from "@/utils/format";
import { getPaperById } from "@/data/mockTests";
import type { MockPaper, TestAttempt, TestResult, SectionResult } from "@/types/mockTest";

// ── Score computation ─────────────────────────────────────────────────────────
function computeResult(attempt: TestAttempt, paper: MockPaper): TestResult {
  const MARKS_PER_Q = paper.totalMarks / paper.totalQuestions;
  const NEGATIVE    = MARKS_PER_Q * 0.5;

  let correct = 0, incorrect = 0, skipped = 0, totalMarks = 0;
  const sectionResults: SectionResult[] = [];

  for (const sec of paper.sections) {
    let sCorrect = 0, sIncorrect = 0, sSkipped = 0, sMarks = 0, sTime = 0;
    for (const q of sec.questions) {
      const qa = attempt.answers[q.id];
      sTime += qa?.timeSpentSeconds ?? 0;
      if (!qa || qa.selectedOption === null) { sSkipped++; skipped++; }
      else if (qa.selectedOption === q.correctOption) { sCorrect++; correct++; sMarks += MARKS_PER_Q; totalMarks += MARKS_PER_Q; }
      else { sIncorrect++; incorrect++; sMarks -= NEGATIVE; totalMarks -= NEGATIVE; }
    }
    sectionResults.push({
      sectionId: sec.id,
      sectionName: sec.name,
      correct: sCorrect,
      incorrect: sIncorrect,
      skipped: sSkipped,
      marks: Math.max(0, sMarks),
      maxMarks: sec.marks,
      accuracy: sec.questions.length > 0 ? Math.round((sCorrect / sec.questions.length) * 100) : 0,
      timeSpentSeconds: sTime,
    });
  }

  const attempted = correct + incorrect;
  return {
    attemptId: attempt.id,
    paperId: paper.id,
    paperTitle: paper.title,
    totalQuestions: paper.totalQuestions,
    attempted,
    correct,
    incorrect,
    skipped,
    totalMarks: Math.max(0, totalMarks),
    maxMarks: paper.totalMarks,
    percentage: Math.round((Math.max(0, totalMarks) / paper.totalMarks) * 100),
    timeTakenSeconds: attempt.submittedAt ? Math.round((attempt.submittedAt - attempt.startedAt) / 1000) : 0,
    sectionResults,
    submittedAt: attempt.submittedAt ?? Date.now(),
  };
}

function fmt(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return m > 0 ? `${m}m ${s}s` : `${s}s`;
}

// ── Question Review accordion ─────────────────────────────────────────────────
function QuestionReview({ paper, attempt }: { paper: MockPaper; attempt: TestAttempt }) {
  const [open, setOpen] = useState<string | null>(null);
  return (
    <div className="space-y-2">
      {paper.sections.map(sec => (
        <div key={sec.id}>
          <button
            type="button"
            onClick={() => setOpen(open === sec.id ? null : sec.id)}
            className="flex w-full items-center justify-between rounded-xl border border-slate-200 bg-white p-4 text-left transition hover:bg-slate-50 dark:border-slate-800 dark:bg-[#0d0e1a] dark:hover:bg-slate-800/60"
          >
            <span className="font-semibold text-slate-900 dark:text-white" style={{ color: sec.color }}>
              {sec.name}
            </span>
            {open === sec.id ? <ChevronUp className="h-4 w-4 text-slate-400" /> : <ChevronDown className="h-4 w-4 text-slate-400" />}
          </button>

          {open === sec.id && (
            <div className="mt-1 space-y-3 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-[#0d0e1a]">
              {sec.questions.map(q => {
                const qa       = attempt.answers[q.id];
                const selected = qa?.selectedOption ?? null;
                const correct  = q.correctOption;
                const isRight  = selected === correct;
                const isWrong  = selected !== null && selected !== correct;
                const isSkipped = selected === null;
                return (
                  <div key={q.id} className={classNames(
                    "rounded-xl border p-4",
                    isRight   ? "border-emerald-200 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-950/20"
                    : isWrong ? "border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/20"
                    :           "border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800/40"
                  )}>
                    <div className="flex items-start gap-3">
                      <span className="mt-0.5 text-lg">
                        {isRight ? "✅" : isWrong ? "❌" : "⬜"}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="mb-3 text-sm font-medium text-slate-900 dark:text-white whitespace-pre-line">
                          <span className="text-slate-500 mr-1">Q{q.questionNo}.</span>
                          {q.questionText}
                        </p>
                        <div className="space-y-1.5">
                          {q.options.map((opt, i) => (
                            <div
                              key={i}
                              className={classNames(
                                "flex items-center gap-2 rounded-lg px-3 py-2 text-sm",
                                i === correct   ? "bg-emerald-100 text-emerald-800 font-semibold dark:bg-emerald-900/40 dark:text-emerald-300"
                                : i === selected && isWrong ? "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300"
                                : "text-slate-600 dark:text-slate-400"
                              )}
                            >
                              <span className="shrink-0 font-bold">{String.fromCharCode(65 + i)}.</span>
                              {opt}
                              {i === correct && <CheckCircle2 className="ml-auto h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />}
                              {i === selected && isWrong && <XCircle className="ml-auto h-4 w-4 text-red-600 dark:text-red-400 shrink-0" />}
                            </div>
                          ))}
                        </div>
                        {q.explanation && (
                          <div className="mt-3 rounded-lg bg-white/70 px-3 py-2 text-xs text-slate-600 dark:bg-slate-900/40 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                            <span className="font-semibold text-slate-700 dark:text-slate-300">Explanation: </span>
                            {q.explanation}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export function MockTestResultPage(): JSX.Element {
  const location = useLocation();
  const { attemptId } = useParams<{ attemptId: string }>();
  const navigate = useNavigate();

  const stateData = location.state as { attempt?: TestAttempt; paper?: MockPaper } | null;
  const [data, setData] = useState<{ attempt: TestAttempt; paper: MockPaper } | null>(null);

  useEffect(() => {
    if (stateData?.attempt && stateData?.paper) {
      setData({ attempt: stateData.attempt, paper: stateData.paper });
      return;
    }
    if (attemptId) {
      const raw = localStorage.getItem(`mock-attempt-${attemptId}`);
      if (raw) {
        const attempt = JSON.parse(raw) as TestAttempt;
        const paper   = getPaperById(attempt.paperId);
        if (paper) { setData({ attempt, paper }); return; }
      }
    }
    navigate("/mock-tests");
  }, [attemptId, stateData, navigate]);

  if (!data) {
    return <div className="flex h-screen items-center justify-center"><p className="text-slate-500">Loading results…</p></div>;
  }

  const result = computeResult(data.attempt, data.paper);

  const scoreColor = result.percentage >= 70 ? "text-emerald-600 dark:text-emerald-400"
    : result.percentage >= 50 ? "text-yellow-600 dark:text-yellow-400"
    : "text-red-600 dark:text-red-400";

  const passMsg = result.percentage >= 60 ? "Good Performance!" : result.percentage >= 40 ? "Keep Practicing!" : "Needs Improvement";

  return (
    <div className="container-page py-10">
      {/* Back */}
      <Link to="/mock-tests" className="mb-6 inline-flex items-center gap-1.5 text-sm text-violet-600 hover:text-violet-700 dark:text-violet-400">
        <ArrowLeft className="h-4 w-4" /> Back to Mock Tests
      </Link>

      {/* Score card */}
      <div className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-[#0d0e1a]">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">{data.paper.title}</p>
            <h1 className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">{passMsg}</h1>
          </div>
          {/* Score circle */}
          <div className="flex items-center gap-5">
            <div className="text-center">
              <p className={classNames("text-5xl font-black tabular-nums", scoreColor)}>
                {result.totalMarks.toFixed(1)}
              </p>
              <p className="text-sm text-slate-500">/{result.maxMarks} Marks</p>
            </div>
            <div className="text-center">
              <p className={classNames("text-5xl font-black tabular-nums", scoreColor)}>
                {result.percentage}%
              </p>
              <p className="text-sm text-slate-500">Score</p>
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-4 h-3 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
          <div
            className={classNames("h-full rounded-full transition-all",
              result.percentage >= 70 ? "bg-emerald-500" : result.percentage >= 50 ? "bg-yellow-500" : "bg-red-500"
            )}
            style={{ width: `${result.percentage}%` }}
          />
        </div>

        {/* Stats row */}
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: "Attempted", value: result.attempted, icon: Target, color: "text-blue-600 bg-blue-50 dark:bg-blue-900/20" },
            { label: "Correct", value: result.correct, icon: CheckCircle2, color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20" },
            { label: "Incorrect", value: result.incorrect, icon: XCircle, color: "text-red-600 bg-red-50 dark:bg-red-900/20" },
            { label: "Time Taken", value: fmt(result.timeTakenSeconds), icon: Clock, color: "text-violet-600 bg-violet-50 dark:bg-violet-900/20" },
          ].map(s => (
            <div key={s.label} className={classNames("rounded-xl p-4 text-center", s.color)}>
              <s.icon className={classNames("mx-auto h-5 w-5 mb-1")} />
              <p className="text-xl font-bold text-slate-900 dark:text-white">{s.value}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Section-wise breakdown */}
      <div className="mb-8">
        <h2 className="mb-4 text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-violet-600" /> Section-wise Analysis
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {result.sectionResults.map(sr => {
            const sec = data.paper.sections.find(s => s.id === sr.sectionId)!;
            return (
              <div key={sr.sectionId} className="card p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-bold text-sm" style={{ color: sec.color }}>{sr.sectionName}</span>
                  <span className="text-sm font-bold text-slate-900 dark:text-white">
                    {sr.marks.toFixed(1)}/{sr.maxMarks}
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden mb-3">
                  <div className="h-full rounded-full" style={{ width: `${sr.accuracy}%`, background: sec.color }} />
                </div>
                <div className="grid grid-cols-4 gap-2 text-center text-xs">
                  <div>
                    <p className="font-bold text-emerald-600">{sr.correct}</p>
                    <p className="text-slate-400">Correct</p>
                  </div>
                  <div>
                    <p className="font-bold text-red-600">{sr.incorrect}</p>
                    <p className="text-slate-400">Wrong</p>
                  </div>
                  <div>
                    <p className="font-bold text-slate-500">{sr.skipped}</p>
                    <p className="text-slate-400">Skipped</p>
                  </div>
                  <div>
                    <p className="font-bold" style={{ color: sec.color }}>{sr.accuracy}%</p>
                    <p className="text-slate-400">Accuracy</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Question review */}
      <div>
        <h2 className="mb-4 text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5 text-violet-600" /> Detailed Question Review
        </h2>
        <QuestionReview paper={data.paper} attempt={data.attempt} />
      </div>

      {/* CTA */}
      <div className="mt-8 flex flex-wrap gap-3 justify-center">
        <Link to={`/mock-tests/attempt/${data.paper.id}`} className="btn-primary px-6">
          Reattempt Test
        </Link>
        <Link to="/mock-tests/ssc" className="btn-secondary px-6">
          More SSC Mocks
        </Link>
        <Link to="/mock-tests" className="btn-secondary px-6">
          All Exam Categories
        </Link>
      </div>
    </div>
  );
}

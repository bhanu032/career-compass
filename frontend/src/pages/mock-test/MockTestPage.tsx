/**
 * Mock Test Page — full-length test engine
 * Features: timer, section navigation, question palette, mark for review, auto-submit
 */
import { AlertTriangle, BookmarkCheck, ChevronLeft, ChevronRight, Clock, Flag, Send } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { classNames } from "@/utils/format";
import { getPaperById } from "@/data/mockTests";
import type { MockPaper, MockQuestion, PaperSection, QuestionAttempt, TestAttempt } from "@/types/mockTest";

// ── State colours ────────────────────────────────────────────────────────────
function qBtnClass(state: QuestionAttempt["state"] | "current", hasAnswer: boolean): string {
  if (state === "current")  return "ring-2 ring-violet-500 bg-violet-600 text-white";
  if (hasAnswer && state === "marked") return "bg-purple-600 text-white";
  if (state === "answered") return "bg-emerald-500 text-white";
  if (state === "marked")   return "bg-yellow-400 text-slate-900";
  if (state === "skipped")  return "bg-red-400 text-white";
  return "bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-200";
}

// ── Timer ────────────────────────────────────────────────────────────────────
function useTimer(totalSeconds: number, onExpire: () => void) {
  const [remaining, setRemaining] = useState(totalSeconds);
  const expiredRef = useRef(false);

  useEffect(() => {
    const id = setInterval(() => {
      setRemaining(prev => {
        if (prev <= 1 && !expiredRef.current) {
          expiredRef.current = true;
          clearInterval(id);
          onExpire();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [onExpire]);

  const m = Math.floor(remaining / 60);
  const s = remaining % 60;
  return { remaining, display: `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`, isLow: remaining < 300 };
}

// ── Attempt helpers ──────────────────────────────────────────────────────────
function initAttempt(paper: MockPaper): TestAttempt {
  const allQ: Record<string, QuestionAttempt> = {};
  for (const sec of paper.sections) {
    for (const q of sec.questions) {
      allQ[q.id] = { questionId: q.id, selectedOption: null, state: "not_visited", timeSpentSeconds: 0, markedForReview: false };
    }
  }
  const firstSec = paper.sections[0];
  const firstQ   = firstSec.questions[0];
  return {
    id: `attempt-${Date.now()}`,
    paperId: paper.id,
    startedAt: Date.now(),
    answers: allQ,
    currentSectionId: firstSec.id,
    currentQuestionId: firstQ.id,
    totalTimeSpentSeconds: 0,
    status: "in_progress",
  };
}

export function MockTestPage(): JSX.Element {
  const { paperId } = useParams<{ paperId: string }>();
  const navigate = useNavigate();
  const paper = paperId ? getPaperById(paperId) : undefined;

  const [attempt, setAttempt]           = useState<TestAttempt | null>(null);
  const [showConfirm, setShowConfirm]   = useState(false);
  const [showPalette, setShowPalette]   = useState(false);
  const startQTimeRef = useRef<number>(Date.now());

  // Initialise
  useEffect(() => {
    if (!paper) return;
    setAttempt(initAttempt(paper));
  }, [paper]);

  const handleExpire = useCallback(() => {
    setShowConfirm(true);
  }, []);

  const totalSeconds = (paper?.duration ?? 60) * 60;
  const { display: timerDisplay, isLow } = useTimer(
    paper ? totalSeconds : 60,
    handleExpire
  );

  if (!paper || !attempt) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-slate-500">Paper not found.</p>
      </div>
    );
  }

  const currentSection = paper.sections.find(s => s.id === attempt.currentSectionId)!;
  const currentQuestion = currentSection.questions.find(q => q.id === attempt.currentQuestionId)!;
  const currentAttempt  = attempt.answers[currentQuestion.id];

  // Counts for palette legend
  const counts = Object.values(attempt.answers).reduce(
    (acc, a) => {
      if (a.state === "answered") acc.answered++;
      else if (a.state === "marked") acc.marked++;
      else if (a.state === "skipped") acc.skipped++;
      else acc.notVisited++;
      return acc;
    },
    { answered: 0, marked: 0, skipped: 0, notVisited: 0 }
  );

  function navigateTo(sectionId: string, questionId: string) {
    const elapsed = Math.round((Date.now() - startQTimeRef.current) / 1000);
    startQTimeRef.current = Date.now();

    setAttempt(prev => {
      if (!prev) return prev;
      const cur = prev.answers[prev.currentQuestionId];
      const updated = {
        ...cur,
        timeSpentSeconds: cur.timeSpentSeconds + elapsed,
        state: cur.state === "not_visited" ? "skipped" : cur.state,
      } as QuestionAttempt;
      const newSection = paper!.sections.find(s => s.id === sectionId)!;
      const newQ = newSection.questions.find(q => q.id === questionId)!;
      const newQAttempt = prev.answers[newQ.id];
      return {
        ...prev,
        currentSectionId: sectionId,
        currentQuestionId: questionId,
        answers: {
          ...prev.answers,
          [prev.currentQuestionId]: updated,
          [questionId]: newQAttempt.state === "not_visited"
            ? { ...newQAttempt, state: "skipped" as const }
            : newQAttempt,
        },
      };
    });
    setShowPalette(false);
  }

  function selectOption(optIdx: number) {
    setAttempt(prev => {
      if (!prev) return prev;
      const cur = prev.answers[currentQuestion.id];
      return {
        ...prev,
        answers: {
          ...prev.answers,
          [currentQuestion.id]: {
            ...cur,
            selectedOption: optIdx,
            state: cur.markedForReview ? "marked" : "answered",
          },
        },
      };
    });
  }

  function clearResponse() {
    setAttempt(prev => {
      if (!prev) return prev;
      const cur = prev.answers[currentQuestion.id];
      return {
        ...prev,
        answers: {
          ...prev.answers,
          [currentQuestion.id]: { ...cur, selectedOption: null, state: "skipped" },
        },
      };
    });
  }

  function toggleMark() {
    setAttempt(prev => {
      if (!prev) return prev;
      const cur = prev.answers[currentQuestion.id];
      const newMark = !cur.markedForReview;
      const newState = newMark
        ? "marked"
        : cur.selectedOption !== null ? "answered" : "skipped";
      return {
        ...prev,
        answers: {
          ...prev.answers,
          [currentQuestion.id]: { ...cur, markedForReview: newMark, state: newState },
        },
      };
    });
  }

  function goNext() {
    const qIdx = currentSection.questions.findIndex(q => q.id === currentQuestion.id);
    if (qIdx < currentSection.questions.length - 1) {
      navigateTo(currentSection.id, currentSection.questions[qIdx + 1].id);
    } else {
      const sIdx = paper!.sections.findIndex(s => s.id === currentSection.id);
      if (sIdx < paper!.sections.length - 1) {
        const nextSec = paper!.sections[sIdx + 1];
        navigateTo(nextSec.id, nextSec.questions[0].id);
      }
    }
  }

  function goPrev() {
    const qIdx = currentSection.questions.findIndex(q => q.id === currentQuestion.id);
    if (qIdx > 0) {
      navigateTo(currentSection.id, currentSection.questions[qIdx - 1].id);
    } else {
      const sIdx = paper!.sections.findIndex(s => s.id === currentSection.id);
      if (sIdx > 0) {
        const prevSec = paper!.sections[sIdx - 1];
        navigateTo(prevSec.id, prevSec.questions[prevSec.questions.length - 1].id);
      }
    }
  }

  function submitTest() {
    const finalAttempt: TestAttempt = {
      id: attempt!.id,
      paperId: attempt!.paperId,
      startedAt: attempt!.startedAt,
      answers: attempt!.answers,
      currentSectionId: attempt!.currentSectionId,
      currentQuestionId: attempt!.currentQuestionId,
      totalTimeSpentSeconds: attempt!.totalTimeSpentSeconds,
      status: "submitted",
      submittedAt: Date.now(),
    };
    localStorage.setItem(`mock-attempt-${finalAttempt.id}`, JSON.stringify(finalAttempt));
    navigate(`/mock-tests/result/${finalAttempt.id}`, { state: { attempt: finalAttempt, paper } });
  }

  const qIdx = currentSection.questions.findIndex(q => q.id === currentQuestion.id);
  const totalQIdx = paper.sections
    .slice(0, paper.sections.findIndex(s => s.id === currentSection.id))
    .reduce((a, s) => a + s.questions.length, 0) + qIdx + 1;

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-slate-50 dark:bg-[#020308]">
      {/* ── Top bar ─────────────────────────────────────────────── */}
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-4 shadow-sm dark:border-slate-800 dark:bg-[#0a0b15]">
        <div className="flex items-center gap-3 min-w-0">
          <span className="hidden text-sm font-semibold text-slate-900 dark:text-white sm:block truncate max-w-xs">
            {paper.title}
          </span>
        </div>

        {/* Section tabs */}
        <div className="hidden items-center gap-1 md:flex">
          {paper.sections.map(sec => (
            <button
              key={sec.id}
              type="button"
              onClick={() => navigateTo(sec.id, sec.questions[0].id)}
              className={classNames(
                "rounded-lg px-3 py-1.5 text-xs font-semibold transition",
                sec.id === currentSection.id
                  ? "text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300"
              )}
              style={sec.id === currentSection.id ? { background: sec.color } : {}}
            >
              {sec.shortName}
            </button>
          ))}
        </div>

        {/* Timer + submit */}
        <div className="flex items-center gap-3">
          <div className={classNames(
            "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-bold tabular-nums",
            isLow
              ? "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400 animate-pulse"
              : "bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-white"
          )}>
            <Clock className="h-4 w-4" />
            {timerDisplay}
          </div>
          <button
            type="button"
            onClick={() => setShowConfirm(true)}
            className="btn-primary flex items-center gap-1.5 py-2 text-xs sm:text-sm"
          >
            <Send className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Submit Test</span>
          </button>
          <button
            type="button"
            onClick={() => setShowPalette(v => !v)}
            className="btn-secondary py-2 px-3 text-xs md:hidden"
          >
            Palette
          </button>
        </div>
      </header>

      {/* ── Body ────────────────────────────────────────────────── */}
      <div className="flex flex-1 overflow-hidden">
        {/* Question area */}
        <main className="flex flex-1 flex-col overflow-y-auto">
          {/* Question header */}
          <div className="border-b border-slate-200 bg-white px-6 py-3 dark:border-slate-800 dark:bg-[#0d0e1a]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="rounded-lg px-3 py-1 text-xs font-bold text-white" style={{ background: currentSection.color }}>
                  {currentSection.shortName}
                </span>
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                  Q{totalQIdx} of {paper.totalQuestions}
                </span>
                {currentQuestion.difficulty && (
                  <span className={classNames(
                    "rounded-full px-2 py-0.5 text-[11px] font-medium",
                    currentQuestion.difficulty === "easy" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300"
                    : currentQuestion.difficulty === "hard" ? "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300"
                    : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300"
                  )}>
                    {currentQuestion.difficulty}
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={toggleMark}
                className={classNames(
                  "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition",
                  currentAttempt.markedForReview
                    ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300"
                )}
              >
                {currentAttempt.markedForReview ? <BookmarkCheck className="h-3.5 w-3.5" /> : <Flag className="h-3.5 w-3.5" />}
                {currentAttempt.markedForReview ? "Marked" : "Mark for Review"}
              </button>
            </div>
          </div>

          {/* Question text + options */}
          <div className="flex-1 px-6 py-6">
            <p className="mb-6 whitespace-pre-line text-base font-medium leading-relaxed text-slate-900 dark:text-white">
              {currentQuestion.questionText}
            </p>
            <div className="space-y-3">
              {currentQuestion.options.map((opt, i) => {
                const selected = currentAttempt.selectedOption === i;
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => selectOption(i)}
                    className={classNames(
                      "flex w-full items-start gap-3 rounded-xl border px-4 py-3 text-left text-sm transition-all",
                      selected
                        ? "border-violet-500 bg-violet-50 text-violet-900 dark:bg-violet-900/30 dark:border-violet-400 dark:text-violet-100"
                        : "border-slate-200 bg-white hover:border-violet-300 hover:bg-violet-50/50 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-200 dark:hover:border-violet-600"
                    )}
                  >
                    <span className={classNames(
                      "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-[11px] font-bold",
                      selected
                        ? "border-violet-500 bg-violet-600 text-white"
                        : "border-slate-300 text-slate-500 dark:border-slate-600 dark:text-slate-400"
                    )}>
                      {String.fromCharCode(65 + i)}
                    </span>
                    <span className="leading-relaxed">{opt}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Bottom nav */}
          <div className="flex items-center justify-between border-t border-slate-200 bg-white px-6 py-3 dark:border-slate-800 dark:bg-[#0d0e1a]">
            <button
              type="button"
              onClick={clearResponse}
              disabled={currentAttempt.selectedOption === null}
              className="btn-secondary text-sm py-2 disabled:opacity-40"
            >
              Clear Response
            </button>
            <div className="flex gap-2">
              <button type="button" onClick={goPrev} className="btn-secondary flex items-center gap-1 py-2 text-sm">
                <ChevronLeft className="h-4 w-4" /> Prev
              </button>
              <button type="button" onClick={goNext} className="btn-primary flex items-center gap-1 py-2 text-sm">
                Next <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </main>

        {/* ── Question Palette sidebar ─────────────────────────── */}
        <aside className={classNames(
          "flex w-72 shrink-0 flex-col border-l border-slate-200 bg-white dark:border-slate-800 dark:bg-[#0a0b15] overflow-y-auto",
          "hidden md:flex",
          showPalette ? "!flex fixed inset-y-14 right-0 z-30 shadow-2xl" : ""
        )}>
          {/* Legend */}
          <div className="border-b border-slate-200 p-4 dark:border-slate-800">
            <p className="mb-3 text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">Question Palette</p>
            <div className="grid grid-cols-2 gap-1.5 text-[11px]">
              {[
                { color: "bg-emerald-500", label: `Answered (${counts.answered})` },
                { color: "bg-yellow-400", label: `Marked (${counts.marked})` },
                { color: "bg-red-400",    label: `Skipped (${counts.skipped})` },
                { color: "bg-slate-200 dark:bg-slate-700", label: `Not Visited (${counts.notVisited})` },
              ].map(l => (
                <div key={l.label} className="flex items-center gap-1.5">
                  <span className={classNames("h-3 w-3 rounded-sm", l.color)} />
                  <span className="text-slate-600 dark:text-slate-400">{l.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Section-wise grid */}
          <div className="flex-1 overflow-y-auto p-4 space-y-5">
            {paper.sections.map(sec => (
              <div key={sec.id}>
                <p className="mb-2 text-xs font-bold" style={{ color: sec.color }}>{sec.shortName}</p>
                <div className="grid grid-cols-5 gap-1.5">
                  {sec.questions.map(q => {
                    const qa = attempt.answers[q.id];
                    const isCurrent = q.id === currentQuestion.id;
                    return (
                      <button
                        key={q.id}
                        type="button"
                        onClick={() => navigateTo(sec.id, q.id)}
                        className={classNames(
                          "flex h-8 w-full items-center justify-center rounded-md text-[11px] font-bold transition hover:scale-105",
                          qBtnClass(isCurrent ? "current" : qa.state, qa.selectedOption !== null)
                        )}
                      >
                        {q.questionNo}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Submit in palette */}
          <div className="border-t border-slate-200 p-4 dark:border-slate-800">
            <button type="button" onClick={() => setShowConfirm(true)} className="btn-primary w-full justify-center py-2.5">
              <Send className="h-4 w-4" /> Submit Test
            </button>
          </div>
        </aside>
      </div>

      {/* ── Submit confirmation modal ────────────────────────────── */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl dark:bg-[#0d0e1a] dark:border dark:border-slate-800">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="h-6 w-6 text-amber-500 shrink-0" />
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Submit Test?</h2>
            </div>
            <div className="mb-5 grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-xl bg-emerald-50 p-3 text-center dark:bg-emerald-900/20">
                <p className="text-2xl font-bold text-emerald-700 dark:text-emerald-400">{counts.answered}</p>
                <p className="text-xs text-emerald-600 dark:text-emerald-400">Answered</p>
              </div>
              <div className="rounded-xl bg-red-50 p-3 text-center dark:bg-red-900/20">
                <p className="text-2xl font-bold text-red-700 dark:text-red-400">{counts.notVisited + counts.skipped}</p>
                <p className="text-xs text-red-600 dark:text-red-400">Not Answered</p>
              </div>
              <div className="rounded-xl bg-yellow-50 p-3 text-center dark:bg-yellow-900/20">
                <p className="text-2xl font-bold text-yellow-700 dark:text-yellow-400">{counts.marked}</p>
                <p className="text-xs text-yellow-600 dark:text-yellow-400">Marked for Review</p>
              </div>
              <div className="rounded-xl bg-slate-50 p-3 text-center dark:bg-slate-800/60">
                <p className="text-2xl font-bold text-slate-700 dark:text-slate-300">{paper.totalQuestions}</p>
                <p className="text-xs text-slate-500">Total Questions</p>
              </div>
            </div>
            <p className="mb-5 text-sm text-slate-500 dark:text-slate-400">
              Once submitted, you cannot change your answers. Are you sure you want to submit?
            </p>
            <div className="flex gap-3">
              <button type="button" onClick={() => setShowConfirm(false)} className="btn-secondary flex-1 justify-center">
                Continue Test
              </button>
              <button type="button" onClick={submitTest} className="btn-primary flex-1 justify-center">
                Yes, Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

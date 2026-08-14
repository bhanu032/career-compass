/**
 * Mock Test List Page — shows papers for a given exam category
 */
import { ArrowLeft, BookOpen, ChevronRight, Clock, Star, Target, Users } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { classNames } from "@/utils/format";
import { EXAM_GROUPS } from "@/data/mockTests";
import type { MockPaper } from "@/types/mockTest";

const DIFFICULTY_COLOR: Record<string, string> = {
  easy:   "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
  medium: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300",
  hard:   "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
};

const TYPE_LABEL: Record<string, string> = {
  similar: "Similar-Based",
  official: "Official Paper",
  practice: "Practice Set",
};

function PaperCard({ paper, examId }: { paper: MockPaper; examId: string }) {
  const hasPaper = paper.sections.some(s => s.questions.length > 0);
  return (
    <div className="card flex flex-col gap-4 p-5">
      {/* Header row */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <span className={classNames("rounded-full px-2.5 py-0.5 text-[11px] font-semibold", DIFFICULTY_COLOR[paper.difficulty])}>
              {paper.difficulty.charAt(0).toUpperCase() + paper.difficulty.slice(1)}
            </span>
            <span className="rounded-full bg-violet-100 px-2.5 py-0.5 text-[11px] font-semibold text-violet-700 dark:bg-violet-900/40 dark:text-violet-300">
              {TYPE_LABEL[paper.type]}
            </span>
          </div>
          <h3 className="font-bold text-slate-900 dark:text-white text-sm">{paper.title}</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{paper.date} · {paper.shift}</p>
        </div>
        {paper.attemptCount && (
          <div className="shrink-0 text-right">
            <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
              <Users className="h-3 w-3" />
              {(paper.attemptCount / 1000).toFixed(1)}K attempted
            </div>
            {paper.avgScore && (
              <div className="flex items-center gap-1 text-xs text-yellow-600 dark:text-yellow-400 mt-0.5">
                <Star className="h-3 w-3 fill-current" />
                Avg: {paper.avgScore}/{paper.totalMarks}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Meta row */}
      <div className="flex flex-wrap gap-3 text-xs text-slate-600 dark:text-slate-300">
        <span className="flex items-center gap-1">
          <BookOpen className="h-3.5 w-3.5 text-violet-500" />
          {paper.totalQuestions} Questions
        </span>
        <span className="flex items-center gap-1">
          <Target className="h-3.5 w-3.5 text-emerald-500" />
          {paper.totalMarks} Marks
        </span>
        <span className="flex items-center gap-1">
          <Clock className="h-3.5 w-3.5 text-blue-500" />
          {paper.duration} Minutes
        </span>
      </div>

      {/* Sections */}
      <div className="flex flex-wrap gap-1.5">
        {paper.sections.map(sec => (
          <span
            key={sec.id}
            className="rounded-md px-2.5 py-1 text-[11px] font-medium text-white"
            style={{ background: sec.color }}
          >
            {sec.shortName} ({sec.questionCount})
          </span>
        ))}
      </div>

      {/* CTA */}
      <div className="flex gap-2 pt-1">
        {hasPaper ? (
          <Link
            to={`/mock-tests/attempt/${paper.id}`}
            className="btn-primary flex-1 justify-center text-sm py-2"
          >
            Start Test <ChevronRight className="h-4 w-4" />
          </Link>
        ) : (
          <button disabled className="btn-secondary flex-1 justify-center text-sm py-2 opacity-50 cursor-not-allowed">
            Coming Soon
          </button>
        )}
      </div>
    </div>
  );
}

export function MockTestListPage(): JSX.Element {
  const { groupId } = useParams<{ groupId: string }>();
  const group = EXAM_GROUPS.find(g => g.id === groupId);

  useDocumentTitle(group ? `${group.shortName} Mock Tests — DeshKiSeva` : "Mock Tests");

  if (!group) {
    return (
      <div className="container-page py-24 text-center">
        <p className="text-slate-500">Exam group not found.</p>
        <Link to="/mock-tests" className="btn-primary mt-4">Back to Mock Tests</Link>
      </div>
    );
  }

  const allPapers = group.exams.flatMap(e => e.papers.map(p => ({ paper: p, examId: e.id, examName: e.name, tier: e.tier })));

  return (
    <div>
      {/* Header */}
      <div className="border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-[#0a0b15]">
        <div className="container-page py-8">
          <Link to="/mock-tests" className="mb-4 inline-flex items-center gap-1.5 text-sm text-violet-600 hover:text-violet-700 dark:text-violet-400">
            <ArrowLeft className="h-4 w-4" /> All Exam Categories
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-4xl">{group.icon}</span>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{group.name}</h1>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{group.description}</p>
            </div>
          </div>
          {/* Exam tabs */}
          <div className="mt-6 flex flex-wrap gap-2">
            {group.exams.map(exam => (
              <div
                key={exam.id}
                className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 dark:border-slate-700 dark:bg-slate-800/60"
              >
                <span className="text-sm font-semibold text-slate-900 dark:text-white">{exam.name}</span>
                <span className="ml-2 text-xs text-slate-500">— {exam.tier}</span>
                <span className="ml-2 rounded-full bg-violet-100 px-2 py-0.5 text-[11px] font-medium text-violet-700 dark:bg-violet-900/40 dark:text-violet-300">
                  {exam.papers.length} papers
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="container-page py-10">
        {allPapers.length === 0 ? (
          <div className="py-24 text-center">
            <BookOpen className="mx-auto h-12 w-12 text-slate-300 dark:text-slate-600" />
            <p className="mt-4 text-slate-500">No papers available yet. Check back soon!</p>
          </div>
        ) : (
          <>
            <p className="mb-6 text-sm text-slate-500 dark:text-slate-400">
              {allPapers.length} paper{allPapers.length !== 1 ? "s" : ""} available
            </p>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {allPapers.map(({ paper, examId }) => (
                <PaperCard key={paper.id} paper={paper} examId={examId} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

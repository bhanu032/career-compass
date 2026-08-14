import {
  AlertCircle,
  Bot,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Cpu,
  Loader2,
  RefreshCw,
  Sparkles,
  TrendingUp,
  X,
  Zap,
} from "lucide-react";
import { useState } from "react";
import type { ResumeData } from "@/types/resume";
import type { SuggestedChange } from "@/services/resumeService";
import { resumeService } from "@/services/resumeService";
import { scoreResume } from "@/utils/ats";
import { generateFrontendSuggestions } from "@/utils/atsOptimizer";
import { classNames } from "@/utils/format";
import { useTheme } from "@/hooks/useTheme";
import { nanoid } from "@/utils/nanoid";

interface Props {
  data: ResumeData;
  onApply: (updated: ResumeData) => void;
}

function ScoreMeter({ score, label, color }: { score: number; label: string; color: string }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative flex h-24 w-24 items-center justify-center">
        <svg className="absolute inset-0 h-full w-full -rotate-90" viewBox="0 0 36 36">
          <circle cx="18" cy="18" r="15.9" fill="none" stroke={isDark ? "#1e293b" : "#e2e8f0"} strokeWidth="3" />
          <circle
            cx="18" cy="18" r="15.9" fill="none" stroke={color} strokeWidth="3"
            strokeDasharray={`${score} ${100 - score}`} strokeLinecap="round"
            style={{ transition: "stroke-dasharray 0.6s ease" }}
          />
        </svg>
        <span className="text-2xl font-bold" style={{ color }}>{score}</span>
      </div>
      <span className={classNames("text-xs font-semibold", isDark ? "text-slate-400" : "text-slate-500")}>
        {label}
      </span>
    </div>
  );
}

function gradeColor(score: number): string {
  if (score >= 80) return "#10b981";
  if (score >= 65) return "#3b82f6";
  if (score >= 50) return "#f59e0b";
  if (score >= 35) return "#f97316";
  return "#ef4444";
}

function gradeLabel(score: number): string {
  if (score >= 80) return "Excellent";
  if (score >= 65) return "Good";
  if (score >= 50) return "Average";
  if (score >= 35) return "Weak";
  return "Poor";
}

function sectionIcon(field: string) {
  if (field === "summary") return "📝";
  if (field === "jobTitle") return "🏷️";
  if (field === "skill_add") return "🛠️";
  if (field.startsWith("exp_")) return "💼";
  if (field === "project_add") return "🚀";
  if (field === "cert_add") return "🏆";
  return "✏️";
}

function sectionLabel(field: string): string {
  if (field === "summary") return "Professional Summary";
  if (field === "jobTitle") return "Job Title";
  if (field === "skill_add") return "Add New Skill";
  if (field === "project_add") return "Add New Project";
  if (field === "cert_add") return "Add Certification";
  if (field.startsWith("exp_")) {
    const idx = parseInt(field.split("_")[1], 10) + 1;
    return `Experience #${idx} Description`;
  }
  return field;
}

/** Parse the display text for project_add / cert_add suggested values */
function parseStructuredSuggested(change: SuggestedChange): string {
  if (change.field === "project_add" || change.field === "cert_add") {
    try {
      const obj = JSON.parse(change.suggested) as Record<string, string>;
      if (change.field === "project_add") {
        return [
          obj.name && `Name: ${obj.name}`,
          obj.technologies && `Tech: ${obj.technologies}`,
          obj.description && `Description: ${obj.description}`,
        ].filter(Boolean).join("\n");
      }
      if (change.field === "cert_add") {
        return [
          obj.name && `Certificate: ${obj.name}`,
          obj.issuer && `Issuer: ${obj.issuer}`,
        ].filter(Boolean).join("\n");
      }
    } catch { /* fall through */ }
  }
  return change.suggested;
}

interface ChangeCardProps {
  change: SuggestedChange;
  accepted: boolean | null;
  onAccept: () => void;
  onReject: () => void;
}

function ChangeCard({ change, accepted, onAccept, onReject }: ChangeCardProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [expanded, setExpanded] = useState(false);

  const cardBg = accepted === true
    ? isDark ? "border-emerald-700/50 bg-emerald-900/20" : "border-emerald-300 bg-emerald-50"
    : accepted === false
    ? isDark ? "border-red-800/40 bg-red-900/10 opacity-60" : "border-red-200 bg-red-50 opacity-60"
    : isDark ? "border-slate-700 bg-slate-800/50" : "border-slate-200 bg-white";

  const displaySuggested = parseStructuredSuggested(change);
  const isStructured = change.field === "project_add" || change.field === "cert_add";

  return (
    <div className={classNames("rounded-xl border transition-all", cardBg)}>
      <div className="flex items-start gap-3 p-4">
        <span className="mt-0.5 text-lg shrink-0">{sectionIcon(change.field)}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <p className={classNames("text-xs font-semibold uppercase tracking-wide", isDark ? "text-slate-400" : "text-slate-500")}>
              {sectionLabel(change.field)}
            </p>
            <button
              type="button"
              onClick={() => setExpanded((v) => !v)}
              className={classNames("flex items-center gap-1 text-xs", isDark ? "text-slate-500 hover:text-slate-300" : "text-slate-400 hover:text-slate-600")}
            >
              {expanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
            </button>
          </div>

          {/* Reason */}
          <p className={classNames("mt-1 text-sm font-medium", isDark ? "text-slate-200" : "text-slate-700")}>
            {change.reason}
          </p>

          {/* Diff — only show if expanded or it's short */}
          {(expanded || displaySuggested.length < 120) && (
            <div className="mt-3 space-y-2">
              {change.original && (
                <div>
                  <p className="text-[10px] font-semibold uppercase text-red-500 mb-1">Before</p>
                  <p className={classNames(
                    "rounded-lg p-2.5 text-xs leading-relaxed border",
                    isDark ? "bg-red-950/30 border-red-900/30 text-slate-300" : "bg-red-50 border-red-200 text-slate-600"
                  )}>
                    {change.original.slice(0, 300)}{change.original.length > 300 ? "…" : ""}
                  </p>
                </div>
              )}
              <div>
                <p className="text-[10px] font-semibold uppercase text-emerald-500 mb-1">
                  {change.field === "skill_add" ? "New Skill" : isStructured ? "New Entry" : "After"}
                </p>
                <p className={classNames(
                  "rounded-lg p-2.5 text-xs leading-relaxed border whitespace-pre-line",
                  isDark ? "bg-emerald-950/30 border-emerald-900/30 text-slate-200" : "bg-emerald-50 border-emerald-200 text-slate-700"
                )}>
                  {displaySuggested.slice(0, 500)}{displaySuggested.length > 500 ? "…" : ""}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Accept / Reject row */}
      {accepted === null && (
        <div className={classNames(
          "flex gap-2 border-t px-4 py-2.5",
          isDark ? "border-slate-700/50" : "border-slate-100"
        )}>
          <button
            type="button"
            onClick={onAccept}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700 transition"
          >
            <Check className="h-3.5 w-3.5" />
            Accept
          </button>
          <button
            type="button"
            onClick={onReject}
            className={classNames(
              "flex flex-1 items-center justify-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition",
              isDark ? "bg-slate-700 text-slate-300 hover:bg-slate-600" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            )}
          >
            <X className="h-3.5 w-3.5" />
            Reject
          </button>
        </div>
      )}

      {accepted === true && (
        <div className="flex items-center gap-2 border-t border-emerald-700/30 px-4 py-2 text-emerald-500 text-xs font-medium">
          <CheckCircle2 className="h-3.5 w-3.5" />
          Accepted — will apply when you click "Apply Changes"
        </div>
      )}
      {accepted === false && (
        <div className={classNames(
          "flex items-center gap-2 border-t px-4 py-2 text-xs font-medium",
          isDark ? "border-slate-700/30 text-slate-500" : "border-slate-200 text-slate-400"
        )}>
          <X className="h-3.5 w-3.5" />
          Rejected
        </div>
      )}
    </div>
  );
}

// ── Apply accepted changes to resume data ────────────────────────────────────

function applyChanges(data: ResumeData, changes: SuggestedChange[], accepted: Record<number, boolean>): ResumeData {
  let updated = {
    ...data,
    personal: { ...data.personal },
    skills: [...data.skills],
    experience: data.experience.map((e) => ({ ...e })),
    projects: [...data.projects],
    certificates: [...data.certificates],
  };

  changes.forEach((change, i) => {
    if (!accepted[i]) return;

    if (change.field === "summary") {
      updated.personal.summary = change.suggested;
    } else if (change.field === "jobTitle") {
      updated.personal.jobTitle = change.suggested;
    } else if (change.field === "skill_add") {
      const already = updated.skills.some((s) => s.name.toLowerCase() === change.suggested.toLowerCase());
      if (!already) {
        updated.skills = [...updated.skills, { id: nanoid(), name: change.suggested, level: "Intermediate" as const }];
      }
    } else if (change.field.startsWith("exp_")) {
      const idx = parseInt(change.field.split("_")[1], 10);
      if (updated.experience[idx]) {
        updated.experience[idx] = { ...updated.experience[idx], description: change.suggested };
      }
    } else if (change.field === "project_add") {
      try {
        const p = JSON.parse(change.suggested) as { name?: string; description?: string; technologies?: string; link?: string };
        const alreadyExists = updated.projects.some((proj) => proj.name.toLowerCase() === (p.name ?? "").toLowerCase());
        if (!alreadyExists) {
          updated.projects = [
            ...updated.projects,
            { id: nanoid(), name: p.name ?? "", description: p.description ?? "", technologies: p.technologies ?? "", link: p.link ?? "" },
          ];
        }
      } catch { /* ignore malformed */ }
    } else if (change.field === "cert_add") {
      try {
        const c = JSON.parse(change.suggested) as { name?: string; issuer?: string; date?: string };
        const alreadyExists = updated.certificates.some((cert) => cert.name.toLowerCase() === (c.name ?? "").toLowerCase());
        if (!alreadyExists) {
          updated.certificates = [
            ...updated.certificates,
            { id: nanoid(), name: c.name ?? "", issuer: c.issuer ?? "", date: c.date ?? "" },
          ];
        }
      } catch { /* ignore malformed */ }
    }
  });

  return updated;
}

// ── Main component ────────────────────────────────────────────────────────────

export function StepATS({ data, onApply }: Props): JSX.Element {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const isTricolor = theme === "tricolor";

  const [jd, setJd] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{
    changes: SuggestedChange[];
    scoreBefore: number;
    scoreAfter: number;
    aiPowered: boolean;
  } | null>(null);
  const [decisions, setDecisions] = useState<Record<number, boolean>>({});  // true=accept, false=reject
  const [applied, setApplied] = useState(false);
  const [showAllCategories, setShowAllCategories] = useState(false);

  // Local ATS score (frontend-only, no JD)
  const localAts = scoreResume(data, jd);

  async function runAnalysis() {
    if (!jd.trim()) { setError("Please paste a job description first."); return; }
    if (jd.trim().length < 20) { setError("Job description is too short. Paste at least 50 characters."); return; }
    setLoading(true);
    setError(null);
    setResult(null);
    setDecisions({});
    setApplied(false);

    // Try backend AI first; fall back to frontend optimizer if unavailable
    try {
      const res = await resumeService.optimize(data, jd);
      setResult({
        changes: res.changes,
        scoreBefore: res.ats_score_before,
        scoreAfter: res.ats_score_after,
        aiPowered: res.ai_powered,
      });
    } catch {
      // Backend unavailable — use powerful frontend optimizer
      try {
        const { changes, scoreBefore, scoreAfter } = generateFrontendSuggestions(data, jd);
        if (changes.length === 0) {
          setError("Your resume already looks well-optimised for this JD. Try a more detailed job description.");
        } else {
          setResult({ changes, scoreBefore, scoreAfter, aiPowered: false });
        }
      } catch (frontendErr) {
        setError(frontendErr instanceof Error ? frontendErr.message : "Analysis failed. Try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  function decide(i: number, accept: boolean) {
    setDecisions((prev) => ({ ...prev, [i]: accept }));
  }

  function acceptAll() {
    const all: Record<number, boolean> = {};
    result?.changes.forEach((_, i) => { all[i] = true; });
    setDecisions(all);
  }

  function handleApply() {
    if (!result) return;
    const updated = applyChanges(data, result.changes, decisions);
    onApply(updated);
    setApplied(true);
  }

  const acceptedCount = Object.values(decisions).filter(Boolean).length;
  const decidedCount = Object.keys(decisions).length;
  const pendingCount = result ? result.changes.length - decidedCount : 0;

  const borderColor = isDark ? "rgba(99,102,241,0.15)" : "#e2e8f0";

  return (
    <div>
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className={classNames("text-xl font-bold", isDark ? "text-white" : "text-slate-900")}>
            ATS Score & AI Optimizer
          </h2>
          <p className={classNames("mt-1 text-sm", isDark ? "text-slate-400" : "text-slate-500")}>
            Paste a job description to get your ATS match score and AI-powered suggestions
          </p>
        </div>
        {result?.aiPowered && (
          <div className={classNames(
            "flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold shrink-0",
            isDark ? "bg-violet-900/50 text-violet-300" : "bg-violet-100 text-violet-700"
          )}>
            <Bot className="h-3.5 w-3.5" />
            AI Powered
          </div>
        )}
        {result !== null && !result.aiPowered && (
          <div className={classNames(
            "flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold shrink-0",
            isDark ? "bg-emerald-900/50 text-emerald-300" : "bg-emerald-100 text-emerald-700"
          )}>
            <Cpu className="h-3.5 w-3.5" />
            Smart Optimizer
          </div>
        )}
      </div>

      {/* Current score (no JD needed) */}
      <div className={classNames(
        "mt-5 flex flex-wrap items-center gap-6 rounded-2xl p-5 border",
        isDark ? "bg-slate-800/40 border-slate-700/50" : "bg-slate-50 border-slate-200"
      )}>
        <ScoreMeter score={localAts.total} label="Current ATS" color={gradeColor(localAts.total)} />
        <div className="flex-1 min-w-0">
          <p className={classNames("text-lg font-bold", isDark ? "text-white" : "text-slate-800")}>
            Your resume scores <span style={{ color: gradeColor(localAts.total) }}>{localAts.total}/100</span>
            <span className={classNames("ml-2 text-sm font-medium", isDark ? "text-slate-400" : "text-slate-500")}>
              ({gradeLabel(localAts.total)})
            </span>
          </p>

          {/* Quick category pills */}
          <div className="mt-2 flex flex-wrap gap-2">
            {localAts.categories.slice(0, showAllCategories ? undefined : 4).map((cat) => (
              <div
                key={cat.key}
                className={classNames(
                  "flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium border",
                  cat.score >= 70
                    ? isDark ? "border-emerald-800/40 bg-emerald-900/20 text-emerald-400" : "border-emerald-200 bg-emerald-50 text-emerald-700"
                    : cat.score >= 40
                    ? isDark ? "border-amber-800/40 bg-amber-900/20 text-amber-400" : "border-amber-200 bg-amber-50 text-amber-700"
                    : isDark ? "border-red-800/40 bg-red-900/20 text-red-400" : "border-red-200 bg-red-50 text-red-600"
                )}
              >
                <span className="font-bold">{cat.score}</span>
                <span className="opacity-70">{cat.label}</span>
              </div>
            ))}
            <button
              type="button"
              onClick={() => setShowAllCategories((v) => !v)}
              className={classNames("text-xs underline", isDark ? "text-slate-500" : "text-slate-400")}
            >
              {showAllCategories ? "less" : `+${localAts.categories.length - 4} more`}
            </button>
          </div>

          {/* Top issues */}
          {localAts.categories.some((c) => c.issues.length > 0) && (
            <div className="mt-3 space-y-1">
              {localAts.categories.flatMap((c) => c.issues).slice(0, 3).map((issue, i) => (
                <p key={i} className={classNames("flex items-start gap-1.5 text-xs", isDark ? "text-slate-400" : "text-slate-500")}>
                  <AlertCircle className="h-3.5 w-3.5 shrink-0 mt-0.5 text-amber-500" />
                  {issue}
                </p>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* JD input */}
      <div className="mt-6">
        <label className="label">
          Paste Job Description *
        </label>
        <textarea
          value={jd}
          onChange={(e) => { setJd(e.target.value); setError(null); }}
          placeholder="Paste the full job description here — requirements, responsibilities, qualifications..."
          rows={6}
          className="input resize-none"
        />
        <div className="mt-1 flex items-center justify-between">
          <p className={classNames("text-xs", isDark ? "text-slate-500" : "text-slate-400")}>
            {jd.length} characters · Minimum 50 recommended
          </p>
          {jd.length > 50 && (
            <p className={classNames("text-xs font-medium text-emerald-500")}>
              ✓ JD ready
            </p>
          )}
        </div>

        {error && (
          <p className="mt-2 flex items-center gap-1.5 text-sm text-red-500">
            <AlertCircle className="h-4 w-4 shrink-0" />
            {error}
          </p>
        )}

        <button
          type="button"
          onClick={runAnalysis}
          disabled={loading || jd.trim().length < 20}
          className="btn-primary mt-4 flex w-full items-center justify-center gap-2 sm:w-auto"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Analysing with AI…
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" />
              Analyse & Get AI Suggestions
            </>
          )}
        </button>
      </div>

      {/* Results */}
      {result && (
        <div className="mt-8 space-y-6">
          {/* Score comparison */}
          <div className={classNames(
            "rounded-2xl border p-5",
            isDark ? "border-indigo-900/30 bg-indigo-950/20" : "border-violet-200 bg-violet-50"
          )}>
            <div className="flex flex-wrap items-center gap-6 sm:gap-10">
              <ScoreMeter score={result.scoreBefore} label="Before" color={gradeColor(result.scoreBefore)} />
              <div className="flex flex-col items-center">
                <TrendingUp className={classNames("h-8 w-8", isDark ? "text-indigo-400" : "text-violet-500")} />
                <span className="mt-1 text-xs font-semibold text-emerald-500">
                  +{result.scoreAfter - result.scoreBefore} pts
                </span>
              </div>
              <ScoreMeter score={result.scoreAfter} label="After (estimated)" color="#10b981" />
              <div className="flex-1">
                <p className={classNames("text-sm font-semibold", isDark ? "text-slate-200" : "text-slate-700")}>
                  {result.changes.length} improvement{result.changes.length !== 1 ? "s" : ""} found
                </p>
                <p className={classNames("mt-1 text-xs", isDark ? "text-slate-400" : "text-slate-500")}>
                  Review each suggestion below. Accept what fits your experience, reject what doesn't.
                </p>
                {result.aiPowered && (
                  <p className="mt-2 flex items-center gap-1 text-xs text-violet-500 font-medium">
                    <Zap className="h-3 w-3" />
                    Generated by ChatGPT — suggestions are tailored to this specific JD
                  </p>
                )}
                {!result.aiPowered && (
                  <p className="mt-2 flex items-center gap-1 text-xs text-emerald-600 font-medium">
                    <Zap className="h-3 w-3" />
                    Generated by Smart Optimizer — JD keywords, domain skills, projects & certifications added
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Bulk actions */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className={classNames("text-sm font-medium", isDark ? "text-slate-300" : "text-slate-600")}>
              {acceptedCount} accepted · {decidedCount - acceptedCount} rejected · {pendingCount} pending
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={acceptAll}
                className={classNames(
                  "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition",
                  isDark ? "bg-emerald-900/40 text-emerald-400 hover:bg-emerald-900/60" : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                )}
              >
                <CheckCircle2 className="h-3.5 w-3.5" />
                Accept All
              </button>
              <button
                type="button"
                onClick={() => { setResult(null); setDecisions({}); setApplied(false); }}
                className={classNames(
                  "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition",
                  isDark ? "bg-slate-700 text-slate-300 hover:bg-slate-600" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                )}
              >
                <RefreshCw className="h-3.5 w-3.5" />
                Re-analyse
              </button>
            </div>
          </div>

          {/* Change cards */}
          <div className="space-y-3">
            {result.changes.map((change, i) => (
              <ChangeCard
                key={i}
                change={change}
                accepted={decisions[i] ?? null}
                onAccept={() => decide(i, true)}
                onReject={() => decide(i, false)}
              />
            ))}
          </div>

          {/* Apply button */}
          {!applied ? (
            <div className={classNames(
              "flex flex-wrap items-center justify-between gap-4 rounded-xl border p-4",
              isDark ? "border-indigo-900/30 bg-slate-800/30" : "border-violet-200 bg-violet-50"
            )}>
              <div>
                <p className={classNames("text-sm font-semibold", isDark ? "text-slate-200" : "text-slate-700")}>
                  Apply {acceptedCount} accepted change{acceptedCount !== 1 ? "s" : ""} to your resume
                </p>
                <p className={classNames("mt-0.5 text-xs", isDark ? "text-slate-500" : "text-slate-400")}>
                  Your resume data will be updated. You can edit further in the previous steps.
                </p>
              </div>
              <button
                type="button"
                disabled={acceptedCount === 0}
                onClick={handleApply}
                className="btn-primary flex items-center gap-2 disabled:opacity-40"
              >
                <Sparkles className="h-4 w-4" />
                Apply {acceptedCount} Change{acceptedCount !== 1 ? "s" : ""}
              </button>
            </div>
          ) : (
            <div className={classNames(
              "flex items-center gap-3 rounded-xl border p-4",
              isDark ? "border-emerald-800/40 bg-emerald-900/20" : "border-emerald-200 bg-emerald-50"
            )}>
              <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-500" />
              <div>
                <p className="text-sm font-semibold text-emerald-600">Changes applied to your resume!</p>
                <p className={classNames("text-xs", isDark ? "text-slate-400" : "text-slate-500")}>
                  Go back to any step to review, or proceed to Preview & Download.
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

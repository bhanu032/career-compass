/**
 * ResumeEntryPage — Landing choice before the builder.
 * User picks: Build from scratch OR Upload existing resume.
 */
import { useRef, useState } from "react";
import { FileText, FilePlus, Loader2, AlertCircle, CheckCircle2, Upload, Sparkles } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import { classNames } from "@/utils/format";
import { extractTextFromFile, parseResumeText, resumeDataToText } from "@/utils/resumeParser";
import type { ResumeData } from "@/types/resume";

interface Props {
  onBuildNew: () => void;
  onUpload: (data: ResumeData) => void;
}

export function ResumeEntryPage({ onBuildNew, onUpload }: Props): JSX.Element {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const isTricolor = theme === "tricolor";

  const fileRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [parsed, setParsed] = useState<ResumeData | null>(null);
  const [parsedText, setParsedText] = useState("");
  const [fileName, setFileName] = useState("");

  const pageBg = isDark
    ? "bg-[#020308] text-slate-100"
    : isTricolor
    ? "bg-[#FFFDF5] text-gray-900"
    : "bg-slate-50 text-slate-900";

  const cardBg = isDark
    ? "bg-white/[0.03] border border-indigo-900/30"
    : isTricolor
    ? "bg-white border border-orange-100"
    : "bg-white border border-slate-200";

  async function handleFile(file: File) {
    const allowed = ["application/pdf", "text/plain"];
    const ext = file.name.split(".").pop()?.toLowerCase();
    if (!allowed.includes(file.type) && !["pdf","txt"].includes(ext ?? "")) {
      setError("Please upload a text-based PDF or TXT file.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("File too large. Maximum 5MB.");
      return;
    }

    setLoading(true);
    setError(null);
    setParsed(null);
    setParsedText("");
    setFileName(file.name);

    try {
      const text = await extractTextFromFile(file);
      if (!text || text.trim().length < 50) {
        setError("Could not extract text from this file. Try copy-pasting into the manual builder.");
        setLoading(false);
        return;
      }
      const data = parseResumeText(text);
      setParsed(data);
      setParsedText(resumeDataToText(data));
    } catch (err) {
      setParsed(null);
      setParsedText("");
      setError(err instanceof Error ? err.message : "Failed to parse resume.");
    } finally {
      setLoading(false);
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) void handleFile(file);
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) void handleFile(file);
  }

  const accentColor = isDark ? "#818cf8" : isTricolor ? "#FF9933" : "#7c3aed";

  return (
    <div className={classNames("min-h-screen", pageBg)}>
      {/* Hero */}
      <div className={classNames(
        "border-b py-12",
        isDark
          ? "border-indigo-900/30 bg-gradient-to-br from-indigo-950/60 to-violet-950/40"
          : isTricolor
          ? "border-orange-100 bg-gradient-to-br from-orange-50 to-green-50"
          : "border-slate-200 bg-gradient-to-br from-violet-50 via-white to-indigo-50"
      )}>
        <div className="container-page text-center">
          <div className={classNames(
            "mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl",
            isDark ? "bg-indigo-900/50" : isTricolor ? "bg-orange-100" : "bg-violet-100"
          )}>
            <FileText className={classNames("h-8 w-8", isDark ? "text-indigo-400" : isTricolor ? "text-orange-600" : "text-violet-600")} />
          </div>
          <h1 className={classNames(
            "text-3xl font-bold sm:text-4xl",
            isDark ? "text-white" : "text-slate-900"
          )}>
            Resume Builder
          </h1>
          <p className={classNames(
            "mt-3 text-base max-w-xl mx-auto",
            isDark ? "text-slate-400" : "text-slate-500"
          )}>
            Build a professional resume from scratch or upload your existing one to improve it with AI
          </p>
        </div>
      </div>

      {/* Choice cards */}
      <div className="container-page py-12">
        <div className="mx-auto max-w-3xl grid grid-cols-1 gap-6 sm:grid-cols-2">

          {/* Option 1 — Build from scratch */}
          <button
            type="button"
            onClick={onBuildNew}
            className={classNames(
              "group flex flex-col items-start gap-4 rounded-2xl border-2 p-8 text-left transition-all duration-200 hover:scale-[1.02] hover:shadow-xl",
              isDark
                ? "border-indigo-800/50 bg-white/[0.03] hover:border-indigo-500 hover:bg-indigo-950/30"
                : isTricolor
                ? "border-orange-200 bg-white hover:border-orange-400 hover:shadow-orange-100"
                : "border-slate-200 bg-white hover:border-violet-400 hover:shadow-violet-100"
            )}
          >
            <div className={classNames(
              "flex h-14 w-14 items-center justify-center rounded-xl transition-colors",
              isDark ? "bg-indigo-900/50 group-hover:bg-indigo-800/60" : isTricolor ? "bg-orange-50 group-hover:bg-orange-100" : "bg-violet-50 group-hover:bg-violet-100"
            )}>
              <FilePlus className={classNames("h-7 w-7", isDark ? "text-indigo-400" : isTricolor ? "text-orange-600" : "text-violet-600")} />
            </div>
            <div>
              <p className={classNames("text-lg font-bold", isDark ? "text-white" : "text-slate-900")}>
                Build from Scratch
              </p>
              <p className={classNames("mt-1.5 text-sm leading-relaxed", isDark ? "text-slate-400" : "text-slate-500")}>
                Start with a complete sample resume and update each section for your needs.
              </p>
            </div>
            <div className="mt-auto flex flex-wrap gap-2">
              {["8 Templates", "ATS Score", "AI Optimizer", "PDF Download"].map((tag) => (
                <span key={tag} className={classNames(
                  "rounded-full px-2.5 py-1 text-xs font-medium",
                  isDark ? "bg-indigo-900/40 text-indigo-300" : isTricolor ? "bg-orange-50 text-orange-700" : "bg-violet-50 text-violet-700"
                )}>
                  {tag}
                </span>
              ))}
            </div>
          </button>

          {/* Option 2 — Upload existing */}
          <div className={classNames(
            "flex flex-col rounded-2xl border-2 transition-all duration-200",
            dragging
              ? isDark ? "border-indigo-400 bg-indigo-950/40" : "border-violet-400 bg-violet-50"
              : isDark ? "border-indigo-800/50 bg-white/[0.03]" : isTricolor ? "border-orange-200 bg-white" : "border-slate-200 bg-white"
          )}>
            <div className="p-8 flex flex-col items-start gap-4 flex-1">
              <div className={classNames(
                "flex h-14 w-14 items-center justify-center rounded-xl",
                isDark ? "bg-emerald-900/40" : isTricolor ? "bg-green-50" : "bg-emerald-50"
              )}>
                <Upload className={classNames("h-7 w-7", isDark ? "text-emerald-400" : "text-emerald-600")} />
              </div>
              <div>
                <p className={classNames("text-lg font-bold", isDark ? "text-white" : "text-slate-900")}>
                  Upload Existing Resume
                </p>
                <p className={classNames("mt-1.5 text-sm leading-relaxed", isDark ? "text-slate-400" : "text-slate-500")}>
                  Upload your PDF or TXT resume. We'll auto-fill all sections so you can edit and improve it.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {["PDF", "TXT", "Auto-parsed", "AI Ready"].map((tag) => (
                  <span key={tag} className={classNames(
                    "rounded-full px-2.5 py-1 text-xs font-medium",
                    isDark ? "bg-emerald-900/30 text-emerald-400" : "bg-emerald-50 text-emerald-700"
                  )}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Drop zone */}
            <div
              className={classNames(
                "mx-4 mb-4 flex flex-col items-center justify-center rounded-xl border-2 border-dashed px-4 py-6 transition-all cursor-pointer",
                dragging
                  ? "border-violet-400 bg-violet-50"
                  : isDark ? "border-slate-700 hover:border-indigo-600" : isTricolor ? "border-orange-200 hover:border-orange-400" : "border-slate-200 hover:border-violet-300"
              )}
              onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileRef.current?.click()}
            >
              <input
                ref={fileRef}
                type="file"
                accept=".pdf,.txt"
                className="hidden"
                onChange={handleInputChange}
              />

              {loading ? (
                <div className="flex flex-col items-center gap-2">
                  <Loader2 className={classNames("h-8 w-8 animate-spin", isDark ? "text-indigo-400" : "text-violet-500")} />
                  <p className={classNames("text-sm font-medium", isDark ? "text-slate-300" : "text-slate-600")}>
                    Parsing resume…
                  </p>
                </div>
              ) : parsed ? (
                <div className="flex flex-col items-center gap-2">
                  <CheckCircle2 className="h-8 w-8 text-emerald-500" />
                  <p className="text-sm font-semibold text-emerald-600">Parsed successfully!</p>
                  <p className={classNames("text-xs text-center", isDark ? "text-slate-400" : "text-slate-500")}>
                    {fileName}
                  </p>
                  <p className={classNames("text-xs text-center", isDark ? "text-slate-400" : "text-slate-500")}>
                    Found: {parsed.experience.length} jobs · {parsed.education.length} degrees · {parsed.skills.length} skills · {parsed.projects.length} projects
                  </p>
                  {parsedText && (
                    <pre className={classNames(
                      "mt-2 max-h-28 w-full overflow-auto rounded-lg p-2 text-left text-[10px] leading-relaxed whitespace-pre-wrap",
                      isDark ? "bg-slate-900/80 text-slate-300" : "bg-slate-50 text-slate-600"
                    )}>
                      {parsedText}
                    </pre>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2 text-center">
                  <Upload className={classNames("h-7 w-7", isDark ? "text-slate-500" : "text-slate-400")} />
                  <p className={classNames("text-sm font-medium", isDark ? "text-slate-300" : "text-slate-600")}>
                    Drop file here or click to browse
                  </p>
                  <p className={classNames("text-xs", isDark ? "text-slate-500" : "text-slate-400")}>
                    PDF or TXT - max 5MB
                  </p>
                </div>
              )}

              {error && (
                <p className="mt-2 flex items-center gap-1.5 text-xs text-red-500">
                  <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                  {error}
                </p>
              )}
            </div>

            {/* Continue with uploaded */}
            {parsed && (
              <div className="px-4 pb-4 flex gap-2">
                <button
                  type="button"
                  onClick={() => onUpload(parsed)}
                  className="btn-primary flex-1 flex items-center justify-center gap-2"
                >
                  <Sparkles className="h-4 w-4" />
                  Continue with This Resume
                </button>
                <button
                  type="button"
                  onClick={() => { setParsed(null); setParsedText(""); setFileName(""); setError(null); }}
                  className="btn-secondary px-3"
                >
                  ×
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Bottom note */}
        <p className={classNames(
          "mt-8 text-center text-xs",
          isDark ? "text-slate-600" : "text-slate-400"
        )}>
          All data stays in your browser — nothing is uploaded to any server
        </p>
      </div>
    </div>
  );
}

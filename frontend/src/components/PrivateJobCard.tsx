import { Briefcase, CheckCircle2, ExternalLink, MapPin, Sparkles } from "lucide-react";
import type { PrivateJob } from "@/data/privateJobs";
import { classNames } from "@/utils/format";

interface PrivateJobCardProps {
  job: PrivateJob;
  matchScore?: number;
}

const SOURCE_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  LinkedIn: { bg: "bg-blue-50 dark:bg-blue-950/40", text: "text-blue-600 dark:text-blue-400", border: "border-blue-200 dark:border-blue-800" },
  Indeed: { bg: "bg-indigo-50 dark:bg-indigo-950/40", text: "text-indigo-600 dark:text-indigo-400", border: "border-indigo-200 dark:border-indigo-800" },
  Glassdoor: { bg: "bg-emerald-50 dark:bg-emerald-950/40", text: "text-emerald-600 dark:text-emerald-400", border: "border-emerald-200 dark:border-emerald-800" },
};

export function PrivateJobCard({ job, matchScore }: PrivateJobCardProps): JSX.Element {
  const sourceTheme = SOURCE_COLORS[job.source] || SOURCE_COLORS.LinkedIn;

  return (
    <div className="card group relative flex flex-col justify-between p-5 hover:scale-[1.01] transition-all duration-200 border-slate-200/80 dark:border-slate-800">
      <div>
        {/* Top Header Row */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            {/* Company Logo Badge */}
            <div className={classNames("flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-white font-bold text-lg shadow-sm", job.logoBg)}>
              {job.logoInitial}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h4 className="font-semibold text-slate-700 dark:text-slate-300 text-xs">{job.company}</h4>
                {job.verified && <CheckCircle2 className="h-3.5 w-3.5 text-blue-500 shrink-0" />}
              </div>
              <p className="text-[11px] text-slate-400 dark:text-slate-500">{job.postedAgo}</p>
            </div>
          </div>

          {/* Badges: Source + Match Score */}
          <div className="flex flex-col items-end gap-1">
            <span className={classNames("rounded-full border px-2.5 py-0.5 text-[11px] font-semibold flex items-center gap-1", sourceTheme.bg, sourceTheme.text, sourceTheme.border)}>
              via {job.source}
            </span>
            {matchScore && matchScore > 65 && (
              <span className="rounded-full bg-emerald-100 text-emerald-700 px-2 py-0.5 text-[10px] font-bold dark:bg-emerald-950/60 dark:text-emerald-300 flex items-center gap-1">
                <Sparkles className="h-3 w-3 text-emerald-500" /> {matchScore}% Match
              </span>
            )}
          </div>
        </div>

        {/* Job Title */}
        <h3 className="mt-3 font-bold text-slate-900 dark:text-white text-base group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors line-clamp-2">
          {job.title}
        </h3>

        {/* Key Info Pills */}
        <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-600 dark:text-slate-300">
          <span className="inline-flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-md">
            {job.salary}
          </span>
          <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 dark:bg-slate-800 px-2 py-1 text-[11px]">
            <MapPin className="h-3 w-3 text-red-500" /> {job.location}
          </span>
          <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 dark:bg-slate-800 px-2 py-1 text-[11px]">
            <Briefcase className="h-3 w-3 text-blue-500" /> {job.experience}
          </span>
        </div>

        {/* Description snippet */}
        <p className="mt-3 text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
          {job.description}
        </p>

        {/* Tags */}
        <div className="mt-3.5 flex flex-wrap gap-1.5">
          {job.tags.map(tag => (
            <span key={tag} className="rounded-md border border-slate-200 dark:border-slate-800 px-2 py-0.5 text-[11px] font-medium text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/60">
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Footer CTA */}
      <div className="mt-5 border-t border-slate-100 dark:border-slate-800/80 pt-3">
        <a
          href={job.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary w-full justify-center text-xs py-2 gap-1.5"
        >
          Apply via {job.source} <ExternalLink className="h-3.5 w-3.5" />
        </a>
      </div>
    </div>
  );
}

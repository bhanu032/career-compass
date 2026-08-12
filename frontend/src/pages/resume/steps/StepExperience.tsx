import { Plus, Trash2 } from "lucide-react";
import { nanoid } from "@/utils/nanoid";
import type { Experience } from "@/types/resume";
import { classNames } from "@/utils/format";
import { useTheme } from "@/hooks/useTheme";

interface Props {
  data: Experience[];
  onChange: (data: Experience[]) => void;
}

const EMPTY: Omit<Experience, "id"> = {
  company: "", position: "", startDate: "", endDate: "",
  current: false, description: "",
};

export function StepExperience({ data, onChange }: Props): JSX.Element {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  function add() {
    onChange([...data, { id: nanoid(), ...EMPTY }]);
  }
  function remove(id: string) {
    onChange(data.filter((e) => e.id !== id));
  }
  function update(id: string, key: keyof Experience, val: string | boolean) {
    onChange(data.map((e) => e.id === id ? { ...e, [key]: val } : e));
  }

  const inputClass = "input";
  const labelClass = "label";

  return (
    <div>
      <h2 className={classNames("text-xl font-bold", isDark ? "text-white" : "text-slate-900")}>
        Work Experience
      </h2>
      <p className={classNames("mt-1 text-sm", isDark ? "text-slate-400" : "text-slate-500")}>
        Add your jobs from most recent first
      </p>

      <div className="mt-6 space-y-6">
        {data.map((exp, idx) => (
          <div
            key={exp.id}
            className={classNames(
              "rounded-xl border p-5",
              isDark ? "border-slate-700 bg-white/[0.02]" : "border-slate-200 bg-slate-50"
            )}
          >
            <div className="flex items-center justify-between">
              <span className={classNames("text-sm font-semibold", isDark ? "text-slate-300" : "text-slate-700")}>
                Experience #{idx + 1}
              </span>
              <button type="button" onClick={() => remove(exp.id)}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-red-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label className={labelClass}>Position / Job Title</label>
                <input className={inputClass} value={exp.position}
                  onChange={(e) => update(exp.id, "position", e.target.value)}
                  placeholder="Software Engineer" />
              </div>
              <div>
                <label className={labelClass}>Company / Organization</label>
                <input className={inputClass} value={exp.company}
                  onChange={(e) => update(exp.id, "company", e.target.value)}
                  placeholder="DRDO, Mumbai" />
              </div>
              <div>
                <label className={labelClass}>Start Date</label>
                <input className={inputClass} type="month" value={exp.startDate}
                  onChange={(e) => update(exp.id, "startDate", e.target.value)} />
              </div>
              <div>
                <label className={labelClass}>End Date</label>
                <input className={inputClass} type="month" value={exp.endDate}
                  disabled={exp.current}
                  onChange={(e) => update(exp.id, "endDate", e.target.value)} />
                <label className="mt-1.5 flex cursor-pointer items-center gap-2 text-xs">
                  <input type="checkbox" checked={exp.current}
                    onChange={(e) => {
                      update(exp.id, "current", e.target.checked);
                      if (e.target.checked) update(exp.id, "endDate", "");
                    }}
                    className="rounded" />
                  <span className={isDark ? "text-slate-400" : "text-slate-500"}>Currently working here</span>
                </label>
              </div>
              <div className="sm:col-span-2">
                <label className={labelClass}>Key Responsibilities / Achievements</label>
                <textarea className={classNames(inputClass, "resize-none")} rows={3}
                  value={exp.description}
                  onChange={(e) => update(exp.id, "description", e.target.value)}
                  placeholder="• Developed and maintained REST APIs using FastAPI&#10;• Reduced deployment time by 40% using CI/CD pipelines" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <button type="button" onClick={add}
        className={classNames(
          "mt-4 flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed py-3 text-sm font-medium transition-colors",
          isDark
            ? "border-slate-700 text-slate-400 hover:border-indigo-600 hover:text-indigo-400"
            : "border-slate-300 text-slate-500 hover:border-violet-400 hover:text-violet-600"
        )}>
        <Plus className="h-4 w-4" />
        Add Experience
      </button>

      {data.length === 0 && (
        <p className={classNames("mt-3 text-center text-xs", isDark ? "text-slate-500" : "text-slate-400")}>
          No experience yet — that's fine! Click above to add your first job.
        </p>
      )}
    </div>
  );
}

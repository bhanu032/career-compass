import { Plus, Trash2 } from "lucide-react";
import { nanoid } from "@/utils/nanoid";
import type { Skill } from "@/types/resume";
import { classNames } from "@/utils/format";
import { useTheme } from "@/hooks/useTheme";

interface Props {
  data: Skill[];
  onChange: (data: Skill[]) => void;
}

const LEVELS: Skill["level"][] = ["Beginner", "Intermediate", "Advanced", "Expert"];

const LEVEL_COLORS: Record<Skill["level"], string> = {
  Beginner:     "bg-slate-200 text-slate-600",
  Intermediate: "bg-blue-100 text-blue-700",
  Advanced:     "bg-violet-100 text-violet-700",
  Expert:       "bg-emerald-100 text-emerald-700",
};

const SUGGESTIONS = [
  "MS Word", "MS Excel", "Tally", "GST Filing", "Python", "Java", "React",
  "AutoCAD", "MATLAB", "Communication", "Leadership", "Problem Solving",
  "Hindi Typing", "English Typing", "Data Analysis",
];

export function StepSkills({ data, onChange }: Props): JSX.Element {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  function add() {
    onChange([...data, { id: nanoid(), name: "", level: "Intermediate" }]);
  }
  function remove(id: string) { onChange(data.filter((s) => s.id !== id)); }
  function update(id: string, key: keyof Skill, val: string) {
    onChange(data.map((s) => s.id === id ? { ...s, [key]: val } : s));
  }
  function addSuggestion(name: string) {
    if (data.some((s) => s.name.toLowerCase() === name.toLowerCase())) return;
    onChange([...data, { id: nanoid(), name, level: "Intermediate" }]);
  }

  return (
    <div>
      <h2 className={classNames("text-xl font-bold", isDark ? "text-white" : "text-slate-900")}>
        Skills
      </h2>
      <p className={classNames("mt-1 text-sm", isDark ? "text-slate-400" : "text-slate-500")}>
        Add technical and soft skills relevant to the job
      </p>

      {/* Quick add suggestions */}
      <div className="mt-4">
        <p className={classNames("mb-2 text-xs font-medium", isDark ? "text-slate-400" : "text-slate-500")}>
          Quick add:
        </p>
        <div className="flex flex-wrap gap-2">
          {SUGGESTIONS.map((s) => {
            const added = data.some((d) => d.name.toLowerCase() === s.toLowerCase());
            return (
              <button key={s} type="button" onClick={() => addSuggestion(s)}
                disabled={added}
                className={classNames(
                  "rounded-full px-3 py-1 text-xs font-medium transition",
                  added
                    ? isDark ? "bg-indigo-900/40 text-indigo-400 cursor-default" : "bg-violet-100 text-violet-600 cursor-default"
                    : isDark ? "bg-slate-800 text-slate-300 hover:bg-slate-700" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                )}>
                {added ? "✓ " : "+ "}{s}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-5 space-y-3">
        {data.map((skill) => (
          <div key={skill.id} className="flex items-center gap-3">
            <input
              className="input flex-1"
              value={skill.name}
              onChange={(e) => update(skill.id, "name", e.target.value)}
              placeholder="e.g. Python, Communication, Tally"
            />
            <select
              className={classNames(
                "rounded-xl border px-2 py-2.5 text-xs font-medium outline-none transition",
                isDark
                  ? "border-indigo-900/40 bg-white/[0.04] text-slate-200"
                  : "border-slate-200 bg-white text-slate-700",
                LEVEL_COLORS[skill.level]
              )}
              value={skill.level}
              onChange={(e) => update(skill.id, "level", e.target.value)}
            >
              {LEVELS.map((l) => (
                <option key={l} value={l}>{l}</option>
              ))}
            </select>
            <button type="button" onClick={() => remove(skill.id)}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-red-400 hover:bg-red-50 hover:text-red-600">
              <Trash2 className="h-4 w-4" />
            </button>
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
        Add Skill
      </button>
    </div>
  );
}

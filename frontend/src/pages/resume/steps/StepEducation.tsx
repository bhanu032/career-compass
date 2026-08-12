import { Plus, Trash2 } from "lucide-react";
import { nanoid } from "@/utils/nanoid";
import type { Education } from "@/types/resume";
import { classNames } from "@/utils/format";
import { useTheme } from "@/hooks/useTheme";

interface Props {
  data: Education[];
  onChange: (data: Education[]) => void;
}

const EMPTY: Omit<Education, "id"> = {
  institution: "", degree: "", field: "",
  startDate: "", endDate: "", grade: "",
};

export function StepEducation({ data, onChange }: Props): JSX.Element {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  function add() { onChange([...data, { id: nanoid(), ...EMPTY }]); }
  function remove(id: string) { onChange(data.filter((e) => e.id !== id)); }
  function update(id: string, key: keyof Education, val: string) {
    onChange(data.map((e) => e.id === id ? { ...e, [key]: val } : e));
  }

  return (
    <div>
      <h2 className={classNames("text-xl font-bold", isDark ? "text-white" : "text-slate-900")}>
        Education
      </h2>
      <p className={classNames("mt-1 text-sm", isDark ? "text-slate-400" : "text-slate-500")}>
        Add your degrees, diplomas, and certifications from most recent first
      </p>

      <div className="mt-6 space-y-5">
        {data.map((edu, idx) => (
          <div key={edu.id} className={classNames(
            "rounded-xl border p-5",
            isDark ? "border-slate-700 bg-white/[0.02]" : "border-slate-200 bg-slate-50"
          )}>
            <div className="flex items-center justify-between">
              <span className={classNames("text-sm font-semibold", isDark ? "text-slate-300" : "text-slate-700")}>
                Education #{idx + 1}
              </span>
              <button type="button" onClick={() => remove(edu.id)}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-red-400 hover:bg-red-50 hover:text-red-600">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="label">Institution / University</label>
                <input className="input" value={edu.institution}
                  onChange={(e) => update(edu.id, "institution", e.target.value)}
                  placeholder="Indian Institute of Technology, Delhi" />
              </div>
              <div>
                <label className="label">Degree</label>
                <input className="input" value={edu.degree}
                  onChange={(e) => update(edu.id, "degree", e.target.value)}
                  placeholder="B.Tech / B.Sc / MBA" />
              </div>
              <div>
                <label className="label">Field of Study</label>
                <input className="input" value={edu.field}
                  onChange={(e) => update(edu.id, "field", e.target.value)}
                  placeholder="Computer Science" />
              </div>
              <div>
                <label className="label">Start Year</label>
                <input className="input" type="month" value={edu.startDate}
                  onChange={(e) => update(edu.id, "startDate", e.target.value)} />
              </div>
              <div>
                <label className="label">End Year (or Expected)</label>
                <input className="input" type="month" value={edu.endDate}
                  onChange={(e) => update(edu.id, "endDate", e.target.value)} />
              </div>
              <div>
                <label className="label">Grade / Percentage / CGPA</label>
                <input className="input" value={edu.grade}
                  onChange={(e) => update(edu.id, "grade", e.target.value)}
                  placeholder="8.5 CGPA / 85%" />
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
        Add Education
      </button>
    </div>
  );
}

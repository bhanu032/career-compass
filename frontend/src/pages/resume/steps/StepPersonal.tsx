import type { PersonalInfo } from "@/types/resume";
import { classNames } from "@/utils/format";
import { useTheme } from "@/hooks/useTheme";

interface Props {
  data: PersonalInfo;
  onChange: (data: PersonalInfo) => void;
}

function Field({
  label, value, onChange, placeholder, type = "text", span = 1,
}: {
  label: string; value: string; onChange: (v: string) => void;
  placeholder?: string; type?: string; span?: number;
}) {
  return (
    <div className={span === 2 ? "sm:col-span-2" : ""}>
      <label className="label">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="input"
      />
    </div>
  );
}

export function StepPersonal({ data, onChange }: Props): JSX.Element {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  function set(key: keyof PersonalInfo) {
    return (val: string) => onChange({ ...data, [key]: val });
  }

  return (
    <div>
      <h2 className={classNames("text-xl font-bold", isDark ? "text-white" : "text-slate-900")}>
        Personal Information
      </h2>
      <p className={classNames("mt-1 text-sm", isDark ? "text-slate-400" : "text-slate-500")}>
        This appears at the top of your resume
      </p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Full Name *" value={data.fullName} onChange={set("fullName")} placeholder="Rahul Sharma" />
        <Field label="Job Title" value={data.jobTitle} onChange={set("jobTitle")} placeholder="Software Engineer" />
        <Field label="Email *" value={data.email} onChange={set("email")} placeholder="rahul@email.com" type="email" />
        <Field label="Phone *" value={data.phone} onChange={set("phone")} placeholder="+91 98765 43210" />
        <Field label="Address" value={data.address} onChange={set("address")} placeholder="New Delhi, India" />
        <Field label="LinkedIn" value={data.linkedin} onChange={set("linkedin")} placeholder="linkedin.com/in/rahul" />
        <Field label="Website / Portfolio" value={data.website} onChange={set("website")} placeholder="rahul.dev" />
      </div>

      <div className="mt-4">
        <label className="label">Professional Summary</label>
        <textarea
          value={data.summary}
          onChange={(e) => onChange({ ...data, summary: e.target.value })}
          placeholder="Write 2–3 sentences about your experience, skills, and career goals..."
          rows={4}
          className="input resize-none"
        />
        <p className={classNames("mt-1 text-xs", isDark ? "text-slate-500" : "text-slate-400")}>
          {data.summary.length}/400 characters
        </p>
      </div>
    </div>
  );
}

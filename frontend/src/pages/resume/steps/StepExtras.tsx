import { Plus, Trash2 } from "lucide-react";
import { nanoid } from "@/utils/nanoid";
import type { Project, Certificate } from "@/types/resume";
import { classNames } from "@/utils/format";
import { useTheme } from "@/hooks/useTheme";

interface Props {
  projects: Project[];
  certificates: Certificate[];
  onProjectsChange: (data: Project[]) => void;
  onCertificatesChange: (data: Certificate[]) => void;
}

export function StepExtras({ projects, certificates, onProjectsChange, onCertificatesChange }: Props): JSX.Element {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  function addProject() {
    onProjectsChange([...projects, { id: nanoid(), name: "", description: "", link: "", technologies: "" }]);
  }
  function removeProject(id: string) { onProjectsChange(projects.filter((p) => p.id !== id)); }
  function updateProject(id: string, key: keyof Project, val: string) {
    onProjectsChange(projects.map((p) => p.id === id ? { ...p, [key]: val } : p));
  }

  function addCert() {
    onCertificatesChange([...certificates, { id: nanoid(), name: "", issuer: "", date: "" }]);
  }
  function removeCert(id: string) { onCertificatesChange(certificates.filter((c) => c.id !== id)); }
  function updateCert(id: string, key: keyof Certificate, val: string) {
    onCertificatesChange(certificates.map((c) => c.id === id ? { ...c, [key]: val } : c));
  }

  const sectionClass = classNames(
    "rounded-xl border p-5",
    isDark ? "border-slate-700 bg-white/[0.02]" : "border-slate-200 bg-slate-50"
  );
  const addBtnClass = classNames(
    "mt-3 flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed py-2.5 text-sm font-medium transition-colors",
    isDark
      ? "border-slate-700 text-slate-400 hover:border-indigo-600 hover:text-indigo-400"
      : "border-slate-300 text-slate-500 hover:border-violet-400 hover:text-violet-600"
  );

  return (
    <div className="space-y-8">
      <h2 className={classNames("text-xl font-bold", isDark ? "text-white" : "text-slate-900")}>
        Projects &amp; Certifications
      </h2>

      {/* Projects */}
      <section>
        <h3 className={classNames("text-base font-semibold", isDark ? "text-slate-200" : "text-slate-800")}>
          Projects
        </h3>
        <p className={classNames("mt-0.5 text-xs", isDark ? "text-slate-500" : "text-slate-400")}>
          Include personal, academic, or open-source projects
        </p>
        <div className="mt-4 space-y-4">
          {projects.map((p, idx) => (
            <div key={p.id} className={sectionClass}>
              <div className="flex items-center justify-between">
                <span className={classNames("text-sm font-medium", isDark ? "text-slate-300" : "text-slate-600")}>
                  Project #{idx + 1}
                </span>
                <button type="button" onClick={() => removeProject(p.id)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-red-400 hover:bg-red-50 hover:text-red-600">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="label">Project Name</label>
                  <input className="input" value={p.name}
                    onChange={(e) => updateProject(p.id, "name", e.target.value)}
                    placeholder="e.g. GovJobs Portal" />
                </div>
                <div>
                  <label className="label">Technologies Used</label>
                  <input className="input" value={p.technologies}
                    onChange={(e) => updateProject(p.id, "technologies", e.target.value)}
                    placeholder="React, Python, PostgreSQL" />
                </div>
                <div className="sm:col-span-2">
                  <label className="label">Description</label>
                  <textarea className="input resize-none" rows={2} value={p.description}
                    onChange={(e) => updateProject(p.id, "description", e.target.value)}
                    placeholder="Brief description of what you built and its impact" />
                </div>
                <div className="sm:col-span-2">
                  <label className="label">Project Link (GitHub / Live)</label>
                  <input className="input" value={p.link}
                    onChange={(e) => updateProject(p.id, "link", e.target.value)}
                    placeholder="https://github.com/username/project" />
                </div>
              </div>
            </div>
          ))}
        </div>
        <button type="button" onClick={addProject} className={addBtnClass}>
          <Plus className="h-4 w-4" /> Add Project
        </button>
      </section>

      {/* Certificates */}
      <section>
        <h3 className={classNames("text-base font-semibold", isDark ? "text-slate-200" : "text-slate-800")}>
          Certifications
        </h3>
        <p className={classNames("mt-0.5 text-xs", isDark ? "text-slate-500" : "text-slate-400")}>
          Include government exams cleared, online courses, professional licenses
        </p>
        <div className="mt-4 space-y-3">
          {certificates.map((c, idx) => (
            <div key={c.id} className={sectionClass}>
              <div className="flex items-center justify-between">
                <span className={classNames("text-sm font-medium", isDark ? "text-slate-300" : "text-slate-600")}>
                  Certificate #{idx + 1}
                </span>
                <button type="button" onClick={() => removeCert(c.id)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-red-400 hover:bg-red-50 hover:text-red-600">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div className="sm:col-span-2">
                  <label className="label">Certificate Name</label>
                  <input className="input" value={c.name}
                    onChange={(e) => updateCert(c.id, "name", e.target.value)}
                    placeholder="AWS Solutions Architect / CCC / SSC CGL Cleared" />
                </div>
                <div>
                  <label className="label">Issued Date</label>
                  <input className="input" type="month" value={c.date}
                    onChange={(e) => updateCert(c.id, "date", e.target.value)} />
                </div>
                <div className="sm:col-span-3">
                  <label className="label">Issuing Organization</label>
                  <input className="input" value={c.issuer}
                    onChange={(e) => updateCert(c.id, "issuer", e.target.value)}
                    placeholder="Amazon Web Services / NIELIT / Staff Selection Commission" />
                </div>
              </div>
            </div>
          ))}
        </div>
        <button type="button" onClick={addCert} className={addBtnClass}>
          <Plus className="h-4 w-4" /> Add Certificate
        </button>
      </section>
    </div>
  );
}

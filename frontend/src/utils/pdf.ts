import type { Job } from "@/types";
import { formatDate, formatSalary } from "@/utils/format";

/** Opens a print-ready window so the user can save the job as a PDF. */
export function exportJobAsPdf(job: Job): void {
  const win = window.open("", "_blank", "width=900,height=1000");
  if (!win) return;

  const rows: [string, string][] = [
    ["Organization", job.organization],
    ["Department", job.department ?? "—"],
    ["Location", [job.city, job.state].filter(Boolean).join(", ") || "—"],
    ["Qualification", job.qualification ?? "—"],
    ["Salary", formatSalary(job.salary, job.salary_min, job.salary_max)],
    ["Age limit", job.age_limit ?? "—"],
    ["Vacancies", job.vacancies ? String(job.vacancies) : "—"],
    ["Experience", job.experience ?? "—"],
    ["Application mode", job.application_mode ?? "—"],
    ["Last date", formatDate(job.last_date)],
    ["Selection process", job.selection_process ?? "—"],
  ];

  win.document.write(`<!doctype html><html><head><title>${job.title}</title>
    <style>
      body { font-family: system-ui, sans-serif; padding: 40px; color: #1e293b; }
      h1 { color: #6d28d9; font-size: 22px; margin-bottom: 4px; }
      table { width: 100%; border-collapse: collapse; margin-top: 20px; }
      td { border-bottom: 1px solid #e2e8f0; padding: 10px 8px; font-size: 13px; vertical-align: top; }
      td:first-child { font-weight: 600; width: 190px; color: #475569; }
      p.desc { margin-top: 20px; font-size: 13px; line-height: 1.6; }
    </style></head><body>
    <h1>${job.title}</h1>
    <div>${job.organization}</div>
    <table>${rows.map(([k, v]) => `<tr><td>${k}</td><td>${v}</td></tr>`).join("")}</table>
    <p class="desc">${job.description ?? ""}</p>
    </body></html>`);
  win.document.close();
  win.focus();
  win.print();
}

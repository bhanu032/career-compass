/**
 * Compact Template — Dense ATS-optimized single column
 * Fits maximum content on one page, no colour distractions
 * Best for: ATS systems, freshers, government form-style CVs
 */
import type { ResumeData } from "@/types/resume";

interface Props { data: ResumeData; printMode?: boolean; }

const ACC  = "#1d4ed8"; // blue accent
const DARK = "#111827";

function fmtDate(d: string): string {
  if (!d) return "";
  const parts = d.split("-");
  if (parts.length < 2) return d;
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  return `${months[parseInt(parts[1], 10) - 1] ?? ""} ${parts[0]}`;
}

function HR() {
  return <div style={{ height: 1, background: "#d1d5db", margin: "10px 0" }} />;
}

function SectionTitle({ children }: { children: string }) {
  return (
    <div style={{ background: "#eff6ff", borderLeft: `3px solid ${ACC}`, padding: "3px 10px", marginBottom: 8 }}>
      <span style={{ fontSize: 11.5, fontWeight: 800, color: ACC, letterSpacing: "0.08em", textTransform: "uppercase" }}>
        {children}
      </span>
    </div>
  );
}

export function TemplateCompact({ data, printMode }: Props): JSX.Element {
  const { personal: p, experience, education, skills, projects, certificates } = data;

  const wrap: React.CSSProperties = printMode
    ? { width: "210mm", minHeight: "297mm", margin: "0 auto", fontFamily: "Arial, sans-serif", fontSize: 11.5, color: DARK, background: "#fff", padding: "28px 36px", boxSizing: "border-box" }
    : { width: "100%", fontFamily: "Arial, sans-serif", fontSize: 11.5, color: DARK, background: "#fff", padding: "24px 32px", borderRadius: 12 };

  // Group skills by level for compact display
  const allSkillNames = skills.map((s) => s.name).filter(Boolean);

  return (
    <div style={wrap}>
      {/* Name header */}
      <div style={{ borderBottom: `2px solid ${DARK}`, paddingBottom: 10, marginBottom: 10 }}>
        <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: DARK, letterSpacing: 0.5 }}>
          {p.fullName || "Your Name"}
        </h1>
        {p.jobTitle && (
          <p style={{ margin: "3px 0 0", fontSize: 12, color: ACC, fontWeight: 600 }}>{p.jobTitle}</p>
        )}
        {/* Contact row */}
        <div style={{ marginTop: 6, display: "flex", flexWrap: "wrap", gap: "2px 16px", fontSize: 11, color: "#374151" }}>
          {p.phone    && <span>{p.phone}</span>}
          {p.email    && <span>{p.email}</span>}
          {p.address  && <span>{p.address}</span>}
          {p.linkedin && <span style={{ color: ACC }}>{p.linkedin}</span>}
          {p.website  && <span style={{ color: ACC }}>{p.website}</span>}
        </div>
      </div>

      {p.summary && (
        <div style={{ marginBottom: 10 }}>
          <SectionTitle>Objective / Summary</SectionTitle>
          <p style={{ margin: 0, lineHeight: 1.7, fontSize: 11.5, color: "#374151" }}>{p.summary}</p>
        </div>
      )}

      {experience.length > 0 && (
        <div style={{ marginBottom: 10 }}>
          <SectionTitle>Work Experience</SectionTitle>
          {experience.map((e, i) => (
            <div key={e.id} style={{ marginBottom: 8 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <span style={{ fontWeight: 700, fontSize: 12 }}>{e.position}</span>
                <span style={{ fontSize: 10.5, color: "#6b7280", flexShrink: 0, marginLeft: 8 }}>
                  {fmtDate(e.startDate)} – {e.current ? "Present" : fmtDate(e.endDate)}
                </span>
              </div>
              <p style={{ margin: "1px 0 0", fontSize: 11.5, color: ACC, fontWeight: 600 }}>{e.company}</p>
              {e.description && (
                <p style={{ margin: "3px 0 0", fontSize: 11, lineHeight: 1.65, color: "#4b5563", whiteSpace: "pre-line" }}>
                  {e.description}
                </p>
              )}
              {i < experience.length - 1 && <HR />}
            </div>
          ))}
        </div>
      )}

      {education.length > 0 && (
        <div style={{ marginBottom: 10 }}>
          <SectionTitle>Education</SectionTitle>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11.5 }}>
            <thead>
              <tr style={{ background: "#f9fafb" }}>
                {["Degree / Course", "Institution", "Year", "Grade"].map((h) => (
                  <th key={h} style={{ textAlign: "left", padding: "4px 8px", fontSize: 10.5, fontWeight: 700, color: "#374151", borderBottom: "1px solid #e5e7eb" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {education.map((e) => (
                <tr key={e.id} style={{ borderBottom: "1px solid #f3f4f6" }}>
                  <td style={{ padding: "4px 8px", fontWeight: 600 }}>
                    {e.degree}{e.field ? ` (${e.field})` : ""}
                  </td>
                  <td style={{ padding: "4px 8px", color: "#374151" }}>{e.institution}</td>
                  <td style={{ padding: "4px 8px", color: "#6b7280", whiteSpace: "nowrap" }}>
                    {fmtDate(e.endDate) || fmtDate(e.startDate)}
                  </td>
                  <td style={{ padding: "4px 8px", color: "#6b7280" }}>{e.grade}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {allSkillNames.length > 0 && (
        <div style={{ marginBottom: 10 }}>
          <SectionTitle>Skills</SectionTitle>
          <p style={{ margin: 0, fontSize: 11.5, lineHeight: 1.8, color: "#374151" }}>
            {allSkillNames.join(" • ")}
          </p>
        </div>
      )}

      {projects.length > 0 && (
        <div style={{ marginBottom: 10 }}>
          <SectionTitle>Projects</SectionTitle>
          {projects.map((pr, i) => (
            <div key={pr.id} style={{ marginBottom: 6 }}>
              <span style={{ fontWeight: 700, fontSize: 12 }}>{pr.name}</span>
              {pr.technologies && <span style={{ fontSize: 11, color: "#6b7280" }}> — {pr.technologies}</span>}
              {pr.description && <p style={{ margin: "2px 0 0", fontSize: 11, lineHeight: 1.6, color: "#4b5563" }}>{pr.description}</p>}
              {pr.link && <p style={{ margin: "1px 0 0", fontSize: 10.5, color: ACC }}>{pr.link}</p>}
              {i < projects.length - 1 && <HR />}
            </div>
          ))}
        </div>
      )}

      {certificates.length > 0 && (
        <div>
          <SectionTitle>Certifications</SectionTitle>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {certificates.map((c) => (
              <div key={c.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", fontSize: 11.5 }}>
                <span style={{ fontWeight: 600 }}>{c.name}</span>
                <span style={{ color: "#6b7280", fontSize: 11 }}>
                  {c.issuer}{c.date ? ` · ${fmtDate(c.date)}` : ""}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Minimal Template — Clean single-column, teal accents
 * Best for: Any job — universally accepted ATS-friendly layout
 */
import type { ResumeData } from "@/types/resume";

interface Props { data: ResumeData; printMode?: boolean; }

const A = "#0f766e";

function fmtDate(d: string) {
  if (!d) return "";
  const [y, m] = d.split("-");
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  return `${months[parseInt(m, 10) - 1]} ${y}`;
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ marginBottom: 10, paddingBottom: 4, borderBottom: `2px solid ${A}` }}>
        <span style={{ fontSize: 12, fontWeight: 800, letterSpacing: "0.1em", color: A, textTransform: "uppercase" }}>
          {title}
        </span>
      </div>
      {children}
    </div>
  );
}

export function TemplateMinimal({ data, printMode }: Props): JSX.Element {
  const { personal: p, experience, education, skills, projects, certificates } = data;

  const wrapStyle: React.CSSProperties = printMode
    ? { width: "210mm", minHeight: "297mm", margin: "0 auto", fontFamily: "'Helvetica Neue', Arial, sans-serif", fontSize: 12.5, color: "#1e293b", background: "#fff", padding: "36px 48px", boxSizing: "border-box" }
    : { width: "100%", fontFamily: "'Helvetica Neue', Arial, sans-serif", fontSize: 12.5, color: "#1e293b", background: "#fff", padding: "32px 40px", borderRadius: 12 };

  const skillGroups: { [key: string]: string[] } = {};
  skills.forEach((s) => {
    if (!skillGroups[s.level]) skillGroups[s.level] = [];
    skillGroups[s.level].push(s.name);
  });

  return (
    <div style={wrapStyle}>
      {/* Header */}
      <div style={{ marginBottom: 24, textAlign: "center" }}>
        <h1 style={{ margin: 0, fontSize: 30, fontWeight: 300, letterSpacing: 4, color: "#0f172a" }}>
          {p.fullName || "YOUR NAME"}
        </h1>
        {p.jobTitle && (
          <p style={{ margin: "6px 0 0", fontSize: 13, color: A, fontWeight: 600, letterSpacing: 1 }}>
            {p.jobTitle.toUpperCase()}
          </p>
        )}
        <div style={{ marginTop: 10, display: "flex", justifyContent: "center", flexWrap: "wrap", gap: "4px 16px", fontSize: 11.5, color: "#475569" }}>
          {p.email    && <span>{p.email}</span>}
          {p.email && p.phone && <span style={{ color: "#cbd5e1" }}>|</span>}
          {p.phone    && <span>{p.phone}</span>}
          {p.phone && p.address && <span style={{ color: "#cbd5e1" }}>|</span>}
          {p.address  && <span>{p.address}</span>}
          {p.address && p.linkedin && <span style={{ color: "#cbd5e1" }}>|</span>}
          {p.linkedin && <span style={{ color: A }}>{p.linkedin}</span>}
          {p.linkedin && p.website && <span style={{ color: "#cbd5e1" }}>|</span>}
          {p.website  && <span style={{ color: A }}>{p.website}</span>}
        </div>
        <div style={{ width: 60, height: 2, background: A, margin: "14px auto 0", borderRadius: 99 }} />
      </div>

      {p.summary && (
        <Section title="Summary">
          <p style={{ margin: 0, lineHeight: 1.8, fontSize: 12.5, color: "#334155" }}>{p.summary}</p>
        </Section>
      )}

      {experience.length > 0 && (
        <Section title="Experience">
          {experience.map((e) => (
            <div key={e.id} style={{ marginBottom: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <p style={{ margin: 0, fontWeight: 700, fontSize: 13 }}>{e.position}</p>
                <span style={{ fontSize: 11, color: "#64748b" }}>
                  {fmtDate(e.startDate)} – {e.current ? "Present" : fmtDate(e.endDate)}
                </span>
              </div>
              <p style={{ margin: "2px 0 6px", fontSize: 12, color: A, fontWeight: 600 }}>{e.company}</p>
              {e.description && (
                <p style={{ margin: 0, fontSize: 12, lineHeight: 1.7, color: "#475569", whiteSpace: "pre-line" }}>
                  {e.description}
                </p>
              )}
            </div>
          ))}
        </Section>
      )}

      {education.length > 0 && (
        <Section title="Education">
          {education.map((e) => (
            <div key={e.id} style={{ marginBottom: 10, display: "flex", justifyContent: "space-between" }}>
              <div>
                <p style={{ margin: 0, fontWeight: 700, fontSize: 13 }}>
                  {e.degree}{e.field ? ` in ${e.field}` : ""}
                </p>
                <p style={{ margin: "2px 0 0", fontSize: 12, color: A, fontWeight: 600 }}>{e.institution}</p>
                {e.grade && <p style={{ margin: "1px 0 0", fontSize: 11, color: "#64748b" }}>Grade: {e.grade}</p>}
              </div>
              <span style={{ fontSize: 11, color: "#64748b", textAlign: "right", flexShrink: 0, marginLeft: 16 }}>
                {fmtDate(e.startDate)}{e.endDate ? ` – ${fmtDate(e.endDate)}` : ""}
              </span>
            </div>
          ))}
        </Section>
      )}

      {skills.length > 0 && (
        <Section title="Skills">
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {skills.map((s) => (
              <span key={s.id} style={{
                padding: "3px 10px", background: `${A}12`, border: `1px solid ${A}30`,
                borderRadius: 99, fontSize: 11.5, color: A, fontWeight: 600,
              }}>
                {s.name}
              </span>
            ))}
          </div>
        </Section>
      )}

      {projects.length > 0 && (
        <Section title="Projects">
          {projects.map((pr) => (
            <div key={pr.id} style={{ marginBottom: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <p style={{ margin: 0, fontWeight: 700, fontSize: 13 }}>{pr.name}</p>
                {pr.technologies && <span style={{ fontSize: 11, color: "#64748b" }}>{pr.technologies}</span>}
              </div>
              {pr.description && <p style={{ margin: "3px 0 0", fontSize: 12, lineHeight: 1.6, color: "#475569" }}>{pr.description}</p>}
              {pr.link && <p style={{ margin: "2px 0 0", fontSize: 11, color: A }}>{pr.link}</p>}
            </div>
          ))}
        </Section>
      )}

      {certificates.length > 0 && (
        <Section title="Certifications">
          <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
            {certificates.map((c) => (
              <div key={c.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <span style={{ fontSize: 12.5, fontWeight: 600 }}>{c.name}</span>
                <span style={{ fontSize: 11, color: "#64748b" }}>
                  {c.issuer}{c.date ? ` · ${fmtDate(c.date)}` : ""}
                </span>
              </div>
            ))}
          </div>
        </Section>
      )}
    </div>
  );
}

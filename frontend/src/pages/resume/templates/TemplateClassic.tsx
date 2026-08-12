/**
 * Classic Template — Traditional two-column layout
 * Deep navy header, clean serif-influenced typography
 * Best for: Government jobs, PSU, banking
 */
import type { ResumeData } from "@/types/resume";

interface Props { data: ResumeData; printMode?: boolean; }

const A = "#1e3a5f"; // accent navy

function fmtDate(d: string) {
  if (!d) return "";
  const [y, m] = d.split("-");
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  return `${months[parseInt(m, 10) - 1]} ${y}`;
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
        <span style={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.06em", color: A, textTransform: "uppercase" }}>
          {title}
        </span>
        <div style={{ flex: 1, height: 1.5, background: A, opacity: 0.25 }} />
      </div>
      {children}
    </div>
  );
}

export function TemplateClassic({ data, printMode }: Props): JSX.Element {
  const { personal: p, experience, education, skills, projects, certificates } = data;
  const levelBar: Record<string, number> = { Beginner: 25, Intermediate: 50, Advanced: 75, Expert: 100 };

  const wrapStyle: React.CSSProperties = printMode
    ? { width: "210mm", minHeight: "297mm", margin: "0 auto", fontFamily: "'Georgia', serif", fontSize: 13, color: "#1a1a2e", background: "#fff", boxSizing: "border-box" }
    : { width: "100%", fontFamily: "'Georgia', serif", fontSize: 13, color: "#1a1a2e", background: "#fff", boxSizing: "border-box", borderRadius: 12, overflow: "hidden" };

  return (
    <div style={wrapStyle}>
      {/* Header */}
      <div style={{ background: A, color: "#fff", padding: "32px 40px 24px" }}>
        <h1 style={{ margin: 0, fontSize: 28, fontWeight: 700, letterSpacing: 1 }}>
          {p.fullName || "Your Name"}
        </h1>
        {p.jobTitle && (
          <p style={{ margin: "4px 0 0", fontSize: 14, opacity: 0.8, fontStyle: "italic" }}>{p.jobTitle}</p>
        )}
        <div style={{ marginTop: 12, display: "flex", flexWrap: "wrap", gap: "6px 20px", fontSize: 12, opacity: 0.9 }}>
          {p.email    && <span>✉ {p.email}</span>}
          {p.phone    && <span>📞 {p.phone}</span>}
          {p.address  && <span>📍 {p.address}</span>}
          {p.linkedin && <span>🔗 {p.linkedin}</span>}
          {p.website  && <span>🌐 {p.website}</span>}
        </div>
      </div>

      {/* Body — two columns */}
      <div style={{ display: "flex", padding: "0" }}>
        {/* Left sidebar */}
        <div style={{ width: "35%", background: "#f4f6fb", padding: "24px 20px", flexShrink: 0 }}>
          {/* Skills */}
          {skills.length > 0 && (
            <Section title="Skills">
              {skills.map((s) => (
                <div key={s.id} style={{ marginBottom: 8 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 3 }}>
                    <span style={{ fontWeight: 600 }}>{s.name}</span>
                    <span style={{ color: "#64748b", fontSize: 11 }}>{s.level}</span>
                  </div>
                  <div style={{ height: 4, background: "#dde3ef", borderRadius: 99 }}>
                    <div style={{ width: `${levelBar[s.level]}%`, height: "100%", background: A, borderRadius: 99 }} />
                  </div>
                </div>
              ))}
            </Section>
          )}

          {/* Certificates */}
          {certificates.length > 0 && (
            <Section title="Certifications">
              {certificates.map((c) => (
                <div key={c.id} style={{ marginBottom: 8 }}>
                  <p style={{ margin: 0, fontSize: 12, fontWeight: 600 }}>{c.name}</p>
                  <p style={{ margin: "2px 0 0", fontSize: 11, color: "#64748b" }}>
                    {c.issuer}{c.date ? ` · ${fmtDate(c.date)}` : ""}
                  </p>
                </div>
              ))}
            </Section>
          )}
        </div>

        {/* Right main */}
        <div style={{ flex: 1, padding: "24px 28px" }}>
          {p.summary && (
            <Section title="Profile Summary">
              <p style={{ margin: 0, lineHeight: 1.7, fontSize: 13, color: "#334155" }}>{p.summary}</p>
            </Section>
          )}

          {experience.length > 0 && (
            <Section title="Work Experience">
              {experience.map((e) => (
                <div key={e.id} style={{ marginBottom: 14 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div>
                      <p style={{ margin: 0, fontWeight: 700, fontSize: 13 }}>{e.position}</p>
                      <p style={{ margin: "2px 0 0", fontSize: 12, color: A, fontStyle: "italic" }}>{e.company}</p>
                    </div>
                    <span style={{ fontSize: 11, color: "#64748b", whiteSpace: "nowrap", marginLeft: 8 }}>
                      {fmtDate(e.startDate)} – {e.current ? "Present" : fmtDate(e.endDate)}
                    </span>
                  </div>
                  {e.description && (
                    <p style={{ margin: "6px 0 0", fontSize: 12, lineHeight: 1.7, color: "#334155", whiteSpace: "pre-line" }}>
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
                <div key={e.id} style={{ marginBottom: 10 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div>
                      <p style={{ margin: 0, fontWeight: 700, fontSize: 13 }}>
                        {e.degree}{e.field ? ` in ${e.field}` : ""}
                      </p>
                      <p style={{ margin: "2px 0 0", fontSize: 12, color: A, fontStyle: "italic" }}>{e.institution}</p>
                    </div>
                    <div style={{ textAlign: "right", flexShrink: 0, marginLeft: 8 }}>
                      <span style={{ fontSize: 11, color: "#64748b" }}>
                        {fmtDate(e.startDate)}{e.endDate ? ` – ${fmtDate(e.endDate)}` : ""}
                      </span>
                      {e.grade && <p style={{ margin: "2px 0 0", fontSize: 11, color: "#64748b" }}>{e.grade}</p>}
                    </div>
                  </div>
                </div>
              ))}
            </Section>
          )}

          {projects.length > 0 && (
            <Section title="Projects">
              {projects.map((pr) => (
                <div key={pr.id} style={{ marginBottom: 10 }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <p style={{ margin: 0, fontWeight: 700, fontSize: 13 }}>{pr.name}</p>
                    {pr.technologies && (
                      <span style={{ fontSize: 11, color: A, fontStyle: "italic" }}>{pr.technologies}</span>
                    )}
                  </div>
                  {pr.description && (
                    <p style={{ margin: "4px 0 0", fontSize: 12, lineHeight: 1.7, color: "#334155" }}>{pr.description}</p>
                  )}
                  {pr.link && (
                    <p style={{ margin: "2px 0 0", fontSize: 11, color: A }}>{pr.link}</p>
                  )}
                </div>
              ))}
            </Section>
          )}
        </div>
      </div>
    </div>
  );
}

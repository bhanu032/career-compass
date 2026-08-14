/**
 * Modern Template — Bold sidebar with purple accent
 * Best for: Tech, private sector, startups
 */
import type { ResumeCustomization, ResumeData } from "@/types/resume";
import { formatResumeDate, pageMargins, resumeShellStyle, sectionGap } from "@/pages/resume/resumeTemplateUtils";

interface Props { data: ResumeData; customization?: ResumeCustomization; printMode?: boolean; }

const A = "#7c3aed";
const SIDE_BG = "#1e1b4b";

function SideSection({ title, children, gap }: { title: string; children: React.ReactNode; gap: number }) {
  return (
    <div className="resume-section resume-avoid-break" style={{ marginBottom: gap }}>
      <p
        style={{
          margin: "0 0 7px",
          fontSize: 10.5,
          fontWeight: 800,
          letterSpacing: "0.1em",
          color: A,
          textTransform: "uppercase",
        }}
      >
        {title}
      </p>
      {children}
    </div>
  );
}

function MainSection({ title, children, gap }: { title: string; children: React.ReactNode; gap: number }) {
  return (
    <div className="resume-section resume-avoid-break" style={{ marginBottom: gap }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 9 }}>
        <div style={{ width: 4, height: 16, background: A, borderRadius: 2 }} />
        <span
          style={{
            fontSize: 12,
            fontWeight: 800,
            letterSpacing: "0.04em",
            color: SIDE_BG,
            textTransform: "uppercase",
          }}
        >
          {title}
        </span>
      </div>
      {children}
    </div>
  );
}

export function TemplateModern({ data, customization, printMode }: Props): JSX.Element {
  const { personal: p, experience, education, skills, projects, certificates } = data;
  const levelPct: Record<string, number> = { Beginner: 25, Intermediate: 50, Advanced: 75, Expert: 100 };
  const gap = sectionGap(customization, 12);  // was 16
  const fmt = (d: string) => formatResumeDate(d, customization?.dateFormat);
  const { h, v } = pageMargins(customization);

  const wrapStyle = resumeShellStyle(customization, {
    fontFamily: "'Segoe UI', Arial, sans-serif",
    fontSize: 12.5,
    color: SIDE_BG,
    printMode,
    display: "flex",
  });

  return (
    <div className="resume-template" style={wrapStyle}>
      {/* Sidebar */}
      <div
        style={{
          width: "32%",
          background: SIDE_BG,
          padding: `${v}px ${Math.round(h * 0.55)}px`,
          flexShrink: 0,
          color: "#e2e8f0",
        }}
      >
        {/* Avatar circle */}
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: "50%",
            background: A,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 24,
            fontWeight: 700,
            color: "#fff",
            marginBottom: 14,
          }}
        >
          {(p.fullName || "?").charAt(0).toUpperCase()}
        </div>
        <h1 style={{ margin: "0 0 3px", fontSize: 18, fontWeight: 800, color: "#fff", lineHeight: 1.2 }}>
          {p.fullName || "Your Name"}
        </h1>
        {p.jobTitle && (
          <p style={{ margin: "0 0 14px", fontSize: 11.5, color: A, fontWeight: 600 }}>
            {p.jobTitle}
          </p>
        )}

        {/* Contact */}
        <SideSection title="Contact" gap={gap}>
          <div style={{ display: "flex", flexDirection: "column", gap: 5, fontSize: 11 }}>
            {p.phone    && <span style={{ color: "#cbd5e1" }}>📞 {p.phone}</span>}
            {p.email    && <span style={{ color: "#cbd5e1", wordBreak: "break-all" }}>✉ {p.email}</span>}
            {p.address  && <span style={{ color: "#cbd5e1" }}>📍 {p.address}</span>}
            {p.linkedin && <span style={{ color: "#a5b4fc", wordBreak: "break-all" }}>🔗 {p.linkedin}</span>}
            {p.website  && <span style={{ color: "#a5b4fc", wordBreak: "break-all" }}>🌐 {p.website}</span>}
          </div>
        </SideSection>

        {/* Skills */}
        {skills.length > 0 && (
          <SideSection title="Skills" gap={gap}>
            {skills.map((s) => (
              <div key={s.id} className="resume-item resume-avoid-break" style={{ marginBottom: 7 }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: 11,
                    marginBottom: 3,
                  }}
                >
                  <span style={{ color: "#e2e8f0", fontWeight: 600 }}>{s.name}</span>
                  <span style={{ color: "#94a3b8", fontSize: 10 }}>{levelPct[s.level]}%</span>
                </div>
                <div style={{ height: 3, background: "rgba(255,255,255,0.1)", borderRadius: 99 }}>
                  <div
                    style={{
                      width: `${levelPct[s.level]}%`,
                      height: "100%",
                      background: A,
                      borderRadius: 99,
                    }}
                  />
                </div>
              </div>
            ))}
          </SideSection>
        )}

        {/* Certificates */}
        {certificates.length > 0 && (
          <SideSection title="Certifications" gap={gap}>
            {certificates.map((c) => (
              <div key={c.id} className="resume-item resume-avoid-break" style={{ marginBottom: 7 }}>
                <p style={{ margin: 0, fontSize: 11, fontWeight: 600, color: "#e2e8f0" }}>{c.name}</p>
                <p style={{ margin: "1px 0 0", fontSize: 10, color: "#94a3b8" }}>
                  {c.issuer}
                  {c.date ? ` · ${fmt(c.date)}` : ""}
                </p>
              </div>
            ))}
          </SideSection>
        )}
      </div>

      {/* Main */}
      <div style={{ flex: 1, padding: `${v}px ${h}px ${v}px ${Math.round(h * 0.75)}px` }}>
        {p.summary && (
          <MainSection title="About Me" gap={gap}>
            <p style={{ margin: 0, fontSize: 12, lineHeight: 1.75, color: "#334155" }}>
              {p.summary}
            </p>
          </MainSection>
        )}

        {experience.length > 0 && (
          <MainSection title="Experience" gap={gap}>
            {experience.map((e) => (
              <div
                key={e.id}
                className="resume-item resume-avoid-break"
                style={{
                  marginBottom: 13,
                  paddingLeft: 11,
                  borderLeft: `2px solid ${A}25`,
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div>
                    <p style={{ margin: 0, fontWeight: 700, fontSize: 12.5, color: "#0f172a" }}>
                      {e.position}
                    </p>
                    <p style={{ margin: "2px 0 0", fontSize: 11.5, color: A, fontWeight: 600 }}>
                      {e.company}
                    </p>
                  </div>
                  <span
                    style={{
                      fontSize: 10.5,
                      color: "#64748b",
                      whiteSpace: "nowrap",
                      marginLeft: 8,
                      background: "#f1f5f9",
                      padding: "2px 7px",
                      borderRadius: 99,
                      flexShrink: 0,
                    }}
                  >
                    {fmt(e.startDate)} – {e.current ? "Present" : fmt(e.endDate)}
                  </span>
                </div>
                {e.description && (
                  <p
                    style={{
                      margin: "5px 0 0",
                      fontSize: 11.5,
                      lineHeight: 1.7,
                      color: "#475569",
                      whiteSpace: "pre-line",
                    }}
                  >
                    {e.description}
                  </p>
                )}
              </div>
            ))}
          </MainSection>
        )}

        {education.length > 0 && (
          <MainSection title="Education" gap={gap}>
            {education.map((e) => (
              <div
                key={e.id}
                className="resume-item resume-avoid-break"
                style={{ marginBottom: 10, paddingLeft: 11, borderLeft: `2px solid ${A}25` }}
              >
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <div>
                    <p style={{ margin: 0, fontWeight: 700, fontSize: 12.5, color: "#0f172a" }}>
                      {e.degree}
                      {e.field ? ` in ${e.field}` : ""}
                    </p>
                    <p style={{ margin: "2px 0 0", fontSize: 11.5, color: A, fontWeight: 600 }}>
                      {e.institution}
                    </p>
                  </div>
                  <div style={{ textAlign: "right", flexShrink: 0, marginLeft: 8 }}>
                    <span style={{ fontSize: 11, color: "#64748b" }}>
                      {fmt(e.startDate)}
                      {e.endDate ? ` – ${fmt(e.endDate)}` : ""}
                    </span>
                    {e.grade && (
                      <p style={{ margin: "1px 0 0", fontSize: 11, color: "#64748b" }}>{e.grade}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </MainSection>
        )}

        {projects.length > 0 && (
          <MainSection title="Projects" gap={gap}>
            {projects.map((pr) => (
              <div
                key={pr.id}
                className="resume-item resume-avoid-break"
                style={{ marginBottom: 10, paddingLeft: 11, borderLeft: `2px solid ${A}25` }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <p style={{ margin: 0, fontWeight: 700, fontSize: 12.5, color: "#0f172a" }}>
                    {pr.name}
                  </p>
                  {pr.technologies && (
                    <span
                      style={{
                        fontSize: 10,
                        background: `${A}15`,
                        color: A,
                        padding: "2px 7px",
                        borderRadius: 99,
                        fontWeight: 600,
                      }}
                    >
                      {pr.technologies}
                    </span>
                  )}
                </div>
                {pr.description && (
                  <p style={{ margin: "4px 0 0", fontSize: 11.5, lineHeight: 1.6, color: "#475569" }}>
                    {pr.description}
                  </p>
                )}
                {pr.link && (
                  <p style={{ margin: "2px 0 0", fontSize: 11, color: A }}>{pr.link}</p>
                )}
              </div>
            ))}
          </MainSection>
        )}
      </div>
    </div>
  );
}

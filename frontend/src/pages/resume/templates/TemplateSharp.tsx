/**
 * Sharp Template — Bold red accent, geometric header block
 * Best for: Banking, competitive exams (SSC CGL, IBPS PO), fresh graduates
 */
import type { ResumeCustomization, ResumeData } from "@/types/resume";
import { formatResumeDate, pageMargins, resumeShellStyle, sectionGap } from "@/pages/resume/resumeTemplateUtils";

interface Props { data: ResumeData; customization?: ResumeCustomization; printMode?: boolean; }

const RED       = "#b91c1c";
const RED_LIGHT = "#fef2f2";
const DARK      = "#111827";

function SectionTitle({ children }: { children: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
      <div
        style={{
          width: 14,
          height: 14,
          background: RED,
          borderRadius: 3,
          flexShrink: 0,
        }}
      />
      <span
        style={{
          fontSize: 11.5,
          fontWeight: 800,
          letterSpacing: "0.08em",
          color: RED,
          textTransform: "uppercase",
        }}
      >
        {children}
      </span>
      <div style={{ flex: 1, height: 1.5, background: `${RED}25` }} />
    </div>
  );
}

function Divider() {
  return <div style={{ height: 1, background: `${RED}20`, margin: "11px 0" }} />;
}

export function TemplateSharp({ data, customization, printMode }: Props): JSX.Element {
  const { personal: p, experience, education, skills, projects, certificates } = data;
  const levelPct: Record<string, number> = { Beginner: 25, Intermediate: 50, Advanced: 75, Expert: 100 };
  const gap = sectionGap(customization, 16);
  const fmt = (d: string) => formatResumeDate(d, customization?.dateFormat);
  const { h, v } = pageMargins(customization);

  const wrap = resumeShellStyle(customization, {
    fontFamily: "Arial, sans-serif",
    fontSize: 12.5,
    color: DARK,
    printMode,
    display: "flex",
    flexDirection: "column",
  });

  return (
    <div className="resume-template" style={wrap}>
      {/* Top accent strip */}
      <div style={{ height: 5, background: RED, flexShrink: 0 }} />

      {/* Header */}
      <div
        style={{
          padding: `${Math.round(v * 0.85)}px ${h}px ${Math.round(v * 0.7)}px`,
          background: "#fff",
          borderBottom: `3px solid ${RED}`,
          flexShrink: 0,
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <h1
              style={{
                margin: 0,
                fontSize: 28,
                fontWeight: 900,
                color: DARK,
                letterSpacing: -0.5,
                lineHeight: 1,
              }}
            >
              {p.fullName || "Your Name"}
            </h1>
            {p.jobTitle && (
              <div
                style={{
                  marginTop: 6,
                  display: "inline-block",
                  background: RED,
                  color: "#fff",
                  fontSize: 10.5,
                  fontWeight: 700,
                  padding: "3px 9px",
                  borderRadius: 3,
                  letterSpacing: 1,
                }}
              >
                {p.jobTitle.toUpperCase()}
              </div>
            )}
          </div>
          <div style={{ textAlign: "right", fontSize: 11, color: "#374151", lineHeight: 1.85 }}>
            {p.phone    && <div>📞 {p.phone}</div>}
            {p.email    && <div>✉ {p.email}</div>}
            {p.address  && <div>📍 {p.address}</div>}
            {p.linkedin && <div style={{ color: RED }}>🔗 {p.linkedin}</div>}
          </div>
        </div>
      </div>

      {/* Two-column body */}
      <div style={{ display: "flex", flex: 1 }}>
        {/* Main — left ~62% */}
        <div style={{ flex: 1, padding: `${v}px ${Math.round(h * 0.65)}px ${v}px ${h}px` }}>
          {p.summary && (
            <div className="resume-section resume-avoid-break" style={{ marginBottom: gap }}>
              <SectionTitle>Profile</SectionTitle>
              <p
                style={{
                  margin: 0,
                  fontSize: 12,
                  lineHeight: 1.8,
                  color: "#374151",
                  background: RED_LIGHT,
                  padding: "9px 12px",
                  borderRadius: 5,
                  borderLeft: `3px solid ${RED}`,
                }}
              >
                {p.summary}
              </p>
            </div>
          )}

          {experience.length > 0 && (
            <div className="resume-section resume-avoid-break" style={{ marginBottom: gap }}>
              <SectionTitle>Work Experience</SectionTitle>
              {experience.map((e, i) => (
                <div
                  key={e.id}
                  className="resume-item resume-avoid-break"
                  style={{ marginBottom: i < experience.length - 1 ? 13 : 0 }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div>
                      <p style={{ margin: 0, fontWeight: 700, fontSize: 12.5, color: DARK }}>
                        {e.position}
                      </p>
                      <p style={{ margin: "2px 0 0", fontSize: 11.5, color: RED, fontWeight: 600 }}>
                        {e.company}
                      </p>
                    </div>
                    <span
                      style={{
                        fontSize: 10.5,
                        color: "#fff",
                        background: RED,
                        padding: "2px 7px",
                        borderRadius: 3,
                        whiteSpace: "nowrap",
                        marginLeft: 8,
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
                        color: "#4b5563",
                        whiteSpace: "pre-line",
                      }}
                    >
                      {e.description}
                    </p>
                  )}
                  {i < experience.length - 1 && <Divider />}
                </div>
              ))}
            </div>
          )}

          {education.length > 0 && (
            <div className="resume-section resume-avoid-break" style={{ marginBottom: gap }}>
              <SectionTitle>Education</SectionTitle>
              {education.map((e) => (
                <div
                  key={e.id}
                  className="resume-item resume-avoid-break"
                  style={{ marginBottom: 10, display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}
                >
                  <div>
                    <p style={{ margin: 0, fontWeight: 700, fontSize: 12.5 }}>
                      {e.degree}
                      {e.field ? ` — ${e.field}` : ""}
                    </p>
                    <p style={{ margin: "2px 0 0", fontSize: 11.5, color: RED, fontWeight: 600 }}>
                      {e.institution}
                    </p>
                    {e.grade && (
                      <p style={{ margin: "2px 0 0", fontSize: 11, color: "#6b7280" }}>
                        Grade: {e.grade}
                      </p>
                    )}
                  </div>
                  <span
                    style={{
                      fontSize: 11,
                      color: "#6b7280",
                      whiteSpace: "nowrap",
                      marginLeft: 10,
                      flexShrink: 0,
                    }}
                  >
                    {fmt(e.startDate)}
                    {e.endDate ? ` – ${fmt(e.endDate)}` : ""}
                  </span>
                </div>
              ))}
            </div>
          )}

          {projects.length > 0 && (
            <div className="resume-section resume-avoid-break">
              <SectionTitle>Projects</SectionTitle>
              {projects.map((pr) => (
                <div
                  key={pr.id}
                  className="resume-item resume-avoid-break"
                  style={{ marginBottom: 10 }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <p style={{ margin: 0, fontWeight: 700, fontSize: 12.5 }}>{pr.name}</p>
                    {pr.technologies && (
                      <span style={{ fontSize: 10.5, color: RED, fontWeight: 600 }}>
                        {pr.technologies}
                      </span>
                    )}
                  </div>
                  {pr.description && (
                    <p
                      style={{
                        margin: "3px 0 0",
                        fontSize: 11.5,
                        lineHeight: 1.6,
                        color: "#4b5563",
                      }}
                    >
                      {pr.description}
                    </p>
                  )}
                  {pr.link && (
                    <p style={{ margin: "2px 0 0", fontSize: 11, color: RED }}>{pr.link}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar — right ~38% */}
        <div
          style={{
            width: "38%",
            borderLeft: `2px solid ${RED}15`,
            background: RED_LIGHT,
            padding: `${v}px ${Math.round(h * 0.55)}px`,
            flexShrink: 0,
          }}
        >
          {skills.length > 0 && (
            <div className="resume-section resume-avoid-break" style={{ marginBottom: gap }}>
              <p
                style={{
                  margin: "0 0 9px",
                  fontSize: 10.5,
                  fontWeight: 800,
                  color: RED,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                }}
              >
                Skills
              </p>
              {skills.map((s) => (
                <div
                  key={s.id}
                  className="resume-item resume-avoid-break"
                  style={{ marginBottom: 8 }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: 11,
                      marginBottom: 3,
                    }}
                  >
                    <span style={{ fontWeight: 600, color: DARK }}>{s.name}</span>
                    <span style={{ color: "#6b7280", fontSize: 10 }}>{s.level}</span>
                  </div>
                  <div style={{ height: 4, background: "#fca5a5", borderRadius: 99 }}>
                    <div
                      style={{
                        width: `${levelPct[s.level]}%`,
                        height: "100%",
                        background: RED,
                        borderRadius: 99,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {certificates.length > 0 && (
            <div className="resume-section resume-avoid-break">
              <p
                style={{
                  margin: "0 0 9px",
                  fontSize: 10.5,
                  fontWeight: 800,
                  color: RED,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                }}
              >
                Certifications
              </p>
              {certificates.map((c) => (
                <div
                  key={c.id}
                  className="resume-item resume-avoid-break"
                  style={{ marginBottom: 8, paddingLeft: 8, borderLeft: `2px solid ${RED}` }}
                >
                  <p style={{ margin: 0, fontSize: 11.5, fontWeight: 600, color: DARK }}>
                    {c.name}
                  </p>
                  <p style={{ margin: "1px 0 0", fontSize: 10.5, color: "#6b7280" }}>
                    {c.issuer}
                    {c.date ? ` · ${fmt(c.date)}` : ""}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

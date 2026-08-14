/**
 * Slate Template — Dark charcoal header, clean right sidebar
 * Best for: Corporate, management, senior government roles
 */
import type { ResumeCustomization, ResumeData } from "@/types/resume";
import { formatResumeDate, pageMargins, resumeShellStyle, sectionGap } from "@/pages/resume/resumeTemplateUtils";

interface Props { data: ResumeData; customization?: ResumeCustomization; printMode?: boolean; }

const SLATE_DARK = "#1e293b";
const SLATE_MID  = "#334155";
const CYAN       = "#0891b2";
const SIDE_BG    = "#f8fafc";

function MainSection({ title, children, gap }: { title: string; children: React.ReactNode; gap: number }) {
  return (
    <div className="resume-section resume-avoid-break" style={{ marginBottom: gap }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 9 }}>
        <div style={{ width: 3, height: 15, background: CYAN, borderRadius: 2 }} />
        <span
          style={{
            fontSize: 11,
            fontWeight: 800,
            letterSpacing: "0.09em",
            color: SLATE_DARK,
            textTransform: "uppercase",
          }}
        >
          {title}
        </span>
        <div style={{ flex: 1, height: 1, background: "#e2e8f0" }} />
      </div>
      {children}
    </div>
  );
}

function SideLabel({ children }: { children: string }) {
  return (
    <p
      style={{
        margin: "0 0 8px",
        fontSize: 10,
        fontWeight: 800,
        letterSpacing: "0.1em",
        color: CYAN,
        textTransform: "uppercase",
      }}
    >
      {children}
    </p>
  );
}

export function TemplateSlate({ data, customization, printMode }: Props): JSX.Element {
  const { personal: p, experience, education, skills, projects, certificates } = data;
  const levelPct: Record<string, number> = { Beginner: 25, Intermediate: 50, Advanced: 75, Expert: 100 };
  const gap = sectionGap(customization, 16);
  const fmt = (d: string) => formatResumeDate(d, customization?.dateFormat);
  const { h, v } = pageMargins(customization);

  const wrap = resumeShellStyle(customization, {
    fontFamily: "'Segoe UI', Arial, sans-serif",
    fontSize: 12.5,
    color: SLATE_DARK,
    printMode,
    display: "flex",
    flexDirection: "column",
  });

  return (
    <div className="resume-template" style={wrap}>
      {/* Full-bleed dark header */}
      <div
        style={{
          background: SLATE_DARK,
          color: "#fff",
          padding: `${Math.round(v * 0.9)}px ${h}px ${Math.round(v * 0.75)}px`,
          flexShrink: 0,
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div>
            <h1
              style={{
                margin: 0,
                fontSize: 26,
                fontWeight: 700,
                letterSpacing: 0.5,
                color: "#f1f5f9",
              }}
            >
              {p.fullName || "Your Name"}
            </h1>
            {p.jobTitle && (
              <p
                style={{
                  margin: "5px 0 0",
                  fontSize: 12.5,
                  color: CYAN,
                  fontWeight: 600,
                  letterSpacing: 0.5,
                }}
              >
                {p.jobTitle}
              </p>
            )}
          </div>
          <div style={{ textAlign: "right", fontSize: 11, color: "#94a3b8", lineHeight: 1.9 }}>
            {p.email   && <div>{p.email}</div>}
            {p.phone   && <div>{p.phone}</div>}
            {p.address && <div>{p.address}</div>}
          </div>
        </div>
        {(p.linkedin || p.website) && (
          <div style={{ marginTop: 9, display: "flex", gap: 18, fontSize: 11, color: CYAN }}>
            {p.linkedin && <span>🔗 {p.linkedin}</span>}
            {p.website  && <span>🌐 {p.website}</span>}
          </div>
        )}
      </div>

      {/* Cyan accent line */}
      <div
        style={{
          height: 3,
          background: `linear-gradient(to right, ${CYAN}, #22d3ee)`,
          flexShrink: 0,
        }}
      />

      {/* Body */}
      <div style={{ display: "flex", flex: 1 }}>
        {/* Main content */}
        <div style={{ flex: 1, padding: `${v}px ${Math.round(h * 0.75)}px ${v}px ${h}px` }}>
          {p.summary && (
            <MainSection title="Professional Summary" gap={gap}>
              <p style={{ margin: 0, lineHeight: 1.8, fontSize: 12, color: SLATE_MID }}>
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
                  style={{ marginBottom: 13, paddingBottom: 11, borderBottom: "1px solid #f1f5f9" }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div>
                      <p style={{ margin: 0, fontWeight: 700, fontSize: 12.5, color: SLATE_DARK }}>
                        {e.position}
                      </p>
                      <p style={{ margin: "2px 0 0", fontSize: 11.5, color: CYAN, fontWeight: 600 }}>
                        {e.company}
                      </p>
                    </div>
                    <span
                      style={{
                        fontSize: 10.5,
                        color: "#64748b",
                        background: "#f1f5f9",
                        padding: "2px 7px",
                        borderRadius: 4,
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
                        lineHeight: 1.75,
                        color: SLATE_MID,
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
                  style={{ marginBottom: 10, display: "flex", justifyContent: "space-between" }}
                >
                  <div>
                    <p style={{ margin: 0, fontWeight: 700, fontSize: 12.5 }}>
                      {e.degree}
                      {e.field ? ` in ${e.field}` : ""}
                    </p>
                    <p style={{ margin: "2px 0 0", fontSize: 11.5, color: CYAN, fontWeight: 600 }}>
                      {e.institution}
                    </p>
                    {e.grade && (
                      <p style={{ margin: "1px 0 0", fontSize: 11, color: "#64748b" }}>
                        Grade: {e.grade}
                      </p>
                    )}
                  </div>
                  <span
                    style={{
                      fontSize: 11,
                      color: "#64748b",
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
            </MainSection>
          )}

          {projects.length > 0 && (
            <MainSection title="Projects" gap={gap}>
              {projects.map((pr) => (
                <div
                  key={pr.id}
                  className="resume-item resume-avoid-break"
                  style={{ marginBottom: 10 }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <p style={{ margin: 0, fontWeight: 700, fontSize: 12.5 }}>{pr.name}</p>
                    {pr.technologies && (
                      <span
                        style={{
                          fontSize: 10,
                          background: `${CYAN}15`,
                          color: CYAN,
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
                    <p
                      style={{
                        margin: "3px 0 0",
                        fontSize: 11.5,
                        lineHeight: 1.6,
                        color: SLATE_MID,
                      }}
                    >
                      {pr.description}
                    </p>
                  )}
                  {pr.link && (
                    <p style={{ margin: "2px 0 0", fontSize: 11, color: CYAN }}>{pr.link}</p>
                  )}
                </div>
              ))}
            </MainSection>
          )}
        </div>

        {/* Right sidebar */}
        <div
          style={{
            width: "32%",
            background: SIDE_BG,
            borderLeft: "1px solid #e2e8f0",
            padding: `${v}px ${Math.round(h * 0.55)}px`,
            flexShrink: 0,
          }}
        >
          {skills.length > 0 && (
            <div style={{ marginBottom: gap }}>
              <SideLabel>Skills</SideLabel>
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
                    <span style={{ fontWeight: 600, color: SLATE_DARK }}>{s.name}</span>
                    <span style={{ fontSize: 10, color: "#94a3b8" }}>{levelPct[s.level]}%</span>
                  </div>
                  <div style={{ height: 4, background: "#e2e8f0", borderRadius: 99 }}>
                    <div
                      style={{
                        width: `${levelPct[s.level]}%`,
                        height: "100%",
                        background: CYAN,
                        borderRadius: 99,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {certificates.length > 0 && (
            <div style={{ marginBottom: gap }}>
              <SideLabel>Certifications</SideLabel>
              {certificates.map((c) => (
                <div
                  key={c.id}
                  className="resume-item resume-avoid-break"
                  style={{
                    marginBottom: 9,
                    paddingBottom: 8,
                    borderBottom: "1px solid #e2e8f0",
                  }}
                >
                  <p style={{ margin: 0, fontSize: 11.5, fontWeight: 600, color: SLATE_DARK }}>
                    {c.name}
                  </p>
                  <p style={{ margin: "2px 0 0", fontSize: 10.5, color: "#64748b" }}>
                    {c.issuer}
                    {c.date ? ` · ${fmt(c.date)}` : ""}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Contact in sidebar */}
          {(p.phone || p.email || p.address) && (
            <div>
              <SideLabel>Contact</SideLabel>
              <div style={{ fontSize: 11, color: "#64748b", lineHeight: 2 }}>
                {p.phone   && <div>📞 {p.phone}</div>}
                {p.email   && <div style={{ wordBreak: "break-all" }}>✉ {p.email}</div>}
                {p.address && <div>📍 {p.address}</div>}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

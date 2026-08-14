/**
 * Executive Template — Premium layout with amber/gold accents
 * Best for: Senior government positions, IAS/IPS, Director-level
 */
import type { ResumeCustomization, ResumeData } from "@/types/resume";
import { formatResumeDate, pageMargins, resumeShellStyle, sectionGap } from "@/pages/resume/resumeTemplateUtils";

interface Props { data: ResumeData; customization?: ResumeCustomization; printMode?: boolean; }

const GOLD       = "#92400e";
const GOLD_LIGHT = "#fef3c7";
const DARK       = "#1c1917";

function Section({ title, children, gap }: { title: string; children: React.ReactNode; gap: number }) {
  return (
    <div className="resume-section resume-avoid-break" style={{ marginBottom: gap }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
        <div
          style={{
            width: 22,
            height: 22,
            background: GOLD_LIGHT,
            border: `1px solid ${GOLD}40`,
            borderRadius: 4,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <div style={{ width: 7, height: 7, background: GOLD, borderRadius: 2 }} />
        </div>
        <span
          style={{
            fontSize: 12,
            fontWeight: 800,
            letterSpacing: "0.06em",
            color: GOLD,
            textTransform: "uppercase",
          }}
        >
          {title}
        </span>
        <div style={{ flex: 1, height: 1, background: `${GOLD}30` }} />
      </div>
      {children}
    </div>
  );
}

export function TemplateExecutive({ data, customization, printMode }: Props): JSX.Element {
  const { personal: p, experience, education, skills, projects, certificates } = data;
  const gap = sectionGap(customization, 18);
  const fmt = (d: string) => formatResumeDate(d, customization?.dateFormat);
  const { h, v } = pageMargins(customization);

  const wrapStyle = resumeShellStyle(customization, {
    fontFamily: "'Times New Roman', 'Georgia', serif",
    fontSize: 12.5,
    color: DARK,
    printMode,
    display: "flex",
    flexDirection: "column",
  });

  return (
    <div className="resume-template" style={wrapStyle}>
      {/* Gold top bar */}
      <div
        style={{
          height: 6,
          background: `linear-gradient(to right, ${GOLD}, #d97706, #92400e)`,
          flexShrink: 0,
        }}
      />

      {/* Header */}
      <div
        style={{
          padding: `${Math.round(v * 0.9)}px ${h}px ${Math.round(v * 0.7)}px`,
          borderBottom: `1px solid ${GOLD}20`,
          flexShrink: 0,
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div>
            <h1 style={{ margin: 0, fontSize: 30, fontWeight: 700, color: DARK, letterSpacing: 1 }}>
              {p.fullName || "Your Name"}
            </h1>
            {p.jobTitle && (
              <p
                style={{
                  margin: "4px 0 0",
                  fontSize: 13,
                  color: GOLD,
                  fontWeight: 600,
                  letterSpacing: 0.5,
                }}
              >
                {p.jobTitle}
              </p>
            )}
          </div>
          <div style={{ textAlign: "right", fontSize: 11, color: "#57534e", lineHeight: 1.8 }}>
            {p.email    && <div>{p.email}</div>}
            {p.phone    && <div>{p.phone}</div>}
            {p.address  && <div>{p.address}</div>}
            {p.linkedin && <div style={{ color: GOLD }}>{p.linkedin}</div>}
            {p.website  && <div style={{ color: GOLD }}>{p.website}</div>}
          </div>
        </div>
      </div>

      {/* Body */}
      <div style={{ display: "flex", flex: 1 }}>
        {/* Main content */}
        <div style={{ flex: 1, padding: `${v}px ${Math.round(h * 0.85)}px ${v}px ${h}px` }}>
          {p.summary && (
            <Section title="Executive Profile" gap={gap}>
              <p
                style={{
                  margin: 0,
                  lineHeight: 1.85,
                  fontSize: 12.5,
                  color: "#292524",
                  fontStyle: "italic",
                  borderLeft: `3px solid ${GOLD}`,
                  paddingLeft: 12,
                }}
              >
                "{p.summary}"
              </p>
            </Section>
          )}

          {experience.length > 0 && (
            <Section title="Professional Experience" gap={gap}>
              {experience.map((e) => (
                <div
                  key={e.id}
                  className="resume-item resume-avoid-break"
                  style={{
                    marginBottom: 15,
                    paddingBottom: 13,
                    borderBottom: `1px dashed ${GOLD}25`,
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div>
                      <p style={{ margin: 0, fontWeight: 700, fontSize: 13, color: DARK }}>
                        {e.position}
                      </p>
                      <p style={{ margin: "3px 0 0", fontSize: 12, color: GOLD, fontWeight: 600 }}>
                        {e.company}
                      </p>
                    </div>
                    <div
                      style={{
                        textAlign: "right",
                        fontSize: 11,
                        color: "#78716c",
                        background: GOLD_LIGHT,
                        padding: "2px 9px",
                        borderRadius: 4,
                        flexShrink: 0,
                        marginLeft: 12,
                      }}
                    >
                      {fmt(e.startDate)} — {e.current ? "Present" : fmt(e.endDate)}
                    </div>
                  </div>
                  {e.description && (
                    <p
                      style={{
                        margin: "7px 0 0",
                        fontSize: 12,
                        lineHeight: 1.75,
                        color: "#44403c",
                        whiteSpace: "pre-line",
                      }}
                    >
                      {e.description}
                    </p>
                  )}
                </div>
              ))}
            </Section>
          )}

          {education.length > 0 && (
            <Section title="Academic Credentials" gap={gap}>
              {education.map((e) => (
                <div
                  key={e.id}
                  className="resume-item resume-avoid-break"
                  style={{ marginBottom: 11, display: "flex", justifyContent: "space-between" }}
                >
                  <div>
                    <p style={{ margin: 0, fontWeight: 700, fontSize: 12.5 }}>
                      {e.degree}
                      {e.field ? `, ${e.field}` : ""}
                    </p>
                    <p style={{ margin: "2px 0 0", fontSize: 12, color: GOLD }}>{e.institution}</p>
                    {e.grade && (
                      <p style={{ margin: "1px 0 0", fontSize: 11, color: "#78716c" }}>
                        Result: {e.grade}
                      </p>
                    )}
                  </div>
                  <span
                    style={{
                      fontSize: 11,
                      color: "#78716c",
                      whiteSpace: "nowrap",
                      marginLeft: 12,
                      flexShrink: 0,
                    }}
                  >
                    {fmt(e.startDate)}
                    {e.endDate ? ` — ${fmt(e.endDate)}` : ""}
                  </span>
                </div>
              ))}
            </Section>
          )}
        </div>

        {/* Right sidebar */}
        <div
          style={{
            width: "32%",
            borderLeft: `1px solid ${GOLD}20`,
            padding: `${v}px ${Math.round(h * 0.65)}px`,
            background: "#fafaf9",
            flexShrink: 0,
          }}
        >
          {skills.length > 0 && (
            <div style={{ marginBottom: gap }}>
              <p
                style={{
                  margin: "0 0 10px",
                  fontSize: 10.5,
                  fontWeight: 800,
                  letterSpacing: "0.1em",
                  color: GOLD,
                  textTransform: "uppercase",
                }}
              >
                Core Competencies
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                {skills.map((s) => (
                  <div
                    key={s.id}
                    className="resume-item resume-avoid-break"
                    style={{ display: "flex", alignItems: "center", gap: 8 }}
                  >
                    <div
                      style={{
                        width: 5,
                        height: 5,
                        borderRadius: 1,
                        background: GOLD,
                        flexShrink: 0,
                      }}
                    />
                    <span style={{ fontSize: 11.5, color: "#292524" }}>{s.name}</span>
                    <span style={{ fontSize: 10, color: "#a8a29e", marginLeft: "auto" }}>
                      {s.level}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {certificates.length > 0 && (
            <div style={{ marginBottom: gap }}>
              <p
                style={{
                  margin: "0 0 10px",
                  fontSize: 10.5,
                  fontWeight: 800,
                  letterSpacing: "0.1em",
                  color: GOLD,
                  textTransform: "uppercase",
                }}
              >
                Certifications
              </p>
              {certificates.map((c) => (
                <div
                  key={c.id}
                  className="resume-item resume-avoid-break"
                  style={{ marginBottom: 8, paddingLeft: 8, borderLeft: `2px solid ${GOLD}` }}
                >
                  <p style={{ margin: 0, fontSize: 11.5, fontWeight: 600, color: DARK }}>
                    {c.name}
                  </p>
                  <p style={{ margin: "1px 0 0", fontSize: 10.5, color: "#78716c" }}>
                    {c.issuer}
                    {c.date ? ` · ${fmt(c.date)}` : ""}
                  </p>
                </div>
              ))}
            </div>
          )}

          {projects.length > 0 && (
            <div>
              <p
                style={{
                  margin: "0 0 10px",
                  fontSize: 10.5,
                  fontWeight: 800,
                  letterSpacing: "0.1em",
                  color: GOLD,
                  textTransform: "uppercase",
                }}
              >
                Key Projects
              </p>
              {projects.map((pr) => (
                <div
                  key={pr.id}
                  className="resume-item resume-avoid-break"
                  style={{ marginBottom: 10, paddingLeft: 8, borderLeft: `2px solid ${GOLD}` }}
                >
                  <p style={{ margin: 0, fontSize: 11.5, fontWeight: 700, color: DARK }}>
                    {pr.name}
                  </p>
                  {pr.technologies && (
                    <p style={{ margin: "1px 0 0", fontSize: 10.5, color: GOLD }}>
                      {pr.technologies}
                    </p>
                  )}
                  {pr.description && (
                    <p style={{ margin: "3px 0 0", fontSize: 11, lineHeight: 1.6, color: "#57534e" }}>
                      {pr.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Gold bottom bar */}
      <div
        style={{
          height: 4,
          background: `linear-gradient(to right, ${GOLD}40, ${GOLD}, ${GOLD}40)`,
          flexShrink: 0,
        }}
      />
    </div>
  );
}

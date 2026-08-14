/**
 * Minimal Template — Clean single-column, teal accents
 * Best for: Any job — universally accepted ATS-friendly layout
 */
import type { ResumeCustomization, ResumeData } from "@/types/resume";
import { formatResumeDate, pageMargins, resumeShellStyle, sectionGap } from "@/pages/resume/resumeTemplateUtils";

interface Props { data: ResumeData; customization?: ResumeCustomization; printMode?: boolean; }

const DEFAULT_A = "#0f766e";

function Section({
  title,
  children,
  accent,
  gap,
}: {
  title: string;
  children: React.ReactNode;
  accent: string;
  gap: number;
}) {
  return (
    <div className="resume-section resume-avoid-break" style={{ marginBottom: gap }}>
      <div
        style={{
          marginBottom: 9,
          paddingBottom: 4,
          borderBottom: `2px solid ${accent}`,
        }}
      >
        <span
          style={{
            fontSize: 11.5,
            fontWeight: 800,
            letterSpacing: "0.1em",
            color: accent,
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

export function TemplateMinimal({ data, customization, printMode }: Props): JSX.Element {
  const { personal: p, experience, education, skills, projects, certificates } = data;
  const accent = customization?.accentColor || DEFAULT_A;
  const gap = sectionGap(customization, 18);
  const fmt = (d: string) => formatResumeDate(d, customization?.dateFormat);
  const { h, v } = pageMargins(customization);

  const wrapStyle = {
    ...resumeShellStyle(customization, {
      fontFamily: "'Helvetica Neue', Arial, sans-serif",
      fontSize: 12.5,
      color: "#1e293b",
      printMode,
      padded: true,
    }),
    // Override padding to use scaled margins
    padding: `${v}px ${h}px`,
  };

  return (
    <div className="resume-template" style={wrapStyle}>
      {/* Header */}
      <div style={{ marginBottom: gap, textAlign: "center" }}>
        <h1
          style={{
            margin: 0,
            fontSize: 28,
            fontWeight: 300,
            letterSpacing: 4,
            color: "#0f172a",
          }}
        >
          {p.fullName || "YOUR NAME"}
        </h1>
        {p.jobTitle && (
          <p
            style={{
              margin: "6px 0 0",
              fontSize: 12.5,
              color: accent,
              fontWeight: 600,
              letterSpacing: 1,
            }}
          >
            {p.jobTitle.toUpperCase()}
          </p>
        )}
        <div
          style={{
            marginTop: 9,
            display: "flex",
            justifyContent: "center",
            flexWrap: "wrap",
            gap: "3px 14px",
            fontSize: 11,
            color: "#475569",
          }}
        >
          {p.email && <span>{p.email}</span>}
          {p.email && p.phone && <span style={{ color: "#cbd5e1" }}>|</span>}
          {p.phone && <span>{p.phone}</span>}
          {p.phone && p.address && <span style={{ color: "#cbd5e1" }}>|</span>}
          {p.address && <span>{p.address}</span>}
          {p.address && p.linkedin && <span style={{ color: "#cbd5e1" }}>|</span>}
          {p.linkedin && <span style={{ color: accent }}>{p.linkedin}</span>}
          {p.linkedin && p.website && <span style={{ color: "#cbd5e1" }}>|</span>}
          {p.website && <span style={{ color: accent }}>{p.website}</span>}
        </div>
        <div
          style={{
            width: 50,
            height: 2,
            background: accent,
            margin: "12px auto 0",
            borderRadius: 99,
          }}
        />
      </div>

      {p.summary && (
        <Section title="Summary" accent={accent} gap={gap}>
          <p style={{ margin: 0, lineHeight: 1.8, fontSize: 12, color: "#334155" }}>
            {p.summary}
          </p>
        </Section>
      )}

      {experience.length > 0 && (
        <Section title="Experience" accent={accent} gap={gap}>
          {experience.map((e) => (
            <div
              key={e.id}
              className="resume-item resume-avoid-break"
              style={{ marginBottom: 13 }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <p style={{ margin: 0, fontWeight: 700, fontSize: 12.5 }}>{e.position}</p>
                <span style={{ fontSize: 11, color: "#64748b", flexShrink: 0, marginLeft: 8 }}>
                  {fmt(e.startDate)} – {e.current ? "Present" : fmt(e.endDate)}
                </span>
              </div>
              <p style={{ margin: "2px 0 5px", fontSize: 11.5, color: accent, fontWeight: 600 }}>
                {e.company}
              </p>
              {e.description && (
                <p
                  style={{
                    margin: 0,
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
        </Section>
      )}

      {education.length > 0 && (
        <Section title="Education" accent={accent} gap={gap}>
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
                <p style={{ margin: "2px 0 0", fontSize: 11.5, color: accent, fontWeight: 600 }}>
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
                  textAlign: "right",
                  flexShrink: 0,
                  marginLeft: 16,
                }}
              >
                {fmt(e.startDate)}
                {e.endDate ? ` – ${fmt(e.endDate)}` : ""}
              </span>
            </div>
          ))}
        </Section>
      )}

      {skills.length > 0 && (
        <Section title="Skills" accent={accent} gap={gap}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {skills.map((s) => (
              <span
                key={s.id}
                style={{
                  padding: "3px 10px",
                  background: `${accent}12`,
                  border: `1px solid ${accent}30`,
                  borderRadius: 99,
                  fontSize: 11,
                  color: accent,
                  fontWeight: 600,
                }}
              >
                {s.name}
              </span>
            ))}
          </div>
        </Section>
      )}

      {projects.length > 0 && (
        <Section title="Projects" accent={accent} gap={gap}>
          {projects.map((pr) => (
            <div
              key={pr.id}
              className="resume-item resume-avoid-break"
              style={{ marginBottom: 10 }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <p style={{ margin: 0, fontWeight: 700, fontSize: 12.5 }}>{pr.name}</p>
                {pr.technologies && (
                  <span style={{ fontSize: 11, color: "#64748b" }}>{pr.technologies}</span>
                )}
              </div>
              {pr.description && (
                <p style={{ margin: "3px 0 0", fontSize: 11.5, lineHeight: 1.6, color: "#475569" }}>
                  {pr.description}
                </p>
              )}
              {pr.link && (
                <p style={{ margin: "2px 0 0", fontSize: 11, color: accent }}>{pr.link}</p>
              )}
            </div>
          ))}
        </Section>
      )}

      {certificates.length > 0 && (
        <Section title="Certifications" accent={accent} gap={gap}>
          <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
            {certificates.map((c) => (
              <div
                key={c.id}
                className="resume-item resume-avoid-break"
                style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}
              >
                <span style={{ fontSize: 12, fontWeight: 600 }}>{c.name}</span>
                <span style={{ fontSize: 11, color: "#64748b" }}>
                  {c.issuer}
                  {c.date ? ` · ${fmt(c.date)}` : ""}
                </span>
              </div>
            ))}
          </div>
        </Section>
      )}
    </div>
  );
}

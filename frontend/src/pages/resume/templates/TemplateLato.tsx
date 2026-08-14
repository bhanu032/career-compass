/**
 * Lato Template — inspired by the "John Doe" classic two-column layout.
 * Clean header with name, contact, bio | left section labels + right content.
 */
import type { ResumeCustomization, ResumeData } from "@/types/resume";
import {
  formatResumeDate,
  pageMargins,
  resumeShellStyle,
  sectionGap,
} from "@/pages/resume/resumeTemplateUtils";
import { getSectionOrder } from "@/pages/resume/useSectionOrder";

interface Props {
  data: ResumeData;
  customization?: ResumeCustomization;
  printMode?: boolean;
}

const DEFAULT_ACCENT = "#54AFE4";

export function TemplateLato({ data, customization, printMode }: Props): JSX.Element {
  const { personal: p, experience, education, skills, projects, certificates } = data;
  const accent = customization?.accentColor || DEFAULT_ACCENT;
  const gap = sectionGap(customization, 20);
  const fmt = (d: string) => formatResumeDate(d, customization?.dateFormat);
  const { h, v } = pageMargins(customization);
  const sectionOrder = getSectionOrder(customization);

  const shell = resumeShellStyle(customization, {
    fontFamily: "'Helvetica Neue', Arial, sans-serif",
    fontSize: 13,
    color: "#222",
    printMode,
    padded: false,
  });

  const skillDots = (level: string) => {
    const filled = level === "Expert" ? 5 : level === "Advanced" ? 4 : level === "Intermediate" ? 3 : level === "Beginner" ? 2 : 1;
    return (
      <div style={{ display: "flex", gap: 4 }}>
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            style={{
              width: 14,
              height: 14,
              borderRadius: "50%",
              background: i <= filled ? "#79A9CE" : "#C3DEF3",
            }}
          />
        ))}
      </div>
    );
  };

  const sectionTitle = (title: string) => (
    <div
      style={{
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: "0.12em",
        color: accent,
        textTransform: "uppercase",
        marginBottom: 10,
      }}
    >
      {title}
    </div>
  );

  const rowItem = (
    left: React.ReactNode,
    right: React.ReactNode,
    key: string
  ) => (
    <div
      key={key}
      className="resume-item resume-avoid-break"
      style={{
        display: "flex",
        gap: 16,
        marginBottom: 16,
        lineHeight: 1.5,
      }}
    >
      <div style={{ width: "38%", flexShrink: 0, fontSize: 12 }}>{left}</div>
      <div style={{ flex: 1, fontSize: 12 }}>{right}</div>
    </div>
  );

  return (
    <div className="resume-template" style={{ ...shell, padding: `${v}px ${h}px` }}>
      {/* Header */}
      <div style={{ marginBottom: 18 }}>
        <div style={{ marginBottom: 6 }}>
          <span style={{ fontSize: 36, fontWeight: 700, letterSpacing: 1 }}>
            {(p.fullName || "Your Name").split(" ")[0]}
          </span>
          <span style={{ fontSize: 36, fontWeight: 300, letterSpacing: 1, marginLeft: 8 }}>
            {(p.fullName || "Your Name").split(" ").slice(1).join(" ")}
          </span>
        </div>

        {/* Contact row */}
        <div style={{ marginBottom: 14, fontSize: 13, color: "#555", lineHeight: 1.8 }}>
          {p.email && (
            <span>
              <span style={{ color: "#999", fontWeight: 300 }}>Email: </span>
              {p.email}
            </span>
          )}
          {p.email && p.phone && (
            <span
              style={{
                display: "inline-block",
                borderLeft: "2px solid #999",
                height: 10,
                margin: "0 10px",
                verticalAlign: "middle",
              }}
            />
          )}
          {p.phone && (
            <span>
              <span style={{ color: "#999", fontWeight: 300 }}>Phone: </span>
              {p.phone}
            </span>
          )}
          {p.address && (
            <>
              <span
                style={{
                  display: "inline-block",
                  borderLeft: "2px solid #999",
                  height: 10,
                  margin: "0 10px",
                  verticalAlign: "middle",
                }}
              />
              {p.address}
            </>
          )}
        </div>

        {/* About */}
        {(p.jobTitle || p.summary) && (
          <div style={{ fontSize: 13 }}>
            {p.jobTitle && (
              <span style={{ fontWeight: 700, textDecoration: "underline", marginRight: 8 }}>
                {p.jobTitle}
              </span>
            )}
            {p.summary && <span style={{ color: "#444" }}>{p.summary}</span>}
          </div>
        )}
      </div>

      {/* Details */}
      <div style={{ lineHeight: "20px" }}>
        {sectionOrder.map((key) => {
          if (key === "experience" && experience.length > 0) return (
            <div key="experience" className="resume-section" style={{ marginBottom: gap }}>
              {sectionTitle("Experience")}
              {experience.map((e) =>
                rowItem(
                  <>
                    <div style={{ fontWeight: 700 }}>{e.company}</div>
                    <div style={{ color: "#64748b", fontSize: 11 }}>{p.address}</div>
                    <div style={{ color: "#64748b", fontSize: 11 }}>
                      {fmt(e.startDate)} – {e.current ? "Present" : fmt(e.endDate)}
                    </div>
                  </>,
                  <>
                    <div style={{ fontWeight: 700 }}>{e.position}</div>
                    {e.description && <div style={{ color: "#555", marginTop: 4, whiteSpace: "pre-line", fontSize: 12 }}>{e.description}</div>}
                  </>,
                  e.id
                )
              )}
            </div>
          );
          if (key === "education" && education.length > 0) return (
            <div key="education" className="resume-section" style={{ marginBottom: gap }}>
              {sectionTitle("Education")}
              {education.map((e) =>
                rowItem(
                  <>
                    <div style={{ fontWeight: 700 }}>{e.institution}</div>
                    {e.grade && <div style={{ color: "#64748b", fontSize: 11 }}>{e.grade}</div>}
                    <div style={{ color: "#64748b", fontSize: 11 }}>
                      {fmt(e.startDate)}{e.endDate ? ` – ${fmt(e.endDate)}` : ""}
                    </div>
                  </>,
                  <><div style={{ fontWeight: 700 }}>{e.degree}{e.field ? ` in ${e.field}` : ""}</div></>,
                  e.id
                )
              )}
            </div>
          );
          if (key === "projects" && projects.length > 0) return (
            <div key="projects" className="resume-section" style={{ marginBottom: gap }}>
              {sectionTitle("Projects")}
              {projects.map((pr) => (
                <div key={pr.id} className="resume-item resume-avoid-break" style={{ marginBottom: 14 }}>
                  <div style={{ fontWeight: 700 }}>{pr.name}</div>
                  {pr.technologies && <div style={{ fontSize: 11, color: "#64748b", fontStyle: "italic" }}>{pr.technologies}</div>}
                  {pr.description && <div style={{ color: "#555", marginTop: 3, fontSize: 12 }}>{pr.description}</div>}
                  {pr.link && <div style={{ fontSize: 11, color: accent, marginTop: 2, fontStyle: "italic" }}>{pr.link}</div>}
                </div>
              ))}
            </div>
          );
          if (key === "skills" && skills.length > 0) return (
            <div key="skills" className="resume-section" style={{ marginBottom: gap }}>
              {sectionTitle("Skills")}
              {skills.map((s) => (
                <div key={s.id} className="resume-item" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                  <div style={{ fontWeight: 600, fontSize: 12.5 }}>{s.name}</div>
                  {customization?.showSkillLevels !== false && skillDots(s.level)}
                </div>
              ))}
            </div>
          );
          if (key === "certificates" && certificates.length > 0) return (
            <div key="certificates" className="resume-section" style={{ marginBottom: 0 }}>
              {sectionTitle("Certifications")}
              {certificates.map((c) => (
                <div key={c.id} className="resume-item resume-avoid-break" style={{ marginBottom: 8, fontSize: 12 }}>
                  <span style={{ fontWeight: 600 }}>{c.name}</span>
                  {c.issuer && <span style={{ color: "#64748b", marginLeft: 10 }}>{c.issuer}{c.date ? ` · ${fmt(c.date)}` : ""}</span>}
                </div>
              ))}
            </div>
          );
          if (key === "summary") return null; // summary shown inline in header
          return null;
        })}
      </div>
    </div>
  );
}

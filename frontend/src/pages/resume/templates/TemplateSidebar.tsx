/**
 * Sidebar Template — inspired by the "Kyle Shanks" design.
 * Coloured top bar with name + dark left sidebar + clean right content area.
 */
import type { ResumeCustomization, ResumeData } from "@/types/resume";
import {
  formatResumeDate,
  pageMargins,
  resumeShellStyle,
  sectionGap,
} from "@/pages/resume/resumeTemplateUtils";

interface Props {
  data: ResumeData;
  customization?: ResumeCustomization;
  printMode?: boolean;
}

const DEFAULT_ACCENT = "#5695cd";

export function TemplateSidebar({ data, customization, printMode }: Props): JSX.Element {
  const { personal: p, experience, education, skills, projects, certificates } = data;
  const accent = customization?.accentColor || DEFAULT_ACCENT;
  const sidebarBg = "#2d2d2d";
  const gap = sectionGap(customization, 16);  // was 24
  const fmt = (d: string) => formatResumeDate(d, customization?.dateFormat);
  const { h, v } = pageMargins(customization);

  const shell = resumeShellStyle(customization, {
    fontFamily: "'Helvetica Neue', Arial, sans-serif",
    fontSize: 12.5,
    color: "#222",
    printMode,
    padded: false,
    display: "flex",
    flexDirection: "column",
  });

  const sideHeader = (title: string) => (
    <div
      style={{
        fontSize: 10,
        fontWeight: 700,
        letterSpacing: "0.18em",
        color: "#bbb",
        textTransform: "uppercase",
        margin: `${gap * 0.7}px 0 8px`,
        paddingBottom: 4,
        borderBottom: "1px solid #444",
      }}
    >
      {title}
    </div>
  );

  const mainSection = (title: string, children: React.ReactNode) => (
    <div className="resume-section" style={{ marginBottom: gap }}>
      <div
        style={{
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: "0.18em",
          color: "#888",
          textTransform: "uppercase",
          marginBottom: 12,
          paddingBottom: 4,
          borderBottom: `1px solid #e2e8f0`,
        }}
      >
        {title}
      </div>
      {children}
    </div>
  );

  const skillLevelWidth = (level: string) =>
    level === "Expert" ? "95%" : level === "Advanced" ? "78%" : level === "Intermediate" ? "58%" : "35%";

  return (
    <div className="resume-template" style={shell}>
      {/* Top bar */}
      <div
        style={{
          background: sidebarBg,
          color: "#fff",
          padding: `${v}px ${h * 2}px ${v * 0.6}px`,
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div>
          <div
            style={{
              fontSize: 30,
              fontWeight: 100,
              letterSpacing: 6,
              textTransform: "uppercase",
              lineHeight: 1.1,
            }}
          >
            {p.fullName || "Your Name"}
          </div>
          {p.jobTitle && (
            <div style={{ fontSize: 12, color: "#aaa", letterSpacing: 2, marginTop: 4, textTransform: "uppercase" }}>
              {p.jobTitle}
            </div>
          )}
        </div>
        <div
          style={{
            width: 4,
            height: 48,
            background: accent,
            borderRadius: 2,
            flexShrink: 0,
          }}
        />
      </div>

      {/* Body: sidebar + content */}
      <div style={{ display: "flex", flex: 1 }}>
        {/* Sidebar */}
        <div
          style={{
            width: "30%",
            background: sidebarBg,
            color: "#ccc",
            padding: `${v}px ${Math.round(h * 0.6)}px`,
            flexShrink: 0,
            fontSize: 11.5,
            lineHeight: 1.7,
          }}
        >
          {/* Contact */}
          {(p.email || p.phone || p.address || p.linkedin || p.website) && (
            <>
              {p.email && <div style={{ marginBottom: 4, wordBreak: "break-all" }}>{p.email}</div>}
              {p.phone && <div style={{ marginBottom: 4 }}>{p.phone}</div>}
              {p.address && <div style={{ marginBottom: 4 }}>{p.address}</div>}
              {p.linkedin && <div style={{ marginBottom: 4, color: accent }}>{p.linkedin}</div>}
              {p.website && <div style={{ marginBottom: 4, color: accent }}>{p.website}</div>}
            </>
          )}

          {/* Skills */}
          {skills.length > 0 && (
            <>
              {sideHeader("Skills")}
              {skills.map((s) => (
                <div key={s.id} style={{ marginBottom: 8 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3, fontSize: 11 }}>
                    <span style={{ color: "#ddd" }}>{s.name}</span>
                  </div>
                  <div style={{ height: 3, background: "#444", borderRadius: 99 }}>
                    <div
                      style={{
                        width: skillLevelWidth(s.level),
                        height: "100%",
                        background: accent,
                        borderRadius: 99,
                      }}
                    />
                  </div>
                </div>
              ))}
            </>
          )}

          {/* Certifications */}
          {certificates.length > 0 && (
            <>
              {sideHeader("Certifications")}
              {certificates.map((c) => (
                <div key={c.id} style={{ marginBottom: 8, fontSize: 11 }}>
                  <div style={{ color: "#ddd", fontWeight: 600 }}>{c.name}</div>
                  {c.issuer && (
                    <div style={{ color: "#999", fontSize: 10.5 }}>
                      {c.issuer}{c.date ? ` · ${fmt(c.date)}` : ""}
                    </div>
                  )}
                </div>
              ))}
            </>
          )}
        </div>

        {/* Main content */}
        <div
          style={{
            flex: 1,
            padding: `${v}px ${h}px`,
            background: "#fff",
          }}
        >
          {/* Summary */}
          {p.summary && (
            mainSection("Profile", (
              <p style={{ margin: 0, color: "#444", lineHeight: 1.75, fontSize: 12 }}>{p.summary}</p>
            ))
          )}

          {/* Experience */}
          {experience.length > 0 &&
            mainSection("Experience", experience.map((e) => (
              <div key={e.id} className="resume-item resume-avoid-break" style={{ marginBottom: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 13 }}>{e.position}</div>
                    <div style={{ fontSize: 11.5, color: accent, fontWeight: 600 }}>{e.company}</div>
                  </div>
                  <div style={{ fontSize: 11, color: "#888", flexShrink: 0, marginLeft: 8 }}>
                    {fmt(e.startDate)} – {e.current ? "Present" : fmt(e.endDate)}
                  </div>
                </div>
                {e.description && (
                  <div style={{ marginTop: 6, fontSize: 11.5, color: "#444", whiteSpace: "pre-line", lineHeight: 1.65 }}>
                    {e.description}
                  </div>
                )}
              </div>
            )))}

          {/* Education */}
          {education.length > 0 &&
            mainSection("Education", education.map((e) => (
              <div key={e.id} className="resume-item resume-avoid-break" style={{ marginBottom: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 12.5 }}>
                      {e.degree}{e.field ? ` in ${e.field}` : ""}
                    </div>
                    <div style={{ fontSize: 11.5, color: accent }}>{e.institution}</div>
                  </div>
                  <div style={{ fontSize: 11, color: "#888", flexShrink: 0, marginLeft: 8 }}>
                    {fmt(e.startDate)}{e.endDate ? ` – ${fmt(e.endDate)}` : ""}
                  </div>
                </div>
                {e.grade && (
                  <div style={{ fontSize: 11, color: "#666", marginTop: 2 }}>Grade: {e.grade}</div>
                )}
              </div>
            )))}

          {/* Projects */}
          {projects.length > 0 &&
            mainSection("Projects", projects.map((pr) => (
              <div key={pr.id} className="resume-item resume-avoid-break" style={{ marginBottom: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <div style={{ fontWeight: 700, fontSize: 12.5 }}>{pr.name}</div>
                  {pr.technologies && (
                    <div style={{ fontSize: 10.5, color: "#888", fontStyle: "italic" }}>{pr.technologies}</div>
                  )}
                </div>
                {pr.description && (
                  <div style={{ fontSize: 11.5, color: "#444", marginTop: 3, lineHeight: 1.6 }}>{pr.description}</div>
                )}
                {pr.link && (
                  <div style={{ fontSize: 11, color: accent, marginTop: 2, fontStyle: "italic" }}>{pr.link}</div>
                )}
              </div>
            )))}
        </div>
      </div>
    </div>
  );
}

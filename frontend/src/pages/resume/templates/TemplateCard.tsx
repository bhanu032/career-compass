/**
 * Card Template — inspired by the "Chih-Hsiang Chen" profile-card design.
 * Left panel: profile info, contact, skills with progress bars.
 * Right panel: education timeline, experience, projects, certifications.
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

const DEFAULT_ACCENT = "#4682bf";

export function TemplateCard({ data, customization, printMode }: Props): JSX.Element {
  const { personal: p, experience, education, skills, projects, certificates } = data;
  const accent = customization?.accentColor || DEFAULT_ACCENT;
  const gap = sectionGap(customization, 14);
  const fmt = (d: string) => formatResumeDate(d, customization?.dateFormat);
  const { h, v } = pageMargins(customization);
  const sectionOrder = getSectionOrder(customization);

  const shell = resumeShellStyle(customization, {
    fontFamily: "'Helvetica Neue', Arial, sans-serif",
    fontSize: 12,
    color: "#545454",
    printMode,
    padded: false,
    display: "flex",
    flexDirection: "row",
  });

  const skillWidth = (level: string) =>
    level === "Expert" ? "95%" : level === "Advanced" ? "78%" : level === "Intermediate" ? "58%" : "35%";

  const introSection = (title: string, children: React.ReactNode) => (
    <div style={{ padding: `${gap * 0.6}px 0`, borderTop: `1px solid #e0e0e0` }}>
      <div
        style={{
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: "#333",
          marginBottom: 8,
        }}
      >
        {title}
      </div>
      {children}
    </div>
  );

  const detailSection = (icon: string, title: string, children: React.ReactNode) => (
    <div className="resume-section" style={{ marginBottom: gap }}>
      <div style={{ display: "flex", alignItems: "center", marginBottom: 12 }}>
        <div
          style={{
            display: "inline-flex",
            justifyContent: "center",
            alignItems: "center",
            width: 28,
            height: 28,
            background: accent,
            borderRadius: "50%",
            marginRight: 10,
            flexShrink: 0,
            fontSize: 13,
          }}
        >
          {icon}
        </div>
        <span style={{ fontSize: 15, fontWeight: 600, letterSpacing: "0.04em", color: "#333" }}>{title}</span>
      </div>
      <div style={{ paddingLeft: 8 }}>{children}</div>
    </div>
  );

  return (
    <div className="resume-template" style={{ ...shell, minHeight: printMode ? "297mm" : undefined }}>
      {/* Left panel */}
      <div
        style={{
          width: "34%",
          flexShrink: 0,
          background: "#f4f6f9",
          boxShadow: "2px 0 8px rgba(0,0,0,0.06)",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Profile header */}
        <div
          style={{
            background: accent,
            color: "#fff",
            padding: `${v * 1.2}px ${h * 0.7}px ${v * 0.8}px`,
            textAlign: "center",
          }}
        >
          {/* Avatar initials circle */}
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.25)",
              margin: "0 auto 10px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 24,
              fontWeight: 700,
              color: "#fff",
              letterSpacing: 1,
              border: "2px solid rgba(255,255,255,0.5)",
            }}
          >
            {(p.fullName || "Y N")
              .split(" ")
              .map((n) => n[0])
              .join("")
              .slice(0, 2)
              .toUpperCase()}
          </div>
          <div style={{ fontSize: 17, fontWeight: 700, lineHeight: 1.2 }}>
            {p.fullName || "Your Name"}
          </div>
          {p.jobTitle && (
            <div style={{ fontSize: 11, marginTop: 4, opacity: 0.85, letterSpacing: 0.5 }}>
              {p.jobTitle}
            </div>
          )}
        </div>

        {/* Left content */}
        <div style={{ padding: `${v * 0.6}px ${h * 0.7}px`, flex: 1 }}>
          {/* About */}
          {p.summary && (
            introSection("About Me", (
              <p style={{ margin: 0, fontSize: 11, lineHeight: 1.65, textAlign: "justify", color: "#555" }}>
                {p.summary}
              </p>
            ))
          )}

          {/* Contact */}
          {(p.email || p.phone || p.address || p.linkedin || p.website) && (
            introSection("Contact", (
              <div style={{ fontSize: 11, lineHeight: 1.8, color: "#555" }}>
                {p.phone && <div>{p.phone}</div>}
                {p.address && <div>{p.address}</div>}
                {p.email && <div style={{ wordBreak: "break-all" }}>{p.email}</div>}
                {p.linkedin && (
                  <div style={{ color: accent, marginTop: 2 }}>{p.linkedin}</div>
                )}
                {p.website && (
                  <div style={{ color: accent }}>{p.website}</div>
                )}
              </div>
            ))
          )}

          {/* Skills */}
          {skills.length > 0 && (
            introSection("Skills", (
              <div>
                {skills.map((s) => (
                  <div key={s.id} style={{ marginBottom: 9 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3, fontSize: 11 }}>
                      <span style={{ fontWeight: 600, color: "#444" }}>{s.name}</span>
                      {customization?.showSkillLevels !== false && (
                        <span style={{ color: "#888", fontSize: 10 }}>{s.level}</span>
                      )}
                    </div>
                    <div style={{ height: 4, background: "#dde3e9", borderRadius: 99 }}>
                      <div
                        style={{
                          width: skillWidth(s.level),
                          height: "100%",
                          background: accent,
                          borderRadius: 99,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ))
          )}

          {/* Certificates */}
          {certificates.length > 0 && (
            introSection("Certifications", (
              <div>
                {certificates.map((c) => (
                  <div key={c.id} style={{ marginBottom: 8, fontSize: 11 }}>
                    <div style={{ fontWeight: 600, color: "#444" }}>{c.name}</div>
                    <div style={{ color: "#888", fontSize: 10.5 }}>
                      {c.issuer}{c.date ? ` · ${fmt(c.date)}` : ""}
                    </div>
                  </div>
                ))}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Right panel — sections in user-defined order */}
      <div style={{ flex: 1, padding: `${v}px ${h}px`, background: "#fff" }}>
        {sectionOrder.map((key) => {
          if (key === "education" && education.length > 0) return (
            detailSection("🎓", "Education", education.map((e) => (
              <div key={e.id} className="resume-item resume-avoid-break" style={{ position: "relative", paddingLeft: 20, marginBottom: 14 }}>
                <div style={{ position: "absolute", left: -1, top: 4, width: 10, height: 10, borderRadius: "50%", border: "2.5px solid #1e293b", background: "#fff" }} />
                <div style={{ position: "absolute", left: 3.5, top: 16, width: 2, height: "calc(100% - 4px)", background: "#1e293b" }} />
                <div style={{ fontWeight: 700, fontSize: 12.5 }}>{e.degree}{e.field ? ` in ${e.field}` : ""}</div>
                <div style={{ fontSize: 11.5, color: "#555" }}>{e.institution}</div>
                <div style={{ fontSize: 11, color: "#888" }}>{fmt(e.startDate)}{e.endDate ? ` – ${fmt(e.endDate)}` : ""}{e.grade ? ` · ${e.grade}` : ""}</div>
              </div>
            )))
          );
          if (key === "experience" && experience.length > 0) return (
            detailSection("💼", "Experience", experience.map((e) => (
              <div key={e.id} className="resume-item resume-avoid-break" style={{ marginBottom: 14 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 12.5 }}>{e.position}</div>
                    <div style={{ fontSize: 11.5, color: accent, fontWeight: 600 }}>{e.company}</div>
                  </div>
                  <div style={{ fontSize: 10.5, color: "#888", flexShrink: 0, marginLeft: 8 }}>
                    {fmt(e.startDate)} – {e.current ? "Present" : fmt(e.endDate)}
                  </div>
                </div>
                {e.description && <div style={{ fontSize: 11.5, color: "#555", marginTop: 5, whiteSpace: "pre-line", lineHeight: 1.6 }}>{e.description}</div>}
              </div>
            )))
          );
          if (key === "projects" && projects.length > 0) return (
            detailSection("🚀", "Projects", projects.map((pr) => (
              <div key={pr.id} className="resume-item resume-avoid-break" style={{ marginBottom: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <div style={{ fontWeight: 700, fontSize: 12.5 }}>{pr.name}</div>
                  {pr.technologies && <div style={{ fontSize: 10.5, color: "#888", fontStyle: "italic" }}>{pr.technologies}</div>}
                </div>
                {pr.description && <div style={{ fontSize: 11.5, color: "#555", marginTop: 3, lineHeight: 1.6 }}>{pr.description}</div>}
                {pr.link && <div style={{ fontSize: 11, color: accent, marginTop: 2, fontStyle: "italic" }}>{pr.link}</div>}
              </div>
            )))
          );
          // summary, skills, certificates are in the left panel — skip in right
          return null;
        })}
      </div>
    </div>
  );
}

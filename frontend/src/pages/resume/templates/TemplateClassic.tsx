import type { ResumeCustomization, ResumeData } from "@/types/resume";
import {
  formatResumeDate,
  lightAccent,
  resumeShellStyle,
  sectionGap,
} from "@/pages/resume/resumeTemplateUtils";

interface Props {
  data: ResumeData;
  customization?: ResumeCustomization;
  printMode?: boolean;
}

const DEFAULT_ACCENT = "#1e3a5f";

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
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
        <span style={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.06em", color: accent, textTransform: "uppercase" }}>
          {title}
        </span>
        <div style={{ flex: 1, height: 1.5, background: accent, opacity: 0.25 }} />
      </div>
      {children}
    </div>
  );
}

export function TemplateClassic({ data, customization, printMode }: Props): JSX.Element {
  const { personal: p, experience, education, skills, projects, certificates } = data;
  const levelBar: Record<string, number> = { Beginner: 25, Intermediate: 50, Advanced: 75, Expert: 100 };
  const accent = customization?.accentColor || DEFAULT_ACCENT;
  const gap = sectionGap(customization, 18);
  const fmt = (date: string) => formatResumeDate(date, customization?.dateFormat);
  const showLevels = customization?.showSkillLevels !== false;

  const wrapStyle = resumeShellStyle(customization, {
    fontFamily: "Georgia, serif",
    fontSize: 13,
    color: "#1a1a2e",
    printMode,
  });

  const skillBlock =
    customization?.skillStyle === "comma" ? (
      <p style={{ margin: 0, fontSize: 12 }}>{skills.map((s) => s.name).join(", ")}</p>
    ) : customization?.skillStyle === "chips" ? (
      <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
        {skills.map((s) => (
          <span key={s.id} style={{ padding: "2px 8px", background: lightAccent(accent), borderRadius: 99, color: accent, fontSize: 11, fontWeight: 600 }}>
            {s.name}{showLevels ? ` - ${s.level}` : ""}
          </span>
        ))}
      </div>
    ) : (
      skills.map((s) => (
        <div key={s.id} style={{ marginBottom: 8 }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 3 }}>
            <span style={{ fontWeight: 600 }}>{s.name}</span>
            {showLevels && <span style={{ color: "#64748b", fontSize: 11 }}>{s.level}</span>}
          </div>
          <div style={{ height: 4, background: "#dde3ef", borderRadius: 99 }}>
            <div style={{ width: `${levelBar[s.level]}%`, height: "100%", background: accent, borderRadius: 99 }} />
          </div>
        </div>
      ))
    );

  return (
    <div className="resume-template" style={wrapStyle}>
      <div style={{ background: accent, color: "#fff", padding: "32px 40px 24px" }}>
        <h1 style={{ margin: 0, fontSize: 28, fontWeight: 700, letterSpacing: 1 }}>
          {p.fullName || "Your Name"}
        </h1>
        {p.jobTitle && <p style={{ margin: "4px 0 0", fontSize: 14, opacity: 0.82, fontStyle: "italic" }}>{p.jobTitle}</p>}
        <div style={{ marginTop: 12, display: "flex", flexWrap: "wrap", gap: "6px 20px", fontSize: 12, opacity: 0.92 }}>
          {p.email && <span>{p.email}</span>}
          {p.phone && <span>{p.phone}</span>}
          {p.address && <span>{p.address}</span>}
          {p.linkedin && <span>{p.linkedin}</span>}
          {p.website && <span>{p.website}</span>}
        </div>
      </div>

      <div style={{ display: "flex" }}>
        <div style={{ width: "35%", background: "#f4f6fb", padding: "24px 20px", flexShrink: 0 }}>
          {skills.length > 0 && <Section title="Skills" accent={accent} gap={gap}>{skillBlock}</Section>}

          {certificates.length > 0 && (
            <Section title="Certifications" accent={accent} gap={gap}>
              {certificates.map((c) => (
                <div key={c.id} className="resume-item resume-avoid-break" style={{ marginBottom: 8 }}>
                  <p style={{ margin: 0, fontSize: 12, fontWeight: 600 }}>{c.name}</p>
                  <p style={{ margin: "2px 0 0", fontSize: 11, color: "#64748b" }}>
                    {c.issuer}{c.date ? ` - ${fmt(c.date)}` : ""}
                  </p>
                </div>
              ))}
            </Section>
          )}
        </div>

        <div style={{ flex: 1, padding: "24px 28px" }}>
          {p.summary && (
            <Section title="Profile Summary" accent={accent} gap={gap}>
              <p style={{ margin: 0, fontSize: 13, color: "#334155" }}>{p.summary}</p>
            </Section>
          )}

          {experience.length > 0 && (
            <Section title="Work Experience" accent={accent} gap={gap}>
              {experience.map((e) => (
                <div key={e.id} className="resume-item resume-avoid-break" style={{ marginBottom: 14 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div>
                      <p style={{ margin: 0, fontWeight: 700, fontSize: 13 }}>{e.position}</p>
                      <p style={{ margin: "2px 0 0", fontSize: 12, color: accent, fontStyle: "italic" }}>{e.company}</p>
                    </div>
                    <span style={{ fontSize: 11, color: "#64748b", whiteSpace: "nowrap", marginLeft: 8 }}>
                      {fmt(e.startDate)} - {e.current ? "Present" : fmt(e.endDate)}
                    </span>
                  </div>
                  {e.description && <p style={{ margin: "6px 0 0", fontSize: 12, color: "#334155", whiteSpace: "pre-line" }}>{e.description}</p>}
                </div>
              ))}
            </Section>
          )}

          {education.length > 0 && (
            <Section title="Education" accent={accent} gap={gap}>
              {education.map((e) => (
                <div key={e.id} className="resume-item resume-avoid-break" style={{ marginBottom: 10 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div>
                      <p style={{ margin: 0, fontWeight: 700, fontSize: 13 }}>{e.degree}{e.field ? ` in ${e.field}` : ""}</p>
                      <p style={{ margin: "2px 0 0", fontSize: 12, color: accent, fontStyle: "italic" }}>{e.institution}</p>
                    </div>
                    <div style={{ textAlign: "right", flexShrink: 0, marginLeft: 8 }}>
                      <span style={{ fontSize: 11, color: "#64748b" }}>{fmt(e.startDate)}{e.endDate ? ` - ${fmt(e.endDate)}` : ""}</span>
                      {e.grade && <p style={{ margin: "2px 0 0", fontSize: 11, color: "#64748b" }}>{e.grade}</p>}
                    </div>
                  </div>
                </div>
              ))}
            </Section>
          )}

          {projects.length > 0 && (
            <Section title="Projects" accent={accent} gap={gap}>
              {projects.map((pr) => (
                <div key={pr.id} className="resume-item resume-avoid-break" style={{ marginBottom: 10 }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <p style={{ margin: 0, fontWeight: 700, fontSize: 13 }}>{pr.name}</p>
                    {pr.technologies && <span style={{ fontSize: 11, color: accent, fontStyle: "italic" }}>{pr.technologies}</span>}
                  </div>
                  {pr.description && <p style={{ margin: "4px 0 0", fontSize: 12, color: "#334155" }}>{pr.description}</p>}
                  {pr.link && <p style={{ margin: "2px 0 0", fontSize: 11, color: accent }}>{pr.link}</p>}
                </div>
              ))}
            </Section>
          )}
        </div>
      </div>
    </div>
  );
}

import type { ReactNode } from "react";
import type { ResumeCustomization, ResumeData, TemplateId } from "@/types/resume";
import { formatResumeDate, lightAccent, resumeShellStyle, sectionGap } from "@/pages/resume/resumeTemplateUtils";

interface Props {
  data: ResumeData;
  templateId: Extract<TemplateId, "ats" | "consulting" | "academic" | "portfolio" | "custom">;
  customization?: ResumeCustomization;
  printMode?: boolean;
}

const VARIANTS = {
  ats: {
    accent: "#2563eb",
    title: "Professional Summary",
    sectionStyle: "rule",
    sidebar: false,
  },
  consulting: {
    accent: "#0f172a",
    title: "Profile",
    sectionStyle: "leftRule",
    sidebar: false,
  },
  academic: {
    accent: "#475569",
    title: "Research Profile",
    sectionStyle: "serif",
    sidebar: false,
  },
  portfolio: {
    accent: "#db2777",
    title: "About",
    sectionStyle: "badge",
    sidebar: true,
  },
  custom: {
    accent: "#7c3aed",
    title: "Professional Summary",
    sectionStyle: "badge",
    sidebar: true,
  },
} as const;

function Section({
  title,
  accent,
  style,
  gap,
  children,
}: {
  title: string;
  accent: string;
  style: string;
  gap: number;
  children: ReactNode;
}) {
  const heading =
    style === "badge" ? (
      <div style={{ marginBottom: 9 }}>
        <span style={{ display: "inline-block", background: lightAccent(accent), color: accent, border: `1px solid ${accent}25`, borderRadius: 4, padding: "3px 9px", fontSize: 11, fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase" }}>
          {title}
        </span>
      </div>
    ) : style === "leftRule" ? (
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 9 }}>
        <div style={{ width: 4, height: 18, background: accent }} />
        <span style={{ color: "#0f172a", fontSize: 12, fontWeight: 800, letterSpacing: "0.07em", textTransform: "uppercase" }}>{title}</span>
      </div>
    ) : (
      <div style={{ borderBottom: `1.5px solid ${accent}`, marginBottom: 9, paddingBottom: 4 }}>
        <span style={{ color: accent, fontSize: 12, fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase" }}>{title}</span>
      </div>
    );

  return (
    <section className="resume-section resume-avoid-break" style={{ marginBottom: gap }}>
      {heading}
      {children}
    </section>
  );
}

function TextBlock({ text }: { text: string }) {
  return <p style={{ margin: 0, color: "#334155", fontSize: 12, whiteSpace: "pre-line" }}>{text}</p>;
}

export function TemplateProfessional({ data, templateId, customization, printMode }: Props): JSX.Element {
  const variant = VARIANTS[templateId];
  const accent = templateId === "custom" ? customization?.accentColor || variant.accent : variant.accent;
  const gap = sectionGap(customization, templateId === "ats" ? 14 : 18);
  const fmt = (date: string) => formatResumeDate(date, customization?.dateFormat);
  const { personal: p, experience, education, skills, projects, certificates } = data;

  const wrap = {
    ...resumeShellStyle(customization, {
      fontFamily: templateId === "academic" ? "Georgia, 'Times New Roman', serif" : "Inter, Arial, sans-serif",
      fontSize: templateId === "ats" ? 11.8 : 12.4,
      color: "#0f172a",
      printMode,
      padded: true,
    }),
    padding: `${templateId === "ats" ? 30 : 34}px ${templateId === "ats" ? 38 : 42}px`,
  };

  const skillsNode = skills.length ? (
    customization?.skillStyle === "comma" || templateId === "ats" ? (
      <p style={{ margin: 0, fontSize: 11.5, color: "#334155" }}>{skills.map((skill) => skill.name).join(", ")}</p>
    ) : (
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
        {skills.map((skill) => (
          <span key={skill.id} style={{ color: accent, background: lightAccent(accent), borderRadius: 99, padding: "3px 9px", fontSize: 11, fontWeight: 650 }}>
            {skill.name}{customization?.showSkillLevels ? ` - ${skill.level}` : ""}
          </span>
        ))}
      </div>
    )
  ) : null;

  return (
    <div className="resume-template" style={wrap}>
      <header style={{ borderBottom: `3px solid ${accent}`, paddingBottom: 14, marginBottom: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 20, alignItems: "flex-start" }}>
          <div>
            <h1 style={{ margin: 0, fontSize: templateId === "academic" ? 27 : 29, letterSpacing: 0, fontWeight: templateId === "academic" ? 700 : 850, color: "#0f172a" }}>
              {p.fullName || "Your Name"}
            </h1>
            {p.jobTitle && <p style={{ margin: "4px 0 0", color: accent, fontSize: 13, fontWeight: 700 }}>{p.jobTitle}</p>}
          </div>
          <div style={{ textAlign: "right", color: "#475569", fontSize: 10.8, lineHeight: 1.7 }}>
            {p.email && <div>{p.email}</div>}
            {p.phone && <div>{p.phone}</div>}
            {p.address && <div>{p.address}</div>}
            {p.linkedin && <div style={{ color: accent }}>{p.linkedin}</div>}
            {p.website && <div style={{ color: accent }}>{p.website}</div>}
          </div>
        </div>
      </header>

      <main style={{ display: variant.sidebar ? "grid" : "block", gridTemplateColumns: variant.sidebar ? "1fr 210px" : undefined, gap: variant.sidebar ? 26 : undefined }}>
        <div>
          {p.summary && (
            <Section title={variant.title} accent={accent} style={variant.sectionStyle} gap={gap}>
              <TextBlock text={p.summary} />
            </Section>
          )}

          {experience.length > 0 && (
            <Section title="Experience" accent={accent} style={variant.sectionStyle} gap={gap}>
              {experience.map((item) => (
                <div key={item.id} className="resume-item resume-avoid-break" style={{ marginBottom: 12 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                    <div>
                      <p style={{ margin: 0, fontSize: 12.5, fontWeight: 800 }}>{item.position}</p>
                      <p style={{ margin: "2px 0 0", color: accent, fontSize: 11.5, fontWeight: 650 }}>{item.company}</p>
                    </div>
                    <span style={{ color: "#64748b", fontSize: 10.5, whiteSpace: "nowrap" }}>{fmt(item.startDate)}{item.endDate ? ` - ${fmt(item.endDate)}` : item.current ? " - Present" : ""}</span>
                  </div>
                  {item.description && <p style={{ margin: "5px 0 0", color: "#334155", fontSize: 11.5, whiteSpace: "pre-line" }}>{item.description}</p>}
                </div>
              ))}
            </Section>
          )}

          {projects.length > 0 && (
            <Section title={templateId === "portfolio" || templateId === "custom" ? "Selected Projects" : "Projects"} accent={accent} style={variant.sectionStyle} gap={gap}>
              {projects.map((item) => (
                <div key={item.id} className="resume-item resume-avoid-break" style={{ marginBottom: 10 }}>
                  <p style={{ margin: 0, fontSize: 12.5, fontWeight: 800 }}>{item.name}</p>
                  {item.technologies && <p style={{ margin: "1px 0 0", color: accent, fontSize: 10.8, fontWeight: 650 }}>{item.technologies}</p>}
                  {item.description && <p style={{ margin: "4px 0 0", color: "#334155", fontSize: 11.3 }}>{item.description}</p>}
                  {item.link && <p style={{ margin: "2px 0 0", color: accent, fontSize: 10.8 }}>{item.link}</p>}
                </div>
              ))}
            </Section>
          )}
        </div>

        <aside>
          {skillsNode && (
            <Section title="Skills" accent={accent} style={variant.sectionStyle} gap={gap}>
              {skillsNode}
            </Section>
          )}

          {education.length > 0 && (
            <Section title="Education" accent={accent} style={variant.sectionStyle} gap={gap}>
              {education.map((item) => (
                <div key={item.id} className="resume-item resume-avoid-break" style={{ marginBottom: 10 }}>
                  <p style={{ margin: 0, fontSize: 12, fontWeight: 800 }}>{item.degree}{item.field ? ` in ${item.field}` : ""}</p>
                  <p style={{ margin: "2px 0 0", color: accent, fontSize: 11.2, fontWeight: 650 }}>{item.institution}</p>
                  <p style={{ margin: "2px 0 0", color: "#64748b", fontSize: 10.5 }}>{fmt(item.startDate)}{item.endDate ? ` - ${fmt(item.endDate)}` : ""}{item.grade ? ` - ${item.grade}` : ""}</p>
                </div>
              ))}
            </Section>
          )}

          {certificates.length > 0 && (
            <Section title="Certifications" accent={accent} style={variant.sectionStyle} gap={gap}>
              {certificates.map((item) => (
                <div key={item.id} className="resume-item resume-avoid-break" style={{ marginBottom: 8 }}>
                  <p style={{ margin: 0, fontSize: 11.5, fontWeight: 750 }}>{item.name}</p>
                  <p style={{ margin: "1px 0 0", color: "#64748b", fontSize: 10.5 }}>{item.issuer}{item.date ? ` - ${fmt(item.date)}` : ""}</p>
                </div>
              ))}
            </Section>
          )}
        </aside>
      </main>
    </div>
  );
}

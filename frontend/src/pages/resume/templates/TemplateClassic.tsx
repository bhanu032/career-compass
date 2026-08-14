import type { ResumeCustomization, ResumeData } from "@/types/resume";
import {
  formatResumeDate,
  lightAccent,
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
        <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.06em", color: accent, textTransform: "uppercase" }}>
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
  const gap = sectionGap(customization, 12);
  const fmt = (date: string) => formatResumeDate(date, customization?.dateFormat);
  const showLevels = customization?.showSkillLevels !== false;
  const { h, v } = pageMargins(customization);
  const sectionOrder = getSectionOrder(customization);

  const skillBlock =
    customization?.skillStyle === "comma" ? (
      <p style={{ margin: 0, fontSize: 11.5 }}>{skills.map((s) => s.name).join(", ")}</p>
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
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11.5, marginBottom: 3 }}>
            <span style={{ fontWeight: 600 }}>{s.name}</span>
            {showLevels && <span style={{ color: "#64748b", fontSize: 10.5 }}>{s.level}</span>}
          </div>
          <div style={{ height: 4, background: "#dde3ef", borderRadius: 99 }}>
            <div style={{ width: `${levelBar[s.level]}%`, height: "100%", background: accent, borderRadius: 99 }} />
          </div>
        </div>
      ))
    );

  // Classic: skills & certs live in the sidebar; other sections go in main column in user order
  const mainSectionMap: Partial<Record<string, JSX.Element | null>> = {
    summary: p.summary ? (
      <Section key="summary" title="Profile Summary" accent={accent} gap={gap}>
        <p style={{ margin: 0, fontSize: 12, color: "#334155", lineHeight: 1.75 }}>{p.summary}</p>
      </Section>
    ) : null,
    experience: experience.length > 0 ? (
      <Section key="experience" title="Work Experience" accent={accent} gap={gap}>
        {experience.map((e) => (
          <div key={e.id} className="resume-item resume-avoid-break" style={{ marginBottom: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <p style={{ margin: 0, fontWeight: 700, fontSize: 12.5 }}>{e.position}</p>
                <p style={{ margin: "2px 0 0", fontSize: 11.5, color: accent, fontStyle: "italic" }}>{e.company}</p>
              </div>
              <span style={{ fontSize: 11, color: "#64748b", whiteSpace: "nowrap", marginLeft: 8, flexShrink: 0 }}>
                {fmt(e.startDate)} – {e.current ? "Present" : fmt(e.endDate)}
              </span>
            </div>
            {e.description && (
              <p style={{ margin: "5px 0 0", fontSize: 11.5, color: "#334155", whiteSpace: "pre-line", lineHeight: 1.7 }}>
                {e.description}
              </p>
            )}
          </div>
        ))}
      </Section>
    ) : null,
    education: education.length > 0 ? (
      <Section key="education" title="Education" accent={accent} gap={gap}>
        {education.map((e) => (
          <div key={e.id} className="resume-item resume-avoid-break" style={{ marginBottom: 10 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <p style={{ margin: 0, fontWeight: 700, fontSize: 12.5 }}>{e.degree}{e.field ? ` in ${e.field}` : ""}</p>
                <p style={{ margin: "2px 0 0", fontSize: 11.5, color: accent, fontStyle: "italic" }}>{e.institution}</p>
              </div>
              <div style={{ textAlign: "right", flexShrink: 0, marginLeft: 8 }}>
                <span style={{ fontSize: 11, color: "#64748b" }}>{fmt(e.startDate)}{e.endDate ? ` – ${fmt(e.endDate)}` : ""}</span>
                {e.grade && <p style={{ margin: "2px 0 0", fontSize: 11, color: "#64748b" }}>{e.grade}</p>}
              </div>
            </div>
          </div>
        ))}
      </Section>
    ) : null,
    projects: projects.length > 0 ? (
      <Section key="projects" title="Projects" accent={accent} gap={gap}>
        {projects.map((pr) => (
          <div key={pr.id} className="resume-item resume-avoid-break" style={{ marginBottom: 10 }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <p style={{ margin: 0, fontWeight: 700, fontSize: 12.5 }}>{pr.name}</p>
              {pr.technologies && <span style={{ fontSize: 11, color: accent, fontStyle: "italic" }}>{pr.technologies}</span>}
            </div>
            {pr.description && <p style={{ margin: "4px 0 0", fontSize: 11.5, color: "#334155" }}>{pr.description}</p>}
            {pr.link && <p style={{ margin: "2px 0 0", fontSize: 11, color: accent }}>{pr.link}</p>}
          </div>
        ))}
      </Section>
    ) : null,
    skills: null,       // rendered in sidebar
    certificates: null, // rendered in sidebar
  };

  const wrapStyle = resumeShellStyle(customization, {
    fontFamily: "Georgia, serif",
    fontSize: 12.5,
    color: "#1a1a2e",
    printMode,
    display: "flex",
    flexDirection: "column",
  });

  return (
    <div className="resume-template" style={wrapStyle}>
      {/* Full-bleed header — always pinned */}
      <div style={{ background: accent, color: "#fff", padding: `${v}px ${h}px ${Math.round(v * 0.75)}px`, flexShrink: 0 }}>
        <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700, letterSpacing: 1 }}>{p.fullName || "Your Name"}</h1>
        {p.jobTitle && <p style={{ margin: "4px 0 0", fontSize: 13, opacity: 0.85, fontStyle: "italic" }}>{p.jobTitle}</p>}
        <div style={{ marginTop: 10, display: "flex", flexWrap: "wrap", gap: "4px 18px", fontSize: 11.5, opacity: 0.92 }}>
          {p.email && <span>{p.email}</span>}
          {p.phone && <span>{p.phone}</span>}
          {p.address && <span>{p.address}</span>}
          {p.linkedin && <span>{p.linkedin}</span>}
          {p.website && <span>{p.website}</span>}
        </div>
      </div>

      {/* Two-column body */}
      <div style={{ display: "flex", flex: 1 }}>
        {/* Sidebar — skills & certs always here */}
        <div style={{ width: "35%", background: "#f4f6fb", padding: `${v}px ${Math.round(h * 0.55)}px`, flexShrink: 0 }}>
          {skills.length > 0 && (
            <Section title="Skills" accent={accent} gap={gap}>{skillBlock}</Section>
          )}
          {certificates.length > 0 && (
            <Section title="Certifications" accent={accent} gap={gap}>
              {certificates.map((c) => (
                <div key={c.id} className="resume-item resume-avoid-break" style={{ marginBottom: 8 }}>
                  <p style={{ margin: 0, fontSize: 11.5, fontWeight: 600 }}>{c.name}</p>
                  <p style={{ margin: "2px 0 0", fontSize: 11, color: "#64748b" }}>{c.issuer}{c.date ? ` - ${fmt(c.date)}` : ""}</p>
                </div>
              ))}
            </Section>
          )}
        </div>

        {/* Main — respects sectionOrder */}
        <div style={{ flex: 1, padding: `${v}px ${h}px ${v}px ${Math.round(h * 0.75)}px` }}>
          {sectionOrder.map((key) => mainSectionMap[key] ?? null)}
        </div>
      </div>
    </div>
  );
}

/**
 * Professional Template — handles ATS, Consulting, Academic, Portfolio, Custom variants
 */
import type { ReactNode } from "react";
import type { ResumeCustomization, ResumeData, TemplateId } from "@/types/resume";
import {
  formatResumeDate,
  lightAccent,
  pageMargins,
  resumeShellStyle,
  sectionGap,
} from "@/pages/resume/resumeTemplateUtils";

interface Props {
  data: ResumeData;
  templateId: Extract<TemplateId, "ats" | "consulting" | "academic" | "portfolio" | "custom">;
  customization?: ResumeCustomization;
  printMode?: boolean;
}

const VARIANTS = {
  ats: {
    accent: "#2563eb",
    summaryTitle: "Professional Summary",
    sectionStyle: "rule" as const,
    sidebar: false,
  },
  consulting: {
    accent: "#0f172a",
    summaryTitle: "Profile",
    sectionStyle: "leftRule" as const,
    sidebar: false,
  },
  academic: {
    accent: "#475569",
    summaryTitle: "Research Profile",
    sectionStyle: "serif" as const,
    sidebar: false,
  },
  portfolio: {
    accent: "#db2777",
    summaryTitle: "About",
    sectionStyle: "badge" as const,
    sidebar: true,
  },
  custom: {
    accent: "#7c3aed",
    summaryTitle: "Professional Summary",
    sectionStyle: "badge" as const,
    sidebar: true,
  },
} as const;

type SectionStyle = "rule" | "leftRule" | "serif" | "badge";

function SectionHeading({
  title,
  accent,
  style,
}: {
  title: string;
  accent: string;
  style: SectionStyle;
}) {
  if (style === "badge") {
    return (
      <div style={{ marginBottom: 9 }}>
        <span
          style={{
            display: "inline-block",
            background: lightAccent(accent),
            color: accent,
            border: `1px solid ${accent}25`,
            borderRadius: 4,
            padding: "3px 9px",
            fontSize: 11,
            fontWeight: 800,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}
        >
          {title}
        </span>
      </div>
    );
  }
  if (style === "leftRule") {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 9 }}>
        <div style={{ width: 4, height: 18, background: accent, flexShrink: 0 }} />
        <span
          style={{
            color: "#0f172a",
            fontSize: 12,
            fontWeight: 800,
            letterSpacing: "0.07em",
            textTransform: "uppercase",
          }}
        >
          {title}
        </span>
      </div>
    );
  }
  // "rule" and "serif"
  return (
    <div
      style={{
        borderBottom: `1.5px solid ${accent}`,
        marginBottom: 9,
        paddingBottom: 4,
      }}
    >
      <span
        style={{
          color: accent,
          fontSize: 12,
          fontWeight: 800,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
        }}
      >
        {title}
      </span>
    </div>
  );
}

function Section({
  title,
  accent,
  style,
  gap,
  children,
}: {
  title: string;
  accent: string;
  style: SectionStyle;
  gap: number;
  children: ReactNode;
}) {
  return (
    <section
      className="resume-section resume-avoid-break"
      style={{ marginBottom: gap }}
    >
      <SectionHeading title={title} accent={accent} style={style} />
      {children}
    </section>
  );
}

export function TemplateProfessional({
  data,
  templateId,
  customization,
  printMode,
}: Props): JSX.Element {
  const variant = VARIANTS[templateId];
  const accent =
    templateId === "custom"
      ? customization?.accentColor || variant.accent
      : variant.accent;
  const gap = sectionGap(customization, templateId === "ats" ? 14 : 18);
  const fmt = (date: string) => formatResumeDate(date, customization?.dateFormat);
  const { h, v } = pageMargins(customization);
  const { personal: p, experience, education, skills, projects, certificates } = data;

  const isAts = templateId === "ats";
  const isAcademic = templateId === "academic";

  const wrap = {
    ...resumeShellStyle(customization, {
      fontFamily: isAcademic
        ? "Georgia, 'Times New Roman', serif"
        : "Inter, Arial, sans-serif",
      fontSize: isAts ? 11.8 : 12.4,
      color: "#0f172a",
      printMode,
      padded: true,
    }),
    padding: `${v}px ${h}px`,
  };

  const skillsNode =
    skills.length > 0 ? (
      customization?.skillStyle === "comma" || isAts ? (
        <p style={{ margin: 0, fontSize: 11.5, color: "#334155" }}>
          {skills.map((s) => s.name).join(", ")}
        </p>
      ) : (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {skills.map((s) => (
            <span
              key={s.id}
              style={{
                color: accent,
                background: lightAccent(accent),
                borderRadius: 99,
                padding: "3px 9px",
                fontSize: 11,
                fontWeight: 600,
              }}
            >
              {s.name}
              {customization?.showSkillLevels ? ` - ${s.level}` : ""}
            </span>
          ))}
        </div>
      )
    ) : null;

  // Sidebar content (portfolio / custom)
  const sideContent = (
    <>
      {skillsNode && (
        <Section
          title="Skills"
          accent={accent}
          style={variant.sectionStyle}
          gap={gap}
        >
          {skillsNode}
        </Section>
      )}

      {education.length > 0 && (
        <Section
          title="Education"
          accent={accent}
          style={variant.sectionStyle}
          gap={gap}
        >
          {education.map((item) => (
            <div
              key={item.id}
              className="resume-item resume-avoid-break"
              style={{ marginBottom: 10 }}
            >
              <p style={{ margin: 0, fontSize: 12, fontWeight: 800 }}>
                {item.degree}
                {item.field ? ` in ${item.field}` : ""}
              </p>
              <p
                style={{
                  margin: "2px 0 0",
                  color: accent,
                  fontSize: 11.5,
                  fontWeight: 600,
                }}
              >
                {item.institution}
              </p>
              <p style={{ margin: "2px 0 0", color: "#64748b", fontSize: 10.5 }}>
                {fmt(item.startDate)}
                {item.endDate ? ` - ${fmt(item.endDate)}` : ""}
                {item.grade ? ` · ${item.grade}` : ""}
              </p>
            </div>
          ))}
        </Section>
      )}

      {certificates.length > 0 && (
        <Section
          title="Certifications"
          accent={accent}
          style={variant.sectionStyle}
          gap={gap}
        >
          {certificates.map((item) => (
            <div
              key={item.id}
              className="resume-item resume-avoid-break"
              style={{ marginBottom: 8 }}
            >
              <p style={{ margin: 0, fontSize: 11.5, fontWeight: 700 }}>{item.name}</p>
              <p style={{ margin: "1px 0 0", color: "#64748b", fontSize: 10.5 }}>
                {item.issuer}
                {item.date ? ` · ${fmt(item.date)}` : ""}
              </p>
            </div>
          ))}
        </Section>
      )}
    </>
  );

  // Main body content
  const mainContent = (
    <>
      {p.summary && (
        <Section
          title={variant.summaryTitle}
          accent={accent}
          style={variant.sectionStyle}
          gap={gap}
        >
          <p
            style={{
              margin: 0,
              color: "#334155",
              fontSize: isAts ? 11.8 : 12,
              lineHeight: 1.75,
              whiteSpace: "pre-line",
            }}
          >
            {p.summary}
          </p>
        </Section>
      )}

      {experience.length > 0 && (
        <Section
          title="Experience"
          accent={accent}
          style={variant.sectionStyle}
          gap={gap}
        >
          {experience.map((item) => (
            <div
              key={item.id}
              className="resume-item resume-avoid-break"
              style={{ marginBottom: 12 }}
            >
              <div
                style={{ display: "flex", justifyContent: "space-between", gap: 12 }}
              >
                <div>
                  <p style={{ margin: 0, fontSize: 12.5, fontWeight: 800 }}>
                    {item.position}
                  </p>
                  <p
                    style={{
                      margin: "2px 0 0",
                      color: accent,
                      fontSize: 11.5,
                      fontWeight: 600,
                    }}
                  >
                    {item.company}
                  </p>
                </div>
                <span
                  style={{
                    color: "#64748b",
                    fontSize: 10.5,
                    whiteSpace: "nowrap",
                    flexShrink: 0,
                  }}
                >
                  {fmt(item.startDate)}
                  {item.current
                    ? " - Present"
                    : item.endDate
                    ? ` - ${fmt(item.endDate)}`
                    : ""}
                </span>
              </div>
              {item.description && (
                <p
                  style={{
                    margin: "5px 0 0",
                    color: "#334155",
                    fontSize: 11.5,
                    whiteSpace: "pre-line",
                    lineHeight: 1.7,
                  }}
                >
                  {item.description}
                </p>
              )}
            </div>
          ))}
        </Section>
      )}

      {projects.length > 0 && (
        <Section
          title={
            templateId === "portfolio" || templateId === "custom"
              ? "Selected Projects"
              : "Projects"
          }
          accent={accent}
          style={variant.sectionStyle}
          gap={gap}
        >
          {projects.map((item) => (
            <div
              key={item.id}
              className="resume-item resume-avoid-break"
              style={{ marginBottom: 10 }}
            >
              <p style={{ margin: 0, fontSize: 12.5, fontWeight: 800 }}>{item.name}</p>
              {item.technologies && (
                <p
                  style={{
                    margin: "1px 0 0",
                    color: accent,
                    fontSize: 11,
                    fontWeight: 600,
                  }}
                >
                  {item.technologies}
                </p>
              )}
              {item.description && (
                <p
                  style={{
                    margin: "4px 0 0",
                    color: "#334155",
                    fontSize: 11.5,
                    lineHeight: 1.65,
                  }}
                >
                  {item.description}
                </p>
              )}
              {item.link && (
                <p style={{ margin: "2px 0 0", color: accent, fontSize: 11 }}>
                  {item.link}
                </p>
              )}
            </div>
          ))}
        </Section>
      )}

      {/* Non-sidebar: education, skills, certs go inline */}
      {!variant.sidebar && (
        <>
          {education.length > 0 && (
            <Section
              title="Education"
              accent={accent}
              style={variant.sectionStyle}
              gap={gap}
            >
              {education.map((item) => (
                <div
                  key={item.id}
                  className="resume-item resume-avoid-break"
                  style={{
                    marginBottom: 10,
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 12,
                  }}
                >
                  <div>
                    <p style={{ margin: 0, fontSize: 12.5, fontWeight: 800 }}>
                      {item.degree}
                      {item.field ? ` in ${item.field}` : ""}
                    </p>
                    <p
                      style={{
                        margin: "2px 0 0",
                        color: accent,
                        fontSize: 11.5,
                        fontWeight: 600,
                      }}
                    >
                      {item.institution}
                    </p>
                    {item.grade && (
                      <p style={{ margin: "1px 0 0", color: "#64748b", fontSize: 10.5 }}>
                        {item.grade}
                      </p>
                    )}
                  </div>
                  <span
                    style={{
                      color: "#64748b",
                      fontSize: 10.5,
                      whiteSpace: "nowrap",
                      flexShrink: 0,
                    }}
                  >
                    {fmt(item.startDate)}
                    {item.endDate ? ` - ${fmt(item.endDate)}` : ""}
                  </span>
                </div>
              ))}
            </Section>
          )}

          {skillsNode && (
            <Section
              title="Skills"
              accent={accent}
              style={variant.sectionStyle}
              gap={gap}
            >
              {skillsNode}
            </Section>
          )}

          {certificates.length > 0 && (
            <Section
              title="Certifications"
              accent={accent}
              style={variant.sectionStyle}
              gap={gap}
            >
              {certificates.map((item) => (
                <div
                  key={item.id}
                  className="resume-item resume-avoid-break"
                  style={{ marginBottom: 8 }}
                >
                  <p style={{ margin: 0, fontSize: 11.5, fontWeight: 700 }}>{item.name}</p>
                  <p style={{ margin: "1px 0 0", color: "#64748b", fontSize: 10.5 }}>
                    {item.issuer}
                    {item.date ? ` · ${fmt(item.date)}` : ""}
                  </p>
                </div>
              ))}
            </Section>
          )}
        </>
      )}
    </>
  );

  return (
    <div className="resume-template" style={wrap}>
      {/* Header */}
      <header
        style={{
          borderBottom: `3px solid ${accent}`,
          paddingBottom: 14,
          marginBottom: 20,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: 20,
            alignItems: "flex-start",
          }}
        >
          <div>
            <h1
              style={{
                margin: 0,
                fontSize: isAcademic ? 26 : 28,
                letterSpacing: 0,
                fontWeight: isAcademic ? 700 : 800,
                color: "#0f172a",
              }}
            >
              {p.fullName || "Your Name"}
            </h1>
            {p.jobTitle && (
              <p
                style={{
                  margin: "4px 0 0",
                  color: accent,
                  fontSize: 13,
                  fontWeight: 700,
                }}
              >
                {p.jobTitle}
              </p>
            )}
          </div>
          <div
            style={{
              textAlign: "right",
              color: "#475569",
              fontSize: 10.8,
              lineHeight: 1.75,
              flexShrink: 0,
            }}
          >
            {p.email    && <div>{p.email}</div>}
            {p.phone    && <div>{p.phone}</div>}
            {p.address  && <div>{p.address}</div>}
            {p.linkedin && <div style={{ color: accent }}>{p.linkedin}</div>}
            {p.website  && <div style={{ color: accent }}>{p.website}</div>}
          </div>
        </div>
      </header>

      {/* Body — grid when sidebar, single column otherwise */}
      {variant.sidebar ? (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 200px",
            gap: 24,
            alignItems: "start",
          }}
        >
          <div>{mainContent}</div>
          <div>{sideContent}</div>
        </div>
      ) : (
        <div>{mainContent}</div>
      )}
    </div>
  );
}

/**
 * Timeline Template — Dot-and-line timeline for experience & education
 * Best for: Experienced professionals, UPSC mains, chronological careers
 */
import type { ResumeData } from "@/types/resume";

interface Props { data: ResumeData; printMode?: boolean; }

const GREEN  = "#059669";
const GREEN2 = "#d1fae5";
const DARK   = "#064e3b";
const GRAY   = "#374151";

function fmtDate(d: string): string {
  if (!d) return "";
  const parts = d.split("-");
  if (parts.length < 2) return d;
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  return `${months[parseInt(parts[1], 10) - 1] ?? ""} ${parts[0]}`;
}

function SectionHeading({ children }: { children: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
      <div style={{ width: 28, height: 28, borderRadius: "50%", background: GREEN, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#fff" }} />
      </div>
      <span style={{ fontSize: 12.5, fontWeight: 800, letterSpacing: "0.07em", color: DARK, textTransform: "uppercase" }}>
        {children}
      </span>
      <div style={{ flex: 1, height: 1.5, background: `${GREEN}30` }} />
    </div>
  );
}

function TimelineItem({
  title, subtitle, dateStr, description, isLast,
}: {
  title: string; subtitle: string; dateStr: string;
  description?: string; isLast: boolean;
}) {
  return (
    <div style={{ display: "flex", gap: 0, marginBottom: isLast ? 0 : 14 }}>
      {/* Timeline rail */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 28, flexShrink: 0 }}>
        <div style={{ width: 10, height: 10, borderRadius: "50%", background: GREEN, border: "2px solid #fff", boxShadow: `0 0 0 2px ${GREEN}`, flexShrink: 0, marginTop: 3 }} />
        {!isLast && <div style={{ width: 2, flex: 1, background: `${GREEN}30`, marginTop: 4 }} />}
      </div>
      {/* Content */}
      <div style={{ flex: 1, paddingLeft: 10, paddingBottom: isLast ? 0 : 4 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <p style={{ margin: 0, fontWeight: 700, fontSize: 13, color: DARK }}>{title}</p>
            <p style={{ margin: "2px 0 0", fontSize: 12, color: GREEN, fontWeight: 600 }}>{subtitle}</p>
          </div>
          {dateStr && (
            <span style={{ fontSize: 10.5, color: "#fff", background: GREEN, padding: "2px 8px", borderRadius: 3, whiteSpace: "nowrap", marginLeft: 8, flexShrink: 0 }}>
              {dateStr}
            </span>
          )}
        </div>
        {description && (
          <p style={{ margin: "5px 0 0", fontSize: 12, lineHeight: 1.7, color: GRAY, whiteSpace: "pre-line" }}>
            {description}
          </p>
        )}
      </div>
    </div>
  );
}

export function TemplateTimeline({ data, printMode }: Props): JSX.Element {
  const { personal: p, experience, education, skills, projects, certificates } = data;

  const wrap: React.CSSProperties = printMode
    ? { width: "210mm", minHeight: "297mm", margin: "0 auto", fontFamily: "'Helvetica Neue', Arial, sans-serif", fontSize: 12.5, color: GRAY, background: "#fff", boxSizing: "border-box" }
    : { width: "100%", fontFamily: "'Helvetica Neue', Arial, sans-serif", fontSize: 12.5, color: GRAY, background: "#fff", borderRadius: 12, overflow: "hidden" };

  return (
    <div style={wrap}>
      {/* Green header */}
      <div style={{ background: `linear-gradient(135deg, ${DARK} 0%, ${GREEN} 100%)`, color: "#fff", padding: "28px 40px 24px" }}>
        <h1 style={{ margin: 0, fontSize: 28, fontWeight: 700, letterSpacing: 0.5 }}>
          {p.fullName || "Your Name"}
        </h1>
        {p.jobTitle && (
          <p style={{ margin: "5px 0 12px", fontSize: 13, color: GREEN2, fontWeight: 500 }}>{p.jobTitle}</p>
        )}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "4px 20px", fontSize: 11, color: GREEN2 }}>
          {p.email    && <span>✉ {p.email}</span>}
          {p.phone    && <span>📞 {p.phone}</span>}
          {p.address  && <span>📍 {p.address}</span>}
          {p.linkedin && <span>🔗 {p.linkedin}</span>}
          {p.website  && <span>🌐 {p.website}</span>}
        </div>
      </div>

      <div style={{ display: "flex" }}>
        {/* Main */}
        <div style={{ flex: 1, padding: "22px 24px 28px 32px" }}>
          {p.summary && (
            <div style={{ marginBottom: 20 }}>
              <SectionHeading>About Me</SectionHeading>
              <p style={{ margin: 0, fontSize: 12.5, lineHeight: 1.8, color: GRAY, paddingLeft: 38 }}>{p.summary}</p>
            </div>
          )}

          {experience.length > 0 && (
            <div style={{ marginBottom: 20 }}>
              <SectionHeading>Experience</SectionHeading>
              <div style={{ paddingLeft: 10 }}>
                {experience.map((e, i) => (
                  <TimelineItem
                    key={e.id}
                    title={e.position}
                    subtitle={e.company}
                    dateStr={`${fmtDate(e.startDate)} – ${e.current ? "Present" : fmtDate(e.endDate)}`}
                    description={e.description}
                    isLast={i === experience.length - 1}
                  />
                ))}
              </div>
            </div>
          )}

          {education.length > 0 && (
            <div style={{ marginBottom: 20 }}>
              <SectionHeading>Education</SectionHeading>
              <div style={{ paddingLeft: 10 }}>
                {education.map((e, i) => (
                  <TimelineItem
                    key={e.id}
                    title={`${e.degree}${e.field ? ` in ${e.field}` : ""}`}
                    subtitle={e.institution}
                    dateStr={`${fmtDate(e.startDate)}${e.endDate ? ` – ${fmtDate(e.endDate)}` : ""}`}
                    description={e.grade ? `Grade: ${e.grade}` : undefined}
                    isLast={i === education.length - 1}
                  />
                ))}
              </div>
            </div>
          )}

          {projects.length > 0 && (
            <div>
              <SectionHeading>Projects</SectionHeading>
              <div style={{ paddingLeft: 10 }}>
                {projects.map((pr, i) => (
                  <TimelineItem
                    key={pr.id}
                    title={pr.name}
                    subtitle={pr.technologies || ""}
                    dateStr=""
                    description={pr.description + (pr.link ? `\n${pr.link}` : "")}
                    isLast={i === projects.length - 1}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div style={{ width: "32%", background: "#f0fdf4", borderLeft: `1px solid ${GREEN}20`, padding: "22px 18px 28px", flexShrink: 0 }}>
          {skills.length > 0 && (
            <div style={{ marginBottom: 20 }}>
              <p style={{ margin: "0 0 10px", fontSize: 10.5, fontWeight: 800, color: DARK, letterSpacing: "0.1em", textTransform: "uppercase" }}>Skills</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {skills.map((s) => (
                  <div key={s.id} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ width: 6, height: 6, borderRadius: "50%", background: GREEN, flexShrink: 0 }} />
                    <span style={{ fontSize: 12, fontWeight: 600, color: DARK, flex: 1 }}>{s.name}</span>
                    <span style={{ fontSize: 10, color: GREEN, background: GREEN2, padding: "1px 6px", borderRadius: 99, fontWeight: 600 }}>
                      {s.level}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {certificates.length > 0 && (
            <div>
              <p style={{ margin: "0 0 10px", fontSize: 10.5, fontWeight: 800, color: DARK, letterSpacing: "0.1em", textTransform: "uppercase" }}>Certifications</p>
              {certificates.map((c) => (
                <div key={c.id} style={{ marginBottom: 8, padding: "6px 8px", background: "#fff", borderRadius: 6, border: `1px solid ${GREEN}25` }}>
                  <p style={{ margin: 0, fontSize: 11.5, fontWeight: 600, color: DARK }}>{c.name}</p>
                  <p style={{ margin: "2px 0 0", fontSize: 10.5, color: "#6b7280" }}>
                    {c.issuer}{c.date ? ` · ${fmtDate(c.date)}` : ""}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

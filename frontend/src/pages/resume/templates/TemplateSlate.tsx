/**
 * Slate Template — Dark charcoal header, clean right sidebar
 * Best for: Corporate, management, senior government roles
 */
import type { ResumeCustomization, ResumeData } from "@/types/resume";
import { resumeShellStyle } from "@/pages/resume/resumeTemplateUtils";

interface Props { data: ResumeData; customization?: ResumeCustomization; printMode?: boolean; }

const SLATE_DARK = "#1e293b";
const SLATE_MID  = "#334155";
const CYAN       = "#0891b2";
const SIDE_BG    = "#f8fafc";

function fmtDate(d: string): string {
  if (!d) return "";
  const parts = d.split("-");
  if (parts.length < 2) return d;
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  return `${months[parseInt(parts[1], 10) - 1] ?? ""} ${parts[0]}`;
}

function MainSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="resume-section resume-avoid-break" style={{ marginBottom: 18 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
        <div style={{ width: 3, height: 16, background: CYAN, borderRadius: 2 }} />
        <span style={{ fontSize: 11.5, fontWeight: 800, letterSpacing: "0.09em", color: SLATE_DARK, textTransform: "uppercase" }}>
          {title}
        </span>
        <div style={{ flex: 1, height: 1, background: "#e2e8f0" }} />
      </div>
      {children}
    </div>
  );
}

function SideLabel({ children }: { children: string }) {
  return (
    <p style={{ margin: "0 0 8px", fontSize: 10.5, fontWeight: 800, letterSpacing: "0.1em", color: CYAN, textTransform: "uppercase" }}>
      {children}
    </p>
  );
}

export function TemplateSlate({ data, customization, printMode }: Props): JSX.Element {
  const { personal: p, experience, education, skills, projects, certificates } = data;
  const levelPct: Record<string, number> = { Beginner: 25, Intermediate: 50, Advanced: 75, Expert: 100 };

  const wrap = resumeShellStyle(customization, {
    fontFamily: "'Segoe UI', Arial, sans-serif",
    fontSize: 12.5,
    color: SLATE_DARK,
    printMode,
    display: "flex",
    flexDirection: "column",
  });

  return (
    <div className="resume-template" style={wrap}>
      {/* Header — full width dark block */}
      <div style={{ background: SLATE_DARK, color: "#fff", padding: "28px 36px 24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div>
            <h1 style={{ margin: 0, fontSize: 28, fontWeight: 700, letterSpacing: 0.5, color: "#f1f5f9" }}>
              {p.fullName || "Your Name"}
            </h1>
            {p.jobTitle && (
              <p style={{ margin: "5px 0 0", fontSize: 13, color: CYAN, fontWeight: 600, letterSpacing: 0.5 }}>
                {p.jobTitle}
              </p>
            )}
          </div>
          <div style={{ textAlign: "right", fontSize: 11, color: "#94a3b8", lineHeight: 2 }}>
            {p.email   && <div>{p.email}</div>}
            {p.phone   && <div>{p.phone}</div>}
            {p.address && <div>{p.address}</div>}
          </div>
        </div>
        {(p.linkedin || p.website) && (
          <div style={{ marginTop: 10, display: "flex", gap: 20, fontSize: 11, color: CYAN }}>
            {p.linkedin && <span>🔗 {p.linkedin}</span>}
            {p.website  && <span>🌐 {p.website}</span>}
          </div>
        )}
      </div>

      {/* Cyan accent line */}
      <div style={{ height: 3, background: `linear-gradient(to right, ${CYAN}, #22d3ee)` }} />

      {/* Body */}
      <div style={{ display: "flex", flex: 1 }}>
        {/* Main content */}
        <div style={{ flex: 1, padding: "22px 28px 28px 36px" }}>
          {p.summary && (
            <MainSection title="Professional Summary">
              <p style={{ margin: 0, lineHeight: 1.8, fontSize: 12.5, color: SLATE_MID }}>{p.summary}</p>
            </MainSection>
          )}

          {experience.length > 0 && (
            <MainSection title="Experience">
              {experience.map((e) => (
                <div key={e.id} className="resume-item resume-avoid-break" style={{ marginBottom: 14, paddingBottom: 12, borderBottom: "1px solid #f1f5f9" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div>
                      <p style={{ margin: 0, fontWeight: 700, fontSize: 13, color: SLATE_DARK }}>{e.position}</p>
                      <p style={{ margin: "2px 0 0", fontSize: 12, color: CYAN, fontWeight: 600 }}>{e.company}</p>
                    </div>
                    <span style={{ fontSize: 11, color: "#64748b", background: "#f1f5f9", padding: "2px 8px", borderRadius: 4, whiteSpace: "nowrap", marginLeft: 8, flexShrink: 0 }}>
                      {fmtDate(e.startDate)} – {e.current ? "Present" : fmtDate(e.endDate)}
                    </span>
                  </div>
                  {e.description && (
                    <p style={{ margin: "6px 0 0", fontSize: 12, lineHeight: 1.75, color: SLATE_MID, whiteSpace: "pre-line" }}>
                      {e.description}
                    </p>
                  )}
                </div>
              ))}
            </MainSection>
          )}

          {education.length > 0 && (
            <MainSection title="Education">
              {education.map((e) => (
                <div key={e.id} className="resume-item resume-avoid-break" style={{ marginBottom: 10, display: "flex", justifyContent: "space-between" }}>
                  <div>
                    <p style={{ margin: 0, fontWeight: 700, fontSize: 13 }}>{e.degree}{e.field ? ` in ${e.field}` : ""}</p>
                    <p style={{ margin: "2px 0 0", fontSize: 12, color: CYAN, fontWeight: 600 }}>{e.institution}</p>
                    {e.grade && <p style={{ margin: "1px 0 0", fontSize: 11, color: "#64748b" }}>Grade: {e.grade}</p>}
                  </div>
                  <span style={{ fontSize: 11, color: "#64748b", whiteSpace: "nowrap", marginLeft: 10, flexShrink: 0 }}>
                    {fmtDate(e.startDate)}{e.endDate ? ` – ${fmtDate(e.endDate)}` : ""}
                  </span>
                </div>
              ))}
            </MainSection>
          )}

          {projects.length > 0 && (
            <MainSection title="Projects">
              {projects.map((pr) => (
                <div key={pr.id} className="resume-item resume-avoid-break" style={{ marginBottom: 10 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <p style={{ margin: 0, fontWeight: 700, fontSize: 13 }}>{pr.name}</p>
                    {pr.technologies && (
                      <span style={{ fontSize: 10.5, background: `${CYAN}15`, color: CYAN, padding: "2px 8px", borderRadius: 99, fontWeight: 600 }}>
                        {pr.technologies}
                      </span>
                    )}
                  </div>
                  {pr.description && <p style={{ margin: "3px 0 0", fontSize: 12, lineHeight: 1.6, color: SLATE_MID }}>{pr.description}</p>}
                  {pr.link && <p style={{ margin: "2px 0 0", fontSize: 11, color: CYAN }}>{pr.link}</p>}
                </div>
              ))}
            </MainSection>
          )}
        </div>

        {/* Right sidebar */}
        <div style={{ width: "33%", background: SIDE_BG, borderLeft: "1px solid #e2e8f0", padding: "22px 20px 28px", flexShrink: 0 }}>
          {skills.length > 0 && (
            <div style={{ marginBottom: 20 }}>
              <SideLabel>Skills</SideLabel>
              {skills.map((s) => (
                <div key={s.id} className="resume-item resume-avoid-break" style={{ marginBottom: 9 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11.5, marginBottom: 3 }}>
                    <span style={{ fontWeight: 600, color: SLATE_DARK }}>{s.name}</span>
                    <span style={{ fontSize: 10, color: "#94a3b8" }}>{levelPct[s.level]}%</span>
                  </div>
                  <div style={{ height: 4, background: "#e2e8f0", borderRadius: 99 }}>
                    <div style={{ width: `${levelPct[s.level]}%`, height: "100%", background: CYAN, borderRadius: 99 }} />
                  </div>
                </div>
              ))}
            </div>
          )}

          {certificates.length > 0 && (
            <div style={{ marginBottom: 20 }}>
              <SideLabel>Certifications</SideLabel>
              {certificates.map((c) => (
                <div key={c.id} className="resume-item resume-avoid-break" style={{ marginBottom: 9, paddingBottom: 8, borderBottom: "1px solid #e2e8f0" }}>
                  <p style={{ margin: 0, fontSize: 12, fontWeight: 600, color: SLATE_DARK }}>{c.name}</p>
                  <p style={{ margin: "2px 0 0", fontSize: 10.5, color: "#64748b" }}>
                    {c.issuer}{c.date ? ` · ${fmtDate(c.date)}` : ""}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Contact repeat for sidebar convenience */}
          {(p.phone || p.email || p.address) && (
            <div>
              <SideLabel>Contact</SideLabel>
              <div style={{ fontSize: 11, color: "#64748b", lineHeight: 2 }}>
                {p.phone   && <div>📞 {p.phone}</div>}
                {p.email   && <div style={{ wordBreak: "break-all" }}>✉ {p.email}</div>}
                {p.address && <div>📍 {p.address}</div>}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

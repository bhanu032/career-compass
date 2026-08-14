/**
 * useSectionOrder
 *
 * Returns the effective section order from customization, merging with
 * the default order so newly added sections always appear even if not
 * yet in the stored sectionOrder array.
 *
 * Usage in a template:
 *   const sectionOrder = getSectionOrder(customization);
 *   {sectionOrder.map((key) => key === "experience" && experience.length > 0 && (
 *     <ExperienceSection ... />
 *   ))}
 */
import type { ResumeCustomization, ResumeSectionKey } from "@/types/resume";
import { DEFAULT_SECTION_ORDER } from "@/types/resume";

/**
 * Returns the effective render order, merging stored order with defaults.
 * Always returns every section key exactly once.
 */
export function getSectionOrder(customization?: ResumeCustomization): ResumeSectionKey[] {
  const stored = customization?.sectionOrder ?? [];
  // Keep stored keys that are still valid, then append any missing ones at the end
  const valid = stored.filter((k): k is ResumeSectionKey =>
    DEFAULT_SECTION_ORDER.includes(k as ResumeSectionKey)
  );
  const missing = DEFAULT_SECTION_ORDER.filter((k) => !valid.includes(k));
  return [...valid, ...missing];
}

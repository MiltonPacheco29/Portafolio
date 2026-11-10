export const siteLang = "es";

export const sectionKeys = [
  "home",
  "about",
  "services",
  "experience",
  "projects",
  "contact",
] as const;
export type SectionKey = (typeof sectionKeys)[number];

export function isSectionKey(value: unknown): value is SectionKey {
  return typeof value === "string" && (sectionKeys as readonly string[]).includes(value);
}

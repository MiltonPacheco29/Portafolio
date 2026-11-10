// Idioma y secciones sin diccionario: se puede importar desde componentes cliente.

/** Idioma del sitio (atributo lang, Intl y widgets externos). */
export const siteLang = "es";

// Orden en que aparecen las secciones en la página de inicio.
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

// Lógica de idiomas sin diccionarios: se puede importar desde componentes cliente.

export const locales = ["es", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "es";

// Orden en que aparecen las secciones en la página de inicio.
export const sectionKeys = [
  "home",
  "about",
  "experience",
  "projects",
  "skills",
  "contact",
] as const;
export type SectionKey = (typeof sectionKeys)[number];

/** id de ancla de cada sección, por idioma (p. ej. about → "sobre-mi" / "about"). */
export type SectionIds = Record<Locale, Record<SectionKey, string>>;

export function hasLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

export function isSectionKey(value: unknown): value is SectionKey {
  return typeof value === "string" && (sectionKeys as readonly string[]).includes(value);
}

export function localePath(locale: Locale): string {
  return `/${locale}/`;
}

/**
 * Cambia el idioma de una ruta y conserva el resto: /es/algo/ → /en/algo/.
 * Si la ruta no empieza por un idioma, se lo antepone. Siempre termina en "/"
 * (trailingSlash: true).
 */
export function switchLocalePath(pathname: string, target: Locale): string {
  const segments = pathname.split("/");
  if (hasLocale(segments[1] ?? "")) {
    segments[1] = target;
  } else {
    segments.splice(1, 0, target);
  }
  const path = segments.join("/");
  return path.endsWith("/") ? path : `${path}/`;
}

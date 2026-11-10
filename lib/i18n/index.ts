import es from "@/content/es.json";

// Reexporta idioma y secciones para que los componentes de servidor importen de un solo sitio.
export * from "@/lib/i18n/locales";

export type Dictionary = typeof es;

export function getDictionary(): Dictionary {
  return es;
}

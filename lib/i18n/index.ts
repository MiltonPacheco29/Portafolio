import es from "@/content/es.json";

export * from "@/lib/i18n/locales";

export type Dictionary = typeof es;

export function getDictionary(): Dictionary {
  return es;
}

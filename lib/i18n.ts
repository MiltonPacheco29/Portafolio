import en from "@/content/en.json";
import es from "@/content/es.json";
import {
  locales,
  sectionKeys,
  type Locale,
  type SectionIds,
  type SectionKey,
} from "@/lib/locales";

// Reexporta la lógica de idiomas para que los componentes de servidor importen de un solo sitio.
export * from "@/lib/locales";

export type Dictionary = typeof es;

// `satisfies` obliga a que en.json tenga la misma forma que es.json:
// si falta o sobra una clave en inglés, el build falla.
const dictionaries = { es, en } satisfies Record<Locale, Dictionary>;

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}

/** Ids de ancla de todas las secciones en todos los idiomas (para LangSwitch). */
export function getSectionIds(): SectionIds {
  return Object.fromEntries(
    locales.map((locale) => [
      locale,
      Object.fromEntries(
        sectionKeys.map((key) => [key, dictionaries[locale].sections[key].id]),
      ) as Record<SectionKey, string>,
    ]),
  ) as SectionIds;
}

/** Datos mínimos de cada idioma para el selector (sin pasar el diccionario entero al cliente). */
export function getLanguageOptions() {
  return locales.map((locale) => ({
    locale,
    short: dictionaries[locale].languageShort,
    name: dictionaries[locale].languageName,
  }));
}

export type LanguageOption = ReturnType<typeof getLanguageOptions>[number];

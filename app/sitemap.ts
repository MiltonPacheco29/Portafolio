import type { MetadataRoute } from "next";
import { defaultLocale, localePath, locales } from "@/lib/i18n/locales";
import { absoluteUrl } from "@/lib/config/site";

// Se genera una vez en el build como out/sitemap.xml (exportación estática).
export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  // Cada idioma enlaza a todas sus traducciones (hreflang).
  const languages = Object.fromEntries(locales.map((locale) => [locale, absoluteUrl(localePath(locale))]));

  return locales.map((locale) => ({
    url: absoluteUrl(localePath(locale)),
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: locale === defaultLocale ? 1 : 0.9,
    alternates: { languages },
  }));
}

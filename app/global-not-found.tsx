import type { Metadata } from "next";
import Link from "next/link";
import { ThemeScript } from "@/components/providers/ThemeScript";
import { fontVariables } from "@/lib/config/fonts";
import { defaultLocale, getDictionary, localePath, locales } from "@/lib/i18n";
import "./globals.css";

// 404 para cualquier URL sin ruta (p. ej. /fr/). No pasa por ningún layout,
// así que carga aquí estilos, fuentes y tema. Idioma principal: español;
// el bloque en inglés va marcado con su propio lang.
const main = getDictionary(defaultLocale);

export const metadata: Metadata = {
  title: main.notFound.title,
  robots: { index: false },
};

export default function GlobalNotFound() {
  return (
    <html
      lang={defaultLocale}
      className={`${fontVariables} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <ThemeScript />
      </head>
      <body className="min-h-full flex flex-col">
        <main className="flex flex-1 flex-col items-center justify-center gap-10 px-gutter text-center">
          <p className="font-mono text-display font-bold text-accent" aria-hidden="true">
            404
          </p>
          {locales.map((locale) => {
            const dict = getDictionary(locale);
            const Heading = locale === defaultLocale ? "h1" : "h2";
            return (
              <div key={locale} lang={locale} className="flex flex-col items-center gap-2">
                <Heading className="font-display text-title font-bold">
                  {dict.notFound.title}
                </Heading>
                <p className="text-fg-muted">{dict.notFound.body}</p>
                <Link
                  href={localePath(locale)}
                  hrefLang={locale}
                  className="text-primary underline underline-offset-4"
                >
                  {dict.notFound.back}
                </Link>
              </div>
            );
          })}
        </main>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MotionProvider } from "@/components/MotionProvider";
import { Navbar } from "@/components/Navbar";
import { ThemeScript } from "@/components/ThemeScript";
import { fontVariables } from "@/lib/fonts";
import {
  defaultLocale,
  getDictionary,
  getLanguageOptions,
  getSectionIds,
  hasLocale,
  localePath,
  locales,
  sectionKeys,
} from "@/lib/i18n";
import { siteUrl } from "@/lib/site";
import "../globals.css";

// Solo existen /es y /en; cualquier otro idioma da 404 (obligatorio para el export estático).
export const dynamicParams = false;

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const { meta } = getDictionary(lang);
  return {
    // Base para que las rutas relativas (canonical, hreflang, og:url) sean absolutas.
    metadataBase: siteUrl,
    title: meta.title,
    description: meta.description,
    alternates: {
      canonical: localePath(lang),
      // hreflang: cada idioma apunta a sus traducciones; x-default al idioma por defecto.
      languages: {
        ...Object.fromEntries(locales.map((locale) => [locale, localePath(locale)])),
        "x-default": localePath(defaultLocale),
      },
    },
    openGraph: {
      type: "website",
      url: localePath(lang),
      siteName: meta.siteName,
      title: meta.title,
      description: meta.description,
      locale: meta.ogLocale,
      alternateLocale: locales
        .filter((locale) => locale !== lang)
        .map((locale) => getDictionary(locale).meta.ogLocale),
    },
    twitter: {
      card: "summary",
      title: meta.title,
      description: meta.description,
    },
  };
}

const MAIN_ID = "main";

export default async function LangLayout({
  children,
  params,
}: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = getDictionary(lang);

  return (
    // lang sale del segmento de la ruta: /es → "es", /en → "en".
    // suppressHydrationWarning: ThemeScript pone data-theme antes de que React hidrate.
    <html
      lang={lang}
      className={`${fontVariables} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <ThemeScript />
      </head>
      <body className="min-h-full flex flex-col">
        <MotionProvider>
          <a
            href={`#${MAIN_ID}`}
            className="sr-only rounded-sm bg-primary px-4 py-2 text-on-primary focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50"
          >
            {dict.a11y.skipToContent}
          </a>
          <Navbar
            brand={dict.brand}
            homeId={dict.sections.home.id}
            navLabel={dict.nav.label}
            menuLabel={dict.nav.menu}
            links={sectionKeys
              .filter((key) => key !== "home")
              .map((key) => ({ key, id: dict.sections[key].id, title: dict.sections[key].title }))}
            langSwitch={{
              current: lang,
              label: dict.langSwitch.label,
              options: getLanguageOptions(),
              sectionIds: getSectionIds(),
            }}
            themeLabels={dict.theme}
          />
          {/* pt-nav reserva el alto de la barra fija. */}
          <main id={MAIN_ID} tabIndex={-1} className="flex flex-1 flex-col pt-nav outline-none">
            {children}
          </main>
          <footer className="px-gutter py-8 font-mono text-sm text-fg-muted">
            {dict.footer.note}
          </footer>
        </MotionProvider>
      </body>
    </html>
  );
}

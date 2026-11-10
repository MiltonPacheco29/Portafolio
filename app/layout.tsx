import type { Metadata } from "next";
import { MotionProvider } from "@/components/providers/MotionProvider";
import { Navbar } from "@/components/layout/Navbar";
import { Preloader } from "@/components/preloader/Preloader";
import { ThemeScript } from "@/components/providers/ThemeScript";
import { fontVariables } from "@/lib/config/fonts";
import { getDictionary, sectionKeys, siteLang } from "@/lib/i18n";
import { siteUrl } from "@/lib/config/site";
import "./globals.css";

const dict = getDictionary();
const { meta } = dict;

export const metadata: Metadata = {
  metadataBase: siteUrl,
  title: meta.title,
  description: meta.description,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    siteName: meta.siteName,
    title: meta.title,
    description: meta.description,
    locale: meta.ogLocale,
  },
  twitter: {
    card: "summary",
    title: meta.title,
    description: meta.description,
  },
};

const MAIN_ID = "main";

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang={siteLang}
      className={`${fontVariables} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <ThemeScript />
      </head>
      <body className="min-h-full flex flex-col">
        <Preloader />
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
            themeLabels={dict.theme}
          />
          <main id={MAIN_ID} tabIndex={-1} className="flex flex-1 flex-col pt-nav outline-none">
            {children}
          </main>
          <footer className="border-t border-border px-gutter py-8 font-mono text-sm text-fg-muted">
            <div className="mx-auto flex w-full max-w-content flex-wrap items-center justify-between gap-x-6 gap-y-2">
              <p>{dict.footer.note}</p>
              <a
                href={`#${dict.sections.home.id}`}
                className="inline-flex min-h-11 items-center text-fg underline underline-offset-4 hover:text-primary motion-safe:transition-colors motion-safe:duration-200"
              >
                {dict.footer.backToTop}
              </a>
            </div>
          </footer>
        </MotionProvider>
      </body>
    </html>
  );
}

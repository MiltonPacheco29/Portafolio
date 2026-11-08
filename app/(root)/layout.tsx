import type { Metadata } from "next";
import { ThemeScript } from "@/components/providers/ThemeScript";
import { fontVariables } from "@/lib/config/fonts";
import { defaultLocale, getDictionary, localePath } from "@/lib/i18n";
import { siteUrl } from "@/lib/config/site";
import "../globals.css";

const dict = getDictionary(defaultLocale);

// "/" solo redirige: no se indexa y su canónica es la versión en el idioma por defecto.
export const metadata: Metadata = {
  metadataBase: siteUrl,
  title: dict.meta.title,
  description: dict.meta.description,
  alternates: { canonical: localePath(defaultLocale) },
  robots: { index: false, follow: true },
};

// Layout raíz solo para "/", que redirige al idioma por defecto.
export default function RootRedirectLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang={defaultLocale}
      className={`${fontVariables} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <ThemeScript />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}

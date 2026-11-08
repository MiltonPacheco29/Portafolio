import Link from "next/link";
import {
  defaultLocale,
  getDictionary,
  localePath,
  locales,
} from "@/lib/i18n";

// En Cloudflare Pages, public/_redirects redirige "/" en el servidor.
// Esta página es el respaldo para `npm run dev` y otros hosts estáticos:
// redirige con <meta refresh> (sin JS) y deja enlaces accesibles por teclado.
export default function RootPage() {
  const dict = getDictionary(defaultLocale);

  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-6 p-8 text-center">
      <meta httpEquiv="refresh" content={`0; url=${localePath(defaultLocale)}`} />
      <h1 className="text-2xl font-bold">{dict.root.title}</h1>
      <p role="status">{dict.root.redirecting}</p>
      <nav aria-label={dict.root.title}>
        <ul className="flex gap-6">
          {locales.map((locale) => (
            <li key={locale}>
              <Link
                href={localePath(locale)}
                hrefLang={locale}
                lang={locale}
                className="underline underline-offset-4"
              >
                {getDictionary(locale).languageName}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </main>
  );
}

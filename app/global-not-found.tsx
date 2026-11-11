import type { Metadata } from "next";
import Link from "next/link";
import { ThemeScript } from "@/components/providers/ThemeScript";
import { fontVariables } from "@/lib/config/fonts";
import { getDictionary, siteLang } from "@/lib/i18n";
import "./globals.css";

const { notFound } = getDictionary();

export const metadata: Metadata = {
  title: notFound.title,
  robots: { index: false },
};

export default function GlobalNotFound() {
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
        <main className="flex flex-1 flex-col items-center justify-center gap-10 px-gutter text-center">
          <p className="font-mono text-display font-bold text-accent" aria-hidden="true">
            404
          </p>
          <div className="flex flex-col items-center gap-2">
            <h1 className="font-display text-title font-black uppercase">{notFound.title}</h1>
            <p className="text-fg-muted">{notFound.body}</p>
            <Link href="/" className="text-primary underline underline-offset-4">
              {notFound.back}
            </Link>
          </div>
        </main>
      </body>
    </html>
  );
}

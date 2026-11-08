"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { switchLocalePath, type Locale, type SectionIds } from "@/lib/i18n/locales";
import { useActiveSection } from "@/lib/hooks/useActiveSection";

export type LangSwitchProps = {
  current: Locale;
  label: string;
  options: { locale: Locale; short: string; name: string }[];
  sectionIds: SectionIds;
  className?: string;
};

export function LangSwitch({ current, label, options, sectionIds, className }: LangSwitchProps) {
  const pathname = usePathname();
  const activeSection = useActiveSection();

  return (
    <nav aria-label={label} className={className}>
      <ul className="flex items-center gap-1 font-mono text-sm">
        {options.map(({ locale, short, name }) => {
          // El nombre accesible incluye el texto visible ("EN · English").
          const content = (
            <>
              <span aria-hidden="true">{short}</span>
              <span className="sr-only">
                {short} · {name}
              </span>
            </>
          );
          const base =
            "inline-flex min-h-11 min-w-11 items-center justify-center rounded-sm px-2 tracking-[var(--tracking-mono)]";

          if (locale === current) {
            return (
              <li key={locale}>
                <span
                  aria-current="true"
                  lang={locale}
                  className={`${base} border border-primary text-primary`}
                >
                  {content}
                </span>
              </li>
            );
          }

          // Sin JS (o arriba del todo) el enlace lleva al inicio del otro idioma;
          // con JS añade el ancla de la sección que se está viendo.
          const hash =
            activeSection && activeSection !== "home"
              ? `#${sectionIds[locale][activeSection]}`
              : "";

          return (
            <li key={locale}>
              <Link
                href={`${switchLocalePath(pathname, locale)}${hash}`}
                hrefLang={locale}
                lang={locale}
                className={`${base} border border-transparent text-fg-muted hover:border-border-strong hover:text-fg motion-safe:transition-colors`}
              >
                {content}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

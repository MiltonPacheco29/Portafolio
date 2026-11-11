import type { CSSProperties, ReactNode } from "react";
import type { Dictionary } from "@/lib/i18n";

type HeroTechStackProps = {
  stack: Dictionary["hero"]["stack"];
  delay: number;
};

/* Iconos de línea propios (mismo trazo y caja de 24) en lugar de logotipos de marca. */
const icons: Record<string, ReactNode> = {
  react: (
    <>
      <circle cx="12" cy="12" r="1.6" fill="currentColor" stroke="none" />
      <ellipse cx="12" cy="12" rx="10" ry="4" />
      <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(60 12 12)" />
      <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(120 12 12)" />
    </>
  ),
  next: (
    <>
      <circle cx="12" cy="12" r="9.5" />
      <path d="M9 16V8l7 9.5M15 8v5" />
    </>
  ),
  java: (
    <>
      <path d="M5 10h10v3.5a5 5 0 0 1-10 0z" />
      <path d="M15 11h1.5a2.25 2.25 0 0 1 0 4.5H14.5" />
      <path d="M8.5 3c-1 1.4 1 2.4 0 4M11.5 3c-1 1.4 1 2.4 0 4M4 21h13" />
    </>
  ),
  aws: <path d="M7 18.5a4.5 4.5 0 0 1-.7-8.95 6 6 0 0 1 11.4 1.2A3.9 3.9 0 0 1 17 18.5z" />,
  database: (
    <>
      <ellipse cx="12" cy="5.5" rx="7" ry="2.5" />
      <path d="M5 5.5v13c0 1.4 3.1 2.5 7 2.5s7-1.1 7-2.5v-13M5 12c0 1.4 3.1 2.5 7 2.5s7-1.1 7-2.5" />
    </>
  ),
};

const STAGGER = 0.05;

export function HeroTechStack({ stack, delay }: HeroTechStackProps) {
  return (
    <ul aria-label={stack.label} className="flex flex-wrap gap-2">
      {stack.items.map((item, i) => (
        <li
          key={item.id}
          className="enter [--enter-y:10px]"
          style={{ "--enter-delay": `${delay + i * STAGGER}s` } as CSSProperties}
        >
          <span className="hero-chip">
            <svg
              aria-hidden="true"
              focusable="false"
              viewBox="0 0 24 24"
              className="size-4 shrink-0 text-primary"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {icons[item.id]}
            </svg>
            {item.name}
          </span>
        </li>
      ))}
    </ul>
  );
}

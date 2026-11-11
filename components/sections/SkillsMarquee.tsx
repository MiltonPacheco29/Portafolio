"use client";

import { useState } from "react";
import { StripeDivider } from "@/components/ui/StripeDivider";

type SkillsMarqueeProps = {
  label: string;
  items: string[];
  pauseLabel: string;
  playLabel: string;
};

const COPIES = 3;

function Words({ items }: { items: string[] }) {
  return items.map((item, i) => (
    <li key={i} className="flex items-center">
      <span className="px-[0.2em]">{item}</span>
      <span aria-hidden="true" className="marquee-sep" />
    </li>
  ));
}

/* Dos filas que se desplazan solas en sentidos opuestos (animación CSS en globals.css).
   Se pausan al pasar el ratón o con el botón (WCAG 2.2.2); con movimiento reducido quedan fijas. */
export function SkillsMarquee({ label, items, pauseLabel, playLabel }: SkillsMarqueeProps) {
  const [paused, setPaused] = useState(false);

  const reversed = [...items].reverse();
  const rowClass =
    "marquee-row flex w-max font-display text-band font-black uppercase [font-stretch:80%]";
  const buttonLabel = paused ? playLabel : pauseLabel;

  return (
    <div
      className="marquee relative overflow-x-clip py-10 sm:py-14"
      data-paused={paused || undefined}
    >
      <StripeDivider />
      <div className="marquee-track flex flex-col gap-2 py-6 sm:gap-3 sm:py-8">
        <div className={`${rowClass} text-fg`}>
          {Array.from({ length: COPIES }, (_, copy) =>
            copy === 0 ? (
              <ul key={copy} aria-label={label} className="flex">
                <Words items={items} />
              </ul>
            ) : (
              <ul key={copy} aria-hidden="true" className="flex">
                <Words items={items} />
              </ul>
            ),
          )}
        </div>
        <div aria-hidden="true" data-dir="reverse" className={`${rowClass} text-accent`}>
          {Array.from({ length: COPIES }, (_, copy) => (
            <ul key={copy} className="flex">
              <Words items={reversed} />
            </ul>
          ))}
        </div>
      </div>
      <StripeDivider />

      <button
        type="button"
        onClick={() => setPaused((p) => !p)}
        aria-label={buttonLabel}
        title={buttonLabel}
        className="absolute right-[var(--gutter)] bottom-1 inline-flex size-11 items-center justify-center rounded-pill border border-border-strong bg-bg/70 text-fg backdrop-blur-sm hover:border-primary hover:text-primary motion-reduce:hidden motion-safe:transition-colors motion-safe:duration-200 sm:bottom-2"
      >
        <svg aria-hidden="true" focusable="false" viewBox="0 0 16 16" className="size-4 fill-current">
          {paused ? <path d="M5 2.5v11l9-5.5z" /> : <path d="M4 3h3v10H4zM9 3h3v10H9z" />}
        </svg>
      </button>
    </div>
  );
}

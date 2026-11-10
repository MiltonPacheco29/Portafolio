"use client";

import { motion, useScroll } from "motion/react";
import { useRef } from "react";
import { FadeIn } from "@/components/motion/FadeIn";
import { usePrefersReducedMotion } from "@/lib/animations";
import type { Dictionary } from "@/lib/i18n";

type Experience = Dictionary["sections"]["experience"];
type ExperienceTimelineProps = {
  items: Experience["items"];
  achievementsLabel: string;
  stackLabel: string;
};

export function ExperienceTimeline({ items, achievementsLabel, stackLabel }: ExperienceTimelineProps) {
  const root = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();
  const { scrollYProgress } = useScroll({ target: root, offset: ["start 0.7", "end 0.7"] });

  return (
    <div ref={root} className="relative pl-10">
      <span aria-hidden="true" className="absolute top-2 bottom-2 left-[0.6875rem] w-0.5 bg-border-strong" />
      <motion.span
        aria-hidden="true"
        style={reduced ? undefined : { scaleY: scrollYProgress }}
        className="absolute top-2 bottom-2 left-[0.6875rem] w-0.5 origin-top bg-primary shadow-glow-primary"
      />

      <ol className="flex flex-col gap-12">
        {items.map((item, i) => (
          <FadeIn key={i} as="li" y={24} duration={0.6} className="relative">
            <span
              aria-hidden="true"
              className="absolute top-1 -left-10 grid size-6 place-items-center rounded-full border-2 border-primary bg-bg shadow-glow-primary"
            >
              <span className="size-2 rounded-full bg-accent" />
            </span>

            <p className="font-mono text-sm tracking-[var(--tracking-mono)] text-primary">{item.period}</p>
            <h3 className="mt-1 font-display text-xl font-semibold">{item.role}</h3>
            <p className="font-mono text-sm text-fg-muted">{item.organization}</p>
            <p className="mt-3 max-w-prose">{item.summary}</p>

            <p className="mt-4 font-mono text-xs tracking-[var(--tracking-mono)] text-accent">
              {achievementsLabel}
            </p>
            <ul className="mt-1 flex list-disc flex-col gap-1 pl-5 text-fg-muted marker:text-primary">
              {item.achievements.map((achievement, j) => (
                <li key={j}>{achievement}</li>
              ))}
            </ul>

            <p className="mt-4 font-mono text-xs tracking-[var(--tracking-mono)] text-accent">{stackLabel}</p>
            <ul className="mt-2 flex flex-wrap gap-2">
              {item.stack.map((tech, j) => (
                <li
                  key={j}
                  className="rounded-sm border border-border-strong px-2 py-1 font-mono text-xs text-fg"
                >
                  {tech}
                </li>
              ))}
            </ul>
          </FadeIn>
        ))}
      </ol>
    </div>
  );
}

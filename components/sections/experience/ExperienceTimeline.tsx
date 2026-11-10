"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";
import { whenMotionAllowed } from "@/lib/animations";
import type { Dictionary } from "@/lib/i18n";

gsap.registerPlugin(useGSAP, ScrollTrigger);

type Experience = Dictionary["sections"]["experience"];
type ExperienceTimelineProps = {
  items: Experience["items"];
  achievementsLabel: string;
  stackLabel: string;
};

export function ExperienceTimeline({ items, achievementsLabel, stackLabel }: ExperienceTimelineProps) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;

      return whenMotionAllowed(gsap, () => {
        gsap.fromTo(
          "[data-timeline-progress]",
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: "none",
            scrollTrigger: { trigger: el, start: "top 70%", end: "bottom 70%", scrub: 0.5 },
          },
        );

        for (const item of gsap.utils.toArray<HTMLElement>("[data-timeline-item]")) {
          if (item.getBoundingClientRect().top < window.innerHeight * 0.85) continue;
          const trigger = { trigger: item, start: "top 85%", once: true };
          gsap.from(item, { opacity: 0, y: 24, duration: 0.6, ease: "power2.out", scrollTrigger: trigger });
          gsap.from(item.querySelector("[data-timeline-dot]"), {
            scale: 0.4,
            duration: 0.6,
            ease: "power2.out",
            scrollTrigger: trigger,
          });
        }
      });
    },
    { scope: root },
  );

  return (
    <div ref={root} className="relative pl-10">
      <span aria-hidden="true" className="absolute top-2 bottom-2 left-[0.6875rem] w-0.5 bg-border-strong" />
      <span
        aria-hidden="true"
        data-timeline-progress
        className="absolute top-2 bottom-2 left-[0.6875rem] w-0.5 origin-top bg-primary shadow-glow-primary"
      />

      <ol className="flex flex-col gap-12">
        {items.map((item, i) => (
          <li key={i} data-timeline-item className="relative">
            <span
              aria-hidden="true"
              data-timeline-dot
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
          </li>
        ))}
      </ol>
    </div>
  );
}

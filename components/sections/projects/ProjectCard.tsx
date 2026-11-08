"use client";

import { motion, useTransform, type MotionValue } from "motion/react";
import { useRef, type FocusEvent } from "react";
import { GhostButton } from "@/components/ui/GhostButton";
import { PlaceholderImage } from "@/components/ui/PlaceholderImage";
import type { ProjectMedia } from "@/components/sections/projects/types";
import type { Dictionary } from "@/lib/i18n";
import { isPending } from "@/lib/text";

type Projects = Dictionary["sections"]["projects"];

type ProjectCardProps = {
  project: Projects["items"][number];
  /** Número fijo del proyecto (posición en content, no en el filtro). */
  number: number;
  media: ProjectMedia[];
  labels: Projects["labels"];
  activeTech: string | null;
  /** Posición dentro de la lista visible (filtrada). */
  index: number;
  total: number;
  progress: MotionValue<number>;
  stacking: boolean;
};

/** Desplazamiento vertical de cada tarjeta apilada. */
const STACK_STEP = 28;

/**
 * Tarjeta de proyecto. Con `stacking`, cada una ocupa un contenedor de 85vh,
 * queda fija (sticky) con top + índice × 28px y se reduce hacia
 * 1 − (total − 1 − índice) × 0.03 mientras pasan las siguientes.
 * Al recibir foco con teclado, su contenedor se desplaza a la vista para que
 * la tarjeta siguiente no tape el foco (WCAG 2.4.11).
 */
export function ProjectCard({
  project,
  number,
  media,
  labels,
  activeTech,
  index,
  total,
  progress,
  stacking,
}: ProjectCardProps) {
  const container = useRef<HTMLLIElement>(null);
  const targetScale = 1 - (total - 1 - index) * 0.03;
  const scale = useTransform(progress, [index / total, 1], [1, targetScale]);
  const href = isPending(project.repo) ? null : project.repo;
  const [first, second, third] = media;

  const onFocus = (event: FocusEvent) => {
    const li = container.current;
    if (!stacking || !li || !(event.target as HTMLElement).matches(":focus-visible")) return;
    li.scrollIntoView({ block: "start" });
  };

  const pane = (item: ProjectMedia | undefined, className: string) => (
    <div className={`panel-skew overflow-hidden ${className}`}>
      <PlaceholderImage
        image={item?.image ?? null}
        devSrc={item?.devSrc ?? null}
        alt={item?.alt ?? ""}
        className="size-full"
        imgClassName="size-full object-cover"
        sizes="(min-width: 768px) 40vw, 90vw"
      />
    </div>
  );

  return (
    <li
      ref={container}
      onFocus={onFocus}
      className={stacking ? "h-[85vh] scroll-mt-nav-offset" : ""}
    >
      <motion.article
        style={stacking ? { scale, top: `calc(var(--stack-top) + ${index * STACK_STEP}px)` } : undefined}
        className={`flex origin-top flex-col gap-6 rounded-card border-2 border-border-strong bg-surface p-4 sm:p-6 md:p-8 [--stack-top:6rem] md:[--stack-top:8rem] ${
          stacking ? "sticky" : ""
        }`}
      >
        <div className="flex flex-wrap items-start gap-x-6 gap-y-4">
          <span aria-hidden="true" className="font-display text-number font-black tabular-nums [font-stretch:80%]">
            {String(number).padStart(2, "0")}
          </span>

          <div className="flex min-w-0 flex-1 basis-64 flex-col gap-2">
            <p className="meta text-accent">{project.category}</p>
            <h3 className="font-display text-2xl font-black uppercase [font-stretch:88%] md:text-4xl">{project.title}</h3>
            <p className="max-w-prose text-fg-muted">{project.problem}</p>
            <ul aria-label={labels.stack} className="mt-1 flex flex-wrap gap-2">
              {project.stack.map((tech, i) => (
                <li
                  key={i}
                  className={`rounded-sm border px-2 py-1 font-mono text-xs ${
                    tech === activeTech ? "border-primary text-primary" : "border-border-strong text-fg"
                  }`}
                >
                  {tech}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col items-start gap-2">
            <GhostButton href={href} label={labels.view} srSuffix={`${labels.repoOf} ${project.title}`} />
            {!href && <p className="meta max-w-56 text-fg-muted">{labels.repoPending}</p>}
          </div>
        </div>

        {/* Cuadrícula de imágenes: izquierda 40 % (2 apiladas), derecha 60 % (1 alta). */}
        <div className="grid grid-cols-[2fr_3fr] gap-3">
          <div className="flex flex-col gap-3">
            {pane(first, "h-[clamp(110px,min(12vw,18vh),190px)]")}
            {pane(second, "h-[clamp(130px,min(16vw,24vh),260px)]")}
          </div>
          {pane(third, "h-full min-h-[252px]")}
        </div>
      </motion.article>
    </li>
  );
}

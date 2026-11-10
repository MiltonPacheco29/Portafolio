"use client";

import { useScroll } from "motion/react";
import { useId, useRef, useState, useSyncExternalStore } from "react";
import { ProjectCard } from "@/components/sections/projects/ProjectCard";
import type { ProjectMedia } from "@/components/sections/projects/types";
import type { Dictionary } from "@/lib/i18n";
import { usePrefersReducedMotion } from "@/lib/animations";
import { fillTemplate } from "@/lib/text";

type Projects = Dictionary["sections"]["projects"];
type ProjectListProps = Pick<Projects, "items" | "labels" | "filters"> & {
  media: Record<string, ProjectMedia[]>;
};

// Apilado solo desde md: en móvil las tarjetas son más altas que la pantalla.
const STACK_QUERY = "(min-width: 48rem)";

function subscribeStack(onChange: () => void) {
  const media = window.matchMedia(STACK_QUERY);
  media.addEventListener("change", onChange);
  return () => media.removeEventListener("change", onChange);
}

/**
 * Proyectos con filtro por tecnología y tarjetas apiladas.
 * - Filtros: botones nativos con aria-pressed; el recuento vive en role="status".
 * - Apilado (sticky + escala con useScroll/useTransform) solo desde md y sin
 *   movimiento reducido; si no, es una lista normal. Sin JS se ven todos.
 */
export function ProjectList({ items, labels, filters, media }: ProjectListProps) {
  const [active, setActive] = useState<string | null>(null);
  const labelId = useId();
  const listRef = useRef<HTMLUListElement>(null);
  const reduced = usePrefersReducedMotion();
  const wide = useSyncExternalStore(subscribeStack, () => window.matchMedia(STACK_QUERY).matches, () => false);
  const stacking = wide && !reduced;
  const { scrollYProgress } = useScroll({ target: listRef, offset: ["start start", "end end"] });

  const technologies = [...new Set(items.flatMap((project) => project.stack))];
  const visible = active ? items.filter((project) => project.stack.includes(active)) : items;
  const status = active
    ? fillTemplate(filters.statusFiltered, { count: visible.length, total: items.length, tech: active })
    : fillTemplate(filters.status, { count: visible.length, total: items.length });

  const filterButton = (value: string | null, text: string) => {
    const pressed = active === value;
    return (
      <button
        key={value ?? "__all"}
        type="button"
        aria-pressed={pressed}
        onClick={() => setActive(value)}
        className={`inline-flex min-h-11 items-center gap-2 rounded-pill border px-4 font-mono text-xs tracking-[var(--tracking-mono)] motion-safe:transition-colors motion-safe:duration-200 ${
          pressed
            ? "border-primary bg-primary text-on-primary"
            : "border-border-strong text-fg hover:border-primary hover:text-primary"
        }`}
      >
        {/* Además del relleno, una marca visible indica el filtro activo (no solo el color). */}
        <span aria-hidden="true">{pressed ? "■" : "□"}</span>
        {text}
      </button>
    );
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-3">
        <p id={labelId} className="meta text-accent">
          {filters.label}
        </p>
        <div role="group" aria-labelledby={labelId} className="flex flex-wrap gap-2">
          {filterButton(null, filters.all)}
          {technologies.map((tech) => filterButton(tech, tech))}
        </div>
        <p role="status" aria-atomic="true" className="font-mono text-sm text-fg-muted">
          {status}
        </p>
      </div>

      <ul ref={listRef} className="flex flex-col gap-8 md:gap-0">
        {visible.map((project, i) => (
          <ProjectCard
            key={project.slug}
            project={project}
            number={items.indexOf(project) + 1}
            media={media[project.slug] ?? []}
            labels={labels}
            activeTech={active}
            index={i}
            total={visible.length}
            progress={scrollYProgress}
            stacking={stacking}
          />
        ))}
      </ul>
    </div>
  );
}

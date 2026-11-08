"use client";

import { useId, useState } from "react";
import type { Dictionary } from "@/lib/i18n";
import { fillTemplate, isPending } from "@/lib/text";

type Projects = Dictionary["sections"]["projects"];
type ProjectListProps = Pick<Projects, "items" | "labels" | "filters">;

/**
 * Tarjetas de proyecto con filtro por tecnología.
 * - Filtros: botones nativos con aria-pressed (Tab para moverse, Enter/Espacio para elegir).
 * - El recuento vive en role="status": los lectores de pantalla anuncian cada cambio.
 * - Sin JS se ven todos los proyectos (el HTML del servidor no filtra nada).
 */
export function ProjectList({ items, labels, filters }: ProjectListProps) {
  const [active, setActive] = useState<string | null>(null);
  const labelId = useId();

  // Tecnologías en el orden en que aparecen, sin repetir.
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
          className={`inline-flex min-h-11 items-center gap-2 rounded-sm border px-3 font-mono text-xs tracking-[var(--tracking-mono)] motion-safe:transition-colors ${
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
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <p id={labelId} className="font-mono text-sm tracking-[var(--tracking-mono)] text-accent">
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

      <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {visible.map((project) => (
          <li
            key={project.slug}
            className="flex flex-col gap-4 rounded-md border border-border-strong bg-surface p-5"
          >
            <h3 className="font-display text-xl font-semibold">{project.title}</h3>

            <div>
              <p className="font-mono text-xs tracking-[var(--tracking-mono)] text-accent">{labels.problem}</p>
              <p className="mt-1 text-fg-muted">{project.problem}</p>
            </div>

            <div>
              <p className="font-mono text-xs tracking-[var(--tracking-mono)] text-accent">{labels.stack}</p>
              <ul className="mt-2 flex flex-wrap gap-2">
                {project.stack.map((tech, i) => (
                  <li
                    key={i}
                    className={`rounded-sm border px-2 py-1 font-mono text-xs ${
                      tech === active ? "border-primary text-primary" : "border-border-strong text-fg"
                    }`}
                  >
                    {tech}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-auto pt-2">
              {isPending(project.repo) ? (
                <p className="font-mono text-sm text-fg-muted">{labels.repoPending}</p>
              ) : (
                <a
                  href={project.repo}
                  className="inline-flex min-h-11 items-center gap-2 font-mono text-sm text-primary underline underline-offset-4"
                >
                  {labels.repo}
                  {/* Nombre único por tarjeta para lectores de pantalla: "Ver repositorio de X". */}
                  <span className="sr-only">
                    {labels.repoOf} {project.title}
                  </span>
                  <span aria-hidden="true">↗</span>
                </a>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

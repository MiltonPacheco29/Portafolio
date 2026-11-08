"use client";

import { useEffect, useRef } from "react";
import { StripeDivider } from "@/components/ui/StripeDivider";
import { usePrefersReducedMotion } from "@/lib/animations";

type SkillsMarqueeProps = {
  label: string;
  items: string[];
};

const COPIES = 3;

/** Una copia de la lista: palabras en mayúsculas separadas por puntos. */
function Words({ items }: { items: string[] }) {
  return items.map((item, i) => (
    <li key={i} className="flex items-center">
      <span className="px-[0.3em]">{item}</span>
      <span aria-hidden="true">·</span>
    </li>
  ));
}

/**
 * Franja de dos filas con las skills, repetidas tres veces, que se desplazan
 * en sentidos opuestos al ritmo del scroll:
 *   desplazamiento = (scrollY − topSección + altoVentana) × 0.3
 * - Listener pasivo agrupado con requestAnimationFrame; solo transform.
 * - Accesible: la primera copia de la fila 1 es la única lista que se lee;
 *   el resto va con aria-hidden.
 * - Con movimiento reducido (o sin JS) queda estática.
 */
export function SkillsMarquee({ label, items }: SkillsMarqueeProps) {
  const root = useRef<HTMLDivElement>(null);
  const rowA = useRef<HTMLDivElement>(null);
  const rowB = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const el = root.current;
    const a = rowA.current;
    const b = rowB.current;
    if (!el || !a || !b || reduced) return;

    let frame = 0;
    const update = () => {
      frame = 0;
      const sectionTop = el.getBoundingClientRect().top + window.scrollY;
      const offset = (window.scrollY - sectionTop + window.innerHeight) * 0.3;
      // Base: una copia a la izquierda (igual que .marquee-row) para no dejar huecos.
      const copyA = a.scrollWidth / COPIES;
      const copyB = b.scrollWidth / COPIES;
      a.style.transform = `translate3d(${-copyA + (offset - 200)}px, 0, 0)`;
      b.style.transform = `translate3d(${-copyB - (offset - 200)}px, 0, 0)`;
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      a.style.transform = "";
      b.style.transform = "";
    };
  }, [reduced]);

  const reversed = [...items].reverse();
  const rowClass =
    "marquee-row flex w-max font-display text-band font-black uppercase [font-stretch:80%] motion-safe:will-change-transform";

  return (
    <div ref={root} className="overflow-x-clip py-10 sm:py-14">
      <StripeDivider />
      <div className="flex flex-col gap-2 py-6 sm:gap-3 sm:py-8">
        <div ref={rowA} className={`${rowClass} text-fg`}>
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
        <div ref={rowB} aria-hidden="true" className={`${rowClass} text-accent`}>
          {Array.from({ length: COPIES }, (_, copy) => (
            <ul key={copy} className="flex">
              <Words items={reversed} />
            </ul>
          ))}
        </div>
      </div>
      <StripeDivider />
    </div>
  );
}

"use client";

import { animate, useInView } from "motion/react";
import { useEffect, useLayoutEffect, useRef, type ReactNode, type RefObject } from "react";
import { FADE_DURATION, FADE_EASE, usePrefersReducedMotion } from "@/lib/animations";

type FadeInProps = {
  children: ReactNode;
  as?: "div" | "li" | "p" | "span" | "header" | "figure";
  delay?: number;
  duration?: number;
  /** Desplazamiento inicial en px (se anima hasta 0). */
  x?: number;
  y?: number;
  className?: string;
};

/**
 * Aparece una sola vez al entrar en pantalla (margen 50px).
 * - El HTML del servidor sale visible: sin JS no se oculta nada.
 * - Tras hidratar, solo se ocultan los elementos que están por debajo de la
 *   ventana; lo que ya se ve (o ya se pasó) no parpadea ni se vuelve a animar.
 * - Con prefers-reduced-motion no se oculta ni se anima nada.
 */
export function FadeIn({
  children,
  as = "div",
  delay = 0,
  duration = FADE_DURATION,
  x = 0,
  y = 30,
  className,
}: FadeInProps) {
  const ref = useRef<HTMLElement>(null);
  const armed = useRef(false);
  const inView = useInView(ref, { once: true, margin: "50px" });
  const reduced = usePrefersReducedMotion();

  // Antes de pintar: oculta solo lo que todavía está por debajo de la ventana.
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || reduced) return;
    if (el.getBoundingClientRect().top < window.innerHeight + 50) return;
    el.style.opacity = "0";
    el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    armed.current = true;
    return () => {
      // Si cambia a movimiento reducido (o se desmonta), queda visible.
      armed.current = false;
      el.style.opacity = "";
      el.style.transform = "";
    };
  }, [reduced, x, y]);

  useEffect(() => {
    const el = ref.current;
    if (!el || !inView || !armed.current) return;
    armed.current = false;
    const controls = animate(
      el,
      { opacity: 1, transform: "translate3d(0px, 0px, 0px)" },
      { duration, delay, ease: FADE_EASE },
    );
    return () => controls.stop();
  }, [inView, delay, duration]);

  // Todas las etiquetas admitidas son HTMLElement; se tipa como div para el ref.
  const Tag = as as "div";
  return (
    <Tag ref={ref as RefObject<HTMLDivElement>} className={className}>
      {children}
    </Tag>
  );
}

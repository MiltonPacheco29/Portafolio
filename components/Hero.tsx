"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";
import { whenMotionAllowed } from "@/lib/animations";

gsap.registerPlugin(useGSAP, ScrollTrigger);

type HeroProps = {
  line1: string;
  line2: string;
  /** Idioma de la frase si difiere del de la página (p. ej. "en" en /es/). */
  lang?: string;
};

/**
 * Frase a pantalla completa con neón suave. Al hacer scroll se reduce, el halo
 * se apaga poco a poco y la frase se desvanece mientras sube el contenido.
 * El avance va ligado al scroll (scrub): no hay parpadeos ni destellos.
 *
 * Con prefers-reduced-motion (CSS motion-safe + whenMotionAllowed) no se crea
 * ninguna animación: la frase queda estática y la sección mide una pantalla.
 */
export function Hero({ line1, line2, lang }: HeroProps) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;

      return whenMotionAllowed(gsap, () => {
        const timeline = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: el,
            // Empieza con el scroll en 0 (el Hero está debajo del hueco de la barra fija)
            // y termina cuando el final del tramo alto llega al borde inferior.
            start: () => `top ${el.getBoundingClientRect().top + window.scrollY}px`,
            end: "bottom bottom",
            scrub: 0.6,
            invalidateOnRefresh: true,
          },
        });

        timeline
          .to("[data-hero-phrase]", { scale: 0.42, yPercent: -12, duration: 1 }, 0)
          .to("[data-hero-line]", { "--neon-on": 0.15, duration: 1 }, 0)
          .to("[data-hero-phrase]", { opacity: 0, duration: 0.4 }, 0.6);

        // Las fuentes pueden cambiar el alto del texto al cargar.
        let cancelled = false;
        document.fonts?.ready.then(() => {
          if (!cancelled) ScrollTrigger.refresh();
        });
        return () => {
          cancelled = true;
        };
      });
    },
    // useGSAP revierte todo al desmontar; además se devuelve mm.revert() explícito.
    { scope: root },
  );

  return (
    <div ref={root} className="relative motion-safe:h-[180svh]">
      <div className="flex h-[calc(100svh-var(--nav-height))] items-center justify-center px-gutter motion-safe:sticky motion-safe:top-nav">
        <p
          data-hero-phrase
          lang={lang}
          className="text-center font-display text-hero font-bold tracking-tight text-balance motion-safe:will-change-transform"
        >
          <span data-hero-line className="neon block [--neon:var(--primary)]">
            {line1}
          </span>
          <span data-hero-line className="neon block [--neon:var(--accent)]">
            {line2}
          </span>
        </p>
      </div>
    </div>
  );
}

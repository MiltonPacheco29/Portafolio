"use client";

import { useEffect, useRef, useState } from "react";
import { preload } from "react-dom";
import { getReducedMotion } from "@/lib/animations";
import { fontPreloader } from "@/lib/fonts";
import {
  IMAGE_SOURCES,
  PRELOADER,
  SCENES,
  buildTimeline,
  type TimelineEntry,
} from "@/lib/preloader";

/**
 * Sobrevive a la navegación del cliente (incluido /es ↔ /en, que vuelve a montar
 * el layout raíz) y se reinicia al recargar: el preloader se ve una vez por carga.
 * La capa viene en el HTML estático y solo se omite en montajes posteriores del
 * cliente, así que la hidratación siempre coincide.
 */
let hasPlayed = false;

/** Elementos `position: fixed` que reciben la misma compensación de la barra de scroll. */
const COMPENSATE_SELECTOR = "[data-scroll-lock-compensate]";

/** Lo pone el efecto al tomar el control: desde ahí el bloqueo de scroll del CSS deja de aplicarse. */
const STARTED_ATTR = "data-preloader-started";

function measureScrollbar(): number {
  const probe = document.createElement("div");
  probe.style.cssText = "position:absolute;top:-9999px;width:100px;height:100px;overflow:scroll";
  document.body.appendChild(probe);
  const width = probe.offsetWidth - probe.clientWidth;
  probe.remove();
  return width;
}

/**
 * Preloader de pantalla completa: cortes secos palabra/imagen (intro y pasadas
 * de montaje cada vez más rápidas), cierre de la franja hacia el centro con el
 * montaje sonando dentro y apertura con dos cortinas que descubren la página.
 * Un único bucle de requestAnimationFrame recorre una timeline de inicios
 * absolutos (lib/preloader.ts); cierre y apertura son Web Animations ancladas a
 * sus labels. No hay re-renders por corte.
 *
 * Excepción documentada en DESIGN.md §6: con prefers-reduced-motion no se muestra.
 */
export function Preloader() {
  const [visible, setVisible] = useState(() => !hasPlayed);
  const overlayRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const curtainTopRef = useRef<HTMLDivElement>(null);
  const curtainBottomRef = useRef<HTMLDivElement>(null);
  const sceneRefs = useRef<(HTMLDivElement | null)[]>([]);
  const wordRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const imageRefs = useRef<(HTMLImageElement | null)[]>([]);

  // <link rel="preload" as="image"> en <head> para que las imágenes se pidan cuanto antes.
  if (visible) {
    for (const src of IMAGE_SOURCES) preload(src, { as: "image" });
  }

  useEffect(() => {
    const overlay = overlayRef.current;
    const stage = stageRef.current;
    const curtains = [curtainTopRef.current, curtainBottomRef.current];
    if (!overlay || !stage || !curtains[0] || !curtains[1]) return;
    const [curtainTop, curtainBottom] = curtains as [HTMLDivElement, HTMLDivElement];
    hasPlayed = true;

    // Con movimiento reducido el CSS ya oculta la capa (motion-reduce:hidden) y
    // no bloquea el scroll; aquí solo se quita del DOM.
    if (getReducedMotion()) {
      const id = requestAnimationFrame(() => setVisible(false));
      return () => cancelAnimationFrame(id);
    }

    const scenes = sceneRefs.current;
    const words = wordRefs.current.filter((el): el is HTMLSpanElement => el != null);
    const images = imageRefs.current.filter((el): el is HTMLImageElement => el != null);
    const timeline = buildTimeline();
    const { entries, labels, totalDuration, collapse, open } = timeline;
    const lastIndex = entries.length - 1;
    const debug = new URLSearchParams(window.location.search).has("debug");

    let cancelled = false;
    let raf = 0;
    let timer = 0;
    let t0 = -1;
    let hiddenAt = -1;
    let waitingVisible = false;
    let current = -1;
    let active: HTMLElement | null = null;
    let collapseAnim: Animation | null = null;
    let openAnims: Animation[] = [];
    const detected: Record<string, number> = {};
    const cuts: number[] = [];
    const cleanups: (() => void)[] = [];
    const running = () => [collapseAnim, ...openAnims].filter((a): a is Animation => a !== null);

    const listen = (
      target: EventTarget,
      type: string,
      handler: () => void,
      options?: AddEventListenerOptions,
    ) => {
      target.addEventListener(type, handler, options);
      cleanups.push(() => target.removeEventListener(type, handler, options));
    };

    if (debug) {
      console.table(
        entries.map((entry) => ({
          escena: SCENES[entry.scene].label,
          pasada: entry.pass,
          inicio: entry.start,
          duración: entry.duration,
        })),
      );
      console.log(
        `[preloader] ${Object.entries(labels)
          .map(([name, ms]) => `${name} ${ms}`)
          .join(" · ")} · totalDuration ${totalDuration}`,
        `· cierre ${collapse.duration} ms${open ? ` · apertura ${open.duration} ms` : ""}`,
      );
    }

    // --- Bloqueo de scroll con compensación de la barra (sin salto horizontal) ---
    // Hasta aquí lo bloqueaba el CSS (body:has(> [data-preloader]…)); desde ahora
    // lo lleva el estilo inline, que se quita junto con la compensación.
    const { body, documentElement: root } = document;
    const compensated = [body, ...document.querySelectorAll<HTMLElement>(COMPENSATE_SELECTOR)];
    const savedPadding = compensated.map((el) => el.style.paddingRight);
    const savedOverflow = body.style.overflow;
    const gap = root.scrollHeight > root.clientHeight ? measureScrollbar() : 0;
    if (gap > 0) {
      const base = compensated.map((el) => parseFloat(getComputedStyle(el).paddingRight) || 0);
      compensated.forEach((el, i) => {
        el.style.paddingRight = `${base[i] + gap}px`;
      });
    }
    body.style.overflow = "hidden";
    overlay.setAttribute(STARTED_ATTR, "");
    let locked = true;
    const unlock = () => {
      if (!locked) return;
      locked = false;
      compensated.forEach((el, i) => {
        el.style.paddingRight = savedPadding[i];
      });
      body.style.overflow = savedOverflow;
    };

    // --- Ajuste al ancho: ningún texto pasa del 90 % de la ventana ---
    const fitWords = () => {
      const max = 0.9 * window.innerWidth;
      for (const word of words) word.style.fontSize = "";
      const sizes = words.map((word) => {
        const style = getComputedStyle(word);
        const stretch = parseFloat(style.getPropertyValue("--stretch")) || 1;
        const width = word.offsetWidth * stretch; // offsetWidth ignora transform y scale
        return width > max ? (parseFloat(style.fontSize) * max) / width : 0;
      });
      words.forEach((word, i) => {
        if (sizes[i] > 0) word.style.fontSize = `${sizes[i]}px`;
      });
    };
    fitWords();
    listen(window, "resize", fitWords);

    // --- Cortes ---
    const show = (entry: TimelineEntry) => {
      const scene = scenes[entry.scene];
      if (!scene) return;
      // Quitar y poner en la misma tarea: nunca hay 0 ni 2 escenas visibles.
      if (active && active !== scene) active.removeAttribute("data-active");
      scene.style.setProperty("--frame-dur", `${entry.duration}ms`);
      scene.setAttribute("data-active", "");
      active = scene;
    };

    const finish = () => {
      if (cancelled) return;
      if (debug) {
        // Fotograma en que terminó la última animación (mismo reloj que t0 y los
        // cortes) y, aparte, el momento en que se resolvió la promesa.
        const frameTime = Number(document.timeline.currentTime ?? performance.now());
        console.table(
          entries.map((entry, i) => ({
            escena: SCENES[entry.scene].label,
            pasada: entry.pass,
            programado: entry.start,
            real: cuts[i] === undefined ? "saltado" : Number(cuts[i].toFixed(1)),
            desfase: cuts[i] === undefined ? "—" : Number((cuts[i] - entry.start).toFixed(1)),
          })),
        );
        console.log(
          `[preloader] ${Object.entries(detected)
            .map(([name, ms]) => `${name} detectado ${ms.toFixed(1)} ms (anclado a ${labels[name]})`)
            .join(" · ")}`,
          `· total real ${(frameTime - t0).toFixed(1)} ms (planificado ${totalDuration} ms;`,
          `promesa resuelta a ${(performance.now() - t0).toFixed(1)} ms)`,
        );
      }
      teardown();
      setVisible(false);
    };

    // Cierre: la franja (stage) se cierra hacia el centro. El bucle de cortes
    // sigue, así que con start "montage" el montaje se ve dentro de la franja.
    // Fuera de ella queda el fondo negro del overlay si hay apertura.
    const startCollapse = (t: number) => {
      detected.collapse = t;
      const target = open ? stage : overlay;
      collapseAnim = target.animate(
        [{ clipPath: "inset(0 0 0 0)" }, { clipPath: "inset(50% 0 50% 0)" }],
        { duration: collapse.duration, easing: collapse.easing, fill: "forwards" },
      );
      // Mismo reloj que el timestamp de rAF: empieza justo en el label, no en este fotograma.
      collapseAnim.startTime = t0 + collapse.start;
      if (!open) collapseAnim.finished.then(finish, () => {});
    };

    // Apertura: el overlay se vuelve transparente y dos cortinas negras se separan.
    const startOpen = (t: number) => {
      if (!open) return;
      detected.open = t;
      overlay.style.backgroundColor = "transparent";
      const options: KeyframeAnimationOptions = {
        duration: open.duration,
        easing: open.easing,
        fill: "forwards",
      };
      openAnims = [
        [curtainTop, "translateY(-100%)"] as const,
        [curtainBottom, "translateY(100%)"] as const,
      ].map(([curtain, to]) => {
        curtain.style.visibility = "visible";
        const anim = curtain.animate([{ transform: "translateY(0)" }, { transform: to }], options);
        anim.startTime = t0 + open.start;
        return anim;
      });
      Promise.all(openAnims.map((anim) => anim.finished)).then(finish, () => {});
    };

    const frame = (now: number) => {
      raf = 0;
      if (t0 < 0) t0 = now;
      const t = now - t0;
      let next = current;
      while (next + 1 < entries.length && entries[next + 1].start <= t) next++;
      if (next !== current) {
        current = next;
        show(entries[next]);
        cuts[next] = t;
      }
      if (!collapseAnim && t >= collapse.start) startCollapse(t);
      if (open && openAnims.length === 0 && t >= open.start) startOpen(t);
      // El bucle sigue hasta que no quedan cortes ni animaciones por lanzar.
      const pending = current < lastIndex || !collapseAnim || (open !== null && openAnims.length === 0);
      if (pending) raf = requestAnimationFrame(frame);
    };

    // --- Pestaña oculta: timeline, cierre y apertura se pausan ---
    listen(document, "visibilitychange", () => {
      if (document.hidden) {
        if (t0 < 0 || hiddenAt >= 0) return;
        hiddenAt = performance.now();
        cancelAnimationFrame(raf);
        raf = 0;
        for (const anim of running()) anim.pause();
      } else if (waitingVisible) {
        waitingVisible = false;
        raf = requestAnimationFrame(frame);
      } else if (hiddenAt >= 0) {
        t0 += performance.now() - hiddenAt;
        hiddenAt = -1;
        for (const anim of running()) anim.play();
        raf = requestAnimationFrame(frame);
      }
    });

    const start = () => {
      if (cancelled) return;
      window.clearTimeout(timer);
      fitWords();
      if (document.hidden) waitingVisible = true;
      else raf = requestAnimationFrame(frame);
    };

    // --- Espera de recursos (solo antes de empezar) ---
    const markFailed = (img: HTMLImageElement) => {
      img.closest("[data-scene]")?.setAttribute("data-failed", "");
    };
    const waitImage = (img: HTMLImageElement) =>
      new Promise<void>((resolve) => {
        let settled = false;
        const settle = () => {
          if (settled) return;
          settled = true;
          if (img.naturalWidth === 0) {
            markFailed(img);
            resolve();
          } else {
            img.decode().then(resolve, resolve);
          }
        };
        // La imagen puede haber terminado antes de hidratar: no basta con onLoad.
        if (img.complete) settle();
        else {
          listen(img, "load", settle, { once: true });
          listen(img, "error", settle, { once: true });
        }
      });

    const windowLoaded =
      document.readyState === "complete"
        ? Promise.resolve()
        : new Promise<void>((resolve) => listen(window, "load", resolve, { once: true }));

    const texts = SCENES.flatMap((scene) => (scene.kind === "word" ? [scene.text] : [])).join("");
    const fontsLoaded = Promise.all([
      document.fonts.ready,
      document.fonts.load(`1em ${fontPreloader.style.fontFamily}`, texts),
    ]).then(
      () => {
        if (!cancelled) fitWords();
      },
      () => {},
    );

    const timeout = new Promise<void>((resolve) => {
      timer = window.setTimeout(resolve, PRELOADER.maxWaitForAssets);
    });

    Promise.race([Promise.all([fontsLoaded, windowLoaded, ...images.map(waitImage)]), timeout]).then(
      start,
    );

    function teardown() {
      cancelled = true;
      cancelAnimationFrame(raf);
      window.clearTimeout(timer);
      cleanups.splice(0).forEach((fn) => fn());
      unlock();
    }

    // Strict Mode ejecuta el efecto dos veces en desarrollo: no deben quedar dos
    // secuencias ni el scroll bloqueado.
    return () => {
      teardown();
      for (const anim of running()) anim.cancel();
      active?.removeAttribute("data-active");
      overlay.removeAttribute(STARTED_ATTR);
      overlay.style.backgroundColor = "";
      curtainTop.style.visibility = "";
      curtainBottom.style.visibility = "";
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      ref={overlayRef}
      aria-hidden="true"
      data-preloader=""
      className={`${fontPreloader.variable} fixed inset-0 z-[9999] overflow-hidden bg-black motion-reduce:hidden`}
    >
      {/* Sin JavaScript la secuencia no puede correr: la capa no debe tapar la página
          ni bloquear el scroll (mismo selector que el bloqueo de globals.css). */}
      <noscript>
        <style>
          {
            "[data-preloader]{display:none}body:has(> [data-preloader]:not([data-preloader-started])){overflow:revert-layer}"
          }
        </style>
      </noscript>

      {/* Stage: la franja que se cierra; fuera de ella se ve el fondo del overlay. */}
      <div ref={stageRef} className="absolute inset-0">
        {SCENES.map((scene, i) => (
          <div
            key={`${scene.kind}-${i}`}
            ref={(el) => {
              sceneRefs.current[i] = el;
            }}
            data-scene=""
            className={`group invisible absolute inset-0 flex items-center justify-center data-active:visible ${
              scene.kind === "word" ? "bg-black" : "bg-[#111]"
            }`}
          >
            {scene.kind === "word" ? (
              <span
                ref={(el) => {
                  wordRefs.current[i] = el;
                }}
                className="preloader-word group-data-active:animate-preloader-punch"
              >
                {scene.text}
              </span>
            ) : (
              <>
                {/* Marcador si la imagen no carga (queda debajo de la imagen). */}
                <div className="absolute inset-0 flex items-center justify-center bg-[repeating-linear-gradient(45deg,#1a1a1a_0_20px,#222_20px_40px)] text-base tracking-[0.2em] text-[#777] [font-family:system-ui]">
                  {scene.label}
                </div>
                {/* eslint-disable-next-line @next/next/no-img-element -- export estático con images.unoptimized: next/image no optimiza nada y aquí hace falta el <img> real para comprobar complete y llamar a decode(). */}
                <img
                  ref={(el) => {
                    imageRefs.current[i] = el;
                  }}
                  src={scene.src}
                  alt=""
                  loading="eager"
                  decoding="async"
                  className="absolute inset-0 size-full object-cover grayscale contrast-115 group-data-active:animate-preloader-zoom group-data-failed:hidden"
                />
              </>
            )}
          </div>
        ))}
      </div>

      {/* Cortinas de la apertura: 50 % + 1px cada una para que no quede una línea en el centro. */}
      <div
        ref={curtainTopRef}
        className="invisible absolute inset-x-0 top-0 h-[calc(50%+1px)] bg-black"
      />
      <div
        ref={curtainBottomRef}
        className="invisible absolute inset-x-0 bottom-0 h-[calc(50%+1px)] bg-black"
      />
    </div>
  );
}

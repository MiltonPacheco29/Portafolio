"use client";

import { useEffect, useRef, useState } from "react";
import { preload } from "react-dom";
import { playPreloader } from "@/components/preloader/engine";
import { getReducedMotion } from "@/lib/animations";
import { fontPreloader } from "@/lib/config/fonts";
import { IMAGE_SOURCES, SCENES } from "@/lib/preloader/config";

/**
 * Sobrevive a la navegación del cliente (incluido /es ↔ /en, que vuelve a montar
 * el layout raíz) y se reinicia al recargar: el preloader se ve una vez por carga.
 * La capa viene en el HTML estático y solo se omite en montajes posteriores del
 * cliente, así que la hidratación siempre coincide.
 */
let hasPlayed = false;

/**
 * Preloader de pantalla completa: cortes secos palabra/imagen, cierre de la
 * franja con el montaje dentro y apertura con cortinas (DESIGN.md §6).
 * Este componente solo pinta la capa y conecta el motor (engine.ts), que
 * mueve el DOM directamente: no hay re-renders por corte.
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
    const curtainTop = curtainTopRef.current;
    const curtainBottom = curtainBottomRef.current;
    if (!overlay || !stage || !curtainTop || !curtainBottom) return;
    hasPlayed = true;

    // Con movimiento reducido el CSS ya oculta la capa (motion-reduce:hidden) y
    // no bloquea el scroll; aquí solo se quita del DOM.
    if (getReducedMotion()) {
      const id = requestAnimationFrame(() => setVisible(false));
      return () => cancelAnimationFrame(id);
    }

    // Strict Mode ejecuta el efecto dos veces en desarrollo: la limpieza del motor
    // evita que queden dos secuencias o el scroll bloqueado.
    return playPreloader(
      {
        overlay,
        stage,
        curtains: [curtainTop, curtainBottom],
        scenes: sceneRefs.current,
        words: wordRefs.current.filter((el): el is HTMLSpanElement => el != null),
        images: imageRefs.current.filter((el): el is HTMLImageElement => el != null),
      },
      {
        fontFamily: fontPreloader.style.fontFamily,
        debug: new URLSearchParams(window.location.search).has("debug"),
        onComplete: () => setVisible(false),
      },
    );
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

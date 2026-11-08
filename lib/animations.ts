import type { Transition } from "motion/react";
import { useSyncExternalStore } from "react";

/**
 * Punto único para prefers-reduced-motion en JavaScript.
 * Ningún componente debe leer la media query por su cuenta: usa estos helpers.
 * (En CSS, la regla global de app/globals.css anula transiciones y animaciones.)
 */

export const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";
/** Para gsap.matchMedia(): animar solo dentro de esta condición. */
export const MOTION_OK_QUERY = "(prefers-reduced-motion: no-preference)";

/** Valor para <MotionConfig reducedMotion>: Motion respeta la preferencia del sistema. */
export const reducedMotionConfig = "user" as const;

function subscribeReducedMotion(onChange: () => void) {
  const media = window.matchMedia(REDUCED_MOTION_QUERY);
  media.addEventListener("change", onChange);
  return () => media.removeEventListener("change", onChange);
}

function getReducedMotion(): boolean {
  return window.matchMedia(REDUCED_MOTION_QUERY).matches;
}

// En el servidor no se conoce la preferencia: se asume movimiento reducido.
function getServerReducedMotion(): boolean {
  return true;
}

/**
 * true si hay que evitar el movimiento; se actualiza si cambia la preferencia.
 *
 * Usa useSyncExternalStore (no useReducedMotion de Motion) para que la
 * hidratación sea coherente: durante la hidratación React usa el valor del
 * servidor (true), así el HTML coincide; justo después aplica el valor real.
 * Con useReducedMotion el primer render del cliente ya leía matchMedia y,
 * por ejemplo, `layout` de Motion cambiaba el atributo style → error de hidratación.
 */
export function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(subscribeReducedMotion, getReducedMotion, getServerReducedMotion);
}

export const instant: Transition = { duration: 0 };

export const transitions = {
  /** Barra de navegación: ancho completo ↔ cápsula flotante. */
  navMorph: { type: "spring", bounce: 0, duration: 0.5 },
  /** Paneles desplegables (menú móvil). */
  panel: { duration: 0.18, ease: [0.22, 1, 0.36, 1] },
  /** Controles que reaparecen al expandir la barra: esperan a que termine navMorph. */
  navControlsIn: { duration: 0.2, delay: 0.3, ease: "easeOut" },
} satisfies Record<string, Transition>;

type GsapWithMatchMedia = {
  matchMedia: () => {
    add: (query: string, setup: () => void | (() => void)) => unknown;
    revert: () => void;
  };
};

/**
 * GSAP: crea las animaciones de `setup` solo si el usuario no pidió movimiento
 * reducido, y las crea o deshace en vivo si cambia la preferencia.
 * Devuelve la función de limpieza (revierte estilos y mata los ScrollTrigger).
 */
export function whenMotionAllowed(
  gsap: GsapWithMatchMedia,
  setup: () => void | (() => void),
): () => void {
  const mm = gsap.matchMedia();
  mm.add(MOTION_OK_QUERY, setup);
  return () => mm.revert();
}

/** Devuelve la transición pedida, o una instantánea si el movimiento está reducido. */
export function useMotionTransition(transition: Transition): Transition {
  return usePrefersReducedMotion() ? instant : transition;
}

/** Curva y duración de FadeIn (DESIGN.md §6). */
export const FADE_EASE = [0.25, 0.1, 0.25, 1] as const;
export const FADE_DURATION = 0.7;

/** Ratón o trackpad: hay hover real y puntero preciso. En táctil, Magnet se apaga. */
export const FINE_POINTER_QUERY = "(hover: hover) and (pointer: fine)";

function subscribeFinePointer(onChange: () => void) {
  const media = window.matchMedia(FINE_POINTER_QUERY);
  media.addEventListener("change", onChange);
  return () => media.removeEventListener("change", onChange);
}

/** true con ratón o trackpad; false en el servidor, en la hidratación y en pantallas táctiles. */
export function useFinePointer(): boolean {
  return useSyncExternalStore(
    subscribeFinePointer,
    () => window.matchMedia(FINE_POINTER_QUERY).matches,
    () => false,
  );
}

import type { Transition } from "motion/react";
import { useSyncExternalStore } from "react";

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

export const reducedMotionConfig = "user" as const;

function subscribeReducedMotion(onChange: () => void) {
  const media = window.matchMedia(REDUCED_MOTION_QUERY);
  media.addEventListener("change", onChange);
  return () => media.removeEventListener("change", onChange);
}

export function getReducedMotion(): boolean {
  return window.matchMedia(REDUCED_MOTION_QUERY).matches;
}

function getServerReducedMotion(): boolean {
  return true;
}

export function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(subscribeReducedMotion, getReducedMotion, getServerReducedMotion);
}

export const instant: Transition = { duration: 0 };

export const transitions = {
  navMorph: { type: "spring", bounce: 0, duration: 0.5 },
  panel: { duration: 0.18, ease: [0.22, 1, 0.36, 1] },
  navControlsIn: { duration: 0.2, delay: 0.3, ease: [0.22, 1, 0.36, 1] },
  menuIcon: { duration: 0.3, ease: [0.22, 1, 0.36, 1] },
  menuLinkIn: { duration: 0.35, ease: [0.22, 1, 0.36, 1] },
} satisfies Record<string, Transition>;

export const MENU_LINK_STAGGER = 0.06;

export function useMotionTransition(transition: Transition): Transition {
  return usePrefersReducedMotion() ? instant : transition;
}

export const FADE_EASE = [0.22, 1, 0.36, 1] as const;
export const FADE_DURATION = 0.7;

"use client";

import { useSyncExternalStore } from "react";
import { isSectionKey, type SectionKey } from "@/lib/i18n/locales";

// Sección visible: la última cuyo borde superior pasó el 40 % de la ventana.
// Las secciones se marcan con data-section="<clave>" en app/page.tsx.

function subscribe(onChange: () => void) {
  let frame = 0;
  const schedule = () => {
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(onChange);
  };
  window.addEventListener("scroll", schedule, { passive: true });
  window.addEventListener("resize", schedule);
  window.addEventListener("hashchange", schedule);
  return () => {
    cancelAnimationFrame(frame);
    window.removeEventListener("scroll", schedule);
    window.removeEventListener("resize", schedule);
    window.removeEventListener("hashchange", schedule);
  };
}

function getActiveSection(): SectionKey | null {
  const sections = document.querySelectorAll<HTMLElement>("[data-section]");
  if (sections.length === 0) return null;

  const line = window.innerHeight * 0.4;
  let active = sections[0].dataset.section;
  for (const section of sections) {
    if (section.getBoundingClientRect().top <= line) active = section.dataset.section;
  }
  // Al llegar al final, la última sección cuenta aunque sea corta.
  const atBottom =
    window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
  if (atBottom) active = sections[sections.length - 1].dataset.section;

  return isSectionKey(active) ? active : null;
}

function getServerSnapshot(): SectionKey | null {
  return null;
}

export function useActiveSection(): SectionKey | null {
  return useSyncExternalStore(subscribe, getActiveSection, getServerSnapshot);
}

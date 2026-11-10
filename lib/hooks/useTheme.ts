"use client";

import { useSyncExternalStore } from "react";
import { isTheme, type Theme } from "@/lib/theme";

function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-theme"],
  });
  return () => observer.disconnect();
}

export function getCurrentTheme(): Theme | null {
  const value = document.documentElement.getAttribute("data-theme");
  return isTheme(value) ? value : null;
}

function getServerSnapshot(): Theme | null {
  return null;
}

export function useTheme(): Theme | null {
  return useSyncExternalStore(subscribe, getCurrentTheme, getServerSnapshot);
}

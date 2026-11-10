"use client";

import { useEffect } from "react";
import {
  LIGHT_MEDIA_QUERY,
  THEME_STORAGE_KEY,
  isTheme,
  type Theme,
} from "@/lib/theme";
import { getCurrentTheme, useTheme } from "@/lib/hooks/useTheme";

type ThemeToggleProps = {
  labels: {
    toggle: string;
    toLight: string;
    toDark: string;
  };
};

function readStoredTheme(): Theme | null {
  try {
    const value = window.localStorage.getItem(THEME_STORAGE_KEY);
    return isTheme(value) ? value : null;
  } catch {
    return null;
  }
}

function storeTheme(theme: Theme) {
  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
  }
}

function applyTheme(theme: Theme) {
  document.documentElement.setAttribute("data-theme", theme);
}

export function ThemeToggle({ labels }: ThemeToggleProps) {
  const theme = useTheme();

  useEffect(() => {
    let media: MediaQueryList;
    try {
      media = window.matchMedia(LIGHT_MEDIA_QUERY);
    } catch {
      return;
    }
    const onSystemChange = (event: MediaQueryListEvent) => {
      if (readStoredTheme() === null) {
        applyTheme(event.matches ? "light" : "dark");
      }
    };
    media.addEventListener("change", onSystemChange);
    return () => media.removeEventListener("change", onSystemChange);
  }, []);

  const toggle = () => {
    const next: Theme = (getCurrentTheme() ?? "dark") === "light" ? "dark" : "light";
    applyTheme(next);
    storeTheme(next);
  };

  const label =
    theme === null ? labels.toggle : theme === "light" ? labels.toDark : labels.toLight;

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={label}
      title={label}
      className="inline-flex size-11 items-center justify-center rounded-sm border border-border-strong text-fg hover:border-primary hover:text-primary motion-safe:transition-colors"
    >
      <svg
        aria-hidden="true"
        focusable="false"
        viewBox="0 0 24 24"
        className="size-5 light:hidden"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      >
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
      </svg>
      <svg
        aria-hidden="true"
        focusable="false"
        viewBox="0 0 24 24"
        className="hidden size-5 light:block"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
      </svg>
    </button>
  );
}

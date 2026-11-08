"use client";

import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
} from "motion/react";
import { useEffect, useId, useRef, useState, type ComponentProps } from "react";
import { LangSwitch, type LangSwitchProps } from "@/components/LangSwitch";
import { ThemeToggle } from "@/components/ThemeToggle";
import {
  instant,
  transitions,
  useMotionTransition,
  usePrefersReducedMotion,
} from "@/lib/animations";
import type { SectionKey } from "@/lib/locales";
import { useActiveSection } from "@/lib/useActiveSection";

type NavbarProps = {
  brand: { text: string; homeLabel: string };
  homeId: string;
  navLabel: string;
  menuLabel: string;
  links: { key: SectionKey; id: string; title: string }[];
  langSwitch: Omit<LangSwitchProps, "className">;
  themeLabels: ComponentProps<typeof ThemeToggle>["labels"];
};

// Histéresis: se compacta al bajar de 80 px y se expande al volver por encima de 40 px,
// así la barra no salta de un estado a otro justo en el límite.
const COMPACT_AT = 80;
const EXPAND_AT = 40;
const DESKTOP_QUERY = "(min-width: 48rem)"; // = breakpoint md de Tailwind

export function Navbar({
  brand,
  homeId,
  navLabel,
  menuLabel,
  links,
  langSwitch,
  themeLabels,
}: NavbarProps) {
  const [bar, setBar] = useState({ compact: false, animate: false });
  const [menuOpen, setMenuOpen] = useState(false);
  const readyRef = useRef(false);
  const headerRef = useRef<HTMLElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const panelId = useId();
  const activeSection = useActiveSection();
  // Con movimiento reducido no hay animación de layout ni fundidos: el cambio
  // se aplica en el mismo fotograma (una transición "instantánea" de Motion
  // todavía pintaría un fotograma con el tamaño anterior).
  const reduced = usePrefersReducedMotion();
  const morph = useMotionTransition(transitions.navMorph);
  const panel = useMotionTransition(transitions.panel);
  const controlsIn = useMotionTransition(transitions.navControlsIn);

  const updateFromScroll = (y: number) => {
    // Antes de estar listos (carga a mitad de página) se cambia sin animar.
    const animate = readyRef.current;
    setBar((prev) => {
      const compact = prev.compact ? y > EXPAND_AT : y > COMPACT_AT;
      return compact === prev.compact ? prev : { compact, animate };
    });
  };

  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", updateFromScroll);

  // Primer fotograma: toma la posición real del scroll; el siguiente habilita la animación.
  useEffect(() => {
    let second = 0;
    const first = requestAnimationFrame(() => {
      updateFromScroll(window.scrollY);
      second = requestAnimationFrame(() => {
        readyRef.current = true;
      });
    });
    return () => {
      cancelAnimationFrame(first);
      cancelAnimationFrame(second);
    };
  }, []);

  // Menú móvil: Escape lo cierra y devuelve el foco al botón; también se cierra
  // al pulsar fuera o al pasar a escritorio.
  useEffect(() => {
    if (!menuOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    };
    const onPointerDown = (event: PointerEvent) => {
      if (!headerRef.current?.contains(event.target as Node)) setMenuOpen(false);
    };
    const desktop = window.matchMedia(DESKTOP_QUERY);
    const onDesktop = (event: MediaQueryListEvent) => {
      if (event.matches) setMenuOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    desktop.addEventListener("change", onDesktop);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
      desktop.removeEventListener("change", onDesktop);
    };
  }, [menuOpen]);

  const { compact } = bar;
  const barTransition = bar.animate ? morph : instant;
  const layoutBar = !reduced;
  const layoutChild = reduced ? false : "position";

  const linkClass = (key: SectionKey) =>
    `inline-flex min-h-11 items-center rounded-sm px-3 font-mono text-sm tracking-[var(--tracking-mono)] hover:text-primary motion-safe:transition-colors ${
      activeSection === key ? "text-primary" : "text-fg-muted"
    }`;

  return (
    <header
      ref={headerRef}
      // La franja exterior no captura clics: en modo cápsula se ve el contenido a los lados.
      className="pointer-events-none fixed inset-x-0 top-0 z-40 flex flex-col items-center"
    >
      <motion.div
        layout={layoutBar}
        transition={barTransition}
        data-compact={compact}
        // borderRadius en style para que Motion corrija la deformación durante la animación.
        style={{ borderRadius: compact ? 9999 : 0 }}
        className={`pointer-events-auto flex items-center gap-2 border-border motion-safe:transition-[background-color,border-color,box-shadow] motion-safe:duration-300 ${
          compact
            ? "mt-[var(--nav-float-gap)] w-fit max-w-[calc(100%-1.5rem)] border border-border-strong bg-surface py-1.5 pr-1.5 pl-4 shadow-glow-primary"
            : "w-full border-b bg-bg px-gutter py-3"
        }`}
      >
        <motion.a
          layout={layoutChild}
          transition={barTransition}
          href={`#${homeId}`}
          className="mr-auto inline-flex min-h-11 items-center rounded-sm pr-2 font-display text-lg font-bold text-primary"
        >
          <span aria-hidden="true" className="text-accent">
            {"//"}
          </span>
          <span className="ml-1">{brand.text}</span>
          <span className="sr-only"> · {brand.homeLabel}</span>
        </motion.a>

        {/* Escritorio: enlaces en línea */}
        <motion.nav
          layout={layoutChild}
          transition={barTransition}
          aria-label={navLabel}
          className="hidden md:block"
        >
          <ul className="flex items-center">
            {links.map((link) => (
              <li key={link.key}>
                <a
                  href={`#${link.id}`}
                  aria-current={activeSection === link.key ? "location" : undefined}
                  className={linkClass(link.key)}
                >
                  {link.title}
                </a>
              </li>
            ))}
          </ul>
        </motion.nav>

        {/* Idioma y tema solo con la barra expandida (arriba del todo). Al compactar
            salen del DOM al instante, antes de la animación, y Tab no puede caer en
            ellos. Al volver arriba reaparecen con un fundido tras la expansión. */}
        {!compact && (
          <motion.div
            key="nav-controls"
            initial={bar.animate && !reduced ? { opacity: 0 } : false}
            animate={{ opacity: 1 }}
            transition={controlsIn}
            className="flex items-center gap-1"
          >
            <LangSwitch {...langSwitch} className="hidden md:block" />
            <ThemeToggle labels={themeLabels} />
          </motion.div>
        )}

        <motion.div layout={layoutChild} transition={barTransition} className="md:hidden">
          {/* Móvil: botón del menú desplegable */}
          <button
            ref={menuButtonRef}
            type="button"
            aria-label={menuLabel}
            aria-expanded={menuOpen}
            aria-controls={panelId}
            onClick={() => setMenuOpen((open) => !open)}
            className="inline-flex size-11 items-center justify-center rounded-sm border border-border-strong text-fg hover:border-primary hover:text-primary motion-safe:transition-colors"
          >
            <svg
              aria-hidden="true"
              focusable="false"
              viewBox="0 0 24 24"
              className="size-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              {menuOpen ? (
                <path d="M6 6l12 12M18 6L6 18" />
              ) : (
                <path d="M4 7h16M4 12h16M4 17h16" />
              )}
            </svg>
          </button>
        </motion.div>
      </motion.div>

      {/* El id existe siempre para que aria-controls apunte a algo válido. */}
      <div id={panelId} className="pointer-events-auto w-[calc(100%-1.5rem)] max-w-md md:hidden">
        <AnimatePresence initial={false}>
          {menuOpen && (
            <motion.div
              key="panel"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={panel}
              className="mt-2 flex flex-col gap-4 rounded-md border border-border-strong bg-surface p-4 shadow-glow-primary"
            >
              <nav aria-label={navLabel}>
                <ul className="flex flex-col">
                  {links.map((link) => (
                    <li key={link.key}>
                      <a
                        href={`#${link.id}`}
                        aria-current={activeSection === link.key ? "location" : undefined}
                        onClick={() => setMenuOpen(false)}
                        className={`${linkClass(link.key)} w-full`}
                      >
                        {link.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
              <LangSwitch {...langSwitch} className="border-t border-border pt-3" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}

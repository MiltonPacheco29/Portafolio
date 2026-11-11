"use client";

import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
} from "motion/react";
import { useEffect, useId, useRef, useState, type ComponentProps } from "react";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import {
  instant,
  MENU_LINK_STAGGER,
  transitions,
  useMotionTransition,
  usePrefersReducedMotion,
} from "@/lib/animations";
import type { SectionKey } from "@/lib/i18n/locales";
import { useActiveSection } from "@/lib/hooks/useActiveSection";

type NavbarProps = {
  brand: { text: string; homeLabel: string };
  homeId: string;
  navLabel: string;
  menuLabel: string;
  links: { key: SectionKey; id: string; title: string }[];
  themeLabels: ComponentProps<typeof ThemeToggle>["labels"];
};

const COMPACT_AT = 80;
const EXPAND_AT = 40;
const DESKTOP_QUERY = "(min-width: 48rem)";

export function Navbar({
  brand,
  homeId,
  navLabel,
  menuLabel,
  links,
  themeLabels,
}: NavbarProps) {
  const [bar, setBar] = useState({ compact: false, animate: false });
  const [menuOpen, setMenuOpen] = useState(false);
  const readyRef = useRef(false);
  const headerRef = useRef<HTMLElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const panelId = useId();
  const activeSection = useActiveSection();
  const reduced = usePrefersReducedMotion();
  const morph = useMotionTransition(transitions.navMorph);
  const panel = useMotionTransition(transitions.panel);
  const controlsIn = useMotionTransition(transitions.navControlsIn);
  const iconMorph = useMotionTransition(transitions.menuIcon);
  const linkIn = useMotionTransition(transitions.menuLinkIn);

  const updateFromScroll = (y: number) => {
    const animate = readyRef.current;
    setBar((prev) => {
      const compact = prev.compact ? y > EXPAND_AT : y > COMPACT_AT;
      return compact === prev.compact ? prev : { compact, animate };
    });
  };

  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", updateFromScroll);

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
    `inline-flex min-h-11 items-center rounded-sm px-3 font-mono text-sm tracking-[var(--tracking-mono)] hover:text-primary motion-safe:transition-colors motion-safe:duration-200 ${
      activeSection === key ? "text-primary" : "text-fg-muted"
    }`;

  /* Indicador de sección activa (escritorio): línea que crece desde la izquierda. */
  const indicatorClass = (key: SectionKey) =>
    `relative after:absolute after:inset-x-3 after:bottom-2 after:h-px after:origin-left after:bg-primary hover:after:scale-x-100 motion-safe:after:transition-transform motion-safe:after:duration-300 ${
      activeSection === key ? "after:scale-x-100" : "after:scale-x-0"
    }`;

  return (
    <header
      ref={headerRef}
      data-scroll-lock-compensate=""
      className="enter pointer-events-none fixed inset-x-0 top-0 z-40 flex flex-col items-center [--enter-y:-20px]"
    >
      <motion.div
        layout={layoutBar}
        transition={barTransition}
        data-compact={compact}
        style={{ borderRadius: compact ? 9999 : 0 }}
        className={`pointer-events-auto flex items-center gap-2 border-border motion-safe:transition-[background-color,border-color,box-shadow] motion-safe:duration-300 ${
          compact
            ? "mt-[var(--nav-float-gap)] w-fit max-w-[calc(100%-1.5rem)] border border-border-strong bg-surface/85 py-1.5 pr-1.5 pl-4 shadow-glow-primary backdrop-blur-md"
            : "w-full border-b bg-bg/70 px-gutter py-3 backdrop-blur-md"
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
                  className={`${linkClass(link.key)} ${indicatorClass(link.key)}`}
                >
                  {link.title}
                </a>
              </li>
            ))}
          </ul>
        </motion.nav>

        {!compact && (
          <motion.div
            key="nav-controls"
            initial={bar.animate && !reduced ? { opacity: 0 } : false}
            animate={{ opacity: 1 }}
            transition={controlsIn}
            className="flex items-center gap-1"
          >
            <ThemeToggle labels={themeLabels} />
          </motion.div>
        )}

        <motion.div layout={layoutChild} transition={barTransition} className="md:hidden">
          <button
            ref={menuButtonRef}
            type="button"
            aria-label={menuLabel}
            aria-expanded={menuOpen}
            aria-controls={panelId}
            onClick={() => setMenuOpen((open) => !open)}
            className="inline-flex size-11 items-center justify-center rounded-sm border border-border-strong text-fg hover:border-primary hover:text-primary motion-safe:transition-colors motion-safe:duration-200"
          >
            <svg
              aria-hidden="true"
              focusable="false"
              viewBox="0 0 24 24"
              className="size-5 overflow-visible"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <motion.path
                d="M4 7h16"
                initial={false}
                animate={menuOpen ? { y: 5, rotate: 45 } : { y: 0, rotate: 0 }}
                transition={iconMorph}
              />
              <motion.path
                d="M4 12h16"
                initial={false}
                animate={{ opacity: menuOpen ? 0 : 1 }}
                transition={iconMorph}
              />
              <motion.path
                d="M4 17h16"
                initial={false}
                animate={menuOpen ? { y: -5, rotate: -45 } : { y: 0, rotate: 0 }}
                transition={iconMorph}
              />
            </svg>
          </button>
        </motion.div>
      </motion.div>

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
                <motion.ul
                  className="flex flex-col"
                  initial={reduced ? false : "hidden"}
                  animate="visible"
                  variants={{ visible: { transition: { staggerChildren: reduced ? 0 : MENU_LINK_STAGGER } } }}
                >
                  {links.map((link) => (
                    <motion.li
                      key={link.key}
                      variants={{
                        hidden: { opacity: 0, y: 24 },
                        visible: { opacity: 1, y: 0, transition: linkIn },
                      }}
                    >
                      <a
                        href={`#${link.id}`}
                        aria-current={activeSection === link.key ? "location" : undefined}
                        onClick={() => setMenuOpen(false)}
                        className={`${linkClass(link.key)} w-full`}
                      >
                        {link.title}
                      </a>
                    </motion.li>
                  ))}
                </motion.ul>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}

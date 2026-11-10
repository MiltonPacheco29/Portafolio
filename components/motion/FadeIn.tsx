"use client";

import { animate, useInView } from "motion/react";
import { useEffect, useLayoutEffect, useRef, type ReactNode, type RefObject } from "react";
import { FADE_DURATION, FADE_EASE, usePrefersReducedMotion } from "@/lib/animations";

type FadeInProps = {
  children: ReactNode;
  as?: "div" | "li";
  delay?: number;
  duration?: number;
  x?: number;
  y?: number;
  className?: string;
};

export function FadeIn({
  children,
  as = "div",
  delay = 0,
  duration = FADE_DURATION,
  x = 0,
  y = 30,
  className,
}: FadeInProps) {
  const ref = useRef<HTMLElement>(null);
  const armed = useRef(false);
  const inView = useInView(ref, { once: true, margin: "50px" });
  const reduced = usePrefersReducedMotion();

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || reduced) return;
    if (el.getBoundingClientRect().top < window.innerHeight + 50) return;
    el.style.opacity = "0";
    el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    armed.current = true;
    return () => {
      armed.current = false;
      el.style.opacity = "";
      el.style.transform = "";
    };
  }, [reduced, x, y]);

  useEffect(() => {
    const el = ref.current;
    if (!el || !inView || !armed.current) return;
    armed.current = false;
    const controls = animate(
      el,
      { opacity: 1, transform: "translate3d(0px, 0px, 0px)" },
      { duration, delay, ease: FADE_EASE },
    );
    return () => controls.stop();
  }, [inView, delay, duration]);

  const Tag = as as "div";
  return (
    <Tag ref={ref as RefObject<HTMLDivElement>} className={className}>
      {children}
    </Tag>
  );
}

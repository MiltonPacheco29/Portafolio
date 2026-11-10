"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { useFinePointer, usePrefersReducedMotion } from "@/lib/animations";

type MagnetProps = {
  children: ReactNode;
  padding?: number;
  strength?: number;
  activeTransition?: string;
  inactiveTransition?: string;
  className?: string;
};

export function Magnet({
  children,
  padding = 150,
  strength = 3,
  activeTransition = "transform 0.3s ease-out",
  inactiveTransition = "transform 0.6s ease-in-out",
  className = "",
}: MagnetProps) {
  const outer = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();
  const finePointer = useFinePointer();

  useEffect(() => {
    const box = outer.current;
    const el = inner.current;
    if (!box || !el || reduced || !finePointer) return;

    let frame = 0;
    let active = false;
    let pointerX = 0;
    let pointerY = 0;

    const update = () => {
      frame = 0;
      const rect = box.getBoundingClientRect();
      const dx = pointerX - (rect.left + rect.width / 2);
      const dy = pointerY - (rect.top + rect.height / 2);
      const near = Math.abs(dx) < rect.width / 2 + padding && Math.abs(dy) < rect.height / 2 + padding;

      if (near) {
        if (!active) {
          active = true;
          el.style.transition = activeTransition;
        }
        el.style.transform = `translate3d(${dx / strength}px, ${dy / strength}px, 0)`;
      } else if (active) {
        active = false;
        el.style.transition = inactiveTransition;
        el.style.transform = "translate3d(0, 0, 0)";
      }
    };

    const onMove = (event: PointerEvent) => {
      pointerX = event.clientX;
      pointerY = event.clientY;
      if (!frame) frame = requestAnimationFrame(update);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(frame);
      el.style.transition = "";
      el.style.transform = "";
    };
  }, [reduced, finePointer, padding, strength, activeTransition, inactiveTransition]);

  return (
    <div ref={outer} className={className}>
      <div ref={inner} className="motion-safe:will-change-transform">
        {children}
      </div>
    </div>
  );
}

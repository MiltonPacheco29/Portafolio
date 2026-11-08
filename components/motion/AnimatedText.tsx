"use client";

import { useMotionValueEvent, useScroll } from "motion/react";
import { useEffect, useRef, type CSSProperties } from "react";
import { usePrefersReducedMotion } from "@/lib/animations";

type AnimatedTextProps = {
  text: string;
  className?: string;
};

type Word = { chars: string[]; start: number } | { space: string };

/** Separa en palabras (para que no se partan al saltar de línea) y numera los caracteres. */
function splitText(text: string): { words: Word[]; total: number } {
  const words: Word[] = [];
  let total = 0;
  for (const part of text.split(/(\s+)/)) {
    if (!part) continue;
    if (/^\s+$/.test(part)) {
      words.push({ space: part });
    } else {
      const chars = Array.from(part);
      words.push({ chars, start: total });
      total += chars.length;
    }
  }
  return { words, total };
}

/**
 * Párrafo que se revela carácter a carácter con el scroll
 * (offset "start 0.8" → "end 0.2"), de opacidad 0.65 a 1.
 * - Una sola variable CSS (--reveal) en el párrafo; cada carácter calcula su
 *   opacidad en CSS (.reveal-char en globals.css): sin cientos de valores animados.
 * - Accesible: el texto completo va en un span sr-only y los caracteres
 *   animados llevan aria-hidden (aria-label en un <p> no es fiable).
 * - Sin JS o con movimiento reducido, --reveal vale 1 (texto completo).
 */
export function AnimatedText({ text, className = "" }: AnimatedTextProps) {
  const ref = useRef<HTMLParagraphElement>(null);
  const reduced = usePrefersReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.8", "end 0.2"] });
  const { words, total } = splitText(text);

  const apply = (value: number) => {
    ref.current?.style.setProperty("--reveal", reduced ? "1" : value.toFixed(3));
  };

  useMotionValueEvent(scrollYProgress, "change", apply);
  useEffect(() => {
    ref.current?.style.setProperty("--reveal", reduced ? "1" : scrollYProgress.get().toFixed(3));
  }, [reduced, scrollYProgress]);

  return (
    <p ref={ref} className={`reveal ${className}`} style={{ "--reveal-total": total } as CSSProperties}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {words.map((word, w) =>
          "space" in word ? (
            word.space
          ) : (
            <span key={w} className="whitespace-nowrap">
              {word.chars.map((char, c) => (
                <span key={c} className="reveal-char" style={{ "--i": word.start + c } as CSSProperties}>
                  {char}
                </span>
              ))}
            </span>
          ),
        )}
      </span>
    </p>
  );
}

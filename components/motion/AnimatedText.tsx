"use client";

import { useMotionValueEvent, useScroll } from "motion/react";
import { useEffect, useRef, type CSSProperties } from "react";
import { usePrefersReducedMotion } from "@/lib/animations";

type AnimatedTextProps = {
  text: string;
  className?: string;
};

type Word = { chars: string[]; start: number } | { space: string };

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

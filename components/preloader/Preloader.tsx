"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { playPreloader } from "@/components/preloader/engine";
import { getReducedMotion } from "@/lib/animations";
import type { Dictionary } from "@/lib/i18n";
import { PRELOADER } from "@/lib/preloader/config";

type PreloaderProps = {
  labels: Dictionary["preloader"];
};

let hasPlayed = false;

/** Pista segmentada: cada segmento solo recibe su índice; el estado lo calcula el CSS desde --p. */
function SegmentTrack({ count, className }: { count: number; className: string }) {
  return (
    <div className={`pl-bar w-full ${className}`} style={{ "--n": count } as CSSProperties}>
      {Array.from({ length: count }, (_, i) => (
        <span key={i} className="pl-seg" style={{ "--i": i } as CSSProperties} />
      ))}
    </div>
  );
}

export function Preloader({ labels }: PreloaderProps) {
  const [visible, setVisible] = useState(() => !hasPlayed);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    hasPlayed = true;
    return playPreloader(root, {
      reduced: getReducedMotion(),
      onComplete: () => setVisible(false),
    });
  }, []);

  if (!visible) return null;

  return (
    <div
      ref={rootRef}
      data-preloader=""
      className="pl-root fixed inset-0 z-[9999] overflow-hidden"
      style={{ "--trail": PRELOADER.segments.trail } as CSSProperties}
    >
      <noscript>
        <style>{"[data-preloader]{display:none}"}</style>
      </noscript>

      <div
        aria-hidden="true"
        className="pl-header type-display absolute top-4 left-4 flex items-baseline gap-2 text-lg sm:top-5 sm:left-6 sm:text-2xl lg:top-6 lg:left-8 lg:text-3xl"
      >
        <span className="text-(--pl-fg)">{labels.brand}</span>
        <span className="text-(--pl-muted)">/ {labels.status}</span>
        <span className="pl-cursor inline-block h-[0.85em] w-[0.45em] translate-y-[0.06em] bg-(--pl-accent)" />
      </div>

      <div
        className="pl-track absolute inset-x-4 top-1/2 -translate-y-1/2 sm:inset-x-6 lg:inset-x-8"
        role="progressbar"
        aria-label={labels.label}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={0}
      >
        <SegmentTrack count={PRELOADER.segments.desktop} className="hidden sm:flex" />
        <SegmentTrack count={PRELOADER.segments.mobile} className="flex sm:hidden" />
      </div>

      <div
        aria-hidden="true"
        className="pl-counter type-display absolute bottom-4 left-3 text-[32vw] tabular-nums select-none sm:bottom-5 sm:left-5 sm:text-[20vw] lg:bottom-6 lg:left-7 lg:text-[min(26vh,17vw)]"
      >
        <span className="pl-digit pl-scan" data-digit="h" data-empty="" />
        <span className="pl-digit pl-scan" data-digit="t">
          0
        </span>
        <span className="pl-digit pl-scan" data-digit="o">
          0
        </span>
        <span className="pl-scan">%</span>
      </div>

      <div
        aria-hidden="true"
        className="pl-edge absolute inset-x-0 bottom-0 h-[2px] bg-(--pl-progress) opacity-0"
      />
    </div>
  );
}

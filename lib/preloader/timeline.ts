/**
 * Timeline del preloader calculada a partir de config.ts: inicios absolutos de
 * cada escena y labels. Pura (sin DOM): nunca se escribe un tiempo a mano.
 */
import { PRELOADER, type PreloaderConfig } from "@/lib/preloader/config";

export type TimelineEntry = {
  /** Índice en SCENES. */
  scene: number;
  /** "intro", "pass2", "pass3"… */
  pass: string;
  /** Inicio absoluto en ms desde el primer corte. */
  start: number;
  duration: number;
};

type Phase = { start: number; duration: number; easing: string };

export type Timeline = {
  entries: TimelineEntry[];
  /** intro, montage, pass2…, collapse, open (si hay apertura) y complete. */
  labels: Record<string, number>;
  totalDuration: number;
  collapse: Phase;
  open: Phase | null;
};

export function buildTimeline(config: PreloaderConfig = PRELOADER): Timeline {
  const entries: TimelineEntry[] = [];
  const labels: Record<string, number> = { intro: 0 };
  let t = 0;

  config.scenes.forEach((scene, i) => {
    entries.push({ scene: i, pass: "intro", start: t, duration: scene.duration });
    t += scene.duration;
  });
  const introEnd = t;

  config.montage.forEach((pass, p) => {
    const name = `pass${p + 2}`;
    if (p === 0) labels.montage = t;
    labels[name] = t;
    config.scenes.forEach((_, i) => {
      const duration = pass[Math.min(i, pass.length - 1)];
      entries.push({ scene: i, pass: name, start: t, duration });
      t += duration;
    });
  });
  const scenesEnd = t;

  // Sin montaje el cierre solapado no tiene sentido: se usa siempre "end".
  const overlap = config.collapse.start === "montage" && config.montage.length > 0;
  const collapse: Phase = overlap
    ? { start: introEnd, duration: scenesEnd - introEnd, easing: config.collapse.overlapEasing }
    : { start: scenesEnd, duration: config.collapse.duration, easing: config.collapse.easing };
  labels.collapse = collapse.start;

  const collapseEnd = collapse.start + collapse.duration;
  const open: Phase | null = config.open
    ? { start: collapseEnd, duration: config.open.duration, easing: config.open.easing }
    : null;
  if (open) labels.open = open.start;

  const complete = open ? open.start + open.duration : collapseEnd;
  labels.complete = complete;

  return { entries, labels, totalDuration: complete, collapse, open };
}

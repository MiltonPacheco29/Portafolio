/**
 * Preloader cinematográfico (components/Preloader.tsx): escenas, tiempos (ms) y
 * animaciones. La timeline se calcula en buildTimeline(); no se escribe a mano.
 */

export type SceneConfig =
  | { text: string; duration: number }
  | { image: string; duration: number };

type PreloaderConfig = {
  /** En orden; cada escena dura `duration` en la primera pasada (intro). */
  scenes: readonly SceneConfig[];
  /**
   * Pasadas extra de TODAS las escenas, acelerando. Una lista por pasada con
   * una duración por escena; el último valor se repite para el resto. [] = sin montaje.
   */
  montage: readonly (readonly number[])[];
  collapse: {
    /** "montage": empieza al terminar la 1.ª pasada y el montaje sigue dentro de la franja. "end": tras la última escena. */
    start: "montage" | "end";
    /** Con start "end" (o sin montaje). */
    duration: number;
    easing: string;
    /** Con start "montage": la duración es automática (todo el montaje). */
    overlapEasing: string;
  };
  /** Cortinas negras que se separan desde el centro; null = el cierre revela la página. */
  open: { duration: number; easing: string } | null;
  /** Texto del marcador si una imagen no carga: "IMAGEN 1"… */
  placeholderLabel: string;
  maxWaitForAssets: number;
};

export const PRELOADER = {
  scenes: [
    { text: "NEED", duration: 345 },
    { image: "/preloader/imagen-1.webp", duration: 195 },
    { text: "MONEY", duration: 345 },
    { image: "/preloader/imagen-2.webp", duration: 185 },
    { text: "FOR", duration: 240 },
    { image: "/preloader/imagen-3.webp", duration: 165 },
    { text: "MY", duration: 220 },
    { image: "/preloader/imagen-4.webp", duration: 150 },
    { text: "PORSCHE", duration: 345 },
    { image: "/preloader/imagen-5.webp", duration: 130 },
  ],
  montage: [
    [115, 105, 100, 90, 85, 80], // pasada 2
    [75, 75, 72, 72, 70], // pasada 3, la más rápida
  ],
  collapse: {
    start: "montage",
    duration: 485,
    easing: "cubic-bezier(0.5, 0.1, 0.1, 1)",
    overlapEasing: "cubic-bezier(0.4, 0, 0.7, 0.6)",
  },
  open: { duration: 650, easing: "cubic-bezier(0.65, 0, 0.35, 1)" },
  placeholderLabel: "IMAGEN",
  maxWaitForAssets: 3000,
} as const satisfies PreloaderConfig;

export type Scene =
  | { kind: "word"; text: string; label: string }
  | { kind: "image"; src: string; label: string };

/** Escenas normalizadas, en orden (índice = posición en el DOM). */
export const SCENES: Scene[] = (() => {
  let images = 0;
  return PRELOADER.scenes.map((scene): Scene =>
    "text" in scene
      ? { kind: "word", text: scene.text, label: scene.text }
      : { kind: "image", src: scene.image, label: `${PRELOADER.placeholderLabel} ${++images}` },
  );
})();

/** URLs de las imágenes, en orden de aparición. */
export const IMAGE_SOURCES = SCENES.flatMap((scene) => (scene.kind === "image" ? [scene.src] : []));

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

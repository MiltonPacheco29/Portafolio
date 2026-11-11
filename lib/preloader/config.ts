/**
 * Preloader de barra segmentada. Todos los tiempos están en segundos y son ABSOLUTOS
 * dentro del timeline maestro (duración visual: 3.2 s). Los textos viven en
 * content/es.json (clave "preloader").
 */

export type ProgressStop = { value: number; at: number };

/** Nombres de las curvas de `lib/preloader/timeline.ts` (equivalentes a las de GSAP). */
export type EaseName =
  | "linear"
  | "power2.out"
  | "power2.in"
  | "power3.inOut"
  | "sine.out";

export const PRELOADER = {
  totalDuration: 3.2,

  scenes: {
    intro: { start: 0, end: 0.35 },
    progress: { start: 0.2, end: 2.35 },
    confirm: { start: 2.35, end: 2.6 },
    exit: { start: 2.6, end: 2.95 },
    /** El Hero arranca su entrada (CSS `.enter`) en este instante. */
    hero: { start: 2.75, end: 3.2 },
  },

  /** Entrada de la escena 1. */
  intro: {
    header: { start: 0, duration: 0.3 },
    track: { start: 0.05, duration: 0.3, y: 6 },
    counter: { start: 0.05, duration: 0.3, yPercent: 8 },
  },

  /**
   * Ritmo del progreso: 0 → 12 → 40 → 78 → 99 → 100. Son referencias de ritmo, no una
   * carga real: se unen con una curva monótona continua que arranca y llega con
   * velocidad 0 y nunca retrocede.
   */
  progressStops: [
    { value: 12, at: 0.55 },
    { value: 40, at: 1.05 },
    { value: 78, at: 1.7 },
    { value: 99, at: 2.2 },
    { value: 100, at: 2.35 },
  ] satisfies ProgressStop[],

  /** En este valor el timeline espera a las fuentes y a `window.load`. */
  gateValue: 99,

  /** Confirmación: toda la barra se enciende (--full 0 → 1). */
  confirm: { duration: 0.2 },

  exit: {
    /** Contador y header se desvanecen y suben. */
    fade: { start: 2.6, duration: 0.2, y: -10 },
    /** La pista se retira hacia la derecha. */
    track: { start: 2.6, duration: 0.22 },
    /** Borde de la persiana. */
    edge: { start: 2.6, duration: 0.06 },
    /** La capa sube como una persiana. */
    mask: { start: 2.64, duration: 0.31 },
  },

  eases: {
    intro: "power2.out",
    confirm: "sine.out",
    exit: "power2.in",
    trackOut: "power3.inOut",
    mask: "power3.inOut",
  } satisfies Record<string, EaseName>,

  /** Segmentos por breakpoint (desde `sm` / móvil) y longitud de la estela. */
  segments: { desktop: 64, mobile: 32, trail: 12 },

  /** Tiempo máximo de espera de recursos antes de continuar igualmente. */
  resources: { timeoutMs: 6000 },

  /** Red de seguridad JS: si algo se cuelga, la capa se cierra a los N ms. */
  failsafeMs: 9000,

  /** Movimiento reducido: progreso breve y fundido de la capa. */
  reducedMotion: { progress: 0.35, finish: 0.05, fade: 0.35 },
} as const;

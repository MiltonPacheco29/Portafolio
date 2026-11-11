import { PRELOADER, type EaseName } from "@/lib/preloader/config";

export type Ease = (k: number) => number;

/** Mismas curvas que GSAP: power2 = cúbica, power3 = cuártica. */
export const EASES: Record<EaseName, Ease> = {
  linear: (k) => k,
  "power2.out": (k) => 1 - (1 - k) ** 3,
  "power2.in": (k) => k ** 3,
  "power3.inOut": (k) => (k < 0.5 ? 8 * k ** 4 : 1 - (-2 * k + 2) ** 4 / 2),
  "sine.out": (k) => Math.sin((k * Math.PI) / 2),
};

type CurvePoint = { t: number; v: number };

/**
 * Curva monótona (Hermite cúbica, método Fritsch–Carlson) que pasa por los puntos de
 * ritmo. La velocidad cambia de forma continua entre puntos (sin frenazos) y la
 * monotonía garantiza que el porcentaje nunca retrocede.
 */
export function createMonotoneCurve(points: CurvePoint[]): (time: number) => number {
  const n = points.length;
  const t = points.map((p) => p.t);
  const v = points.map((p) => p.v);

  const delta: number[] = [];
  for (let i = 0; i < n - 1; i++) delta.push((v[i + 1] - v[i]) / (t[i + 1] - t[i]));

  // Arranque y llegada con tangente 0; interiores por media armónica ponderada.
  const m: number[] = new Array(n).fill(0);
  for (let i = 1; i < n - 1; i++) {
    const a = delta[i - 1];
    const b = delta[i];
    if (a <= 0 || b <= 0) continue;
    const w1 = 2 * (t[i + 1] - t[i]) + (t[i] - t[i - 1]);
    const w2 = t[i + 1] - t[i] + 2 * (t[i] - t[i - 1]);
    m[i] = (w1 + w2) / (w1 / a + w2 / b);
  }

  return (time) => {
    if (time <= t[0]) return v[0];
    if (time >= t[n - 1]) return v[n - 1];
    let i = 0;
    while (time > t[i + 1]) i++;
    const h = t[i + 1] - t[i];
    const s = (time - t[i]) / h;
    const s2 = s * s;
    const s3 = s2 * s;
    return (
      (2 * s3 - 3 * s2 + 1) * v[i] +
      (s3 - 2 * s2 + s) * h * m[i] +
      (-2 * s3 + 3 * s2) * v[i + 1] +
      (s3 - s2) * h * m[i + 1]
    );
  };
}

/** Plan temporal de la secuencia: progreso en función del tiempo y sus hitos. */
export type ProgressPlan = {
  progressAt: (t: number) => number;
  /** Instante en el que el reloj espera a los recursos (valor `gateValue`). */
  gateAt: number;
  /** Instante en el que se libera la entrada del Hero. */
  revealAt: number;
  /** Instante en el que termina la capa y se desmonta. */
  endAt: number;
};

export function buildProgressPlan(reduced: boolean): ProgressPlan {
  if (reduced) {
    const { progress, finish, fade } = PRELOADER.reducedMotion;
    const gate = PRELOADER.gateValue;
    return {
      progressAt: (t) =>
        t <= progress ? (t / progress) * gate : gate + (100 - gate) * Math.min(1, (t - progress) / finish),
      gateAt: progress,
      revealAt: progress + finish,
      endAt: progress + finish + fade,
    };
  }

  const { start, end } = PRELOADER.scenes.progress;
  const curve = createMonotoneCurve([
    { t: start, v: 0 },
    ...PRELOADER.progressStops.map((s) => ({ t: s.at, v: s.value })),
  ]);
  const { mask } = PRELOADER.exit;
  return {
    progressAt: curve,
    gateAt: PRELOADER.progressStops.find((s) => s.value === PRELOADER.gateValue)?.at ?? end,
    revealAt: PRELOADER.scenes.hero.start,
    endAt: mask.start + mask.duration,
  };
}

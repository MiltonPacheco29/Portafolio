import { lockScroll } from "@/components/preloader/scrollLock";
import { PRELOADER } from "@/lib/preloader/config";
import { EASES, buildProgressPlan, type Ease } from "@/lib/preloader/timeline";

/** El JS ha llegado: desactiva la red de seguridad solo-CSS (globals.css). */
const ARMED_ATTR = "data-armed";
/** Libera la entrada del Hero (`.enter`), que está en pausa mientras exista la capa. */
const REVEAL_ATTR = "data-reveal";
/** Paso máximo del reloj por frame: al volver de una pestaña oculta no salta al final. */
const MAX_STEP = 0.1;

type Tween = { start: number; duration: number; ease: Ease; apply: (k: number) => void };

type PlayOptions = {
  reduced: boolean;
  onComplete: () => void;
};

function query(root: HTMLElement, selector: string): HTMLElement {
  const el = root.querySelector<HTMLElement>(selector);
  if (!el) throw new Error(`Falta ${selector} en el preloader`);
  return el;
}

/** Fuentes + `window.load`, con tiempo máximo. Nunca rechaza. */
function waitForResources(timeoutMs: number, signal: AbortSignal): Promise<boolean> {
  return new Promise((resolve) => {
    let timer = 0;
    const settle = (ready: boolean) => {
      window.clearTimeout(timer);
      window.removeEventListener("load", onLoad);
      signal.removeEventListener("abort", onAbort);
      resolve(ready);
    };
    const onAbort = () => settle(false);
    let resolveLoad = () => {};
    const loaded = new Promise<void>((r) => (resolveLoad = r));
    const onLoad = () => resolveLoad();

    if (signal.aborted) return resolve(false);
    if (document.readyState === "complete") resolveLoad();
    else window.addEventListener("load", onLoad, { once: true });
    signal.addEventListener("abort", onAbort, { once: true });
    timer = window.setTimeout(() => settle(!signal.aborted), timeoutMs);

    Promise.all([document.fonts?.ready, loaded]).then(
      () => settle(!signal.aborted),
      () => settle(!signal.aborted),
    );
  });
}

/**
 * Timeline maestro del preloader (3.2 s visuales):
 *   1. Inicialización  0.00 – 0.35  header, pista inactiva y 00 %
 *   2. Progreso        0.20 – 2.35  curva monótona 0 → 12 → 40 → 78 → 99 → 100
 *   3. Confirmación    2.35 – 2.60  100 % y barra encendida
 *   4. Salida          2.60 – 2.95  contador y header fuera, pista retirada, persiana
 *   5. Hero            2.75 – 3.20  se libera la entrada CSS del Hero
 * Un único reloj rAF calcula todo a partir del tiempo; en `gateAt` espera a los recursos.
 * Devuelve la limpieza (compatible con el doble montaje de Strict Mode).
 */
export function playPreloader(root: HTMLElement, { reduced, onComplete }: PlayOptions): () => void {
  const touched: [HTMLElement, string][] = [];
  const set = (el: HTMLElement, prop: string, value: string) => {
    if (!touched.some(([e, p]) => e === el && p === prop)) touched.push([el, prop]);
    el.style.setProperty(prop, value);
  };

  const abort = new AbortController();
  const previousRestoration = history.scrollRestoration;
  let unlock: (() => void) | null = null;
  let raf = 0;
  let failsafe = 0;
  let finished = false;
  let revealed = false;

  const reveal = () => {
    if (revealed) return;
    revealed = true;
    root.setAttribute(REVEAL_ATTR, "");
  };

  // Si se recarga o se sale a mitad de la secuencia, la entrada del historial no se
  // queda con la restauración de scroll en "manual".
  const restoreScroll = () => {
    history.scrollRestoration = previousRestoration;
  };

  const teardown = () => {
    cancelAnimationFrame(raf);
    window.clearTimeout(failsafe);
    window.removeEventListener("pagehide", restoreScroll);
    abort.abort();
    unlock?.();
    unlock = null;
    restoreScroll();
  };

  const finish = () => {
    if (finished) return;
    finished = true;
    reveal();
    teardown();
    onComplete();
  };

  try {
    const header = query(root, ".pl-header");
    const track = query(root, ".pl-track");
    const counter = query(root, ".pl-counter");
    const edge = query(root, ".pl-edge");
    const hundreds = query(root, '[data-digit="h"]');
    const tens = query(root, '[data-digit="t"]');
    const ones = query(root, '[data-digit="o"]');

    root.setAttribute(ARMED_ATTR, "");
    unlock = lockScroll();
    history.scrollRestoration = "manual";
    window.addEventListener("pagehide", restoreScroll);
    window.scrollTo(0, 0);

    // Renderizador único: --p (segmentos) y contador salen del mismo valor.
    let shown = -1;
    const renderProgress = (value: number) => {
      const v = Math.min(100, Math.max(0, value));
      set(root, "--p", v.toFixed(3));
      const n = Math.floor(v + 1e-6); // nunca muestra 100 antes de tiempo
      if (n === shown) return;
      shown = n;
      const text = String(n).padStart(2, "0");
      const full = text.length === 3;
      hundreds.textContent = full ? text[0] : "";
      hundreds.toggleAttribute("data-empty", !full);
      tens.textContent = text[text.length - 2];
      ones.textContent = text[text.length - 1];
      track.setAttribute("aria-valuenow", String(n));
    };

    const plan = buildProgressPlan(reduced);
    const { intro, exit, eases, confirm, scenes } = PRELOADER;
    const tween = (
      start: number,
      duration: number,
      ease: keyof typeof EASES,
      apply: (k: number) => void,
    ): Tween => ({ start, duration, ease: EASES[ease], apply });

    const tweens: Tween[] = reduced
      ? [
          tween(0, 0, "linear", () => {
            set(header, "clip-path", "none");
            set(track, "opacity", "1");
            set(counter, "opacity", "1");
          }),
          tween(plan.revealAt, plan.endAt - plan.revealAt, "linear", (k) =>
            set(root, "opacity", String(1 - k)),
          ),
        ]
      : [
          // Escena 1: el header se revela con clip-path; pista y contador aparecen.
          tween(intro.header.start, intro.header.duration, eases.intro, (k) =>
            set(header, "clip-path", `inset(0 ${(100 * (1 - k)).toFixed(2)}% 0 0)`),
          ),
          tween(intro.track.start, intro.track.duration, eases.intro, (k) => {
            set(track, "opacity", String(k));
            set(track, "transform", `translateY(${(intro.track.y * (1 - k)).toFixed(2)}px)`);
          }),
          tween(intro.counter.start, intro.counter.duration, eases.intro, (k) => {
            set(counter, "opacity", String(k));
            set(counter, "transform", `translateY(${(intro.counter.yPercent * (1 - k)).toFixed(2)}%)`);
          }),
          // Escena 3: toda la barra se enciende.
          tween(scenes.confirm.start, confirm.duration, eases.confirm, (k) =>
            set(root, "--full", k.toFixed(3)),
          ),
          // Escena 4: salida.
          tween(exit.fade.start, exit.fade.duration, eases.exit, (k) => {
            for (const el of [counter, header]) {
              set(el, "opacity", String(1 - k));
              set(el, "transform", `translateY(${(exit.fade.y * k).toFixed(2)}px)`);
            }
          }),
          tween(exit.track.start, exit.track.duration, eases.trackOut, (k) =>
            set(track, "scale", `${(1 - k).toFixed(4)} 1`),
          ),
          tween(exit.edge.start, exit.edge.duration, "linear", (k) =>
            set(edge, "opacity", String(k)),
          ),
          tween(exit.mask.start, exit.mask.duration, eases.mask, (k) =>
            set(root, "translate", `0 ${(-100 * k).toFixed(3)}%`),
          ),
        ];
    tweens.sort((a, b) => a.start - b.start);

    // Solo se aplican los tweens ya iniciados, en orden: el último gana si comparten propiedad.
    const render = (t: number) => {
      renderProgress(plan.progressAt(t));
      for (const tw of tweens) {
        if (t < tw.start) break;
        const k = tw.duration > 0 ? Math.min(1, (t - tw.start) / tw.duration) : 1;
        tw.apply(tw.ease(k));
      }
      if (t >= plan.revealAt) reveal();
    };

    let ready = false;
    waitForResources(PRELOADER.resources.timeoutMs, abort.signal).then((ok) => {
      ready = ok;
    });

    let clock = 0;
    let last = -1;
    const frame = (now: number) => {
      clock += last < 0 ? 0 : Math.min((now - last) / 1000, MAX_STEP);
      last = now;
      // Puerta de recursos: el reloj se detiene en 99 % hasta que estén listos.
      if (!ready && clock > plan.gateAt) clock = plan.gateAt;
      render(clock);
      if (clock >= plan.endAt) finish();
      else raf = requestAnimationFrame(frame);
    };

    render(0);
    raf = requestAnimationFrame(frame);
    failsafe = window.setTimeout(finish, PRELOADER.failsafeMs);
  } catch (error) {
    console.error("[preloader]", error);
    finish();
  }

  return () => {
    teardown();
    if (finished) return;
    for (const [el, prop] of touched) el.style.removeProperty(prop);
    root.removeAttribute(ARMED_ATTR);
    root.removeAttribute(REVEAL_ATTR);
  };
}

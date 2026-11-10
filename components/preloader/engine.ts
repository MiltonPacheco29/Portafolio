import { lockScroll } from "@/components/preloader/scrollLock";
import { PRELOADER, SCENES } from "@/lib/preloader/config";
import { buildTimeline, type TimelineEntry } from "@/lib/preloader/timeline";

const PRELOADER_STARTED_ATTR = "data-preloader-started";

type PreloaderElements = {
  overlay: HTMLElement;
  stage: HTMLElement;
  curtains: [top: HTMLElement, bottom: HTMLElement];
  scenes: (HTMLElement | null)[];
  words: HTMLElement[];
  images: HTMLImageElement[];
};

type PlayOptions = {
  fontFamily: string;
  debug: boolean;
  onComplete: () => void;
};

export function playPreloader(elements: PreloaderElements, options: PlayOptions): () => void {
  const { overlay, stage, curtains, scenes, words, images } = elements;
  const [curtainTop, curtainBottom] = curtains;
  const { debug, fontFamily, onComplete } = options;
  const { entries, labels, totalDuration, collapse, open } = buildTimeline();
  const lastIndex = entries.length - 1;

  let cancelled = false;
  let raf = 0;
  let timer = 0;
  let t0 = -1;
  let hiddenAt = -1;
  let waitingVisible = false;
  let current = -1;
  let active: HTMLElement | null = null;
  let collapseAnim: Animation | null = null;
  let openAnims: Animation[] = [];
  const detected: Record<string, number> = {};
  const cuts: number[] = [];
  const cleanups: (() => void)[] = [];
  const running = () => [collapseAnim, ...openAnims].filter((a): a is Animation => a !== null);

  const listen = (
    target: EventTarget,
    type: string,
    handler: () => void,
    listenerOptions?: AddEventListenerOptions,
  ) => {
    target.addEventListener(type, handler, listenerOptions);
    cleanups.push(() => target.removeEventListener(type, handler, listenerOptions));
  };

  if (debug) {
    console.table(
      entries.map((entry) => ({
        escena: SCENES[entry.scene].label,
        pasada: entry.pass,
        inicio: entry.start,
        duración: entry.duration,
      })),
    );
    console.log(
      `[preloader] ${Object.entries(labels)
        .map(([name, ms]) => `${name} ${ms}`)
        .join(" · ")} · totalDuration ${totalDuration}`,
      `· cierre ${collapse.duration} ms${open ? ` · apertura ${open.duration} ms` : ""}`,
    );
  }

  const unlock = lockScroll();
  overlay.setAttribute(PRELOADER_STARTED_ATTR, "");

  const fitWords = () => {
    const max = 0.9 * window.innerWidth;
    for (const word of words) word.style.fontSize = "";
    const sizes = words.map((word) => {
      const style = getComputedStyle(word);
      const stretch = parseFloat(style.getPropertyValue("--stretch")) || 1;
      const width = word.offsetWidth * stretch;
      return width > max ? (parseFloat(style.fontSize) * max) / width : 0;
    });
    words.forEach((word, i) => {
      if (sizes[i] > 0) word.style.fontSize = `${sizes[i]}px`;
    });
  };
  fitWords();
  listen(window, "resize", fitWords);

  const show = (entry: TimelineEntry) => {
    const scene = scenes[entry.scene];
    if (!scene) return;
    if (active && active !== scene) active.removeAttribute("data-active");
    scene.style.setProperty("--frame-dur", `${entry.duration}ms`);
    scene.setAttribute("data-active", "");
    active = scene;
  };

  const finish = () => {
    if (cancelled) return;
    if (debug) {
      const frameTime = Number(document.timeline.currentTime ?? performance.now());
      console.table(
        entries.map((entry, i) => ({
          escena: SCENES[entry.scene].label,
          pasada: entry.pass,
          programado: entry.start,
          real: cuts[i] === undefined ? "saltado" : Number(cuts[i].toFixed(1)),
          desfase: cuts[i] === undefined ? "—" : Number((cuts[i] - entry.start).toFixed(1)),
        })),
      );
      console.log(
        `[preloader] ${Object.entries(detected)
          .map(([name, ms]) => `${name} detectado ${ms.toFixed(1)} ms (anclado a ${labels[name]})`)
          .join(" · ")}`,
        `· total real ${(frameTime - t0).toFixed(1)} ms (planificado ${totalDuration} ms;`,
        `promesa resuelta a ${(performance.now() - t0).toFixed(1)} ms)`,
      );
    }
    teardown();
    onComplete();
  };

  const startCollapse = (t: number) => {
    detected.collapse = t;
    const target = open ? stage : overlay;
    collapseAnim = target.animate(
      [{ clipPath: "inset(0 0 0 0)" }, { clipPath: "inset(50% 0 50% 0)" }],
      { duration: collapse.duration, easing: collapse.easing, fill: "forwards" },
    );
    collapseAnim.startTime = t0 + collapse.start;
    if (!open) collapseAnim.finished.then(finish, () => {});
  };

  const startOpen = (t: number) => {
    if (!open) return;
    detected.open = t;
    overlay.style.backgroundColor = "transparent";
    const animOptions: KeyframeAnimationOptions = {
      duration: open.duration,
      easing: open.easing,
      fill: "forwards",
    };
    openAnims = [
      [curtainTop, "translateY(-100%)"] as const,
      [curtainBottom, "translateY(100%)"] as const,
    ].map(([curtain, to]) => {
      curtain.style.visibility = "visible";
      const anim = curtain.animate([{ transform: "translateY(0)" }, { transform: to }], animOptions);
      anim.startTime = t0 + open.start;
      return anim;
    });
    Promise.all(openAnims.map((anim) => anim.finished)).then(finish, () => {});
  };

  const frame = (now: number) => {
    raf = 0;
    if (t0 < 0) t0 = now;
    const t = now - t0;
    let next = current;
    while (next + 1 < entries.length && entries[next + 1].start <= t) next++;
    if (next !== current) {
      current = next;
      show(entries[next]);
      cuts[next] = t;
    }
    if (!collapseAnim && t >= collapse.start) startCollapse(t);
    if (open && openAnims.length === 0 && t >= open.start) startOpen(t);
    const pending =
      current < lastIndex || !collapseAnim || (open !== null && openAnims.length === 0);
    if (pending) raf = requestAnimationFrame(frame);
  };

  listen(document, "visibilitychange", () => {
    if (document.hidden) {
      if (t0 < 0 || hiddenAt >= 0) return;
      hiddenAt = performance.now();
      cancelAnimationFrame(raf);
      raf = 0;
      for (const anim of running()) anim.pause();
    } else if (waitingVisible) {
      waitingVisible = false;
      raf = requestAnimationFrame(frame);
    } else if (hiddenAt >= 0) {
      t0 += performance.now() - hiddenAt;
      hiddenAt = -1;
      for (const anim of running()) anim.play();
      raf = requestAnimationFrame(frame);
    }
  });

  const start = () => {
    if (cancelled) return;
    window.clearTimeout(timer);
    fitWords();
    if (document.hidden) waitingVisible = true;
    else raf = requestAnimationFrame(frame);
  };

  const markFailed = (img: HTMLImageElement) => {
    img.closest("[data-scene]")?.setAttribute("data-failed", "");
  };
  const waitImage = (img: HTMLImageElement) =>
    new Promise<void>((resolve) => {
      let settled = false;
      const settle = () => {
        if (settled) return;
        settled = true;
        if (img.naturalWidth === 0) {
          markFailed(img);
          resolve();
        } else {
          img.decode().then(resolve, resolve);
        }
      };
      if (img.complete) settle();
      else {
        listen(img, "load", settle, { once: true });
        listen(img, "error", settle, { once: true });
      }
    });

  const windowLoaded =
    document.readyState === "complete"
      ? Promise.resolve()
      : new Promise<void>((resolve) => listen(window, "load", resolve, { once: true }));

  const texts = SCENES.flatMap((scene) => (scene.kind === "word" ? [scene.text] : [])).join("");
  const fontsLoaded = Promise.all([
    document.fonts.ready,
    document.fonts.load(`1em ${fontFamily}`, texts),
  ]).then(
    () => {
      if (!cancelled) fitWords();
    },
    () => {},
  );

  const timeout = new Promise<void>((resolve) => {
    timer = window.setTimeout(resolve, PRELOADER.maxWaitForAssets);
  });

  Promise.race([Promise.all([fontsLoaded, windowLoaded, ...images.map(waitImage)]), timeout]).then(
    start,
  );

  function teardown() {
    cancelled = true;
    cancelAnimationFrame(raf);
    window.clearTimeout(timer);
    cleanups.splice(0).forEach((fn) => fn());
    unlock();
  }

  return () => {
    teardown();
    for (const anim of running()) anim.cancel();
    active?.removeAttribute("data-active");
    overlay.removeAttribute(PRELOADER_STARTED_ATTR);
    overlay.style.backgroundColor = "";
    curtainTop.style.visibility = "";
    curtainBottom.style.visibility = "";
  };
}

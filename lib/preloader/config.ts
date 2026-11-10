export type SceneConfig =
  | { text: string; duration: number }
  | { image: string; duration: number };

export type PreloaderConfig = {
  scenes: readonly SceneConfig[];
  montage: readonly (readonly number[])[];
  collapse: {
    start: "montage" | "end";
    duration: number;
    easing: string;
    overlapEasing: string;
  };
  open: { duration: number; easing: string } | null;
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
    [115, 105, 100, 90, 85, 80],
    [75, 75, 72, 72, 70],
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

export const SCENES: Scene[] = (() => {
  let images = 0;
  return PRELOADER.scenes.map((scene): Scene =>
    "text" in scene
      ? { kind: "word", text: scene.text, label: scene.text }
      : { kind: "image", src: scene.image, label: `${PRELOADER.placeholderLabel} ${++images}` },
  );
})();

export const IMAGE_SOURCES = SCENES.flatMap((scene) => (scene.kind === "image" ? [scene.src] : []));

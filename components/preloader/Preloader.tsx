"use client";

import { useEffect, useRef, useState } from "react";
import { preload } from "react-dom";
import { playPreloader } from "@/components/preloader/engine";
import { getReducedMotion } from "@/lib/animations";
import { fontPreloader } from "@/lib/config/fonts";
import { IMAGE_SOURCES, SCENES } from "@/lib/preloader/config";

let hasPlayed = false;

export function Preloader() {
  const [visible, setVisible] = useState(() => !hasPlayed);
  const overlayRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const curtainTopRef = useRef<HTMLDivElement>(null);
  const curtainBottomRef = useRef<HTMLDivElement>(null);
  const sceneRefs = useRef<(HTMLDivElement | null)[]>([]);
  const wordRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const imageRefs = useRef<(HTMLImageElement | null)[]>([]);

  if (visible) {
    for (const src of IMAGE_SOURCES) preload(src, { as: "image" });
  }

  useEffect(() => {
    const overlay = overlayRef.current;
    const stage = stageRef.current;
    const curtainTop = curtainTopRef.current;
    const curtainBottom = curtainBottomRef.current;
    if (!overlay || !stage || !curtainTop || !curtainBottom) return;
    hasPlayed = true;

    if (getReducedMotion()) {
      const id = requestAnimationFrame(() => setVisible(false));
      return () => cancelAnimationFrame(id);
    }

    return playPreloader(
      {
        overlay,
        stage,
        curtains: [curtainTop, curtainBottom],
        scenes: sceneRefs.current,
        words: wordRefs.current.filter((el): el is HTMLSpanElement => el != null),
        images: imageRefs.current.filter((el): el is HTMLImageElement => el != null),
      },
      {
        fontFamily: fontPreloader.style.fontFamily,
        debug: new URLSearchParams(window.location.search).has("debug"),
        onComplete: () => setVisible(false),
      },
    );
  }, []);

  if (!visible) return null;

  return (
    <div
      ref={overlayRef}
      aria-hidden="true"
      data-preloader=""
      className={`${fontPreloader.variable} fixed inset-0 z-[9999] overflow-hidden bg-black motion-reduce:hidden`}
    >
      <noscript>
        <style>
          {
            "[data-preloader]{display:none}body:has(> [data-preloader]:not([data-preloader-started])){overflow:revert-layer}"
          }
        </style>
      </noscript>

      <div ref={stageRef} className="absolute inset-0">
        {SCENES.map((scene, i) => (
          <div
            key={`${scene.kind}-${i}`}
            ref={(el) => {
              sceneRefs.current[i] = el;
            }}
            data-scene=""
            className={`group invisible absolute inset-0 flex items-center justify-center data-active:visible ${
              scene.kind === "word" ? "bg-black" : "bg-[#111]"
            }`}
          >
            {scene.kind === "word" ? (
              <span
                ref={(el) => {
                  wordRefs.current[i] = el;
                }}
                className="preloader-word group-data-active:animate-preloader-punch"
              >
                {scene.text}
              </span>
            ) : (
              <>
                <div className="absolute inset-0 flex items-center justify-center bg-[repeating-linear-gradient(45deg,#1a1a1a_0_20px,#222_20px_40px)] text-base tracking-[0.2em] text-[#777] [font-family:system-ui]">
                  {scene.label}
                </div>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  ref={(el) => {
                    imageRefs.current[i] = el;
                  }}
                  src={scene.src}
                  alt=""
                  loading="eager"
                  decoding="async"
                  className="absolute inset-0 size-full object-cover grayscale contrast-115 group-data-active:animate-preloader-zoom group-data-failed:hidden"
                />
              </>
            )}
          </div>
        ))}
      </div>

      <div
        ref={curtainTopRef}
        className="invisible absolute inset-x-0 top-0 h-[calc(50%+1px)] bg-black"
      />
      <div
        ref={curtainBottomRef}
        className="invisible absolute inset-x-0 bottom-0 h-[calc(50%+1px)] bg-black"
      />
    </div>
  );
}

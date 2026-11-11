"use client";

import { useEffect, useRef, useState } from "react";

type HeroVideoProps = {
  src: string;
  playLabel: string;
  pauseLabel: string;
};

/* Video decorativo de fondo. Con movimiento reducido no arranca solo; el botón permite
   pausarlo o reanudarlo (WCAG 2.2.2) y fuera de pantalla se pausa para ahorrar batería. */
export function HeroVideo({ src, playLabel, pauseLabel }: HeroVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const userPaused = useRef(false);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    userPaused.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !userPaused.current) {
        video.play().catch(() => {});
      } else if (!entry.isIntersecting) {
        video.pause();
      }
    });
    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  function toggle() {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      userPaused.current = false;
      video.play().catch(() => {});
    } else {
      userPaused.current = true;
      video.pause();
    }
  }

  return (
    <>
      <div aria-hidden="true" className="hero-video">
        <video
          ref={videoRef}
          src={src}
          muted
          loop
          playsInline
          preload="metadata"
          tabIndex={-1}
          disablePictureInPicture
          disableRemotePlayback
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
        />
      </div>

      <button
        type="button"
        onClick={toggle}
        aria-label={playing ? pauseLabel : playLabel}
        className="absolute right-gutter bottom-4 z-10 inline-flex size-11 items-center justify-center rounded-pill border-2 border-border-strong bg-bg/70 text-fg backdrop-blur-sm hover:border-primary hover:text-primary motion-safe:transition-colors motion-safe:duration-200"
      >
        <svg aria-hidden="true" viewBox="0 0 16 16" className="size-4 fill-current">
          {playing ? (
            <path d="M4 3h3v10H4zM9 3h3v10H9z" />
          ) : (
            <path d="M5 2.5v11l9-5.5z" />
          )}
        </svg>
      </button>
    </>
  );
}

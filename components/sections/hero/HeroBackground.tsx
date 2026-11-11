import { HeroVideo } from "@/components/sections/hero/HeroVideo";
import type { Dictionary } from "@/lib/i18n";

type HeroBackgroundProps = {
  video: Dictionary["hero"]["video"];
};

/* Capas del fondo, de atrás hacia delante: video con velo, luz ambiental, retícula de puntos
   y esquinas de marco. Todas son decorativas y no reciben eventos de puntero. */
export function HeroBackground({ video }: HeroBackgroundProps) {
  return (
    <>
      <HeroVideo src={video.src} playLabel={video.play} pauseLabel={video.pause} />
      <div aria-hidden="true" className="hero-ambient enter [--enter-dur:1.2s] [--enter-y:0]" />
      <div aria-hidden="true" className="hero-dots enter [--enter-dur:1.2s] [--enter-y:0]" />
      <div aria-hidden="true" className="hero-frame enter [--enter-delay:0.3s] [--enter-y:0]" />
    </>
  );
}

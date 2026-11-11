import type { CSSProperties } from "react";
import { HeroBackground } from "@/components/sections/hero/HeroBackground";
import { HeroTechStack } from "@/components/sections/hero/HeroTechStack";
import { AvatarImage } from "@/components/ui/AvatarImage";
import { ContactButton } from "@/components/ui/ContactButton";
import type { Dictionary } from "@/lib/i18n";
import type { LocalImage } from "@/lib/server/images";

type HeroProps = {
  hero: Dictionary["hero"];
  titleId: string;
  avatar: LocalImage | null;
  contactHref: string;
  contactLabel: string;
  projectsHref: string;
  projectsLabel: string;
};

/* Retrasos de la entrada (s), relativos a la apertura del preloader. La pausa hasta ese
   momento y el movimiento reducido los resuelve la clase .enter de globals.css. */
const delay = {
  badge: 0.15,
  name: 0.25,
  role: 0.4,
  title: 0.5,
  titleStep: 0.08,
  tagline: 0.75,
  actions: 0.9,
  actionsStep: 0.08,
  stack: 1.1,
  avatar: 0.2,
};

const at = (seconds: number) =>
  ({ "--enter-delay": `${seconds}s` }) as CSSProperties;

const secondaryClass =
  "inline-flex min-h-12 items-center justify-center rounded-pill border border-fg/45 bg-bg/50 px-7 py-3 font-mono text-sm font-semibold tracking-[var(--tracking-mono)] text-fg backdrop-blur-sm hover:border-primary hover:text-primary active:translate-y-px motion-safe:transition-colors motion-safe:duration-200";

export function Hero({
  hero,
  titleId,
  avatar,
  contactHref,
  contactLabel,
  projectsHref,
  projectsLabel,
}: HeroProps) {
  return (
    <div className="hero">
      <HeroBackground video={hero.video} />

      <div className="hero-grid">
        <div className="flex flex-col items-start pt-10 pb-10 [grid-area:content] md:pt-14 lg:self-center lg:py-12">
          {hero.availability.show && (
            <p
              className="enter hero-badge [--enter-y:12px]"
              style={at(delay.badge)}
            >
              <span
                aria-hidden="true"
                className="size-2 shrink-0 rounded-full bg-status"
              />
              {hero.availability.label}
            </p>
          )}

          <h1 id={titleId} className="mt-5">
            <span
              className="enter block font-display text-name font-extrabold text-fg [--enter-y:12px]"
              style={at(delay.name)}
            >
              {hero.name}
            </span>
            <span className="sr-only">, </span>
            <span
              className="enter block font-display text-name leading-[1.2] text-fg-muted [--enter-y:0]"
              style={at(delay.role)}
            >
              {hero.role}
            </span>
          </h1>

          <div className="mt-6 w-full @container lg:mt-8">
            <p className="hero-title">
              {hero.title.map((line, i) => (
                <span key={line} className="hero-line">
                  <span
                    className={`enter block [--enter-opacity:1] [--enter-y:105%] ${i === 0 ? "text-fg" : "text-primary"}`}
                    style={at(delay.title + i * delay.titleStep)}
                  >
                    {line}
                  </span>
                </span>
              ))}
            </p>
            <p className="hero-tagline mt-3 text-fg lg:mt-4">
              <span className="hero-line">
                <span
                  className="enter block [--enter-opacity:1] [--enter-y:105%]"
                  style={at(delay.tagline)}
                >
                  {hero.tagline}
                </span>
              </span>
            </p>
          </div>

          <div className="mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:flex-wrap">
            <div className="enter [--enter-y:12px]" style={at(delay.actions)}>
              <ContactButton
                href={contactHref}
                label={contactLabel}
                icon
                className="w-full max-sm:px-5 sm:w-auto"
              />
            </div>
            <div
              className="enter [--enter-y:12px]"
              style={at(delay.actions + delay.actionsStep)}
            >
              <a
                href={projectsHref}
                className={`${secondaryClass} w-full sm:w-auto`}
              >
                {projectsLabel}
              </a>
            </div>
          </div>

          <div className="mt-8">
            <HeroTechStack stack={hero.stack} delay={delay.stack} />
          </div>
        </div>

        <div className="hero-avatar [grid-area:avatar]">
          <div
            aria-hidden="true"
            className="hero-avatar-glow enter [--enter-dur:1.2s] [--enter-y:0]"
            style={at(delay.avatar)}
          />
          <div
            className="enter [--enter-dur:1.15s] [--enter-x:6%] [--enter-y:0]"
            style={at(delay.avatar)}
          >
            <AvatarImage
              image={avatar}
              alt={hero.avatar.alt}
              pending={hero.avatar.pending}
              bare
              preload
              sizes="(min-width: 1024px) 48vw, (min-width: 768px) 32.2rem, 86vw"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

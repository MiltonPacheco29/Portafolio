import { AvatarImage } from "@/components/ui/AvatarImage";
import { ContactButton } from "@/components/ui/ContactButton";
import { HeroVideo } from "@/components/ui/HeroVideo";
import type { Dictionary } from "@/lib/i18n";
import type { LocalImage } from "@/lib/server/images";

type HeroProps = {
  hero: Dictionary["hero"];
  titleId: string;
  avatar: LocalImage | null;
  contactHref: string;
  contactLabel: string;
};

export function Hero({
  hero,
  titleId,
  avatar,
  contactHref,
  contactLabel,
}: HeroProps) {
  return (
    <div className="hero-grid relative isolate overflow-x-clip px-gutter lg:px-(--hero-inset)">
      <HeroVideo
        src={hero.video.src}
        playLabel={hero.video.play}
        pauseLabel={hero.video.pause}
      />

      <h1 id={titleId} className="pt-2 [grid-area:intro] md:pt-4 lg:pt-6">
        <span className="block font-display text-name font-extrabold text-fg">
          {hero.name}
        </span>
        <span className="sr-only">, </span>
        <span className="block font-display text-name leading-[1.2] text-fg-muted">
          {hero.role}
        </span>
      </h1>

      <div className="pt-4 @container [grid-area:title] lg:self-end lg:pt-8">
        <p className="hero-title title-gradient">
          {hero.title.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </p>
      </div>

      <div className="mx-auto mt-4 w-(--hero-avatar) self-end overflow-clip [grid-area:avatar] lg:mx-0 lg:mt-0 lg:justify-self-end">
        <div className="enter [--enter-delay:0.1s] [--enter-opacity:1] [--enter-y:18%]">
          <AvatarImage
            image={avatar}
            alt={hero.avatar.alt}
            pending={hero.avatar.pending}
            bare
            preload
            sizes="(min-width: 1024px) 46vw, 84vw"
          />
        </div>
      </div>

      <div className="flex flex-col gap-6 pt-4 pb-8 [grid-area:copy] md:pb-10 lg:pt-6 lg:pb-16">
        <p className="max-w-[34rem] text-lead text-fg">{hero.tagline}</p>
        <ContactButton
          href={contactHref}
          label={contactLabel}
          className="w-fit"
        />
      </div>
    </div>
  );
}

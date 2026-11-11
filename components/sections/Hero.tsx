import { AvatarImage } from "@/components/ui/AvatarImage";
import { ContactButton } from "@/components/ui/ContactButton";
import { Magnet } from "@/components/motion/Magnet";
import type { Dictionary } from "@/lib/i18n";
import type { LocalImage } from "@/lib/server/images";
import { fillTemplate, isPending } from "@/lib/text";

type HeroProps = {
  hero: Dictionary["hero"];
  titleId: string;
  avatar: LocalImage | null;
  contactHref: string;
  contactLabel: string;
};

function splitTitle(title: string): [string, string] {
  const at = title.trimEnd().lastIndexOf(" ");
  return at > 0 ? [title.slice(0, at), title.slice(at + 1)] : [title, ""];
}

export function Hero({ hero, titleId, avatar, contactHref, contactLabel }: HeroProps) {
  const [line1, line2] = splitTitle(hero.title);
  const since = isPending(hero.meta.year) ? hero.meta.year : fillTemplate(hero.meta.since, { year: hero.meta.year });
  const meta = [hero.meta.city, since];

  return (
    <div className="relative flex min-h-[calc(100svh-var(--nav-height))] flex-col overflow-x-clip">
      <h1
        id={titleId}
        className="hero-title title-gradient enter relative z-0 px-gutter pt-2 [--enter-delay:0.15s] [--enter-y:40px] md:pt-4"
      >
        <span className="block">{line1}</span>
        {line2 && <span className="block">{line2}</span>}
      </h1>

      <div className="enter relative z-10 mx-auto -mt-[4vw] w-60 [--enter-delay:0.6s] [--enter-y:30px] sm:w-80 lg:absolute lg:right-[3%] lg:bottom-0 lg:mt-0 lg:w-[min(380px,44svh)] xl:w-[min(460px,50svh)]">
        <Magnet>
          <AvatarImage
            image={avatar}
            alt={hero.avatar.alt}
            pending={hero.avatar.pending}
            bare
            preload
            sizes="(min-width: 1280px) 460px, (min-width: 1024px) 380px, (min-width: 640px) 320px, 240px"
          />
        </Magnet>
      </div>

      <div className="relative z-20 mt-auto flex flex-col gap-6 px-gutter pt-8 pb-7 sm:pb-8 md:pb-10">
        <div className="flex max-w-[34rem] flex-col gap-6 lg:max-w-[min(34rem,46%)]">
          <p className="enter font-serif text-tagline text-fg italic [--enter-delay:0.35s] [--enter-y:20px]">{hero.tagline}</p>
          <ContactButton href={contactHref} label={contactLabel} className="enter w-fit [--enter-delay:0.5s] [--enter-y:20px]" />
          <ul aria-label={hero.meta.label} className="enter meta flex flex-wrap gap-x-2 gap-y-1 text-sm text-fg-muted md:text-base [--enter-delay:0.5s] [--enter-y:20px]">
            {meta.map((item, i) => (
              <li key={i} className="flex gap-2">
                {i > 0 && <span aria-hidden="true">·</span>}
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

import { AvatarImage } from "@/components/ui/AvatarImage";
import { ContactButton } from "@/components/ui/ContactButton";
import { Magnet } from "@/components/motion/Magnet";
import type { Dictionary } from "@/lib/i18n";
import type { LocalImage } from "@/lib/server/images";
import { fillTemplate, isPending } from "@/lib/text";

type HeroProps = {
  hero: Dictionary["hero"];
  titleId: string;
  /** Idioma de la página: el subtítulo lleva lang propio si difiere. */
  lang: string;
  avatar: LocalImage | null;
  contactHref: string;
  contactLabel: string;
};

/** "HOLA, SOY MILTON" → ["HOLA, SOY", "MILTON"]: la última palabra va en su propia línea. */
function splitTitle(title: string): [string, string] {
  const at = title.trimEnd().lastIndexOf(" ");
  return at > 0 ? [title.slice(0, at), title.slice(at + 1)] : [title, ""];
}

/**
 * Hero a pantalla completa con composición de póster:
 * - nombre gigante en dos líneas (Archivo 900 comprimido, tamaño en vw);
 * - avatar centrado abajo, delante de la segunda línea, dentro de Magnet
 *   (apagado en táctil y con movimiento reducido);
 * - barra inferior: subtítulo en serif cursiva y frase a la izquierda;
 *   metadatos y botón de contacto a la derecha.
 * Entrada escalonada con CSS (.enter): el HTML del servidor no sale oculto,
 * sin JS se ve todo y con movimiento reducido no se anima.
 * Por debajo de lg el avatar entra en el flujo (no tapa la barra inferior).
 */
export function Hero({ hero, titleId, lang, avatar, contactHref, contactLabel }: HeroProps) {
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

      <div className="enter relative z-10 mx-auto -mt-[4vw] w-60 [--enter-delay:0.6s] [--enter-y:30px] sm:w-80 lg:absolute lg:bottom-0 lg:left-1/2 lg:mt-0 lg:w-[380px] lg:-translate-x-1/2 xl:w-[460px]">
        <Magnet padding={150} strength={3}>
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

      <div className="relative z-20 mt-auto flex flex-col gap-6 px-gutter pt-8 pb-7 sm:pb-8 md:pb-10 lg:flex-row lg:items-end lg:justify-between">
        <div className="enter flex flex-col gap-3 [--enter-delay:0.35s] [--enter-y:20px] lg:max-w-[calc(50%-13rem)] xl:max-w-[calc(50%-15.5rem)]">
          <p lang={hero.subtitleLang !== lang ? hero.subtitleLang : undefined} className="font-serif text-subtitle text-fg italic">
            {hero.subtitle}
          </p>
          <p className="meta max-w-xs text-fg-muted">{hero.tagline}</p>
        </div>

        <div className="flex flex-col gap-4 lg:max-w-[calc(50%-13rem)] lg:items-end xl:max-w-[calc(50%-15.5rem)]">
          <ul aria-label={hero.meta.label} className="enter meta flex flex-wrap gap-x-2 gap-y-1 text-fg-muted [--enter-delay:0.35s] [--enter-y:20px] lg:justify-end">
            {meta.map((item, i) => (
              <li key={i} className="flex gap-2">
                {i > 0 && <span aria-hidden="true">·</span>}
                {item}
              </li>
            ))}
          </ul>
          <ContactButton href={contactHref} label={contactLabel} className="enter w-fit [--enter-delay:0.5s] [--enter-y:20px]" />
        </div>
      </div>
    </div>
  );
}

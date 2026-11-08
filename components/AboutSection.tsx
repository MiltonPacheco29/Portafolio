import { AnimatedText } from "@/components/AnimatedText";
import { AvatarImage } from "@/components/AvatarImage";
import { ContactButton } from "@/components/ContactButton";
import { FadeIn } from "@/components/FadeIn";
import { PlaceholderImage, type PlaceholderVariant } from "@/components/PlaceholderImage";
import { VerticalLabel } from "@/components/VerticalLabel";
import { getDevPlaceholders } from "@/lib/devPlaceholders";
import type { Dictionary } from "@/lib/i18n";
import { getLocalImage } from "@/lib/images";
import { sectionClass, sectionTitleClass } from "@/lib/ui";

type AboutSectionProps = {
  about: Dictionary["sections"]["about"];
  contactHref: string;
  contactLabel: string;
};

type Corner = "topLeft" | "bottomLeft" | "topRight" | "bottomRight";

// Decorativos de las esquinas: entran desde su lado (DESIGN.md §6).
// En producción son formas CSS con los tokens del tema; en desarrollo, imágenes de prueba.
const CORNERS: { key: Corner; variant: PlaceholderVariant; x: number; delay: number; className: string }[] = [
  { key: "topLeft", variant: "circle", x: -80, delay: 0.1, className: "top-[4%] left-[2%] w-[160px] xl:left-[4%] xl:w-[210px]" },
  { key: "bottomLeft", variant: "block", x: -80, delay: 0.25, className: "bottom-[8%] left-[4%] w-[140px] xl:left-[8%] xl:w-[180px]" },
  { key: "topRight", variant: "ring", x: 80, delay: 0.15, className: "top-[4%] right-[2%] w-[160px] xl:right-[4%] xl:w-[210px]" },
  { key: "bottomRight", variant: "bars", x: 80, delay: 0.3, className: "bottom-[8%] right-[4%] w-[170px] xl:right-[8%] xl:w-[220px]" },
];

/**
 * Sobre mí: título gigante, avatar, párrafo que se revela por carácter con el
 * scroll y botón de contacto. Los cuatro decorativos solo aparecen desde lg,
 * donde hay sitio a los lados (no se superponen al texto) y son aria-hidden.
 */
export async function AboutSection({ about, contactHref, contactLabel }: AboutSectionProps) {
  const titleId = `${about.id}-title`;
  const image = getLocalImage(about.image.src);
  const dev = await getDevPlaceholders();

  return (
    <section
      id={about.id}
      data-section="about"
      aria-labelledby={titleId}
      className={`${sectionClass} flex min-h-svh items-center overflow-x-clip`}
    >
      <VerticalLabel text={about.title} className="top-section left-3" />

      {CORNERS.map((corner) => (
        <FadeIn
          key={corner.key}
          x={corner.x}
          y={0}
          duration={0.9}
          delay={corner.delay}
          className={`pointer-events-none absolute z-0 hidden aspect-square lg:block ${corner.className}`}
        >
          <PlaceholderImage
            image={null}
            devSrc={dev?.devAboutDecor[corner.key] ?? null}
            alt=""
            variant={corner.variant}
            className="size-full"
            imgClassName="size-full object-contain"
          />
        </FadeIn>
      ))}

      <div className="relative z-10 mx-auto flex w-full max-w-content flex-col items-center gap-10 text-center sm:gap-14 md:gap-16">
        <FadeIn y={40}>
          <h2 id={titleId} className={sectionTitleClass}>
            {about.title}
          </h2>
        </FadeIn>

        <AvatarImage
          image={image}
          alt={about.image.alt}
          pending={about.image.pending}
          className="w-full max-w-60 sm:max-w-72"
          sizes="(min-width: 640px) 288px, 240px"
        />

        <AnimatedText text={about.lead} className="max-w-[35rem] text-lead font-medium text-fg" />

        <ContactButton href={contactHref} label={contactLabel} />
      </div>
    </section>
  );
}

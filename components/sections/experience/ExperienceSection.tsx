import { AvatarImage } from "@/components/ui/AvatarImage";
import { ExperienceTimeline } from "@/components/sections/experience/ExperienceTimeline";
import { FadeIn } from "@/components/motion/FadeIn";
import { VerticalLabel } from "@/components/ui/VerticalLabel";
import type { Dictionary } from "@/lib/i18n";
import { getLocalImage } from "@/lib/server/images";
import { labelClass, sectionClass, sectionTitleClass } from "@/components/sections/sectionStyles";

type ExperienceSectionProps = { experience: Dictionary["sections"]["experience"] };

/**
 * Experiencia: se superpone a la sección invertida anterior con esquinas
 * superiores redondeadas. Línea de tiempo (GSAP, ya respeta movimiento
 * reducido) y formación.
 */
export function ExperienceSection({ experience }: ExperienceSectionProps) {
  const titleId = `${experience.id}-title`;
  const image = getLocalImage(experience.image.src);

  return (
    <section
      id={experience.id}
      data-section="experience"
      aria-labelledby={titleId}
      className={`${sectionClass} z-10 -mt-[var(--corner-section)] rounded-t-section bg-bg`}
    >
      <VerticalLabel text={experience.title} className="top-section left-3" />

      <div className="mx-auto w-full max-w-content">
        <FadeIn y={40}>
          <h2 id={titleId} className={sectionTitleClass}>
            {experience.title}
          </h2>
        </FadeIn>
        <p className="mt-6 max-w-prose text-lg text-fg-muted">{experience.intro}</p>

        <div className="mt-12 grid gap-10 lg:grid-cols-[minmax(0,20rem)_minmax(0,1fr)] lg:gap-16">
          <AvatarImage
            image={image}
            alt={experience.image.alt}
            pending={experience.image.pending}
            className="mx-auto w-full max-w-xs lg:sticky lg:top-nav-offset lg:max-w-none lg:self-start"
            sizes="(min-width: 1024px) 320px, 320px"
          />
          <div className="flex flex-col gap-16">
            <ExperienceTimeline
              items={experience.items}
              achievementsLabel={experience.achievementsLabel}
              stackLabel={experience.stackLabel}
            />

            <div className="flex flex-col gap-4">
              <h3 className={labelClass}>{experience.educationTitle}</h3>
              <ol className="grid gap-4 sm:grid-cols-2">
                {experience.education.map((entry, i) => (
                  <li key={i} className="rounded-md border border-border-strong bg-surface p-5">
                    <h4 className="font-display text-lg font-bold">{entry.degree}</h4>
                    <p className="mt-1 font-mono text-sm text-fg-muted">
                      {entry.institution} · {entry.period}
                    </p>
                    <p className="mt-2 text-fg-muted">{entry.detail}</p>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

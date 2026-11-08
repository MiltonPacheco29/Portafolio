import { AvatarImage } from "@/components/AvatarImage";
import { ExperienceTimeline } from "@/components/ExperienceTimeline";
import type { Dictionary } from "@/lib/i18n";
import { getLocalImage } from "@/lib/images";
import { sectionClass, sectionTitleClass } from "@/lib/ui";

type ExperienceSectionProps = { experience: Dictionary["sections"]["experience"] };

export function ExperienceSection({ experience }: ExperienceSectionProps) {
  const titleId = `${experience.id}-title`;
  const image = getLocalImage(experience.image.src);

  return (
    <section
      id={experience.id}
      data-section="experience"
      aria-labelledby={titleId}
      className={sectionClass}
    >
      <div className="mx-auto w-full max-w-content">
        <h2 id={titleId} className={sectionTitleClass}>
          {experience.title}
        </h2>
        <p className="mt-4 max-w-prose text-lg text-fg-muted">{experience.intro}</p>

        <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,20rem)_minmax(0,1fr)] lg:gap-16">
          <AvatarImage
            image={image}
            alt={experience.image.alt}
            pending={experience.image.pending}
            className="mx-auto w-full max-w-xs lg:sticky lg:top-nav-offset lg:max-w-none lg:self-start"
          />
          <ExperienceTimeline
            items={experience.items}
            achievementsLabel={experience.achievementsLabel}
            stackLabel={experience.stackLabel}
          />
        </div>
      </div>
    </section>
  );
}

import { AvatarImage } from "@/components/AvatarImage";
import type { Dictionary } from "@/lib/i18n";
import { getLocalImage } from "@/lib/images";
import { sectionClass, sectionTitleClass } from "@/lib/ui";

type SkillsSectionProps = { skills: Dictionary["sections"]["skills"] };

export function SkillsSection({ skills }: SkillsSectionProps) {
  const titleId = `${skills.id}-title`;
  const image = getLocalImage(skills.image.src);

  return (
    <section id={skills.id} data-section="skills" aria-labelledby={titleId} className={sectionClass}>
      <div className="mx-auto w-full max-w-content">
        <h2 id={titleId} className={sectionTitleClass}>
          {skills.title}
        </h2>
        <p className="mt-4 max-w-prose text-lg text-fg-muted">{skills.intro}</p>

        <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,18rem)_minmax(0,1fr)] lg:gap-16">
          <AvatarImage
            image={image}
            alt={skills.image.alt}
            pending={skills.image.pending}
            className="mx-auto w-full max-w-xs lg:sticky lg:top-nav-offset lg:max-w-none lg:self-start"
          />

          <ul className="grid gap-6 sm:grid-cols-2">
            {skills.groups.map((group) => (
              <li key={group.key} className="rounded-md border border-border-strong bg-surface p-5">
                <h3 className="font-display text-lg font-semibold text-primary">{group.title}</h3>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {group.items.map((skill, i) => (
                    <li key={i} className="rounded-sm border border-border-strong px-2 py-1 font-mono text-xs text-fg">
                      {skill}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

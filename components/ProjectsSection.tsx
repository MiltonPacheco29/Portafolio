import { AvatarImage } from "@/components/AvatarImage";
import { ProjectList } from "@/components/ProjectList";
import type { Dictionary } from "@/lib/i18n";
import { getLocalImage } from "@/lib/images";
import { sectionClass, sectionTitleClass } from "@/lib/ui";

type ProjectsSectionProps = { projects: Dictionary["sections"]["projects"] };

export function ProjectsSection({ projects }: ProjectsSectionProps) {
  const titleId = `${projects.id}-title`;
  const image = getLocalImage(projects.image.src);

  return (
    <section id={projects.id} data-section="projects" aria-labelledby={titleId} className={sectionClass}>
      <div className="mx-auto flex w-full max-w-content flex-col gap-10">
        <div className="grid items-center gap-8 md:grid-cols-[minmax(0,1fr)_minmax(0,16rem)]">
          <div>
            <h2 id={titleId} className={sectionTitleClass}>
              {projects.title}
            </h2>
            <p className="mt-4 max-w-prose text-lg text-fg-muted">{projects.intro}</p>
          </div>
          <AvatarImage
            image={image}
            alt={projects.image.alt}
            pending={projects.image.pending}
            className="mx-auto w-full max-w-60 md:max-w-none"
          />
        </div>

        <ProjectList items={projects.items} labels={projects.labels} filters={projects.filters} />
      </div>
    </section>
  );
}

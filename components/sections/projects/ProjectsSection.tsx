import { FadeIn } from "@/components/motion/FadeIn";
import { ProjectList } from "@/components/sections/projects/ProjectList";
import type { ProjectMedia } from "@/components/sections/projects/types";
import { VerticalLabel } from "@/components/ui/VerticalLabel";
import { getDevPlaceholders } from "@/lib/server/devPlaceholders";
import type { Dictionary } from "@/lib/i18n";
import { getLocalImage } from "@/lib/server/images";
import { sectionClass, sectionTitleClass } from "@/components/sections/sectionStyles";

type ProjectsSectionProps = { projects: Dictionary["sections"]["projects"] };

export async function ProjectsSection({ projects }: ProjectsSectionProps) {
  const titleId = `${projects.id}-title`;
  const dev = await getDevPlaceholders();

  const media: Record<string, ProjectMedia[]> = Object.fromEntries(
    projects.items.map((project, p) => [
      project.slug,
      project.images.map((img, i) => ({
        image: getLocalImage(img.src),
        devSrc: dev?.devProjectImages[p]?.[i] ?? null,
        alt: img.alt,
      })),
    ]),
  );

  return (
    <section id={projects.id} data-section="projects" aria-labelledby={titleId} className={sectionClass}>
      <VerticalLabel text={projects.title} className="top-section right-3" />

      <div className="mx-auto flex w-full max-w-content flex-col gap-10">
        <div>
          <FadeIn y={40}>
            <h2 id={titleId} className={sectionTitleClass}>
              {projects.title}
            </h2>
          </FadeIn>
          <p className="mt-6 max-w-prose text-lg text-fg-muted">{projects.intro}</p>
        </div>

        <ProjectList items={projects.items} labels={projects.labels} filters={projects.filters} media={media} />
      </div>
    </section>
  );
}

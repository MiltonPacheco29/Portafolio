import { AvatarImage } from "@/components/AvatarImage";
import type { Dictionary } from "@/lib/i18n";
import { getLocalImage } from "@/lib/images";
import { sectionClass, sectionTitleClass } from "@/lib/ui";

type AboutSectionProps = { about: Dictionary["sections"]["about"] };

export function AboutSection({ about }: AboutSectionProps) {
  const titleId = `${about.id}-title`;
  const image = getLocalImage(about.image.src);

  return (
    <section id={about.id} data-section="about" aria-labelledby={titleId} className={sectionClass}>
      <div className="mx-auto w-full max-w-content">
        <h2 id={titleId} className={sectionTitleClass}>
          {about.title}
        </h2>

        <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,22rem)] lg:gap-16">
          <div className="flex flex-col gap-10">
            {/* Bio */}
            <div className="flex flex-col gap-4">
              <h3 className="font-mono text-sm tracking-[var(--tracking-mono)] text-accent">
                {about.bioTitle}
              </h3>
              {about.paragraphs.map((text, i) => (
                <p key={i} className="max-w-prose text-lg text-fg-muted">
                  {text}
                </p>
              ))}
              <dl className="mt-2 grid gap-4 sm:grid-cols-3">
                {about.facts.map((fact, i) => (
                  <div key={i} className="border-l-2 border-border-strong pl-3">
                    <dt className="font-mono text-sm text-primary">{fact.label}</dt>
                    <dd>{fact.value}</dd>
                  </div>
                ))}
              </dl>
            </div>

            {/* Formación */}
            <div className="flex flex-col gap-4">
              <h3 className="font-mono text-sm tracking-[var(--tracking-mono)] text-accent">
                {about.educationTitle}
              </h3>
              <ol className="grid gap-4 sm:grid-cols-2">
                {about.education.map((entry, i) => (
                  <li key={i} className="rounded-md border border-border bg-surface p-4">
                    <h4 className="font-display text-lg font-semibold">{entry.degree}</h4>
                    <p className="font-mono text-sm text-fg-muted">
                      {entry.institution} · {entry.period}
                    </p>
                    <p className="mt-2 text-fg-muted">{entry.detail}</p>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          <AvatarImage
            image={image}
            alt={about.image.alt}
            pending={about.image.pending}
            className="mx-auto w-full max-w-sm lg:sticky lg:top-nav-offset lg:max-w-none lg:self-start"
          />
        </div>
      </div>
    </section>
  );
}

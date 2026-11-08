import { notFound } from "next/navigation";
import { AboutSection } from "@/components/AboutSection";
import { ContactSection } from "@/components/ContactSection";
import { ExperienceSection } from "@/components/ExperienceSection";
import { Hero } from "@/components/Hero";
import { ProjectsSection } from "@/components/ProjectsSection";
import { SkillsSection } from "@/components/SkillsSection";
import { getDictionary, hasLocale } from "@/lib/i18n";
import { innerClass } from "@/lib/ui";

export default async function HomePage({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const { sections: s, hero } = getDictionary(lang);

  return (
    <>
      <section
        id={s.home.id}
        data-section="home"
        aria-labelledby={`${s.home.id}-title`}
        className="scroll-mt-nav-offset"
      >
        <Hero
          line1={hero.line1}
          line2={hero.line2}
          lang={hero.lang !== lang ? hero.lang : undefined}
        />
        <div className={`${innerClass} px-gutter py-section`}>
          <p className="font-mono text-sm text-accent">{s.home.eyebrow}</p>
          <h1 id={`${s.home.id}-title`} className="font-display text-display font-bold text-primary">
            {s.home.title}
          </h1>
          <p className="max-w-prose text-lg text-fg-muted">{s.home.intro}</p>
          <p className="flex flex-wrap gap-4">
            <a href={`#${s.projects.id}`} className="underline underline-offset-4">
              {s.home.primaryCta}
            </a>
            <a href={`#${s.contact.id}`} className="underline underline-offset-4">
              {s.home.secondaryCta}
            </a>
          </p>
        </div>
      </section>

      <AboutSection about={s.about} />
      <ExperienceSection experience={s.experience} />
      <ProjectsSection projects={s.projects} />
      <SkillsSection skills={s.skills} />
      <ContactSection contact={s.contact} locale={lang} />
    </>
  );
}

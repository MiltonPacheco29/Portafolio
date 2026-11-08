import { notFound } from "next/navigation";
import { AboutSection } from "@/components/sections/AboutSection";
import { ContactSection } from "@/components/sections/contact/ContactSection";
import { ExperienceSection } from "@/components/sections/experience/ExperienceSection";
import { Hero } from "@/components/sections/Hero";
import { ProjectsSection } from "@/components/sections/projects/ProjectsSection";
import { ServicesSection } from "@/components/sections/ServicesSection";
import { SkillsMarquee } from "@/components/sections/SkillsMarquee";
import { StripeDivider } from "@/components/ui/StripeDivider";
import { getDictionary, hasLocale } from "@/lib/i18n";
import { getLocalImage } from "@/lib/server/images";

export default async function HomePage({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const { sections: s, hero, cta, skillsBand } = getDictionary(lang);
  const contactHref = `#${s.contact.id}`;

  return (
    <>
      <section
        id={s.home.id}
        data-section="home"
        aria-labelledby={`${s.home.id}-title`}
        className="scroll-mt-nav-offset"
      >
        <Hero
          hero={hero}
          titleId={`${s.home.id}-title`}
          lang={lang}
          avatar={getLocalImage(hero.avatar.src)}
          contactHref={contactHref}
          contactLabel={cta.contact}
        />
      </section>

      <SkillsMarquee label={skillsBand.label} items={skillsBand.items} />

      <AboutSection about={s.about} contactHref={contactHref} contactLabel={cta.contact} />
      <ServicesSection services={s.services} />
      <ExperienceSection experience={s.experience} />
      {/* Separadores decorativos: rayas diagonales estáticas (aria-hidden). */}
      <StripeDivider />
      <ProjectsSection projects={s.projects} />
      <StripeDivider />
      <ContactSection contact={s.contact} locale={lang} ctaLabel={cta.contact} />
    </>
  );
}

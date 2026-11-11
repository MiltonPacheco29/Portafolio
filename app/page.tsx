import { AboutSection } from "@/components/sections/AboutSection";
import { ContactSection } from "@/components/sections/contact/ContactSection";
import { ExperienceSection } from "@/components/sections/experience/ExperienceSection";
import { Hero } from "@/components/sections/hero/Hero";
import { ProjectsSection } from "@/components/sections/projects/ProjectsSection";
import { ServicesSection } from "@/components/sections/ServicesSection";
import { SkillsMarquee } from "@/components/sections/SkillsMarquee";
import { StripeDivider } from "@/components/ui/StripeDivider";
import { getDictionary } from "@/lib/i18n";
import { getLocalImage } from "@/lib/server/images";

export default function HomePage() {
  const { sections: s, hero, cta, skillsBand } = getDictionary();
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
          avatar={getLocalImage(hero.avatar.src)}
          contactHref={contactHref}
          contactLabel={cta.contact}
          projectsHref={`#${s.projects.id}`}
          projectsLabel={cta.projects}
        />
      </section>

      <SkillsMarquee label={skillsBand.label} items={skillsBand.items} />

      <AboutSection about={s.about} contactHref={contactHref} contactLabel={cta.contact} />
      <ServicesSection services={s.services} />
      <ExperienceSection experience={s.experience} />
      <StripeDivider />
      <ProjectsSection projects={s.projects} />
      <StripeDivider />
      <ContactSection contact={s.contact} ctaLabel={cta.contact} />
    </>
  );
}

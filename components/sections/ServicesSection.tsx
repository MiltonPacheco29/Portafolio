import { FadeIn } from "@/components/motion/FadeIn";
import { VerticalLabel } from "@/components/ui/VerticalLabel";
import type { Dictionary } from "@/lib/i18n";
import { sectionTitleClass } from "@/components/sections/sectionStyles";

type ServicesSectionProps = { services: Dictionary["sections"]["services"] };

export function ServicesSection({ services }: ServicesSectionProps) {
  const titleId = `${services.id}-title`;

  return (
    <section
      id={services.id}
      data-section="services"
      aria-labelledby={titleId}
      className="surface-inverse relative scroll-mt-nav-offset rounded-t-section bg-bg px-gutter pt-section pb-[calc(var(--section-gap)+var(--corner-section))] text-fg"
    >
      <VerticalLabel text={services.title} className="top-section right-3" />

      <div className="mx-auto w-full max-w-5xl">
        <FadeIn y={40}>
          <h2 id={titleId} className={`${sectionTitleClass} mb-16 text-center sm:mb-20 md:mb-28`}>
            {services.title}
          </h2>
        </FadeIn>

        <ol className="border-b border-border-strong">
          {services.items.map((item, i) => (
            <FadeIn
              key={i}
              as="li"
              delay={i * 0.1}
              className="flex items-start gap-5 border-t border-border-strong py-8 sm:gap-10 sm:py-10 md:py-12"
            >
              <span
                aria-hidden="true"
                className="w-[1.3em] shrink-0 font-display text-number font-black tabular-nums [font-stretch:80%]"
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="flex flex-col gap-3 pt-1 sm:pt-3">
                <h3 className="font-display text-xl font-bold uppercase md:text-2xl lg:text-3xl">{item.title}</h3>
                <p className="max-w-2xl text-base text-fg-muted md:text-lg">{item.description}</p>
              </div>
            </FadeIn>
          ))}
        </ol>
      </div>
    </section>
  );
}

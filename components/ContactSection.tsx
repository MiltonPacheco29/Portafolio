import { AvatarImage } from "@/components/AvatarImage";
import { ContactButton } from "@/components/ContactButton";
import { ContactForm } from "@/components/ContactForm";
import { CvBarcodeLink } from "@/components/CvBarcodeLink";
import { FadeIn } from "@/components/FadeIn";
import { VerticalLabel } from "@/components/VerticalLabel";
import { fileFormat, formatFileSize, getPublicFile } from "@/lib/files";
import type { Dictionary, Locale } from "@/lib/i18n";
import { getLocalImage } from "@/lib/images";
import { fillTemplate, isPending } from "@/lib/text";
import { labelClass, sectionClass, sectionTitleClass } from "@/lib/ui";

type Contact = Dictionary["sections"]["contact"];
type ContactSectionProps = { contact: Contact; locale: Locale; ctaLabel: string };

/** href de un enlace de contacto, o null si el valor sigue pendiente o no es válido. */
function contactHref(link: Contact["links"][number]): string | null {
  if (isPending(link.value)) return null;
  if (link.kind === "email") return `mailto:${link.value}`;
  return link.value.startsWith("https://") ? link.value : null;
}

export function ContactSection({ contact, locale, ctaLabel }: ContactSectionProps) {
  const titleId = `${contact.id}-title`;
  const formTitleId = `${contact.id}-form-title`;
  const image = getLocalImage(contact.image.src);
  const cvFile = getPublicFile(contact.cv.file);
  const format = cvFile?.format ?? fileFormat(contact.cv.file);

  // El nombre accesible del CV indica formato e idioma (y el tamaño si el archivo existe).
  const cvLabel = cvFile
    ? fillTemplate(contact.cv.labelWithSize, {
        format,
        language: contact.cv.languageName,
        size: formatFileSize(cvFile.bytes, locale),
      })
    : fillTemplate(contact.cv.label, { format, language: contact.cv.languageName });

  return (
    <section id={contact.id} data-section="contact" aria-labelledby={titleId} className={sectionClass}>
      <VerticalLabel text={contact.title} className="top-section left-3" />

      <div className="mx-auto w-full max-w-content">
        <FadeIn y={40}>
          <h2 id={titleId} className={sectionTitleClass}>
            {contact.title}
          </h2>
        </FadeIn>
        <p className="mt-6 max-w-prose text-lg text-fg-muted">{contact.intro}</p>

        {/* CTA final: mismo texto que la del Hero; lleva al formulario. */}
        <div className="mt-8 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-6">
          <p className="font-serif text-subtitle text-fg italic">{contact.ctaIntro}</p>
          <ContactButton href={`#${formTitleId}`} label={ctaLabel} />
        </div>

        <div className="mt-12 grid gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-3">
              <h3 className={labelClass}>{contact.linksTitle}</h3>
              <ul className="flex flex-col gap-2">
                {contact.links.map((link) => {
                  const href = contactHref(link);
                  return (
                    <li key={link.kind} className="flex flex-col">
                      <span className="font-mono text-xs text-primary">{link.label}</span>
                      {href ? (
                        <a
                          href={href}
                          rel={link.kind === "email" ? undefined : "me noreferrer"}
                          className="inline-flex min-h-11 items-center break-all text-fg underline underline-offset-4 hover:text-primary"
                        >
                          {link.value}
                        </a>
                      ) : (
                        <span className="py-1 text-fg-muted">
                          {/* break-all solo en el valor (URL larga); la etiqueta no se parte. */}
                          <span className="break-all">{link.value}</span>{" "}
                          <span className="font-mono text-xs whitespace-nowrap">({contact.pendingLink})</span>
                        </span>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="flex flex-col gap-2">
              <CvBarcodeLink
                href={cvFile?.src ?? null}
                label={cvLabel}
                title={contact.cv.button}
                caption={`${format} · ${contact.cv.langShort}`}
                fileLang={contact.cv.fileLang}
                mime={cvFile?.mime}
              />
              {!cvFile && <p className="font-mono text-xs text-fg-muted">{contact.cv.pending}</p>}
            </div>

            <AvatarImage
              image={image}
              alt={contact.image.alt}
              pending={contact.image.pending}
              className="w-full max-w-xs"
              sizes="320px"
            />
          </div>

          <div
            aria-labelledby={formTitleId}
            role="region"
            className="relative flex min-h-[28rem] flex-col gap-4 rounded-card border border-border-strong bg-surface p-6 sm:p-8"
          >
            <h3 id={formTitleId} tabIndex={-1} className="scroll-mt-nav-offset font-display text-2xl font-black uppercase outline-none">
              {contact.form.title}
            </h3>
            <ContactForm
              texts={contact.form}
              locale={locale}
              successImage={getLocalImage(contact.form.success.image.src)}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

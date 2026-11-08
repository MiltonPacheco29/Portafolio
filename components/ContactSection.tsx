import { AvatarImage } from "@/components/AvatarImage";
import { ContactForm } from "@/components/ContactForm";
import { fileFormat, formatFileSize, getPublicFile } from "@/lib/files";
import type { Dictionary, Locale } from "@/lib/i18n";
import { getLocalImage } from "@/lib/images";
import { fillTemplate, isPending } from "@/lib/text";
import { sectionClass, sectionTitleClass } from "@/lib/ui";

type Contact = Dictionary["sections"]["contact"];
type ContactSectionProps = { contact: Contact; locale: Locale };

const subtitleClass = "font-mono text-sm tracking-[var(--tracking-mono)] text-accent";

/** href de un enlace de contacto, o null si el valor sigue pendiente o no es válido. */
function contactHref(link: Contact["links"][number]): string | null {
  if (isPending(link.value)) return null;
  if (link.kind === "email") return `mailto:${link.value}`;
  return link.value.startsWith("https://") ? link.value : null;
}

export function ContactSection({ contact, locale }: ContactSectionProps) {
  const titleId = `${contact.id}-title`;
  const formTitleId = `${contact.id}-form-title`;
  const image = getLocalImage(contact.image.src);
  const cvFile = getPublicFile(contact.cv.file);

  // El texto del botón indica formato e idioma (y el tamaño si el archivo existe).
  const cvLabel = cvFile
    ? fillTemplate(contact.cv.labelWithSize, {
        format: cvFile.format,
        language: contact.cv.languageName,
        size: formatFileSize(cvFile.bytes, locale),
      })
    : fillTemplate(contact.cv.label, { format: fileFormat(contact.cv.file), language: contact.cv.languageName });

  const downloadIcon = (
    <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3v12M7 10l5 5 5-5M5 21h14" />
    </svg>
  );

  return (
    <section id={contact.id} data-section="contact" aria-labelledby={titleId} className={sectionClass}>
      <div className="mx-auto w-full max-w-content">
        <h2 id={titleId} className={sectionTitleClass}>
          {contact.title}
        </h2>
        <p className="mt-4 max-w-prose text-lg text-fg-muted">{contact.intro}</p>

        <div className="mt-10 grid gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="flex flex-col gap-8">
            {/* Enlaces */}
            <div className="flex flex-col gap-3">
              <h3 className={subtitleClass}>{contact.linksTitle}</h3>
              <ul className="flex flex-col gap-2">
                {contact.links.map((link) => {
                  const href = contactHref(link);
                  return (
                    <li key={link.kind} className="flex flex-col border-l-2 border-border-strong pl-3">
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

            {/* CV */}
            <div className="flex flex-col gap-2">
              {cvFile ? (
                <a
                  href={cvFile.src}
                  download
                  hrefLang={contact.cv.fileLang}
                  type={cvFile.mime}
                  className="inline-flex min-h-11 w-fit items-center gap-2 rounded-sm bg-primary px-4 py-2 font-mono text-sm font-semibold text-on-primary shadow-glow-primary hover:bg-accent hover:text-on-accent motion-safe:transition-colors"
                >
                  {downloadIcon}
                  {cvLabel}
                </a>
              ) : (
                <>
                  {/* Sin archivo no hay enlace (evita un 404): botón inactivo con aviso. */}
                  <span className="inline-flex min-h-11 w-fit items-center gap-2 rounded-sm border border-dashed border-border-strong px-4 py-2 font-mono text-sm text-fg-muted">
                    {downloadIcon}
                    {cvLabel}
                  </span>
                  <p className="font-mono text-xs text-fg-muted">{contact.cv.pending}</p>
                </>
              )}
            </div>

            <AvatarImage
              image={image}
              alt={contact.image.alt}
              pending={contact.image.pending}
              className="w-full max-w-xs"
            />
          </div>

          <div
            aria-labelledby={formTitleId}
            role="region"
            className="relative flex min-h-[28rem] flex-col gap-4 rounded-md border border-border-strong bg-surface p-6"
          >
            <h3 id={formTitleId} className="font-display text-xl font-semibold">
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

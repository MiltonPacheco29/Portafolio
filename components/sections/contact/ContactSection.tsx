import { ContactForm } from "@/components/sections/contact/ContactForm";
import { CopyEmailButton } from "@/components/sections/contact/CopyEmailButton";
import { CvBarcodeLink } from "@/components/sections/contact/CvBarcodeLink";
import { FadeIn } from "@/components/motion/FadeIn";
import { ghostClass } from "@/components/ui/GhostButton";
import { VerticalLabel } from "@/components/ui/VerticalLabel";
import { fileFormat, formatFileSize, getPublicFile } from "@/lib/server/files";
import { siteLang, type Dictionary } from "@/lib/i18n";
import { fillTemplate, isPending } from "@/lib/text";
import { sectionClass } from "@/components/sections/sectionStyles";

type Contact = Dictionary["sections"]["contact"];
type Link = Contact["links"][number];
type ContactSectionProps = {
  contact: Contact;
  availability: Dictionary["hero"]["availability"];
};

function contactHref(link: Link): string | null {
  if (isPending(link.value)) return null;
  if (link.kind === "email") return `mailto:${link.value}`;
  return link.value.startsWith("https://") ? link.value : null;
}

/* Iconos de línea propios (mismo trazo que los chips del Hero). */
function LinkIcon({ kind }: { kind: string }) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 16 16"
      className="size-4 shrink-0"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {kind === "linkedin" ? (
        <>
          <rect x="1.75" y="1.75" width="12.5" height="12.5" rx="2" />
          <path d="M5 7v4M5 5v.01M8 11V7M8 8.75c0-1 .75-1.75 1.75-1.75S11.5 7.75 11.5 8.75V11" />
        </>
      ) : (
        <path d="M6 13.5c-3 .9-3-1.5-4.25-1.75M10 15v-2.4c0-.7.07-1-.35-1.4 2-.22 3.85-1 3.85-4.4a3.4 3.4 0 0 0-.95-2.4 3.2 3.2 0 0 0-.06-2.35s-.76-.24-2.5.92a8.6 8.6 0 0 0-4.5 0C3.75 1.8 3 2.05 3 2.05a3.2 3.2 0 0 0-.06 2.35A3.4 3.4 0 0 0 2 6.8c0 3.4 1.85 4.18 3.85 4.4-.42.4-.42.8-.35 1.4V15" />
      )}
    </svg>
  );
}

/* Cierre de la página: un panel como la última hoja del cartel. Arriba la invitación y el
   correo en tamaño de cartel (la pieza protagonista); abajo el formulario y el CV. */
export function ContactSection({ contact, availability }: ContactSectionProps) {
  const titleId = `${contact.id}-title`;
  const formTitleId = `${contact.id}-form-title`;
  const cvFile = getPublicFile(contact.cv.file);
  const format = cvFile?.format ?? fileFormat(contact.cv.file);

  const cvLabel = cvFile
    ? fillTemplate(contact.cv.labelWithSize, {
        format,
        language: contact.cv.languageName,
        size: formatFileSize(cvFile.bytes, siteLang),
      })
    : fillTemplate(contact.cv.label, { format, language: contact.cv.languageName });

  const email = contact.links.find((link) => link.kind === "email");
  const emailHref = email ? contactHref(email) : null;
  const profiles = contact.links.filter((link) => link.kind !== "email");
  const [lineA, lineB] = contact.headline;

  return (
    <section
      id={contact.id}
      data-section="contact"
      aria-labelledby={titleId}
      className={`${sectionClass} lg:flex lg:min-h-[calc(100svh-var(--nav-offset))] lg:items-center lg:py-6`}
    >
      <VerticalLabel text={contact.title} className="top-section left-3" />

      <FadeIn y={40} className="mx-auto w-full max-w-content">
        <div className="contact-panel">
          <div aria-hidden="true" className="contact-panel-glow" />
          <div aria-hidden="true" className="contact-panel-dots" />

          <div className="grid gap-12 lg:grid-cols-12">
            <div className="contact-intro flex flex-col lg:col-span-7">
              {availability.show && (
                <p className="hero-badge self-start">
                  <span aria-hidden="true" className="size-2 shrink-0 rounded-full bg-status" />
                  {availability.label}
                </p>
              )}
              <h2 id={titleId} className="contact-headline mt-6">
                <span className="sr-only">{contact.title}: </span>
                <span className="title-gradient block">{lineA}</span>
                <span className="block text-primary">{lineB}</span>
              </h2>
              <p className="mt-6 max-w-prose text-fg-muted md:text-lg">{contact.intro}</p>

              {email && (
                <div className="mt-10 flex flex-col gap-5">
                  {emailHref ? (
                    <a href={emailHref} className="contact-email">
                      <span className="sr-only">{contact.emailLabel} </span>
                      {email.value}
                    </a>
                  ) : (
                    <p className="contact-email text-fg-muted">
                      {email.value} <span className="font-mono text-xs normal-case">({contact.pendingLink})</span>
                    </p>
                  )}

                  <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-start">
                    {emailHref && (
                      <CopyEmailButton
                        email={email.value}
                        label={contact.copyEmail}
                        copied={contact.copied}
                        failed={contact.copyFailed}
                      />
                    )}
                    <ul aria-label={contact.linksTitle} className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                      {profiles.map((link) => {
                        const href = contactHref(link);
                        return (
                          <li key={link.kind} className="flex flex-col">
                            {href ? (
                              <a href={href} rel="me noreferrer" className={`${ghostClass} justify-center`}>
                                <LinkIcon kind={link.kind} />
                                {link.label}
                              </a>
                            ) : (
                              <span
                                aria-disabled="true"
                                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-pill border-2 border-dashed border-border-strong px-5 font-mono text-sm font-semibold text-fg-muted"
                              >
                                <LinkIcon kind={link.kind} />
                                {link.label} ({contact.pendingLink})
                              </span>
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </div>
              )}

              <div className="mt-8 flex flex-col gap-2 lg:mt-auto lg:pt-8">
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
            </div>

            <div aria-hidden="true" className="stripes lg:hidden" />

            <div
              aria-labelledby={formTitleId}
              role="region"
              className="flex flex-col gap-5 lg:col-span-5 lg:border-l lg:border-border lg:pl-12"
            >
              <h3
                id={formTitleId}
                tabIndex={-1}
                className="scroll-mt-nav-offset font-display text-2xl font-extrabold uppercase outline-none"
              >
                {contact.form.title}
              </h3>
              <ContactForm texts={contact.form} />
            </div>
          </div>
        </div>
      </FadeIn>
    </section>
  );
}

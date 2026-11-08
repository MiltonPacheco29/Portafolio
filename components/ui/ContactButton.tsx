type ContactButtonProps = {
  href: string;
  label: string;
  className?: string;
};

/**
 * Llamada a la acción principal (que me contacten). Mismo texto en todas partes.
 * Oscuro: cian con tinta (13.92:1). Claro: rojo de imprenta con blanco (5.25:1).
 */
export function ContactButton({ href, label, className = "" }: ContactButtonProps) {
  return (
    <a
      href={href}
      className={`inline-flex min-h-12 items-center justify-center rounded-pill bg-cta px-7 py-3 font-mono text-sm font-semibold tracking-[var(--tracking-mono)] text-on-cta shadow-glow-primary hover:bg-cta-hover hover:text-on-cta-hover active:translate-y-px motion-safe:transition-colors motion-safe:duration-150 ${className}`}
    >
      {label}
    </a>
  );
}

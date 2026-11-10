type ContactButtonProps = {
  href: string;
  label: string;
  className?: string;
};

export const ctaClass =
  "inline-flex min-h-12 items-center justify-center rounded-pill bg-cta px-7 py-3 font-mono text-sm font-semibold tracking-[var(--tracking-mono)] text-on-cta shadow-glow-primary hover:bg-cta-hover hover:text-on-cta-hover active:translate-y-px motion-safe:transition-colors motion-safe:duration-200";

export function ContactButton({ href, label, className = "" }: ContactButtonProps) {
  return (
    <a href={href} className={`${ctaClass} ${className}`}>
      {label}
    </a>
  );
}

type ContactButtonProps = {
  href: string;
  label: string;
  className?: string;
  icon?: boolean;
};

export const ctaClass =
  "group inline-flex min-h-12 items-center justify-center rounded-pill bg-cta px-7 py-3 font-mono text-sm font-semibold tracking-[var(--tracking-mono)] text-on-cta shadow-glow-primary hover:bg-cta-hover hover:text-on-cta-hover active:translate-y-px motion-safe:transition-colors motion-safe:duration-200";

export function ContactButton({ href, label, className = "", icon = false }: ContactButtonProps) {
  return (
    <a href={href} className={`${ctaClass} ${icon ? "gap-2.5" : ""} ${className}`}>
      {label}
      {icon && (
        <svg
          aria-hidden="true"
          focusable="false"
          viewBox="0 0 16 16"
          className="size-4 shrink-0 group-hover:translate-x-0.5 motion-safe:transition-transform motion-safe:duration-200"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M3 8h10M9 4l4 4-4 4" />
        </svg>
      )}
    </a>
  );
}

import type { ReactNode } from "react";

type GhostButtonProps = {
  href: string | null;
  label: string;
  srSuffix?: string;
  icon?: ReactNode;
  className?: string;
};

const base =
  "inline-flex min-h-11 items-center gap-2 rounded-pill border-2 px-5 font-mono text-sm font-semibold tracking-[var(--tracking-mono)]";

export const ghostClass = `${base} border-fg text-fg hover:border-primary hover:text-primary active:translate-y-px motion-safe:transition-colors motion-safe:duration-200`;

export function GhostButton({ href, label, srSuffix, icon, className = "" }: GhostButtonProps) {
  const content = (
    <>
      {label}
      {srSuffix && <span className="sr-only"> {srSuffix}</span>}
      {icon}
    </>
  );

  if (!href) {
    return (
      <span aria-disabled="true" className={`${base} border-dashed border-border-strong text-fg-muted ${className}`}>
        {content}
      </span>
    );
  }

  return (
    <a
      href={href}
      rel="noreferrer"
      className={`${ghostClass} ${className}`}
    >
      {content}
    </a>
  );
}

export function VerticalLabel({ text, className = "" }: { text: string; className?: string }) {
  return (
    <span aria-hidden="true" className={`vertical-label pointer-events-none absolute hidden select-none lg:block ${className}`}>
      {text}
    </span>
  );
}

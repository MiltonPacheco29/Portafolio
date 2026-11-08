/**
 * Etiqueta vertical decorativa (repite un texto que ya está en la sección, de
 * content/*.json). aria-hidden: los lectores de pantalla no la leen dos veces.
 * Solo desde lg; en móvil se oculta.
 */
export function VerticalLabel({ text, className = "" }: { text: string; className?: string }) {
  return (
    <span aria-hidden="true" className={`vertical-label pointer-events-none absolute hidden select-none lg:block ${className}`}>
      {text}
    </span>
  );
}

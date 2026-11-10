type CvBarcodeLinkProps = {
  href: string | null;
  label: string;
  title: string;
  caption: string;
  fileLang: string;
  mime?: string;
};

function barWidths(seed: string, count = 38): number[] {
  let hash = 2166136261;
  const widths: number[] = [];
  for (let i = 0; i < count; i++) {
    hash ^= seed.charCodeAt(i % seed.length) + i;
    hash = Math.imul(hash, 16777619);
    widths.push(1 + ((hash >>> 0) % 4));
  }
  return widths;
}

function barLayout(seed: string): { bars: { x: number; width: number }[]; total: number } {
  const bars: { x: number; width: number }[] = [];
  let x = 0;
  barWidths(seed).forEach((width, i) => {
    bars.push({ x, width });
    x += width + (i % 3 === 0 ? 2 : 1.5);
  });
  return { bars, total: x };
}

function Barcode({ seed }: { seed: string }) {
  const { bars, total: x } = barLayout(seed);
  return (
    <svg aria-hidden="true" focusable="false" viewBox={`0 0 ${x} 40`} preserveAspectRatio="none" className="h-12 w-full" fill="currentColor">
      {bars.map((bar, i) => (
        <rect key={i} x={bar.x} y="0" width={bar.width} height="40" />
      ))}
    </svg>
  );
}

export function CvBarcodeLink({ href, label, title, caption, fileLang, mime }: CvBarcodeLinkProps) {
  const body = (
    <>
      <Barcode seed={caption} />
      <span className="flex items-baseline justify-between gap-4">
        <span className="font-mono text-sm font-semibold tracking-[var(--tracking-mono)]">{title}</span>
        <span className="meta">{caption}</span>
      </span>
    </>
  );

  if (!href) {
    return (
      <span
        aria-disabled="true"
        className="flex w-full max-w-72 flex-col gap-2 rounded-sm border-2 border-dashed border-border-strong bg-surface px-4 py-3 text-fg-muted"
      >
        <span className="sr-only">{label}</span>
        <span aria-hidden="true" className="flex flex-col gap-2">
          {body}
        </span>
      </span>
    );
  }

  return (
    <a
      href={href}
      download
      hrefLang={fileLang}
      type={mime}
      aria-label={label}
      className="flex w-full max-w-72 flex-col gap-2 rounded-sm border-2 border-fg bg-surface px-4 py-3 text-fg hover:border-primary hover:text-primary active:translate-y-px motion-safe:transition-colors motion-safe:duration-200"
    >
      {body}
    </a>
  );
}

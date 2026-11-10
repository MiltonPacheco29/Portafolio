export function StripeDivider({ className = "" }: { className?: string }) {
  return <div aria-hidden="true" className={`stripes w-full ${className}`} />;
}

import { existsSync, statSync } from "node:fs";
import { join } from "node:path";

export type PublicFile = {
  src: string;
  bytes: number;
  format: string;
  mime?: string;
};

const MIME_TYPES: Record<string, string> = {
  pdf: "application/pdf",
};

export function fileFormat(src: string): string {
  return (src.split(".").pop() ?? "").toUpperCase();
}

export function getPublicFile(src: string): PublicFile | null {
  const file = join(process.cwd(), "public", src);
  if (!existsSync(file)) return null;
  const format = fileFormat(src);
  return { src, bytes: statSync(file).size, format, mime: MIME_TYPES[format.toLowerCase()] };
}

export function formatFileSize(bytes: number, locale: string): string {
  const mb = bytes / (1024 * 1024);
  if (mb >= 1) {
    return `${new Intl.NumberFormat(locale, { maximumFractionDigits: 1 }).format(mb)} MB`;
  }
  return `${new Intl.NumberFormat(locale, { maximumFractionDigits: 0 }).format(Math.max(1, bytes / 1024))} KB`;
}

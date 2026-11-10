// Solo para componentes de servidor: se ejecuta en el build (output: "export").
import { existsSync, statSync } from "node:fs";
import { join } from "node:path";

export type PublicFile = {
  src: string;
  bytes: number;
  /** Formato legible para el usuario, a partir de la extensión: "PDF". */
  format: string;
  /** Tipo MIME para el atributo type del enlace, si se conoce. */
  mime?: string;
};

const MIME_TYPES: Record<string, string> = {
  pdf: "application/pdf",
};

export function fileFormat(src: string): string {
  return (src.split(".").pop() ?? "").toUpperCase();
}

/** Archivo de public/ con su tamaño, o null si todavía no existe (se muestra como pendiente). */
export function getPublicFile(src: string): PublicFile | null {
  const file = join(process.cwd(), "public", src);
  if (!existsSync(file)) return null;
  const format = fileFormat(src);
  return { src, bytes: statSync(file).size, format, mime: MIME_TYPES[format.toLowerCase()] };
}

/** Tamaño legible en el idioma del sitio: "120 KB", "1,4 MB". */
export function formatFileSize(bytes: number, locale: string): string {
  const mb = bytes / (1024 * 1024);
  if (mb >= 1) {
    return `${new Intl.NumberFormat(locale, { maximumFractionDigits: 1 }).format(mb)} MB`;
  }
  return `${new Intl.NumberFormat(locale, { maximumFractionDigits: 0 }).format(Math.max(1, bytes / 1024))} KB`;
}

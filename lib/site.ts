// URL pública del sitio, para metadata, sitemap y robots (solo se usa en el build).
// Orden: NEXT_PUBLIC_SITE_URL (la definitiva, p. ej. tu dominio) → CF_PAGES_URL
// (Cloudflare Pages la define en cada build: es la URL de ESE despliegue) → localhost.
const raw =
  process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
  process.env.CF_PAGES_URL?.trim() ||
  "http://localhost:3000";

export const siteUrl = new URL(raw.endsWith("/") ? raw : `${raw}/`);

/** URL absoluta de una ruta del sitio: absoluteUrl("/es/") → "https://dominio/es/". */
export function absoluteUrl(path: string): string {
  return new URL(path.replace(/^\//, ""), siteUrl).toString();
}

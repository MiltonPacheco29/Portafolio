const raw =
  process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
  process.env.CF_PAGES_URL?.trim() ||
  "http://localhost:3000";

export const siteUrl = new URL(raw.endsWith("/") ? raw : `${raw}/`);

export function absoluteUrl(path: string): string {
  return new URL(path.replace(/^\//, ""), siteUrl).toString();
}

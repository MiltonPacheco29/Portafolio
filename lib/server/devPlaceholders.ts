type DevPlaceholders = typeof import("@/content/dev-placeholders");

export async function getDevPlaceholders(): Promise<DevPlaceholders | null> {
  if (process.env.NODE_ENV !== "development") return null;
  return import("@/content/dev-placeholders");
}

// Solo para componentes de servidor: se ejecuta en `next dev` o en el build.
//
// En producción devuelve null sin importar content/dev-placeholders.ts, así que
// ninguna URL externa llega al HTML ni al JavaScript de out/. Los componentes
// cliente nunca importan ese archivo: reciben las URLs ya resueltas por props.

type DevPlaceholders = typeof import("@/content/dev-placeholders");

export async function getDevPlaceholders(): Promise<DevPlaceholders | null> {
  if (process.env.NODE_ENV !== "development") return null;
  return import("@/content/dev-placeholders");
}

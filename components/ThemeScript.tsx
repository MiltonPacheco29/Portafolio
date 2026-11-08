"use client";

import { useSyncExternalStore } from "react";
import { themeInitScript } from "@/lib/theme";

const subscribe = () => () => {};
const onClient = () => false;
const onServer = () => true;

/**
 * Script en línea para <head>: fija data-theme antes de pintar la página.
 * Se usa un <script> normal (no next/script) porque en App Router
 * `beforeInteractive` lo ejecuta el runtime de Next y llegaría tarde.
 *
 * Solo se renderiza en el HTML del servidor (y al hidratarlo). Si React lo
 * monta en el navegador, por ejemplo al cambiar /es ↔ /en (Next vuelve a montar
 * el layout raíz), devuelve null: un <script> creado por React no se ejecuta y
 * React 19 avisa por ello. No hace falta: el script ya corrió al cargar la
 * página y su MutationObserver sigue activo.
 */
export function ThemeScript() {
  // true en el servidor y durante la hidratación; false en montajes del cliente.
  const fromServerHtml = useSyncExternalStore(subscribe, onClient, onServer);
  if (!fromServerHtml) return null;
  return <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />;
}

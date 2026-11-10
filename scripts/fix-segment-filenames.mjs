// Corrige los archivos de prefetch por segmento de `output: "export"` cuando se
// construye en Windows. Se ejecuta en postbuild.
//
// El cliente de Next pide /ruta/__next.$d$seg.__PAGE__.txt (segmentos unidos con
// "."), pero en Windows el export escribe /ruta/__next.$d$seg/__PAGE__.txt: usa
// path.relative (separador "\") y solo sustituye "/" por "." (Next 16.4.5,
// dist/export/index.js). El prefetch da 404 y la navegación tiene que pedir la
// página entera. En Linux (CI, Cloudflare) no hay carpetas así y no hace nada.
import { readdirSync, renameSync, rmSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";

const OUT_DIR = "out";
const PREFIX = "__next.";

function* files(dir) {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) yield* files(path);
    else yield path;
  }
}

function* segmentDirs(dir) {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (!statSync(path).isDirectory() || name === "_next") continue;
    if (name.startsWith(PREFIX)) yield path;
    else yield* segmentDirs(path);
  }
}

let moved = 0;
for (const dir of [...segmentDirs(OUT_DIR)]) {
  for (const file of [...files(dir)]) {
    // out/ruta/__next.$d$seg/__PAGE__.txt → out/ruta/__next.$d$seg.__PAGE__.txt
    const flat = `${dir}.${relative(dir, file).split(sep).join(".")}`;
    renameSync(file, flat);
    moved++;
  }
  rmSync(dir, { recursive: true });
}
console.log(
  moved > 0
    ? `✓ Prefetch: ${moved} archivo(s) de segmento renombrados al formato que pide el cliente.`
    : "✓ Prefetch: nombres de segmento correctos (nada que corregir).",
);

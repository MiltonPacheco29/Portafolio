// Falla si el sitio exportado (out/) contiene URLs de las imágenes de prueba
// TEMPORALES (content/dev-placeholders.ts). Se ejecuta tras `npm run build`
// (postbuild) y en la CI.
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const OUT_DIR = "out";
const FORBIDDEN = ["higgs.ai", "figma.site", "cloudfront"];

function* walk(dir) {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) yield* walk(path);
    else yield path;
  }
}

let found = 0;
for (const file of walk(OUT_DIR)) {
  const text = readFileSync(file).toString("latin1");
  for (const needle of FORBIDDEN) {
    if (text.includes(needle)) {
      console.error(`✗ ${relative(".", file)} contiene "${needle}"`);
      found++;
    }
  }
}

if (found > 0) {
  console.error(`\n${found} coincidencia(s): hay URLs de prueba en el build de producción.`);
  process.exit(1);
}
console.log(`✓ out/ sin URLs de prueba (${FORBIDDEN.join(", ")}).`);

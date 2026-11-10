import { createHash } from "node:crypto";
import { readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const OUT_DIR = "out";
const HEADERS = join(OUT_DIR, "_headers");
const TOKEN = "__CSP_SCRIPT_HASHES__";
const MAX_LINE = 2000;

function* walk(dir) {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) yield* walk(path);
    else if (path.endsWith(".html")) yield path;
  }
}

const hashes = new Set();
const inlineScript = /<script\b(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/gi;
for (const file of walk(OUT_DIR)) {
  const html = readFileSync(file, "utf8");
  for (const match of html.matchAll(inlineScript)) {
    if (match[1].length === 0) continue;
    hashes.add(`'sha256-${createHash("sha256").update(match[1], "utf8").digest("base64")}'`);
  }
}

const template = readFileSync(HEADERS, "utf8");
if (template.split(TOKEN).length !== 2) {
  console.error(`✗ ${HEADERS} debe contener ${TOKEN} exactamente una vez`);
  process.exit(1);
}
const result = template.replace(TOKEN, [...hashes].sort().join(" "));
const longest = Math.max(...result.split("\n").map((line) => line.length));
if (longest > MAX_LINE) {
  console.error(`✗ Una línea de _headers mide ${longest} caracteres (máximo ${MAX_LINE}).`);
  process.exit(1);
}
writeFileSync(HEADERS, result);
console.log(`✓ CSP: ${hashes.size} hash(es) de scripts en línea en ${HEADERS}.`);

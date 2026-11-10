import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

export type LocalImage = { src: string; width: number; height: number };

function readWebpSize(buf: Buffer): { width: number; height: number } | null {
  if (buf.toString("ascii", 0, 4) !== "RIFF" || buf.toString("ascii", 8, 12) !== "WEBP") return null;
  const chunk = buf.toString("ascii", 12, 16);
  if (chunk === "VP8X") {
    return { width: 1 + buf.readUIntLE(24, 3), height: 1 + buf.readUIntLE(27, 3) };
  }
  if (chunk === "VP8 ") {
    return { width: buf.readUInt16LE(26) & 0x3fff, height: buf.readUInt16LE(28) & 0x3fff };
  }
  if (chunk === "VP8L") {
    const bits = buf.readUInt32LE(21);
    return { width: (bits & 0x3fff) + 1, height: ((bits >> 14) & 0x3fff) + 1 };
  }
  return null;
}

export function getLocalImage(src: string): LocalImage | null {
  const file = join(process.cwd(), "public", src);
  if (!existsSync(file)) return null;
  const size = readWebpSize(readFileSync(file));
  if (!size) throw new Error(`${src}: las imágenes de public/ deben ser WebP`);
  return { src, ...size };
}

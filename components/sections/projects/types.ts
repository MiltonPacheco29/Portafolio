import type { LocalImage } from "@/lib/server/images";

export type ProjectMedia = { image: LocalImage | null; devSrc: string | null; alt: string };

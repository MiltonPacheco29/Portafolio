import type { LocalImage } from "@/lib/server/images";

/**
 * Imagen de un proyecto: local (con dimensiones leídas en el build), URL de
 * prueba solo en desarrollo, o ninguna (marcador CSS). La comparten
 * ProjectsSection (servidor), ProjectList y ProjectCard (cliente).
 */
export type ProjectMedia = { image: LocalImage | null; devSrc: string | null; alt: string };

import { PlaceholderImage } from "@/components/ui/PlaceholderImage";
import type { LocalImage } from "@/lib/server/images";

type AvatarImageProps = {
  /** Imagen con dimensiones reales (lib/server/images.ts), o null si aún no existe el archivo. */
  image: LocalImage | null;
  alt: string;
  /** Texto del marco reservado mientras falta la imagen. */
  pending: string;
  className?: string;
  /** Sin marco (avatar recortado con fondo transparente, p. ej. en el Hero). */
  bare?: boolean;
  preload?: boolean;
  sizes?: string;
};

/**
 * Avatar enmarcado. Si falta el archivo muestra una silueta con la misma
 * proporción (4:5) que tendrá la imagen: al añadirla no se mueve nada.
 */
export function AvatarImage({ image, alt, pending, className = "", bare = false, preload, sizes }: AvatarImageProps) {
  const frame = bare ? "" : "overflow-hidden rounded-card border border-border-strong bg-surface shadow-glow-primary";
  return (
    <PlaceholderImage
      image={image}
      alt={alt}
      pending={pending}
      variant="avatar"
      preload={preload}
      sizes={sizes}
      surface={!bare}
      className={`${frame} ${image ? "" : "aspect-[4/5]"} ${className}`}
    />
  );
}

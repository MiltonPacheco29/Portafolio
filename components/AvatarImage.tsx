import Image from "next/image";
import type { LocalImage } from "@/lib/images";

type AvatarImageProps = {
  /** Imagen con dimensiones reales (lib/images.ts), o null si aún no existe el archivo. */
  image: LocalImage | null;
  alt: string;
  /** Texto del marco reservado mientras falta la imagen. */
  pending: string;
  className?: string;
};

// Proporción del marco reservado cuando falta la imagen (la de los avatares: 4:5).
const PENDING_ASPECT_RATIO = "4 / 5";

export function AvatarImage({ image, alt, pending, className = "" }: AvatarImageProps) {
  const frame = `overflow-hidden rounded-md border border-border-strong bg-surface shadow-glow-primary ${className}`;

  if (!image) {
    // Mismo tamaño que tendrá la imagen: al añadir el archivo no se mueve nada.
    return (
      <div
        className={`${frame} flex items-center justify-center border-dashed p-6 text-center`}
        style={{ aspectRatio: PENDING_ASPECT_RATIO }}
      >
        <p className="font-mono text-sm text-fg-muted">{pending}</p>
      </div>
    );
  }

  // width/height reales: el navegador reserva el espacio antes de descargarla (sin saltos).
  return (
    <div className={frame}>
      <Image
        src={image.src}
        alt={alt}
        width={image.width}
        height={image.height}
        className="block h-auto w-full"
      />
    </div>
  );
}

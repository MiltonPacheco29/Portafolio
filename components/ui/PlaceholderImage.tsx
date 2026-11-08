import Image from "next/image";
import type { LocalImage } from "@/lib/server/images";

export type PlaceholderVariant = "avatar" | "photo" | "circle" | "ring" | "block" | "bars";

type PlaceholderImageProps = {
  /** Imagen local con dimensiones reales (lib/server/images.ts), o null si aún no existe. */
  image: LocalImage | null;
  /** Solo en desarrollo: URL de prueba TEMPORAL (content/dev-placeholders.ts). En producción llega null. */
  devSrc?: string | null;
  /** Texto alternativo; vacío = decorativa (se oculta a lectores de pantalla). */
  alt: string;
  /** Aviso visible cuando falta la imagen (texto de content/*.json). */
  pending?: string;
  variant?: PlaceholderVariant;
  /** Clases del contenedor (tamaño, proporción, forma). */
  className?: string;
  /** Clases del <img> (object-fit, etc.). */
  imgClassName?: string;
  /** Precarga (solo para la imagen principal del Hero). */
  preload?: boolean;
  sizes?: string;
  /** false: marcador sin fondo (silueta sobre lo que haya detrás, p. ej. el título del Hero). */
  surface?: boolean;
};

/** Silueta de persona para los avatares que faltan. */
function Silhouette() {
  return (
    <svg aria-hidden="true" focusable="false" viewBox="0 0 100 125" className="h-3/4 w-auto text-fg-muted" fill="currentColor">
      <circle cx="50" cy="40" r="20" opacity="0.55" />
      <path d="M10 125c0-27 18-46 40-46s40 19 40 46z" opacity="0.4" />
    </svg>
  );
}

/** Formas decorativas hechas con CSS (sustituyen a imágenes externas en producción). */
function DecorShape({ variant }: { variant: Exclude<PlaceholderVariant, "avatar" | "photo"> }) {
  switch (variant) {
    case "circle":
      return <span className="block size-full rounded-full bg-red" />;
    case "ring":
      return <span className="block size-full rounded-full border-[0.75rem] border-primary" />;
    case "block":
      return <span className="panel-skew block size-full bg-fg" />;
    case "bars":
      return <span className="stripes block h-full w-full" />;
  }
}

/**
 * Imagen con marcador de posición:
 * 1. imagen local → next/image con width/height reales (sin saltos de diseño);
 * 2. en desarrollo, URL de prueba → <img> sin optimizar (no se configura
 *    remotePatterns para que ningún dominio externo entre al build);
 * 3. si no, marcador CSS con los tokens del tema (rayas, silueta o forma).
 */
export function PlaceholderImage({
  image,
  devSrc,
  alt,
  pending,
  variant = "photo",
  className = "",
  imgClassName = "block h-auto w-full",
  preload = false,
  sizes,
  surface = true,
}: PlaceholderImageProps) {
  const decorative = alt === "";

  if (image) {
    return (
      <div className={className}>
        <Image
          src={image.src}
          alt={alt}
          width={image.width}
          height={image.height}
          preload={preload}
          sizes={sizes}
          className={imgClassName}
        />
      </div>
    );
  }

  if (devSrc) {
    return (
      <div className={className}>
        {/* TEMPORAL: solo en desarrollo. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={devSrc} alt={alt} loading="lazy" decoding="async" referrerPolicy="no-referrer" className={imgClassName} />
      </div>
    );
  }

  if (variant !== "avatar" && variant !== "photo") {
    return (
      <div aria-hidden="true" className={className}>
        <DecorShape variant={variant} />
      </div>
    );
  }

  return (
    <div
      role={decorative ? undefined : "img"}
      aria-label={decorative ? undefined : alt}
      aria-hidden={decorative ? true : undefined}
      className={`${surface ? "placeholder-surface" : ""} relative flex items-end justify-center overflow-hidden ${className}`}
    >
      {variant === "avatar" && <Silhouette />}
      {pending && (
        <span aria-hidden="true" className="meta absolute top-3 left-3 max-w-[calc(100%-1.5rem)] rounded-sm bg-surface px-2 py-1 text-fg-muted">
          {pending}
        </span>
      )}
    </div>
  );
}

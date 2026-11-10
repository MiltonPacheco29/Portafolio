import { PlaceholderImage } from "@/components/ui/PlaceholderImage";
import type { LocalImage } from "@/lib/server/images";

type AvatarImageProps = {
  image: LocalImage | null;
  alt: string;
  pending: string;
  className?: string;
  bare?: boolean;
  preload?: boolean;
  sizes?: string;
};

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

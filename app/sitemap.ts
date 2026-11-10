import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/config/site";

// Se genera una vez en el build como out/sitemap.xml (exportación estática).
export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: absoluteUrl("/"),
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}

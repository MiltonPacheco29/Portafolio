import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/site";

// Se genera una vez en el build como out/robots.txt (exportación estática).
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}

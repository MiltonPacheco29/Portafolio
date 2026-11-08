import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Sitio 100% estático para Cloudflare Pages: `next build` genera `out/`.
  output: "export",
  // La optimización de imágenes por defecto necesita servidor.
  images: { unoptimized: true },
  // Genera `/es/index.html` en lugar de `/es.html`.
  trailingSlash: true,
  experimental: {
    // Habilita app/global-not-found.tsx: con el root layout en app/[lang]
    // no hay un layout único para la 404 (así tendrá lang, estilos y tema).
    globalNotFound: true,
  },
  turbopack: {
    // Fija la raíz del proyecto (hay un package-lock.json suelto en la carpeta del usuario).
    root: process.cwd(),
    rules: {
      // Tailwind CSS v4 vía su loader oficial para Turbopack.
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;

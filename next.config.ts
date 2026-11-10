import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Sitio 100% estático para Cloudflare Pages: `next build` genera `out/`.
  output: "export",
  // La optimización de imágenes por defecto necesita servidor.
  images: { unoptimized: true },
  // Rutas con barra final (`/ruta/index.html` en lugar de `/ruta.html`).
  trailingSlash: true,
  experimental: {
    // Habilita app/global-not-found.tsx: la 404 no pasa por el layout raíz
    // (sin barra ni preloader) y trae sus propios lang, estilos y tema.
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

# Portafolio

Portafolio personal estático con tema cyberpunk (oscuro) y de papel impreso (claro), en español e inglés (`/es` y `/en`).

- **Stack:** Next.js 16 (App Router, `output: "export"`), React 19, TypeScript, Tailwind CSS v4, Motion y GSAP.
- **Sin backend propio:** el formulario de contacto usa Formspree con Cloudflare Turnstile.
- **Publicación prevista:** Cloudflare Pages. Por ahora solo se usa en local.

## Requisitos

Node.js 22 (la misma versión que usa la CI) y npm.

```bash
npm install
```

## Comandos

| Comando | Qué hace |
|---|---|
| `npm run dev` | Servidor de desarrollo en http://localhost:3000 |
| `npm run lint` | ESLint |
| `npm run build` | Genera el sitio estático en `out/` y después ejecuta el `postbuild` |
| `npm run check:placeholders` | Falla si `out/` contiene URLs de imágenes de prueba |

El `postbuild` ejecuta tres scripts de `scripts/`:

1. `fix-segment-filenames.mjs`: corrige los nombres de los archivos de *prefetch* cuando se construye en Windows (en Linux no hace nada).
2. `csp-hashes.mjs`: escribe en `out/_headers` los hashes de los `<script>` en línea para la CSP.
3. `check-placeholders.mjs`: la comprobación de URLs de prueba.

Para ver el build como quedará publicado, sirve la carpeta `out/` con cualquier servidor estático.

## Variables de entorno

Van en `.env.local`, que no se versiona. Todas son públicas (`NEXT_PUBLIC_`) porque Next las incrusta en el JavaScript, así que **nunca deben contener secretos**.

| Variable | Para qué |
|---|---|
| `NEXT_PUBLIC_FORMSPREE_ID` | ID del formulario de Formspree |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Clave pública de Turnstile (la secreta va en el panel de Formspree) |
| `NEXT_PUBLIC_SITE_URL` | URL definitiva del sitio, para metadata, sitemap y robots. Sin ella se usa `CF_PAGES_URL` o `http://localhost:3000` |

El formulario solo se activa si están definidas las dos primeras.

## Estructura

```
app/                  Rutas, layouts y metadata ([lang] = /es y /en)
components/
  sections/           Una sección de la página por archivo (experience/, projects/, contact/)
  layout/             Navbar, selector de idioma y de tema
  providers/          Configuración global sin UI (Motion, script del tema)
  ui/                 Piezas reutilizables (botones, imágenes, decorativos)
  motion/             Envoltorios de animación (FadeIn, AnimatedText, Magnet)
  preloader/          Vista, motor y bloqueo de scroll del preloader
lib/
  server/             Solo build (lee public/ con node:fs)
  config/             URL del sitio, variables públicas y fuentes
  i18n/               Diccionarios y lógica de idiomas
  hooks/              Hooks de cliente
  preloader/          Escenas y tiempos (config.ts) y cálculo de la timeline
content/              Textos en es.json y en.json
public/               Estáticos (WebP, cabeceras y redirecciones de Cloudflare)
scripts/              Comprobaciones del build
```

Las reglas del proyecto están en `CLAUDE.md` y la dirección de arte y los tokens, en `DESIGN.md`.

## Editar contenido

- **Textos:** `content/es.json` y `content/en.json` deben tener las mismas claves; si no, el build falla. Los valores con `[POR COMPLETAR]` se muestran como pendientes.
- **Imágenes:** en WebP dentro de `public/`. Sus dimensiones se leen en el build.
- **Preloader:** las escenas, el montaje, el cierre y la apertura están en `lib/preloader/config.ts`. Abre la página con `?debug` para ver en consola la timeline y los tiempos reales. Con `prefers-reduced-motion` no se muestra.

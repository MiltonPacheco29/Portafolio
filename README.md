# Portafolio

Portafolio personal estático con tema cyberpunk (oscuro) y de papel impreso (claro), en español.

- **Stack:** Next.js 16 (App Router, `output: "export"`), React 19, TypeScript, Tailwind CSS v4 y Motion.
- **Sin backend propio:** el formulario de contacto usa Formspree con Cloudflare Turnstile.
- **Publicación:** Cloudflare Pages, con un pipeline de release dev → qa → pdn (ver [CI/CD](#cicd)).

## Requisitos

Node.js 22 (la misma versión que usan los workflows de GitHub Actions) y npm.

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

## CI/CD

```
PR → main ──► Build (lint, build, auditoría) ──► merge
                                                   │
main ──► Release: build ×3 ──► dev ──► [aprobación] ──► qa ──► [aprobación] ──► pdn
```

| Workflow | Cuándo | Qué hace |
|---|---|---|
| `.github/workflows/build.yml` | Cada PR hacia `main` | Lint, build, URLs de prueba y `npm audit`. Su job `build` es obligatorio para fusionar |
| `.github/workflows/release.yml` | Cada push a `main` (o a mano) | Construye un artefacto por entorno y lo despliega por stages |
| `.github/workflows/deploy-pages.yml` | Lo llama `release.yml` | Plantilla de un stage: descarga el artefacto, despliega con Wrangler y hace una prueba de humo |

**Artefactos.** Lo que se publica es la carpeta `out/` (HTML, CSS, JS, imágenes, `_headers` y `_redirects`). Como las variables `NEXT_PUBLIC_*` se incrustan al compilar, el stage de build genera `sitio-dev`, `sitio-qa` y `sitio-pdn` desde el mismo commit. Los stages de despliegue no compilan: solo suben su artefacto. Los artefactos se guardan 30 días.

**Entornos en Cloudflare Pages** (un solo proyecto Direct Upload):

| Stage | Rama de Pages | URL | Aprobación |
|---|---|---|---|
| dev | `dev` (preview) | `https://dev.<proyecto>.pages.dev` | No |
| qa | `qa` (preview) | `https://qa.<proyecto>.pages.dev` | Sí |
| pdn | `main` (producción) | `https://<proyecto>.pages.dev` o el dominio propio | Sí |

Los previews llevan `X-Robots-Tag: noindex` automáticamente, así que dev y qa no se indexan.

### Configuración fuera del repo

Solo los workflows y `.github/rulesets/main.json` viven en el repo. Lo demás se configura una vez:

1. **Cloudflare:** Workers & Pages → Create → Pages → **Upload assets** (Direct Upload; un proyecto conectado a Git no puede pasar a Direct Upload). Rama de producción: `main`. Después, en My Profile → API Tokens, crea un token con el permiso *Account → Cloudflare Pages → Edit* y copia el Account ID.
2. **GitHub → Settings → Environments:** crea `dev` (sin reglas), `qa` (*Required reviewers*: tú) y `pdn` (*Required reviewers*: tú y *Deployment branches*: solo `main`). En cada uno añade los secretos `CLOUDFLARE_API_TOKEN` y `CLOUDFLARE_ACCOUNT_ID`.
3. **GitHub → Settings → Secrets and variables → Actions → Variables** (de repositorio):
   - `CF_PAGES_PROJECT`: nombre del proyecto de Pages. Mientras no exista, el release se salta.
   - `DEV_SITE_URL`, `QA_SITE_URL`, `PDN_SITE_URL`: URL de cada entorno (obligatorias).
   - Opcionales por entorno: `DEV_FORMSPREE_ID`, `DEV_TURNSTILE_SITE_KEY` (y con prefijo `QA_` y `PDN_`). Sin ellas, el formulario de ese entorno se desactiva.
4. **Ruleset de `main`:** Settings → Rules → Rulesets → New ruleset → **Import a ruleset** → `.github/rulesets/main.json`. Exige PR, que el check `build` pase con la rama al día y bloquea force push y borrado.

### Rollback

En Cloudflare: Workers & Pages → proyecto → Deployments → despliegue anterior → **Rollback**. También puedes volver a ejecutar el job `deploy-pdn` de un run anterior de Release mientras su artefacto exista.

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
app/                  Layout, página, 404, sitemap y robots
components/
  sections/           Una sección de la página por archivo (experience/, projects/, contact/)
  layout/             Navbar y selector de tema
  providers/          Configuración global sin UI (Motion, script del tema)
  ui/                 Piezas reutilizables (botones, imágenes, decorativos)
  motion/             Envoltorios de animación (FadeIn, AnimatedText, Magnet)
  preloader/          Vista, motor y bloqueo de scroll del preloader
lib/
  server/             Solo build (lee public/ con node:fs)
  config/             URL del sitio, variables públicas y fuentes
  i18n/               Textos, idioma del sitio y lista de secciones
  hooks/              Hooks de cliente
  preloader/          Escenas y tiempos (config.ts) y cálculo de la timeline
content/              Textos en es.json
public/               Estáticos (WebP, cabeceras y redirecciones de Cloudflare)
scripts/              Comprobaciones del build
```

Las reglas del proyecto están en `CLAUDE.md` y la dirección de arte y los tokens, en `DESIGN.md`.

## Editar contenido

- **Textos:** todos en `content/es.json`. Los valores con `[POR COMPLETAR]` se muestran como pendientes.
- **Imágenes:** en WebP dentro de `public/`. Sus dimensiones se leen en el build.
- **Preloader:** las escenas, el montaje, el cierre y la apertura están en `lib/preloader/config.ts`. Abre la página con `?debug` para ver en consola la timeline y los tiempos reales. Con `prefers-reduced-motion` no se muestra.

# Portafolio web personal

## Proyecto

Portafolio estático con tema cyberpunk, solo en español (página única en "/"; /es y /en redirigen a "/").

## Stack

Next.js (App Router, `output: "export"`), TypeScript, Tailwind CSS y Motion (`motion/react`). Sin backend propio. Se publica en Cloudflare Pages.

## Comandos

- `npm run dev`: servidor local en http://localhost:3000
- `npm run lint`: revisión de código
- `npm run build`: genera el sitio estático en `out/`

## Estructura

- `app/`: solo rutas, layouts y metadata (`layout.tsx` y `page.tsx` en la raíz; `global-not-found.tsx` para la 404).
- `components/sections/`: una sección de la página por archivo. Las que tienen varias piezas van en subcarpeta (`experience/`, `projects/`, `contact/`). `sectionStyles.ts` guarda las clases compartidas.
- `components/layout/`: chrome fijo del sitio (navbar, tema).
- `components/providers/`: configuración global sin UI propia (`MotionProvider`, `ThemeScript`).
- `components/ui/`: piezas reutilizables sin lógica de página (botones, imágenes, decorativos).
- `components/motion/`: envoltorios de animación reutilizables (`FadeIn`, `AnimatedText`, `Magnet`).
- `components/preloader/`: vista (`Preloader.tsx`), motor DOM (`engine.ts`) y bloqueo de scroll (`scrollLock.ts`).
- `lib/server/`: solo build (`node:fs`). Un componente cliente solo puede hacer `import type` de aquí.
- `lib/config/`: configuración del sitio (URL, variables `NEXT_PUBLIC_`, fuentes).
- `lib/i18n/`: textos (`@/lib/i18n`) e idioma y secciones aptos para cliente (`@/lib/i18n/locales`).
- `lib/hooks/`: hooks de cliente.
- `lib/preloader/`: `config.ts` (escenas y tiempos editables) y `timeline.ts` (cálculo).
- `lib/animations.ts`, `lib/theme.ts`, `lib/text.ts`: utilidades compartidas entre servidor y cliente.
- `content/`: textos (`es.json`). `public/`: estáticos. `scripts/`: comprobaciones del build.

## Reglas

- Los textos viven en `content/es.json`, nunca dentro de los componentes.
- Todo componente animado respeta `prefers-reduced-motion`.
- Nada parpadea rápido; el texto cumple contraste mínimo de 4.5:1.
- Navegación completa con teclado y etiquetas accesibles.
- No uses server actions, rutas de API ni middleware (es un sitio estático).
- Imágenes en WebP dentro de `public/`, siempre con `alt` descriptivo.
- Nunca incluyas nombres de clientes, sistemas internos ni datos confidenciales en el contenido.
- Nunca leas ni escribas archivos `.env` y no pongas secretos en el código.
- Haz cambios pequeños y al final lista los archivos que tocaste.

## Diseño

Tema oscuro y claro con variables CSS; la dirección de arte y los tokens completos están en `DESIGN.md`. Oscuro: fondo #0A0B14, cian #00F0FF, magenta #FF2BD6, amarillo #F5E83A. Claro (papel): fondo #EFE6D3, tinta #1A1612 y rojo #A8231B para texto (el rojo vivo #C8352B solo como fondo con texto blanco). Títulos en Archivo (800–900), subtítulos en Newsreader cursiva y detalles en JetBrains Mono; máximo tres familias.

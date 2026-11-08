# Portafolio web personal

## Proyecto

Portafolio estático con tema cyberpunk, en español e inglés (rutas /es y /en).

## Stack

Next.js (App Router, `output: "export"`), TypeScript, Tailwind CSS, Motion (`motion/react`) y GSAP (`gsap`, `@gsap/react`). Sin backend propio. Se publica en Cloudflare Pages.

## Comandos

- `npm run dev`: servidor local en http://localhost:3000
- `npm run lint`: revisión de código
- `npm run build`: genera el sitio estático en `out/`

## Reglas

- Los textos viven en `content/es.json` y `content/en.json`, nunca dentro de los componentes.
- Todo componente animado respeta `prefers-reduced-motion`.
- Nada parpadea rápido; el texto cumple contraste mínimo de 4.5:1.
- Navegación completa con teclado y etiquetas accesibles.
- No uses server actions, rutas de API ni middleware (es un sitio estático).
- Imágenes en WebP dentro de `public/`, siempre con `alt` descriptivo.
- Nunca incluyas nombres de clientes, sistemas internos ni datos confidenciales en el contenido.
- Nunca leas ni escribas archivos `.env` y no pongas secretos en el código.
- Haz cambios pequeños y al final lista los archivos que tocaste.

## Diseño

Tema oscuro y claro con variables CSS. Oscuro: fondo #0A0B14, cian #00F0FF, magenta #FF2BD6, amarillo #F5E83A. Títulos en Chakra Petch y detalles en JetBrains Mono.

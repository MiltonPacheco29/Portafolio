# Dirección de arte del portafolio

Referencia de diseño del rediseño (rama `feat/rediseno`). Las reglas de `CLAUDE.md` prevalecen sobre todo lo que aparece aquí.

## 1. Concepto

**Un cartel en dos impresiones.** La página se compone como un póster editorial: titulares gigantes en una sans muy pesada, subtítulos en serif cursiva, metadatos diminutos en monoespaciada, cortes en diagonal y franjas de rayas. Los dos temas comparten la composición y cambian la tinta:

- **Oscuro, "de noche":** el cyberpunk actual (#0A0B14, cian, magenta, amarillo). Los títulos grandes llevan un degradado frío.
- **Claro, "impreso":** papel crema con grano, tinta casi negra y rojo de imprenta.

Referencias usadas **solo como gramática visual y como datos**: `docs/referencias/poster-referencia.jpg` (escala tipográfica, figura que tapa el titular, rayas, código de barras, metadatos) y `docs/referencias/prompt-referencia-jack.md` (orden de secciones y mecánicas de movimiento). No se copian textos, marcas, imágenes ni el retrato; la carpeta `docs/` no se versiona ni se publica.

### Dónde va la audacia

1. **Hero:** el nombre a todo el ancho y el avatar delante de las letras.
2. **Proyectos:** las tarjetas que se apilan al hacer scroll.

El resto (Sobre mí, Qué hago, Experiencia, Contacto) se apoya en la misma escala tipográfica y en el ritmo de secciones, sin decoración añadida.

## 2. Estructura de la página

Objetivo único (de `landing-page-design`): **que me contacten**. El botón de contacto repite el mismo texto en todas partes: "Hablemos de tu proyecto".

| Orden | Bloque | Ancla | Notas |
|---|---|---|---|
| 1 | Hero | `inicio` | `h1` "HOLA, SOY MILTON", subtítulo "Stable systems. Secure code." (`lang="en"`), metadatos, frase corta y botón de contacto |
| 2 | Franja de skills | sin ancla | Decorativa en movimiento, con una lista accesible única |
| 3 | Sobre mí | `sobre-mi` | Revelado por carácter, avatar y botón de contacto |
| 4 | Qué hago | `que-hago` | Fondo invertido, 5 servicios numerados |
| 5 | Experiencia | `experiencia` | Línea de tiempo actual más formación |
| 6 | Proyectos | `proyectos` | Tarjetas apiladas con filtros |
| 7 | Contacto | `contacto` | Formulario, enlaces, CV en código de barras |

Se elimina la sección Skills (la sustituye la franja). Los datos de "Sobre mí" (ubicación, experiencia) pasan a los metadatos del Hero y la formación pasa a Experiencia.

## 3. Tokens de color

Contrastes calculados con la fórmula WCAG 2.x. Texto ≥ 4.5:1; controles y foco ≥ 3:1.

### 3.1 Tema oscuro (colores actuales)

| Token | Valor | Contraste sobre `--bg` |
|---|---|---|
| `--bg` | #0A0B14 | |
| `--surface` | #12142A | |
| `--fg` | #E8EAFF | 16.48:1 (15.22:1 sobre surface) |
| `--fg-muted` | #A3A9CC | 8.50:1 (7.85:1 sobre surface) |
| `--primary` | #00F0FF | 13.92:1 |
| `--accent` | #FF2BD6 | 6.13:1 (5.67:1 sobre surface) |
| `--highlight` | #F5E83A | 15.40:1 |
| `--on-primary`, `--on-accent` | #0A0B14 | 13.92:1 y 6.13:1 |
| `--border` / `--border-strong` | #23264A / #5A6094 | decorativo / 3.30:1 |
| `--focus` | #F5E83A | 15.40:1 |
| `--title-from` → `--title-to` | #E8EAFF → #7FE9FF | degradado vertical frío, el tono más oscuro da 14.01:1 |
| `--stripe` | #FF2BD6 | decorativo |
| `--grain-opacity` | 0 | sin grano |

**Superficie invertida** (Qué hago), lavanda: `--bg` #EEF0FF, `--fg` #0B1033 (16.32:1), `--fg-muted` #3B4275 (8.34:1), `--accent` #A3007E (6.49:1), `--primary` #006577 (5.93:1), `--border-strong` #7A80AD (3.36:1).

### 3.2 Tema claro (papel)

| Token | Valor | Contraste |
|---|---|---|
| `--bg` | #EFE6D3 | |
| `--surface` | #F7F1E5 | |
| `--fg` | #1A1612 | 14.50:1 (15.99:1 sobre surface) |
| `--fg-muted` | #524A40 | 7.02:1 (7.74:1 sobre surface) |
| `--primary`, `--accent` | #A8231B | 5.80:1 (6.39:1 sobre surface): rojo profundo, único rojo permitido como texto |
| `--red` | #C8352B | 4.23:1: **nunca como texto**; solo fondo con texto blanco, rayas y formas |
| `--on-red`, `--on-primary`, `--on-accent` | #FFFFFF | 5.25:1 sobre `--red`, 7.19:1 sobre `--primary` |
| `--highlight` | #6B5B00 | 5.42:1 |
| `--border` / `--border-strong` | #D8CCB3 / #7A7062 | decorativo / 3.92:1 |
| `--focus` | #A8231B | 5.80:1 |
| `--title-from` → `--title-to` | #1A1612 → #1A1612 | tinta plana (sin degradado) |
| `--stripe` | #1A1612 | decorativo |
| `--grain-opacity` | 0.07 | grano estático |

**Superficie invertida** (Qué hago), tinta: `--bg` #1A1612, `--fg` #EFE6D3 (14.50:1), `--fg-muted` #B9AE9B (8.22:1), `--accent` y `--primary` #FF7A6B (7.07:1), `--border-strong` #A89D8A (6.73:1).

Reglas del rojo: el rojo vivo `--red` solo aparece como bloque con texto blanco (botón principal en tema claro) o como forma; los titulares rojos usan `--primary` #A8231B. La tinta sobre `--red` (3.43:1) está prohibida.

### 3.3 Grano y marcadores

- **Grano:** `body::before` fijo por encima del contenido (`z-index` 60, sin eventos de puntero) para que también cubra las secciones con fondo propio; ruido SVG `feTurbulence` en un *data URI* del CSS, opacidad `--grain-opacity`, sin `mix-blend-mode` y sin animación.
- **Marcador de imagen** (producción, cuando falta la imagen): degradado plano entre `--surface` y una mezcla con `--primary`, más rayas diagonales de `--stripe` al 14 %. El texto de aviso va en una etiqueta de fondo sólido `--surface` para mantener 4.5:1.
- **Silueta de avatar:** SVG en línea con `currentColor` (`--fg-muted`) sobre el marcador.

## 4. Tipografía

Máximo tres familias, todas con `next/font/google` (se sirven desde el propio dominio).

| Rol | Familia | Configuración |
|---|---|---|
| Títulos gigantes y títulos | **Archivo** | variable, peso 800–900, eje `wdth` (ancho 75–100 %), mayúsculas |
| Subtítulos | **Newsreader** | variable, solo `italic`, peso 400–500 |
| Metadatos, etiquetas, filtros, botones | **JetBrains Mono** | 400–600 |
| Texto corrido | pila del sistema | sin descarga |

**Excepción: Anton.** Solo para las palabras del preloader (peso 400, `--font-anton`). Esa variable se aplica en la capa del preloader y no en `<html>`, así que la landing sigue usando únicamente las tres familias de arriba.

### Escala

| Token | Valor | Uso |
|---|---|---|
| `--fs-hero` | `clamp(3.5rem, 17vw, 17rem)` | Nombre del Hero en dos líneas ("HOLA, SOY" / "MILTON"), `font-stretch` 75 %, interlineado 0.86 |
| `--fs-display` | `clamp(3rem, 12vw, 10rem)` | Títulos de sección |
| `--fs-number` | `clamp(3rem, 10vw, 8.75rem)` | Números de Qué hago y de proyectos |
| `--fs-band` | `clamp(2.25rem, 6vw, 5.5rem)` | Franja de skills |
| `--fs-subtitle` | `clamp(1.5rem, 1rem + 2.4vw, 3rem)` | Subtítulo en serif cursiva |
| `--fs-lead` | `clamp(1.125rem, 1rem + 0.8vw, 1.5rem)` | Párrafo de Sobre mí |
| `--fs-meta` | 0.75rem (12 px, mínimo) | Metadatos y etiquetas verticales, mayúsculas por CSS, `--tracking-meta` 0.14em |
| `--fs-xs` … `--fs-4xl` | escala actual | Texto de interfaz |

Interlineados: `--lh-display` 0.88, `--lh-tight` 1.15, `--lh-snug` 1.35, `--lh-normal` 1.6. Las mayúsculas se aplican con `text-transform` (en el JSON el texto va en tipo oración salvo el nombre del Hero).

## 5. Espaciado, bordes y radios

- **Espaciado:** escala actual `--space-3xs` (0.25rem) a `--space-3xl` (6rem), `--gutter` `clamp(1rem, 4vw, 2.5rem)`, `--section-gap` `clamp(6rem, 12vw, 10rem)`, `--content-max` 72rem.
- **Bordes:** 1px `--border` decorativo; 1px `--border-strong` en controles; 2px en botones fantasma.

| Radio | Valor | Uso |
|---|---|---|
| `--corner-none` | 0 | Paneles inclinados con `clip-path`, franjas |
| `--corner-sm` | 2px | Chips del stack, campos del formulario |
| `--corner-md` | 6px | Avisos y formulario |
| `--corner-card` | `clamp(1.5rem, 3vw, 2.5rem)` | Tarjetas de proyecto |
| `--corner-section` | `clamp(2.5rem, 5vw, 3.75rem)` | Esquinas superiores de las secciones superpuestas |
| `--corner-pill` | 9999px | Botones (contacto, fantasma, filtros) y cápsula de la navbar |

Paneles inclinados: `clip-path: polygon(var(--skew) 0, 100% 0, calc(100% - var(--skew)) 100%, 0 100%)` con `--skew` `clamp(0.75rem, 2.5vw, 2rem)`, siempre en la capa de la imagen, nunca en el elemento que contiene enlaces.

## 6. Movimiento

| Token | Valor |
|---|---|
| `--ease-fade` | `cubic-bezier(0.22, 1, 0.36, 1)` (la misma curva que `--ease-out`: frena al llegar) |
| `--dur-fade` | 0.7s |
| `--ease-out` | `cubic-bezier(0.22, 1, 0.36, 1)` |
| `--dur-fast` | 200ms (color en hover y foco; nunca menos) |

| Pieza | Comportamiento | Movimiento reducido |
|---|---|---|
| Entrada del Hero | CSS: navbar 0s (y −20), título 0.15s (y 40), frase 0.35s (y 20), botón 0.5s (y 20), avatar 0.6s (y 30) | Sin animación |
| `FadeIn` | `motion/react`, al entrar en pantalla, una vez, margen 50px, 0.7s, `--ease-fade`. Lo que ya está visible al cargar no se oculta | Sin animación |
| `Magnet` | Avatar del Hero: padding 150, fuerza 3, entrada 0.3s ease-out, salida 0.6s ease-in-out | Apagado (también en táctil: `hover: none` o `pointer: coarse`) |
| Franja de skills | `translateX` = ±(scrollY − topSección + altoVentana) × 0.3 − 200; listener pasivo, agrupado por `requestAnimationFrame`, `will-change: transform` | Estática |
| `AnimatedText` | Opacidad por carácter de **0.65** a 1 (offset "start 0.8" → "end 0.2"); una sola variable CSS de progreso | Opacidad 1 |
| Proyectos | `sticky` y escala hacia `1 − (total − 1 − i) × 0.03`, `top` + i × 28px, contenedor 85vh por tarjeta, solo desde `md` | Lista normal, sin `sticky` ni escala |
| Experiencia | Línea de progreso y aparición actuales (GSAP) | Sin animación |

Prohibido: parpadeos, destellos, *glitch*, grano o rayas animados, autoplay sin control y cualquier cambio de luminancia más de 3 veces por segundo. Solo se animan `transform` y `opacity`. Sin JS todo se ve.

**Excepción consciente: el preloader** (`components/preloader/`, escenas y tiempos en `lib/preloader/config.ts`). Al cargar la página hace cortes secos a pantalla completa: palabras sobre negro y fotos en blanco y negro. El color de las palabras depende del tema mediante los tokens `--preloader-ink-from` y `--preloader-ink-to`. En oscuro es el mismo degradado #E8EAFF → #7FE9FF del título del Hero; en claro, rojo plano #E33529. La intro y dos pasadas de montaje, cada una más rápida, suman entre 4 y 14 cortes por segundo durante unos 3,9 s. Desde el final de la intro la franja se cierra hacia el centro con `clip-path` mientras sigue el montaje, y después dos cortinas negras se abren en 650 ms. **Incumple WCAG 2.3.1** (umbral de destellos y de destello rojo) y su propietario lo ha aceptado de forma explícita. Mitigaciones:
- con `prefers-reduced-motion: reduce` no se muestra nada: la capa tiene `display: none` desde el HTML y se quita del DOM;
- solo se reproduce en una carga completa o una recarga, nunca al navegar dentro del sitio;
- sin JS no se muestra.

Cualquier otro componente sigue la prohibición de arriba.

El 0.65 inicial del revelado garantiza 4.5:1 en ambos temas en todo momento (a 0.6: 6.29:1 en oscuro y 4.38:1 en claro; a 0.65 ambos cumplen).

## 7. Componentes

| Componente | Tipo | Notas |
|---|---|---|
| `FadeIn` | cliente | props `delay`, `x`, `y`, `duration`, `as` |
| `Magnet` | cliente | transform por `ref`, sin re-renderizar |
| `AnimatedText` | cliente | `sr-only` con el texto completo; caracteres en `aria-hidden`, agrupados por palabra |
| `ContactButton` | servidor | enlace al ancla de contacto, píldora: cian con tinta en oscuro, `--red` con blanco en claro |
| `GhostButton` | servidor | píldora de borde 2px; sin destino se muestra desactivado (no es enlace) |
| `PlaceholderImage` | servidor | imagen local → `next/image`; en desarrollo, URL de prueba → `<img>`; si no, marcador CSS (rayas, silueta o forma decorativa) |
| `Preloader` | cliente | capa negra en el HTML estático; cortes con un bucle rAF sobre una timeline calculada; cierre solapado con el montaje (`clip-path` en el stage) y apertura con cortinas, ambos con WAAPI anclada a sus labels; bloquea el scroll compensando la barra en `body` y en `[data-scroll-lock-compensate]`; `?debug` imprime la timeline y los tiempos reales |
| `StripeDivider` | servidor | rayas diagonales de 12px, periodo 24px, `aria-hidden` |
| `VerticalLabel` | servidor | `writing-mode: vertical-rl`, `aria-hidden`, solo desde `lg` |
| `CvBarcodeLink` | servidor | barras SVG `aria-hidden` sin datos reales, texto visible "Descargar CV · PDF · ES" y nombre accesible con formato, idioma y tamaño |

## 8. Imágenes

### Avatares de `public/avatar/`

| Archivo | Dónde | Estado |
|---|---|---|
| `avatar-hola.webp` | Hero (fondo transparente) | **Falta uno propio**: el archivo local actual viene de la referencia, está en `.gitignore` y no debe publicarse |
| `avatar-brazos-cruzados.webp` | Sobre mí | **Falta**: silueta SVG |
| `avatar-laptop.webp` | Experiencia | Existe |
| `avatar-laptop-cerrada.webp` | Contacto | **Falta**: silueta SVG |
| `avatar-pulgar.webp` | Mensaje enviado | **Falta**: silueta SVG |

Los avatares `avatar-senalando.webp` y `avatar-codigo.webp` ya no se usan (se eliminaron sus secciones).

### Otros pendientes

- `public/cv/cv-es.pdf` y `public/cv/cv-en.pdf` (el botón queda desactivado hasta que existan).
- Imagen para `og:image` (redes sociales): falta diseñarla.

### Imágenes de prueba TEMPORALES (pendientes de reemplazar por las mías)

`content/dev-placeholders.ts` guarda 9 URLs de higgs.ai (3 por proyecto) y 4 de figma.site (decorativos de Sobre mí). Solo se leen con `NODE_ENV === "development"` desde componentes de servidor; en producción se muestra el marcador CSS. El build y la CI fallan si `out/` contiene `higgs.ai`, `figma.site` o `cloudfront`.

| Uso | Archivo definitivo previsto |
|---|---|
| Proyecto 1, imágenes 1–3 | `public/projects/portafolio-1.webp` … `-3.webp` |
| Proyecto 2, imágenes 1–3 | `public/projects/api-rest-1.webp` … `-3.webp` |
| Proyecto 3, imágenes 1–3 | `public/projects/proyecto-3-1.webp` … `-3.webp` |
| Sobre mí, 4 decorativos | Se quedan como formas CSS, o `public/decor/*.webp` si se quieren imágenes |

Capturas: solo trabajos personales o públicos, sin datos de clientes, exportadas a WebP sin metadatos (EXIF, XMP, GPS).

## 9. Accesibilidad y confidencialidad

- Decorativo con `aria-hidden`: franjas, etiquetas verticales, copias de la franja de skills, decorativos de esquina, barras del CV, grano.
- El degradado del texto tiene alternativa sólida en `forced-colors: active`.
- Las tarjetas apiladas desplazan su contenedor a la vista al recibir foco (no quedan tapadas).
- Navegación con teclado completa; foco visible en ambos temas.
- Ciudad y país como máximo; sin coordenadas, dirección ni datos de clientes o sistemas internos.

## 10. Seguridad y CI

- `public/_headers`: CSP sin `'unsafe-inline'` en `script-src` (hashes SHA-256 calculados en `postbuild` por `scripts/csp-hashes.mjs`), Turnstile en `script-src` y `frame-src`, Formspree en `connect-src` y `form-action`, `img-src 'self' data:`, `frame-ancestors 'none'` y cabeceras `nosniff`, `Referrer-Policy`, `Permissions-Policy`, COOP y HSTS. `style-src` necesita `'unsafe-inline'` por los atributos `style` que escriben React y Motion.
- `.github/workflows/ci.yml`: lint, build (con CSP y chequeo de URLs de prueba), `npm run check:placeholders` y `npm audit --audit-level=high`.

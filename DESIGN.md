# Dirección de arte del portafolio

Documento de referencia para el rediseño. Las reglas de `CLAUDE.md` prevalecen sobre todo lo que aparece aquí.

## 1. Concepto

**Un mismo cartel, dos impresiones.** El portafolio se compone como un cartel de colección: tipografía gigante, recortes en diagonal, bloques de color planos y una franja de metadatos pequeños que funcionan como firma. Los dos temas comparten la misma composición y cambian solo la "tinta":

- **Oscuro (actual):** el cartel de noche. Fondo #0A0B14, neón cian, magenta y amarillo. Se conserva tal cual.
- **Claro (nuevo):** el cartel impreso. Papel crema con grano, tinta casi negra y un rojo de imprenta.

La referencia (`docs/referencias/poster-referencia.jpg`) solo aporta la gramática visual: escala tipográfica extrema, figura que tapa parte del titular, subtítulo en serif cursiva, paneles en paralelogramo, rayas diagonales, código de barras y metadatos diminutos. **No se copia** la imagen, la modelo, los textos, la ciudad, los caracteres japoneses ni las coordenadas, y la imagen nunca se copia a `public/`.

### Dónde va la audacia

Un solo elemento memorable por pantalla:

1. **Hero:** la frase gigante con el avatar delante.
2. **Proyectos:** el ritmo de paralelogramos que alternan imagen y color.
3. **Contacto:** el código de barras del CV.

Todo lo demás (Sobre mí, Experiencia, Skills, formulario) queda sobrio: mismas reglas de tipo, sin decoración extra.

## 2. Estructura de la página

Basada en `landing-page-design` (solo estructura, CTA y texto del Hero). Objetivo único de la página: **que la persona escriba** (contacto).

| Orden | Sección | Papel en la página | Cambia |
|---|---|---|---|
| 1 | Hero | Frase, subtítulo, avatar, metadatos y CTA de contacto | Sí |
| 2 | Sobre mí | Quién eres | Solo etiqueta vertical y separador |
| 3 | Experiencia | Trayectoria (prueba) | Solo etiqueta vertical y separador |
| 4 | Proyectos | Prueba principal, con filtros | Sí (tarjetas) |
| 5 | Skills | Herramientas | Solo etiqueta vertical y separador |
| 6 | Contacto | CTA final, idéntica a la del Hero, y CV | Sí (botón CV) |

Reglas tomadas de la skill:

- Un único CTA principal visible en la primera pantalla. "Ver proyectos" deja de ser CTA del Hero (sigue en la barra de navegación).
- El CTA dice el verbo y lo que se obtiene; el de Contacto repite exactamente el mismo texto.
- La franja de metadatos (ciudad, año de inicio, skills) hace de señal de prueba en la primera pantalla.
- Ningún dato inventado: lo que falte queda con `[POR COMPLETAR]`.

Descartado de la skill por contradecir el encargo o `CLAUDE.md`: una sola tipografía, prohibición de cursivas y de pesos 900, degradado en el titular, Geist o Poppins, FAQ, precios, testimonios y la sección obligatoria de *tagline* con revelado palabra por palabra (añadiría un segundo momento de movimiento).

### Texto del Hero (propuesta, a confirmar)

| Pieza | es.json | en.json |
|---|---|---|
| Frase gigante (`hero.line1`, `hero.line2`) | Se mantiene "STABLE SYSTEMS." / "SECURE CODE." con `lang="en"` | Igual |
| Subtítulo serif cursiva (`hero.subtitle`) | "Construyo software que aguanta el tráfico real y protege los datos de quien lo usa." | "I build software that holds up under real traffic and keeps its users' data safe." |
| CTA (`hero.cta`, `contact.cta`) | "Escríbeme sobre tu proyecto" | "Tell me about your project" |

Opción alternativa: traducir la frase en /es ("SISTEMAS ESTABLES." / "CÓDIGO SEGURO.") y quitar el `lang` distinto.

## 3. Tokens

Los nombres existentes de `app/globals.css` se conservan (`--bg`, `--surface`, `--fg`, `--fg-muted`, `--primary`, `--accent`, `--highlight`, `--on-*`, `--border*`, `--focus`) para que los componentes actuales sigan funcionando. Se añaden los marcados como **nuevo**.

### 3.1 Color: tema oscuro (cyberpunk, sin cambios)

| Token | Valor | Uso | Contraste sobre `--bg` |
|---|---|---|---|
| `--bg` | #0A0B14 | Fondo | |
| `--surface` | #12142A | Paneles | |
| `--fg` | #E8EAFF | Texto | 16.48:1 |
| `--fg-muted` | #A3A9CC | Texto secundario | 8.50:1 |
| `--primary` | #00F0FF | Cian: enlaces, bloques | 13.92:1 |
| `--accent` | #FF2BD6 | Magenta: etiquetas, bloques | 6.13:1 |
| `--highlight` | #F5E83A | Amarillo: foco, rayas | 15.40:1 |
| `--on-primary` / `--on-accent` | #0A0B14 | Texto sobre bloques cian y magenta | 13.92:1 y 6.13:1 |
| `--border` | #23264A | Decorativo | |
| `--border-strong` | #5A6094 | Controles | 3.30:1 |
| **nuevo** `--block-a` / `--on-block-a` | `--primary` / #0A0B14 | Bloque de texto de proyecto (impares) | 13.92:1 |
| **nuevo** `--block-b` / `--on-block-b` | `--accent` / #0A0B14 | Bloque de texto de proyecto (pares) | 6.13:1 |
| **nuevo** `--stripe` | `--accent` | Rayas diagonales | decorativo |
| **nuevo** `--grain-opacity` | 0 | Sin grano en oscuro | |

### 3.2 Color: tema claro (papel)

Contrastes calculados con la fórmula WCAG 2.x.

| Token | Valor | Uso | Contraste |
|---|---|---|---|
| `--bg` | #EFE6D3 | Papel crema | |
| `--surface` | #F7F1E5 | Paneles, formulario | |
| `--fg` | #1A1612 | Tinta casi negra | 14.50:1 sobre bg, 15.99:1 sobre surface |
| `--fg-muted` | #524A40 | Texto secundario | 7.02:1 sobre bg, 7.74:1 sobre surface |
| `--primary` | #A8231B | Rojo profundo: **todo texto rojo**, enlaces, foco | 5.80:1 sobre bg, 6.39:1 sobre surface |
| `--accent` | #A8231B | Etiquetas pequeñas (mismo rojo profundo) | 5.80:1 |
| **nuevo** `--red` | #C8352B | Rojo de imprenta: **solo** fondo de bloques con texto blanco, rayas y formas | 4.23:1 sobre bg: **prohibido como texto** |
| **nuevo** `--on-red` | #FFFFFF | Texto sobre `--red` | 5.25:1 |
| `--highlight` | #6B5B00 | Ocre oscuro (uso puntual) | 5.42:1 |
| `--on-primary` / `--on-accent` | #FFFFFF | Texto sobre rojo profundo | 7.19:1 |
| `--border` | #D8CCB3 | Decorativo | |
| `--border-strong` | #7A7062 | Controles | 3.92:1 sobre bg, 4.32:1 sobre surface |
| `--focus` | #A8231B | Anillo de foco | 5.80:1 |
| **nuevo** `--block-a` / `--on-block-a` | #C8352B / #FFFFFF | Bloque rojo con texto blanco | 5.25:1 |
| **nuevo** `--block-b` / `--on-block-b` | #1A1612 / #EFE6D3 | Bloque de tinta con texto crema | 14.50:1 |
| **nuevo** `--stripe` | #1A1612 | Rayas diagonales | decorativo |
| **nuevo** `--grain-opacity` | 0.06 | Intensidad del grano | |
| `--glow-*`, `--neon-far` | transparente / 0% | Sin neón en papel | |

Reglas del rojo:

- `CLAUDE.md` exige 4.5:1 para todo texto, así que el rojo vivo `--red` **nunca** se usa como color de texto, ni siquiera en titulares grandes. Los titulares rojos usan `--primary` (#A8231B, 5.80:1).
- Texto sobre `--red`: siempre blanco (5.25:1). Tinta sobre `--red` da 3.43:1: prohibido.
- El bloque `--red` sobre `--bg` es una forma, no texto: no necesita contraste de texto.

### 3.3 Grano de papel

- Capa `body::before` fija, `pointer-events: none`, ruido SVG (`feTurbulence`) en un *data URI* dentro del CSS, opacidad `--grain-opacity`.
- **Estático:** nunca se anima ni cambia de semilla (un grano animado parpadea).
- Sin `mix-blend-mode` (evita repintados costosos al hacer scroll).
- Con opacidad 0.06 la luminancia del fondo varía menos de un 3 %; los contrastes de la tabla se mantienen por encima de 4.5:1.

### 3.4 Tipografía

| Rol | Familia | Pesos y estilo | Carga |
|---|---|---|---|
| Frase gigante del Hero y títulos | Chakra Petch (actual) | 700, mayúsculas, interletraje negativo | `next/font`, ya cargada |
| Subtítulo del Hero | **Newsreader** (nueva) | 500 cursiva, solo `style: italic` | `next/font/google`, subconjunto latin |
| Metadatos, etiquetas, filtros, código | JetBrains Mono (actual) | 400 y 500 | ya cargada |
| Texto corrido | Pila del sistema (actual) | 400 y 600 | sin descarga |

Decisión pendiente: si se quiere un titular más "cartel" que Chakra Petch 700, la alternativa es una grotesca condensada pesada (p. ej. Archivo 800 o Anton) **solo** para la frase del Hero. Eso contradice "Títulos en Chakra Petch" de `CLAUDE.md` y exigiría actualizarlo antes.

### 3.5 Escala tipográfica

Se conservan `--fs-xs` a `--fs-4xl`. Cambios y nuevos:

| Token | Valor | Uso |
|---|---|---|
| `--fs-hero` | `clamp(3.5rem, 10.5vw, 12rem)` | Frase gigante, dos líneas desde 40rem |
| **nuevo** `--fs-hero-narrow` | `17vw` | Por debajo de 40rem: una palabra por línea (STABLE / SYSTEMS. / SECURE / CODE.) para no desbordar a 390 px |
| **nuevo** `--lh-hero` | 0.86 | Interlineado de la frase gigante |
| **nuevo** `--tracking-hero` | -0.02em | Interletraje de la frase gigante |
| **nuevo** `--fs-subtitle` | `clamp(1.25rem, 1rem + 1.2vw, 2rem)` | Subtítulo serif cursiva, máximo 2 líneas, ancho máximo 34rem |
| **nuevo** `--lh-subtitle` | 1.3 | |
| **nuevo** `--fs-meta` | 0.75rem (12 px) | Metadatos y etiquetas verticales. **Mínimo absoluto: 12 px** |
| **nuevo** `--tracking-meta` | 0.12em | Mayúsculas de metadatos |
| **nuevo** `--tracking-vertical` | 0.2em | Etiquetas verticales |

Las mayúsculas de metadatos y etiquetas se aplican con `text-transform: uppercase`; en el JSON el texto va en minúsculas normales para que los lectores de pantalla no lo deletreen.

### 3.6 Espaciado

Se conserva la escala actual (`--space-3xs` 0.25rem a `--space-3xl` 6rem, `--gutter`, `--section-gap`, `--content-max` 72rem). Nuevos:

| Token | Valor | Uso |
|---|---|---|
| **nuevo** `--skew` | `clamp(0.75rem, 2.5vw, 2rem)` | Desplazamiento horizontal de los paralelogramos |
| **nuevo** `--stripe-height` | 0.75rem (12 px) | Alto de la franja separadora |
| **nuevo** `--stripe-period` | 1.5rem (24 px) | Raya de 12 px + hueco de 12 px |
| **nuevo** `--vertical-rail` | 2rem | Columna reservada para la etiqueta vertical (solo desde `lg`) |

### 3.7 Radios

| Token | Valor | Uso |
|---|---|---|
| **nuevo** `--corner-none` | 0 | Paralelogramos, bloques de color, botón CV, franjas |
| `--corner-sm` | 2px | Botones, filtros, chips |
| `--corner-md` | 6px | Solo el formulario y los avisos |

Los paralelogramos no tienen radio: el corte diagonal es la forma.

### 3.8 Movimiento

| Token | Valor |
|---|---|
| **nuevo** `--ease-out` | `cubic-bezier(0.22, 1, 0.36, 1)` |
| **nuevo** `--dur-fast` | 150ms (cambios de color en hover y foco) |
| **nuevo** `--dur-base` | 300ms (paneles) |
| **nuevo** `--dur-slow` | 600ms (aparición única) |

Reglas:

1. Un único momento orquestado: el scroll del Hero (ya existe, con `scrub`). La frase se reduce y el avatar sube ligeramente a otra velocidad. No se añade otra animación ligada al scroll.
2. Se mantienen las animaciones actuales: barra de navegación, línea de tiempo y menú móvil.
3. Prohibido: parpadeos, destellos, efectos *glitch*, grano animado, rayas que se desplazan, marquesinas automáticas (las skills del Hero son una lista estática) y cualquier cambio de luminancia más de 3 veces por segundo.
4. Solo se animan `transform`, `opacity` y propiedades de color.
5. `prefers-reduced-motion`: en JS siempre a través de `lib/animations.ts` (`whenMotionAllowed`, `usePrefersReducedMotion`, `MotionProvider`); en CSS, variante `motion-safe:` y la regla global de `globals.css`. Con movimiento reducido todo aparece en su estado final, sin desplazamientos.
6. Sin JS, el HTML muestra todo visible.

## 4. Componentes

### 4.1 Hero

```
┌──────────────────────────────────────────────────────────┐
│ STABLE SYSTEMS.                       (Chakra Petch 700) │
│ SECURE CO┌────────┐                                      │
│          │ avatar │  ← tapa la parte baja de la 2ª línea │
│ Construye│  hola  │ software que aguanta…  (serif curs.) │
│          │        │                                      │
│ [Escríbeme sobre tu proyecto]                            │
│──────────────────────────────────────────────────────────│
│ [CIUDAD] · DESDE [AÑO] · [SKILL] · [SKILL] · … (mono 12) │
└──────────────────────────────────────────────────────────┘
```

- Alineación a la izquierda, rejilla de 12 columnas; el avatar ocupa columnas 7 a 11 y se superpone a la frase con `z-index`.
- El avatar (`public/avatar/avatar-hola.webp`) tapa como máximo un 30 % del alto de las letras de una línea, para que la frase siga legible. Necesita fondo transparente.
- La frase es texto real en el DOM (lectores de pantalla y buscadores la leen completa).
- Oscuro: neón actual en la frase. Claro: tinta plana, sin halo.
- `h1`: se mantiene el nombre (`sections.home.title`) junto al rol, en tamaño de título, debajo del subtítulo o en la franja.
- Imagen del Hero con precarga (candidata a LCP), `width` y `height` reales desde `lib/images.ts`.

### 4.2 Metadatos de identidad

- Contenido: ciudad y país (nunca dirección, barrio ni coordenadas), "Desde {año}" y de 4 a 6 skills.
- Marcado: `<ul>` con un `<li>` por dato; los puntos separadores son `aria-hidden="true"`.
- JetBrains Mono, `--fs-meta`, mayúsculas por CSS, `--fg-muted` (7.02:1 claro, 8.50:1 oscuro).
- Claves nuevas en ambos JSON: `hero.meta.city`, `hero.meta.since` (plantilla "Desde {year}" / "Since {year}"), `hero.meta.year`, `hero.meta.skills[]`, `hero.meta.label` (nombre accesible de la lista).

### 4.3 Tarjetas de proyecto en paralelogramo

```
 ╱‾‾‾‾‾‾‾‾‾‾‾‾‾‾╱╱‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾╱     proyecto impar
╱   imagen     ╱╱  bloque color A  ╱      imagen | texto
‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾
 ╱‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾╱╱‾‾‾‾‾‾‾‾‾‾‾‾‾‾╱     proyecto par
╱ bloque color B  ╱╱   imagen     ╱       texto | imagen
‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾
```

- Forma: `clip-path: polygon(var(--skew) 0, 100% 0, calc(100% - var(--skew)) 100%, 0 100%)`.
- El `clip-path` va en una **capa de fondo** (pseudoelemento o hijo decorativo), nunca en el elemento que contiene enlaces: así no recorta el anillo de foco ni el texto.
- Relleno horizontal del texto ≥ `--skew` + `--space-md`, para que ninguna letra toque el corte.
- La alternancia se calcula sobre la lista **visible** (después de filtrar), para que el ritmo no se rompa.
- Orden en el DOM: título, problema, stack, enlace y después la imagen; la alternancia visual se hace con la rejilla, sin cambiar el orden de lectura.
- Filtros por tecnología: se conservan tal cual (botones con `aria-pressed`, marca ■/□, recuento en `role="status"`).
- Móvil (< 48rem): imagen arriba y bloque abajo, `--skew` mínimo.
- Clave nueva por proyecto: `items[].image { src, alt, pending }`. Sin imagen se muestra el marco pendiente de `AvatarImage`.

### 4.4 Botón de descarga del CV

- Un `<a href download hreflang type>` (ya existe la lógica en `ContactSection`).
- Visual: barras verticales SVG `aria-hidden="true"` generadas de forma determinista a partir del texto visible; **no codifican ningún dato real**.
- Debajo de las barras, texto visible en mono: "CV · PDF · ES" y el tamaño.
- Nombre accesible: el `cvLabel` actual, p. ej. "Descargar CV (PDF, español, 120 KB)".
- Objetivo táctil ≥ 44 × 44 px, anillo de foco visible, hover solo cambia color (`--dur-fast`).
- Sin archivo: barras discontinuas, sin enlace, con el aviso `pending` actual.

### 4.5 Etiquetas verticales

- `writing-mode: vertical-rl`, JetBrains Mono, `--fs-meta`, `--tracking-vertical`, `--fg-muted` (cumple 4.5:1 aunque sea decorativa).
- `aria-hidden="true"`: repiten el título de la sección (`sections.*.title`), así no se añaden textos nuevos ni se leen dos veces.
- Solo desde `lg`, en la columna `--vertical-rail`; en móvil se ocultan.

### 4.6 Franjas de rayas diagonales

- `<div aria-hidden="true">` entre secciones con `repeating-linear-gradient(-45deg, var(--stripe) 0 12px, transparent 12px 24px)`.
- Alto `--stripe-height` (12 px), periodo 24 px. Un periodo mayor y una franja baja reducen el deslumbramiento por patrones repetidos.
- Estáticas siempre. Sustituyen al `border-t` actual de `sectionClass`.

## 5. Accesibilidad (resumen)

- Texto ≥ 4.5:1 en ambos temas (tablas 3.1 y 3.2). Controles y foco ≥ 3:1.
- Elementos decorativos (`aria-hidden`): etiquetas verticales, franjas, barras del código de barras, separadores de metadatos, grano.
- Toda información visible existe en `content/es.json` y `content/en.json`.
- Teclado: el orden de tabulación sigue el de lectura; ningún recorte oculta el foco.
- Comprobar a 390 px de ancho: sin scroll horizontal y con el CTA visible en la primera pantalla.

## 6. Confidencialidad

- Ciudad y país como máximo. Nunca dirección, coordenadas ni datos que permitan ubicarte con más precisión.
- Capturas de proyectos: solo trabajos personales o públicos, sin nombres de clientes, URLs internas, paneles ni datos reales. Exportar WebP **sin metadatos** (EXIF, XMP, GPS).
- El código de barras es decorativo y no codifica correo, teléfono ni identificadores.
- La referencia vive en `docs/referencias/` y no se publica (solo `public/` se despliega).

// Configuración pública del sitio. Solo variables NEXT_PUBLIC_: Next las incrusta en el
// JavaScript durante el build, así que NUNCA deben contener secretos.
// - Local: en .env.local (ignorado por git).
// - Cloudflare Pages: Settings → Variables and Secrets (y volver a desplegar).
//
// La clave SECRETA de Turnstile no va aquí: se pega en el panel de Formspree,
// que es quien verifica el token en su servidor.

// Next sustituye process.env.NEXT_PUBLIC_* solo si se escribe literalmente así.
const formspreeId = process.env.NEXT_PUBLIC_FORMSPREE_ID?.trim() ?? "";
const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim() ?? "";

// Un ID de Formspree es alfanumérico (p. ej. "xyzabcde"): evita construir URLs con valores raros.
const FORMSPREE_ID_PATTERN = /^[A-Za-z0-9]+$/;
const TURNSTILE_KEY_PATTERN = /^[A-Za-z0-9_-]+$/;

export const formspreeEndpoint = FORMSPREE_ID_PATTERN.test(formspreeId)
  ? `https://formspree.io/f/${formspreeId}`
  : null;

export const turnstileKey = TURNSTILE_KEY_PATTERN.test(turnstileSiteKey) ? turnstileSiteKey : null;

/** El formulario solo se habilita si están las dos variables. */
export const contactFormConfigured = formspreeEndpoint !== null && turnstileKey !== null;

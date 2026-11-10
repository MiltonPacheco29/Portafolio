const formspreeId = process.env.NEXT_PUBLIC_FORMSPREE_ID?.trim() ?? "";
const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim() ?? "";

const FORMSPREE_ID_PATTERN = /^[A-Za-z0-9]+$/;
const TURNSTILE_KEY_PATTERN = /^[A-Za-z0-9_-]+$/;

export const formspreeEndpoint = FORMSPREE_ID_PATTERN.test(formspreeId)
  ? `https://formspree.io/f/${formspreeId}`
  : null;

export const turnstileKey = TURNSTILE_KEY_PATTERN.test(turnstileSiteKey) ? turnstileSiteKey : null;

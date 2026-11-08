export const themes = ["dark", "light"] as const;
export type Theme = (typeof themes)[number];

export const THEME_STORAGE_KEY = "theme";
export const LIGHT_MEDIA_QUERY = "(prefers-color-scheme: light)";

export function isTheme(value: unknown): value is Theme {
  return value === "dark" || value === "light";
}

/**
 * Se ejecuta en <head> antes de pintar el <body> para evitar el parpadeo.
 * Orden: elección guardada → prefers-color-scheme del sistema → oscuro.
 * Si localStorage no está disponible (modo privado, bloqueado), sigue al sistema.
 *
 * Además vigila data-theme: al cambiar de idioma (/es ↔ /en) Next vuelve a montar
 * el layout raíz y React limpia los atributos de <html> que no controla. El
 * observador lo restaura con el último tema conocido antes del siguiente pintado.
 */
export const themeInitScript = `(function(){var d=document.documentElement,t=null;try{t=localStorage.getItem(${JSON.stringify(
  THEME_STORAGE_KEY,
)})}catch(e){}if(t!=="light"&&t!=="dark"){try{t=window.matchMedia(${JSON.stringify(
  LIGHT_MEDIA_QUERY,
)}).matches?"light":"dark"}catch(e){t="dark"}}d.setAttribute("data-theme",t);try{new MutationObserver(function(){var v=d.getAttribute("data-theme");if(v==="light"||v==="dark"){t=v}else{d.setAttribute("data-theme",t)}}).observe(d,{attributes:true,attributeFilter:["data-theme"]})}catch(e){}})();`;

export const themes = ["dark", "light"] as const;
export type Theme = (typeof themes)[number];

export const THEME_STORAGE_KEY = "theme";
export const LIGHT_MEDIA_QUERY = "(prefers-color-scheme: light)";

export function isTheme(value: unknown): value is Theme {
  return value === "dark" || value === "light";
}

export const themeInitScript = `(function(){var d=document.documentElement,t=null;try{t=localStorage.getItem(${JSON.stringify(
  THEME_STORAGE_KEY,
)})}catch(e){}if(t!=="light"&&t!=="dark"){try{t=window.matchMedia(${JSON.stringify(
  LIGHT_MEDIA_QUERY,
)}).matches?"light":"dark"}catch(e){t="dark"}}d.setAttribute("data-theme",t);try{new MutationObserver(function(){var v=d.getAttribute("data-theme");if(v==="light"||v==="dark"){t=v}else{d.setAttribute("data-theme",t)}}).observe(d,{attributes:true,attributeFilter:["data-theme"]})}catch(e){}})();`;

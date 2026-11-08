/** Elementos `position: fixed` que reciben la misma compensación de la barra de scroll. */
export const SCROLL_LOCK_COMPENSATE_SELECTOR = "[data-scroll-lock-compensate]";

function measureScrollbar(): number {
  const probe = document.createElement("div");
  probe.style.cssText = "position:absolute;top:-9999px;width:100px;height:100px;overflow:scroll";
  document.body.appendChild(probe);
  const width = probe.offsetWidth - probe.clientWidth;
  probe.remove();
  return width;
}

/**
 * Bloquea el scroll de la página sin salto horizontal: si la página tiene
 * scroll, suma el ancho de la barra como padding-right en <body> y en los
 * elementos fijos marcados. No usa `scrollbar-gutter: stable` (ese hueco se
 * pinta por encima de las capas fijas).
 * Devuelve `unlock`, que quita padding y bloqueo en el mismo paso; es idempotente.
 */
export function lockScroll(): () => void {
  const { body, documentElement: root } = document;
  const compensated = [
    body,
    ...document.querySelectorAll<HTMLElement>(SCROLL_LOCK_COMPENSATE_SELECTOR),
  ];
  const savedPadding = compensated.map((el) => el.style.paddingRight);
  const savedOverflow = body.style.overflow;
  const gap = root.scrollHeight > root.clientHeight ? measureScrollbar() : 0;
  if (gap > 0) {
    const base = compensated.map((el) => parseFloat(getComputedStyle(el).paddingRight) || 0);
    compensated.forEach((el, i) => {
      el.style.paddingRight = `${base[i] + gap}px`;
    });
  }
  body.style.overflow = "hidden";

  let locked = true;
  return () => {
    if (!locked) return;
    locked = false;
    compensated.forEach((el, i) => {
      el.style.paddingRight = savedPadding[i];
    });
    body.style.overflow = savedOverflow;
  };
}

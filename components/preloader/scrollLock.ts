const SCROLL_LOCK_COMPENSATE_SELECTOR = "[data-scroll-lock-compensate]";

function measureScrollbar(): number {
  const probe = document.createElement("div");
  probe.style.cssText = "position:absolute;top:-9999px;width:100px;height:100px;overflow:scroll";
  document.body.appendChild(probe);
  const width = probe.offsetWidth - probe.clientWidth;
  probe.remove();
  return width;
}

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

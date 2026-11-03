/** Reads a CSS variable as sRGB (0-255) in the current theme. Browser only. */
export function readTokenRgb(token: string): [number, number, number] {
  const probe = document.createElement("span");
  probe.style.color = `var(--${token})`;
  document.body.appendChild(probe);
  const resolved = getComputedStyle(probe).color;
  probe.remove();
  // The canvas converts any CSS color syntax (oklch, lab, ...) to sRGB.
  const ctx = document
    .createElement("canvas")
    .getContext("2d", { willReadFrequently: true });
  if (!ctx) return [0, 0, 0];
  ctx.fillStyle = resolved;
  ctx.fillRect(0, 0, 1, 1);
  const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
  return [r, g, b];
}

function luminance([r, g, b]: [number, number, number]) {
  const [lr, lg, lb] = [r, g, b].map((v) => {
    const c = v / 255;
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * lr + 0.7152 * lg + 0.0722 * lb;
}

/** WCAG contrast ratio between two tokens in the current theme. */
export function tokenContrast(background: string, foreground: string) {
  const x = luminance(readTokenRgb(background));
  const y = luminance(readTokenRgb(foreground));
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
}

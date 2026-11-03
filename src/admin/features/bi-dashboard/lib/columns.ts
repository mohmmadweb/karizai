/**
 * How many columns a group of cards uses so that its last row is full: the widest count up to `max`
 * that divides the number of cards, or `max` when none does. A group never uses more columns than cards.
 */
export function pickColumns(count: number, max: number): number {
  if (count <= max) return Math.max(count, 1);
  for (let columns = max; columns >= 2; columns--) if (count % columns === 0) return columns;
  return max;
}

/** Inline CSS variables read by `md:grid-cols-(--cols-md)` and its siblings; each holds a whole column template. */
export function columnVars(count: number): React.CSSProperties {
  const template = (max: number) => `repeat(${pickColumns(count, max)}, minmax(0, 1fr))`;
  return { "--cols-md": template(2), "--cols-lg": template(3), "--cols-xl": template(4) } as React.CSSProperties;
}

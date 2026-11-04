/** The colour of one desk block, from the semantic tokens; full class names so Tailwind can find them. */
export type DeskTone = "primary" | "info" | "success" | "warning" | "teal" | "violet";

export const toneClasses: Record<DeskTone, { chip: string; bar: string; tile: string }> = {
  primary: { chip: "bg-primary/10 text-primary", bar: "border-t-primary", tile: "bg-primary/8 border-primary/20" },
  info: { chip: "bg-info/15 text-info", bar: "border-t-info", tile: "bg-info/8 border-info/20" },
  success: { chip: "bg-success/15 text-success", bar: "border-t-success", tile: "bg-success/8 border-success/20" },
  warning: { chip: "bg-warning/30 text-warning-foreground", bar: "border-t-warning", tile: "bg-warning/15 border-warning/40" },
  teal: { chip: "bg-chart-2/20 text-chart-2", bar: "border-t-chart-2", tile: "bg-chart-2/10 border-chart-2/30" },
  violet: { chip: "bg-chart-4/15 text-chart-4", bar: "border-t-chart-4", tile: "bg-chart-4/8 border-chart-4/25" },
};

import type { ReactNode } from "react";

export type DataTableColumn<T> = {
  id: string;
  header: string;
  cell: (row: T) => ReactNode;
  /** Numbers align to the end and use tabular figures. */
  align?: "start" | "end";
  /** Hide this column in the table below the given breakpoint. */
  hideBelow?: "lg" | "xl";
  className?: string;
};

export type DataTableAction = {
  label: string;
  icon?: ReactNode;
  /** Navigates instead of running `onSelect`. */
  href?: string;
  onSelect?: () => void;
  destructive?: boolean;
  disabled?: boolean;
  /** Shows the action as a visible button beside «⋯» instead of inside the menu. */
  inline?: boolean;
  /** With `inline`: shows only the icon; the label becomes a tooltip and the accessible name. */
  iconOnly?: boolean;
  /** When set, a confirmation dialog opens before `onSelect` runs. */
  confirm?: { title: string; description: string; confirmLabel: string };
};

/** Actions are grouped; a separator is drawn between groups. */
export type DataTableActionGroup = DataTableAction[];

export type ColorPair = {
  id: string;
  label: string;
  /** Names of the CSS variables, without `--`. Values are read live. */
  background: string;
  foreground: string;
  /** Minimum ratio this pair must reach: 4.5 for text, 3 for borders. */
  target: 3 | 4.5;
};

export type TypeRole = {
  id: string;
  label: string;
  className: string;
  spec: string;
};

export type ScaleItem = { id: string; label: string; value: string };

export type FontWeightItem = { weight: number; name: string; className: string };

export type SelectOption = { value: string; label: string };

export type SampleRow = {
  id: string;
  name: string;
  status: "success" | "warning" | "info";
  statusLabel: string;
  amount: number;
};

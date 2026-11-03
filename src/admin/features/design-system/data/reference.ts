import type { FontWeightItem, SampleRow, SelectOption } from "../types";

const fontWeights: FontWeightItem[] = [
  { weight: 100, name: "Thin", className: "font-thin" },
  { weight: 200, name: "UltraLight", className: "font-extralight" },
  { weight: 300, name: "Light", className: "font-light" },
  { weight: 400, name: "Regular", className: "font-normal" },
  { weight: 500, name: "Medium", className: "font-medium" },
  { weight: 600, name: "DemiBold", className: "font-semibold" },
  { weight: 700, name: "Bold", className: "font-bold" },
  { weight: 800, name: "ExtraBold", className: "font-extrabold" },
  { weight: 900, name: "Black", className: "font-black" },
];

const selectOptions: SelectOption[] = [
  { value: "one", label: "گزینه اول" },
  { value: "two", label: "گزینه دوم" },
  { value: "three", label: "گزینه سوم" },
];

const sampleStatuses = [
  { status: "success", statusLabel: "موفق" },
  { status: "warning", statusLabel: "هشدار" },
  { status: "info", statusLabel: "اطلاع" },
] as const;
const ordinals = ["اول", "دوم", "سوم", "چهارم", "پنجم", "ششم", "هفتم", "هشتم", "نهم", "دهم", "یازدهم", "دوازدهم"];

const sampleRows: SampleRow[] = ordinals.map((ordinal, index) => ({
  id: `row-${index + 1}`,
  name: `ردیف ${ordinal}`,
  ...sampleStatuses[index % sampleStatuses.length],
  amount: [1250000, 84000, 3600, 560000][index % 4] + index * 1000,
}));

export const getFontWeights = () => fontWeights;
export const getSelectOptions = () => selectOptions;
export const getSampleRows = () => sampleRows;

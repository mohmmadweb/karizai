import type { Indicator, IndicatorInput, Severity, SourceKind } from "../types";

/** The form keeps every number as text so the user can type Persian or Latin digits. */
export type IndicatorFormValues = {
  name: string;
  unit: string;
  lowerLimit: string;
  upperLimit: string;
  source: SourceKind;
  reference: string;
  refreshMinutes: string;
  severity: Severity;
  userIds: string[];
  groupIds: string[];
  enabled: boolean;
};

export const severityLabels: Record<Severity, string> = { info: "اطلاع", warning: "هشدار", critical: "بحرانی" };

export const emptyForm: IndicatorFormValues = { name: "", unit: "", lowerLimit: "", upperLimit: "", source: "mes", reference: "", refreshMinutes: "5", severity: "warning", userIds: [], groupIds: [], enabled: true };

export function formFrom(indicator: Indicator): IndicatorFormValues {
  const text = (n: number | null) => (n === null ? "" : String(n));
  return { ...indicator, lowerLimit: text(indicator.lowerLimit), upperLimit: text(indicator.upperLimit), refreshMinutes: String(indicator.refreshMinutes) };
}

const latin = (text: string) => text.replace(/[۰-۹]/g, (d) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(d))).replace(/[٫,]/g, ".").trim();

/** `null` for empty text, `NaN` for text that is not a number. */
export function parseNumber(text: string): number | null {
  if (!latin(text)) return null;
  const value = Number(latin(text));
  return Number.isFinite(value) ? value : Number.NaN;
}

/** The input to validate and save; a limit that is not a number comes through as `NaN` so validation can refuse it. */
export function toInput(values: IndicatorFormValues): IndicatorInput {
  const refresh = parseNumber(values.refreshMinutes);
  return {
    ...values,
    name: values.name.trim(),
    unit: values.unit.trim(),
    lowerLimit: parseNumber(values.lowerLimit),
    upperLimit: parseNumber(values.upperLimit),
    reference: values.source === "manual" ? "" : values.reference.trim(),
    refreshMinutes: refresh === null ? Number.NaN : refresh,
  };
}

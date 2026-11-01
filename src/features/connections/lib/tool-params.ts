import type { ConnectionTool, ToolParam } from "../types";

const latinDigits = (text: string) => text.replace(/[۰-۹]/g, (d) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(d))).replace(/٫/g, ".");

/** A number typed with Persian or Latin digits, or `null` when the text is not a number. */
export function numberFromText(text: string): number | null {
  const value = Number(latinDigits(text.trim()));
  return text.trim() !== "" && Number.isFinite(value) ? value : null;
}

/** The settings of a tool: its own, or the sample inputs as required text settings. */
export function toolParams(tool: ConnectionTool): ToolParam[] {
  return tool.params ?? tool.sampleInputs.map((input, index) => ({ key: `p${index}`, label: input.label, kind: "text" as const, required: true, placeholder: input.value || undefined }));
}

export function defaultParams(params: ToolParam[]): Record<string, string> {
  return Object.fromEntries(params.map((param) => [param.key, param.defaultValue ?? ""]));
}

const schemes = ["http:", "https:", "mqtt:", "mqtts:", "mssql:"];

/** A plain-Persian problem with a value, or `null` when it is fine. */
export function paramProblem(param: ToolParam, value: string | undefined): string | null {
  const text = (value ?? "").trim();
  if (!text) return param.required ? `«${param.label}» را وارد کنید.` : null;
  if (param.kind === "url") {
    try {
      if (!schemes.includes(new URL(text).protocol)) throw new Error("scheme");
    } catch {
      return `«${param.label}» یک نشانی معتبر نیست (مثلاً https://example.com/api).`;
    }
  }
  if (param.kind === "number") {
    const number = numberFromText(text);
    if (number === null) return `«${param.label}» باید عدد باشد.`;
    if (param.min !== undefined && number < param.min) return `«${param.label}» دست‌کم ${param.min.toLocaleString("fa-IR")} باشد.`;
    if (param.max !== undefined && number > param.max) return `«${param.label}» حداکثر ${param.max.toLocaleString("fa-IR")} باشد.`;
  }
  if (param.kind === "select" && !param.options?.some((option) => option.value === text)) return `برای «${param.label}» یکی از گزینه‌ها را انتخاب کنید.`;
  if (param.kind === "secret" && text.length < 16) return `«${param.label}» دست‌کم ۱۶ نویسه باشد.`;
  return null;
}

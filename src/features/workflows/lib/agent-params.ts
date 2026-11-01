import type { ToolParam } from "@/features/connections/types";

/** Settings every Agent step has. A step without them uses the default. */
export const agentParams: ToolParam[] = [
  { key: "inputFrom", label: "ورودی این گام", kind: "select", required: true, defaultValue: "previous", options: [{ value: "previous", label: "خروجی گام قبل" }, { value: "instruction", label: "فقط متن دستور همین گام" }] },
  { key: "maxOutputTokens", label: "حداکثر توکن خروجی", kind: "number", required: true, min: 100, max: 8000, defaultValue: "1500", hint: "برای کنترل هزینه؛ پاسخ بلندتر از این بریده می‌شود." },
];

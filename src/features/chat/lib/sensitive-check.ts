import { applyMasks, type MaskField } from "@/lib/policy-store";

export type SensitiveMatch = { label: string; value: string };

export type SensitiveCheck =
  | { kind: "none" }
  | { kind: "warning"; reason: string; matches: SensitiveMatch[]; preview: string }
  | { kind: "internal-only"; reason: string }
  | { kind: "forbidden"; reason: string };

/** Persian and Arabic digits become Latin ones, so the admin's patterns (written with \d) find them. */
export function normalizeDigits(text: string) {
  return text.replace(/[۰-۹]/g, (d) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(d))).replace(/[٠-٩]/g, (d) => String("٠١٢٣٤٥٦٧٨٩".indexOf(d)));
}

/**
 * Checks a message against the fields the admin defined in «مرکز قواعد و سیاست‌ها» (`usePolicies().maskFields`).
 * «replace» fields are masked before an external model; an «internal-only» field keeps the message inside the organization.
 */
export function checkSensitive(text: string, fields: MaskField[]): SensitiveCheck {
  if (/(کلید خصوصی|private key)/i.test(text)) {
    return { kind: "forbidden", reason: "این پیام شامل کلید خصوصی است و طبق قوانین سازمان نباید فرستاده شود. آن را از پیام حذف کنید." };
  }
  const { masked, found, internalOnly } = applyMasks(normalizeDigits(text), fields);
  if (found.length === 0) return { kind: "none" };
  const names = (action: string) => [...new Set(found.filter((item) => item.action === action).map((item) => `«${item.label}»`))].join("، ");
  if (internalOnly) return { kind: "internal-only", reason: `پیام شما ${names("internal-only")} دارد و طبق قواعد سازمان فقط مدل داخلی آن را می‌خواند؛` };
  return { kind: "warning", reason: `در پیام شما این موارد حساس دیده می‌شود: ${names("replace")}.`, matches: found.map(({ label, value }) => ({ label, value })), preview: masked };
}

/** Replaces each sensitive value with a token like «[کد ملی ۱]» before the text goes to a model. */
export function maskText(text: string, matches: SensitiveMatch[]) {
  const map: { token: string; value: string }[] = [];
  const perLabel = new Map<string, number>();
  let masked = normalizeDigits(text);
  for (const match of matches) {
    if (map.some((item) => item.value === match.value)) continue;
    const n = (perLabel.get(match.label) ?? 0) + 1;
    perLabel.set(match.label, n);
    const token = `[${match.label} ${n.toLocaleString("fa-IR")}]`;
    map.push({ token, value: match.value });
    masked = masked.split(match.value).join(token);
  }
  return { masked, map };
}

/** Puts the original values back into the model's answer for the user. */
export function restoreText(text: string, map: { token: string; value: string }[]) {
  return map.reduce((result, item) => result.split(item.token).join(item.value), text);
}

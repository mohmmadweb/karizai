export type SensitiveMatch = { label: string; value: string };

export type SensitiveCheck =
  | { kind: "none" }
  | { kind: "warning"; reason: string; matches: SensitiveMatch[] }
  | { kind: "forbidden"; reason: string };

const digit = "[0-9۰-۹]";
const patterns: { label: string; regex: RegExp }[] = [
  { label: "شماره‌ی کارت بانکی", regex: new RegExp(`(?<!${digit})(?:${digit}[ -]?){15}${digit}(?!${digit})`, "g") },
  { label: "شماره‌ی تلفن همراه", regex: new RegExp(`(?<!${digit})(?:09|۰۹)${digit}{9}(?!${digit})`, "g") },
  { label: "کد ملی", regex: new RegExp(`(?<!${digit})${digit}{10}(?!${digit})`, "g") },
];

/** Simple pattern checks that stand in for the organization's real rules. */
export function checkSensitive(text: string): SensitiveCheck {
  if (/(کلید خصوصی|private key)/i.test(text)) {
    return { kind: "forbidden", reason: "این پیام شامل کلید خصوصی است و طبق قوانین سازمان نباید فرستاده شود. آن را از پیام حذف کنید." };
  }
  const matches: SensitiveMatch[] = [];
  let rest = text;
  for (const { label, regex } of patterns) {
    for (const found of rest.match(regex) ?? []) matches.push({ label, value: found });
    rest = rest.replace(regex, " ");
  }
  if (matches.length === 0) return { kind: "none" };
  const names = [...new Set(matches.map((item) => item.label))].join("، ");
  return { kind: "warning", reason: `در پیام شما این موارد حساس دیده می‌شود: ${names}.`, matches };
}

/** Replaces each sensitive value with a token before the text goes to a model. */
export function maskText(text: string, matches: SensitiveMatch[]) {
  const map: { token: string; value: string }[] = [];
  let masked = text;
  matches.forEach((match, index) => {
    const token = `[مورد-حساس-${index + 1}]`;
    map.push({ token, value: match.value });
    masked = masked.split(match.value).join(token);
  });
  return { masked, map };
}

/** Puts the original values back into the model's answer for the user. */
export function restoreText(text: string, map: { token: string; value: string }[]) {
  return map.reduce((result, item) => result.split(item.token).join(item.value), text);
}

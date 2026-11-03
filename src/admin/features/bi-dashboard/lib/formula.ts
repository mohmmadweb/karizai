type Token = { kind: "num"; value: number } | { kind: "name"; value: string } | { kind: "op"; value: string };

function tokenize(text: string): Token[] | string {
  const tokens: Token[] = [];
  const re = /\s*(?:(\d+(?:\.\d+)?)|([A-Za-z_]\w*)|([-+*/()]))/y;
  let pos = 0;
  while (pos < text.length) {
    re.lastIndex = pos;
    const m = re.exec(text);
    if (!m) return text.slice(pos).trim() === "" ? tokens : `نویسه‌ی «${text.slice(pos).trim()[0]}» در فرمول مجاز نیست.`;
    tokens.push(m[1] !== undefined ? { kind: "num", value: Number(m[1]) } : m[2] !== undefined ? { kind: "name", value: m[2] } : { kind: "op", value: m[3] });
    pos = re.lastIndex;
  }
  return tokens;
}

export type FormulaResult = { ok: true; value: number } | { ok: false; error: string };

/** Evaluates a formula with + - * / and parentheses over named values. Anything else is refused. */
export function evaluateFormula(formula: string, values: Record<string, number>): FormulaResult {
  const scanned = tokenize(formula);
  if (typeof scanned === "string") return { ok: false, error: scanned };
  const tokens: Token[] = scanned;
  if (tokens.length === 0) return { ok: false, error: "فرمول را بنویسید." };
  let i = 0;
  const fail = (error: string): never => { throw new Error(error); };
  const isOp = (v: string) => tokens[i]?.kind === "op" && tokens[i].value === v;

  function primary(): number {
    const t = tokens[i++];
    if (!t) return fail("فرمول ناتمام است.");
    if (t.kind === "num") return t.value;
    if (t.kind === "name") return t.value in values ? values[t.value] : fail(`متغیر «${t.value}» تعریف نشده است.`);
    if (t.value === "-") return -primary();
    if (t.value !== "(") return fail(`جای «${t.value}» عدد یا متغیر لازم است.`);
    const inner = sum();
    if (!isOp(")")) return fail("پرانتز بسته نشده است.");
    i++;
    return inner;
  }
  function product(): number {
    let v = primary();
    while (isOp("*") || isOp("/")) {
      const op = tokens[i++].value;
      const r = primary();
      if (op === "/" && r === 0) return fail("تقسیم بر صفر.");
      v = op === "*" ? v * r : v / r;
    }
    return v;
  }
  function sum(): number {
    let v = product();
    while (isOp("+") || isOp("-")) v = tokens[i++].value === "+" ? v + product() : v - product();
    return v;
  }
  try {
    const value = sum();
    if (i < tokens.length) return { ok: false, error: "فرمول ناقص یا نادرست است." };
    return { ok: true, value: Math.round(value * 100) / 100 };
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
}

export const variableValues = (variables: { name: string; value: number }[]) => Object.fromEntries(variables.map((v) => [v.name, v.value]));

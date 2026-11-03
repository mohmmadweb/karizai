import { maskFields, type Policies } from "@/lib/policies";
import { readPolicies, writePolicies } from "@/server/provider-store";

export async function GET() {
  return Response.json({ policies: await readPolicies() });
}

const isRecord = (value: unknown): value is Record<string, unknown> => typeof value === "object" && value !== null && !Array.isArray(value);

function isValid(p: Partial<Policies> | undefined): p is Policies {
  if (!p || !isRecord(p.weeklyLimits) || !isRecord(p.masking) || !isRecord(p.toolAccess)) return false;
  const ids = p.confidentialDocumentIds;
  if (ids !== null && !(Array.isArray(ids) && ids.every((id) => typeof id === "string"))) return false;
  if (!Object.values(p.weeklyLimits).every((v) => v === null || (typeof v === "number" && v > 0 && Number.isFinite(v)))) return false;
  const { fields, phrases } = p.masking as Policies["masking"];
  if (!isRecord(fields) || !maskFields.every((f) => typeof fields[f] === "boolean")) return false;
  if (!Array.isArray(phrases) || phrases.length > 200) return false;
  if (!phrases.every((x) => typeof x.id === "string" && typeof x.phrase === "string" && x.phrase.trim() && typeof x.withNumber === "boolean")) return false;
  return Object.values(p.toolAccess).every((byConnection) => isRecord(byConnection) && Object.values(byConnection).every((m) => m === "read" || m === "readwrite"));
}

export async function PUT(request: Request) {
  const body = (await request.json().catch(() => null)) as { policies?: Partial<Policies> } | null;
  if (!isValid(body?.policies)) return Response.json({ error: "داده‌ی نامعتبر است." }, { status: 400 });
  await writePolicies(body!.policies as Policies);
  return Response.json({ ok: true });
}

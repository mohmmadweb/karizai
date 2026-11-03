import { apiKeyKinds, type ApiKeyPolicy } from "@/lib/api-keys";
import { readApiKeys, writeApiKeyPolicies } from "@/admin/server/provider-store";

export async function GET() {
  return Response.json(await readApiKeys());
}

/** Saves which groups may create keys, for what, and with which monthly ceiling. */
export async function PUT(request: Request) {
  const body = (await request.json().catch(() => null)) as { policies?: ApiKeyPolicy[] } | null;
  const list = body?.policies;
  const valid =
    Array.isArray(list) &&
    list.every(
      (item) =>
        typeof item.groupId === "string" &&
        Array.isArray(item.kinds) &&
        item.kinds.every((kind) => apiKeyKinds.includes(kind)) &&
        (item.monthlyTokenLimit === null || (Number.isFinite(item.monthlyTokenLimit) && item.monthlyTokenLimit >= 0)),
    );
  if (!valid || !list) return Response.json({ error: "داده‌ی نامعتبر است." }, { status: 400 });
  await writeApiKeyPolicies(list);
  return Response.json({ ok: true });
}

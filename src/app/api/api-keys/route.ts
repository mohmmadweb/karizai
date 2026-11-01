import { apiKeyKinds, combinePolicies, type ApiKeyKind } from "@/lib/api-keys";
import { createApiKey, readApiKeys } from "@/server/provider-store";

/** Policies of all groups and the keys of one owner (`?ownerId=`). */
export async function GET(request: Request) {
  const ownerId = new URL(request.url).searchParams.get("ownerId");
  const { policies, keys } = await readApiKeys();
  return Response.json({ policies, keys: keys.filter((key) => key.ownerId === ownerId) });
}

type CreateBody = {
  name?: string;
  ownerId?: string;
  ownerName?: string;
  groupIds?: string[];
  kind?: ApiKeyKind;
  resourceId?: string;
  resourceName?: string;
  expiresInDays?: number | null;
};

/** Creates a key if one of the owner's groups allows its kind. The secret is returned once. */
export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as CreateBody | null;
  const name = body?.name?.trim();
  if (!body || !name || !body.ownerId || !body.ownerName || !body.resourceId || !body.resourceName || !body.kind || !apiKeyKinds.includes(body.kind) || !Array.isArray(body.groupIds)) {
    return Response.json({ error: "داده‌ی نامعتبر است." }, { status: 400 });
  }
  const { policies } = await readApiKeys();
  if (!combinePolicies(policies, body.groupIds).kinds.includes(body.kind)) {
    return Response.json({ error: "گروه‌های شما اجازه‌ی ساخت این نوع کلید را ندارند." }, { status: 403 });
  }
  const days = body.expiresInDays;
  const expiresAt = typeof days === "number" && days > 0 ? new Date(Date.now() + days * 86_400_000).toISOString() : null;
  const { record, secret } = await createApiKey({ name, ownerId: body.ownerId, ownerName: body.ownerName, kind: body.kind, resourceId: body.resourceId, resourceName: body.resourceName, expiresAt });
  return Response.json({ key: record, secret });
}

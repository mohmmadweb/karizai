import { revokeApiKey } from "@/server/provider-store";

/** A user can revoke only their own key. */
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = (await request.json().catch(() => null)) as { ownerId?: string } | null;
  if (!body?.ownerId) return Response.json({ error: "داده‌ی نامعتبر است." }, { status: 400 });
  const done = await revokeApiKey(id, body.ownerId);
  return done ? Response.json({ ok: true }) : Response.json({ error: "کلید پیدا نشد." }, { status: 404 });
}

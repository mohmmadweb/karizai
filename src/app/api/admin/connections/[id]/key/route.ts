import { setProviderKey } from "@/admin/server/provider-store";

/** The key of a connection with a shared key. It is stored encrypted and never returned. */
export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = (await request.json().catch(() => null)) as { apiKey?: string } | null;
  const apiKey = body?.apiKey?.trim();
  if (!apiKey) return Response.json({ error: "کلید دسترسی خالی است." }, { status: 400 });
  await setProviderKey(`conn:${id}`, apiKey);
  return Response.json({ ok: true });
}

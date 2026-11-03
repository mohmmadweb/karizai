import { revokeApiKey } from "@/admin/server/provider-store";

/** The admin can revoke any key. */
export async function POST(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const done = await revokeApiKey(id);
  return done ? Response.json({ ok: true }) : Response.json({ error: "کلید پیدا نشد." }, { status: 404 });
}

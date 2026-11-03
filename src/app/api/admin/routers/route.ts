import { readRouters, writeRouters, type StoredRouter } from "@/admin/server/provider-store";

export async function GET() {
  return Response.json({ routers: await readRouters() });
}

const tiers = ["light", "medium", "heavy"];

export async function PUT(request: Request) {
  const body = (await request.json().catch(() => null)) as { routers?: StoredRouter[] } | null;
  const list = body?.routers;
  const valid =
    Array.isArray(list) &&
    list.every(
      (router) =>
        typeof router.id === "string" &&
        typeof router.name === "string" &&
        router.name.trim() &&
        Array.isArray(router.groupIds) &&
        Array.isArray(router.members) &&
        router.members.every((member) => typeof member.modelId === "string" && tiers.includes(member.tier)),
    );
  if (!valid || !list) return Response.json({ error: "داده‌ی نامعتبر است." }, { status: 400 });
  await writeRouters(list);
  return Response.json({ ok: true });
}

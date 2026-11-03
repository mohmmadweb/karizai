import { readConnections, writeConnections, type StoredConnection } from "@/admin/server/provider-store";

export async function GET() {
  return Response.json({ connections: await readConnections() });
}

const types = ["mcp", "api", "n8n", "dify"];
const auths = ["none", "shared-key", "user-login"];

export async function PUT(request: Request) {
  const body = (await request.json().catch(() => null)) as { connections?: StoredConnection[] } | null;
  const list = body?.connections;
  const valid =
    Array.isArray(list) &&
    list.every(
      (item) =>
        typeof item.id === "string" &&
        typeof item.name === "string" &&
        item.name.trim() &&
        types.includes(item.type) &&
        auths.includes(item.auth) &&
        Array.isArray(item.tools) &&
        Array.isArray(item.groupIds) &&
        item.tools.every((tool) => typeof tool.id === "string" && typeof tool.name === "string"),
    );
  if (!valid || !list) return Response.json({ error: "داده‌ی نامعتبر است." }, { status: 400 });
  await writeConnections(list);
  return Response.json({ ok: true });
}

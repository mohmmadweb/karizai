import { readSnapshot, writeSnapshot, type Snapshot } from "@/admin/server/provider-store";

export async function GET() {
  return Response.json(await readSnapshot());
}

export async function PUT(request: Request) {
  const body = (await request.json().catch(() => null)) as Partial<Snapshot> | null;
  if (!body || !Array.isArray(body.providers) || !Array.isArray(body.models)) {
    return Response.json({ error: "داده‌ی نامعتبر است." }, { status: 400 });
  }
  // Keys never travel in the snapshot.
  const providers = body.providers.map((provider) => {
    const { apiKey, ...rest } = provider as Record<string, unknown>;
    void apiKey;
    return rest;
  }) as Snapshot["providers"];
  await writeSnapshot({ providers, models: body.models });
  return Response.json({ ok: true });
}

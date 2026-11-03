import { getProviderKey } from "@/admin/server/provider-store";
import { apiUrl, isHttpUrl } from "@/admin/server/remote";

/** Asks the provider for its models (OpenAI-compatible `GET /models`). */
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = (await request.json().catch(() => null)) as { baseUrl?: string } | null;
  const baseUrl = body?.baseUrl?.trim() ?? "";
  if (!isHttpUrl(baseUrl)) return Response.json({ error: "نشانی پایه معتبر نیست." }, { status: 400 });
  const apiKey = await getProviderKey(id);
  if (!apiKey) return Response.json({ error: "کلید این ارائه‌دهنده ثبت نشده است." }, { status: 400 });
  try {
    const response = await fetch(apiUrl(baseUrl, "/models"), {
      headers: { Authorization: `Bearer ${apiKey}` },
      signal: AbortSignal.timeout(15000),
    });
    if (!response.ok) {
      const reason = response.status === 401 || response.status === 403 ? "کلید پذیرفته نشد." : `ارائه‌دهنده خطا داد (${response.status}).`;
      return Response.json({ error: reason }, { status: 502 });
    }
    const json = (await response.json()) as { data?: { id?: string }[] };
    const remoteIds = (json.data ?? []).map((item) => item.id).filter((value): value is string => Boolean(value));
    return Response.json({ remoteIds });
  } catch {
    return Response.json({ error: "اتصال به ارائه‌دهنده برقرار نشد." }, { status: 502 });
  }
}

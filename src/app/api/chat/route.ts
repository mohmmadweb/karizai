import { maskWithPolicy } from "@/lib/masking";
import { getProviderKey, readPolicies, readSnapshot } from "@/server/provider-store";
import { apiUrl } from "@/server/remote";

type ChatBody = { modelId?: string; messages?: { role: string; content: string }[] };

const fail = (error: string, status = 502) => Response.json({ error }, { status });

/**
 * Sends the conversation to the model's provider (OpenAI-compatible
 * `POST /chat/completions`, streaming) and returns the answer as plain text
 * that arrives piece by piece. The key stays on the server.
 */
export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as ChatBody | null;
  if (!body?.modelId || !Array.isArray(body.messages) || body.messages.length === 0) {
    return fail("درخواست نامعتبر است.", 400);
  }
  const { providers, models } = await readSnapshot();
  const model = models.find((item) => item.id === body.modelId && item.enabled);
  const provider = providers.find((item) => item.id === model?.providerId);
  if (!model || !provider) return fail("این مدل در دسترس نیست.", 404);
  const apiKey = await getProviderKey(provider.id);
  if (!apiKey) return fail("کلید این ارائه‌دهنده ثبت نشده است.", 400);

  // Safety net: whatever the browser sent, the saved policies are applied once more before the model sees it.
  const { masking } = await readPolicies();
  const messages = body.messages.map((item) => ({ ...item, content: typeof item.content === "string" ? maskWithPolicy(item.content, masking).masked : item.content }));

  let upstream: Response;
  try {
    upstream = await fetch(apiUrl(provider.baseUrl, "/chat/completions"), {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({ model: model.remoteId, messages, stream: true }),
      signal: AbortSignal.any([request.signal, AbortSignal.timeout(120000)]),
    });
  } catch {
    return fail("اتصال به ارائه‌دهنده‌ی مدل برقرار نشد.");
  }
  if (!upstream.ok || !upstream.body) {
    const reason = upstream.status === 401 || upstream.status === 403 ? "کلید ارائه‌دهنده پذیرفته نشد." : upstream.status === 429 ? "سقف درخواست ارائه‌دهنده پر شده است؛ کمی بعد تلاش کنید." : `ارائه‌دهنده خطا داد (${upstream.status}).`;
    return fail(reason);
  }

  const decoder = new TextDecoder();
  const encoder = new TextEncoder();
  let buffer = "";
  const stream = upstream.body.pipeThrough(
    new TransformStream<Uint8Array, Uint8Array>({
      transform(chunk, controller) {
        buffer += decoder.decode(chunk, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";
        for (const line of lines) {
          const data = line.replace(/^data:\s*/, "").trim();
          if (!line.startsWith("data:") || !data || data === "[DONE]") continue;
          try {
            const piece = JSON.parse(data).choices?.[0]?.delta?.content;
            if (piece) controller.enqueue(encoder.encode(piece));
          } catch {
            // an incomplete or non-text event is skipped
          }
        }
      },
    }),
  );
  return new Response(stream, { headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" } });
}

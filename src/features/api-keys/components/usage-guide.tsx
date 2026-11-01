import { apiKeyKindLabels, type ApiKeyKind } from "@/lib/api-keys";

const examples: Record<ApiKeyKind, { path: string; body: string }> = {
  model: { path: "/api/v1/chat/completions", body: '{ "model": "<شناسه‌ی مدل>", "messages": [{ "role": "user", "content": "سلام" }] }' },
  agent: { path: "/api/v1/agents/<شناسه‌ی عامل>/run", body: '{ "input": "قرارداد پیوست را بررسی کن" }' },
  knowledge: { path: "/api/v1/knowledge/search", body: '{ "query": "مرخصی استحقاقی چند روز است؟" }' },
};

/** Short guide: how a program calls the API with a key. */
export function UsageGuide({ kinds }: { kinds: ApiKeyKind[] }) {
  return (
    <section className="flex flex-col gap-3" aria-labelledby="guide-title">
      <h2 id="guide-title" className="text-h4">راهنمای استفاده</h2>
      <p className="max-w-reading text-body text-muted-foreground">برنامه‌ی شما کلید را در سرآیند Authorization می‌فرستد. نشانی سرور موشکاف سازمان را جایگزین «‌آدرس‌موشکاف» کنید.</p>
      <div className="grid gap-4 lg:grid-cols-2">
        {kinds.map((kind) => (
          <div key={kind} className="flex flex-col gap-2 rounded-xl border p-4">
            <span className="text-label">{apiKeyKindLabels[kind]}</span>
            <pre dir="ltr" className="overflow-x-auto rounded-lg bg-muted/50 p-3 text-start font-mono text-caption leading-relaxed">{`curl -X POST https://<آدرس‌موشکاف>${examples[kind].path} \\
  -H "Authorization: Bearer msk_..." \\
  -H "Content-Type: application/json" \\
  -d '${examples[kind].body}'`}</pre>
          </div>
        ))}
      </div>
    </section>
  );
}

"use client";

import { useState } from "react";
import { SendIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { apiKeyKindLabels, apiKeyStatus, type ApiKeyRecord } from "@/lib/api-keys";
import { useDemoFlags } from "@/lib/demo-flags";
import { formatNumber } from "@/lib/format";
import { simulateRequest } from "@/lib/simulate-request";
import { endpoints } from "../data/endpoints";
import { CodeBlock } from "./code-block";

type Result = { status: number; latencyMs: number; tokens?: { input: number; output: number }; body: unknown; note?: string };

/** Pick an endpoint, edit the body and see a sample response with latency and tokens. Nothing leaves the browser. */
export function PlaygroundTab({ keys }: { keys: ApiKeyRecord[] }) {
  const { offline } = useDemoFlags();
  const [endpointId, setEndpointId] = useState(endpoints[0].id);
  const endpoint = endpoints.find((item) => item.id === endpointId) ?? endpoints[0];
  const usable = keys.filter((key) => apiKeyStatus(key) === "active");
  const [keyId, setKeyId] = useState(usable[0]?.id ?? "");
  const [body, setBody] = useState(JSON.stringify(endpoint.request ?? {}, null, 2));
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState<string | null>(null);

  function pick(id: string) {
    const next = endpoints.find((item) => item.id === id) ?? endpoints[0];
    setEndpointId(next.id);
    setBody(JSON.stringify(next.request ?? {}, null, 2));
    setResult(null);
  }

  async function send() {
    let parsed: Record<string, unknown>;
    try {
      parsed = JSON.parse(body || "{}") as Record<string, unknown>;
      setError(null);
    } catch {
      setError("بدنه‌ی درخواست JSON معتبر نیست؛ ویرگول‌ها و گیومه‌ها را بررسی کنید.");
      return;
    }
    setBusy(true);
    await simulateRequest(Math.min(endpoint.latencyMs, 1600));
    const key = usable.find((item) => item.id === keyId);
    if (!key) {
      setResult({ status: 401, latencyMs: 35, body: { error: { code: "invalid_api_key", message: "کلید معتبری فرستاده نشد." } } });
    } else if (endpoint.keyKind && key.kind !== endpoint.keyKind) {
      setResult({ status: 403, latencyMs: 41, body: { error: { code: "key_kind_not_allowed", message: `این نشانی کلید «${apiKeyKindLabels[endpoint.keyKind]}» می‌خواهد.` } } });
    } else {
      const external = typeof parsed.model === "string" && !/qwen|llama|internal|auto/i.test(parsed.model);
      const response = endpoint.response as Record<string, unknown>;
      const rerouted = offline && external;
      setResult({
        status: 200, latencyMs: endpoint.latencyMs + (body.length % 97), tokens: endpoint.tokens,
        body: rerouted ? { ...response, model: "qwen-internal" } : endpoint.id === "chat" && typeof parsed.model === "string" ? { ...response, model: parsed.model } : response,
        note: rerouted ? "اینترنت سازمان قطع است؛ درخواست به مدل داخلی Qwen سپرده شد." : undefined,
      });
    }
    setBusy(false);
  }

  const endpointItems = endpoints.map((item) => ({ value: item.id, label: `${item.method} ${item.path}` }));
  const keyItems = usable.map((key) => ({ value: key.id, label: `${key.name} (…${key.last4})` }));

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <form noValidate className="flex flex-col gap-4" onSubmit={(event) => { event.preventDefault(); void send(); }}>
        <Field>
          <FieldLabel htmlFor="pg-endpoint">نشانی</FieldLabel>
          <Select items={endpointItems} value={endpointId} onValueChange={(value) => value && pick(String(value))}>
            <SelectTrigger id="pg-endpoint"><SelectValue /></SelectTrigger>
            <SelectContent><SelectGroup>{endpointItems.map((item) => <SelectItem key={item.value} value={item.value}><bdi dir="ltr">{item.label}</bdi></SelectItem>)}</SelectGroup></SelectContent>
          </Select>
        </Field>
        <Field>
          <FieldLabel htmlFor="pg-key">کلید</FieldLabel>
          <Select items={keyItems} value={keyId || null} onValueChange={(value) => value && setKeyId(String(value))}>
            <SelectTrigger id="pg-key"><SelectValue placeholder="کلید فعالی ندارید" /></SelectTrigger>
            <SelectContent><SelectGroup>{keyItems.map((item) => <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>)}</SelectGroup></SelectContent>
          </Select>
        </Field>
        <Field data-invalid={error ? true : undefined}>
          <FieldLabel htmlFor="pg-body">بدنه‌ی درخواست (JSON)</FieldLabel>
          <Textarea id="pg-body" dir="ltr" rows={12} spellCheck={false} className="font-mono text-caption" value={body} aria-invalid={Boolean(error)} onChange={(event) => setBody(event.target.value)} />
          {error ? <FieldError>{error}</FieldError> : null}
        </Field>
        <Button type="submit" loading={busy} className="w-fit"><SendIcon aria-hidden className="rtl:-scale-x-100" />ارسال درخواست</Button>
      </form>
      <div className="flex min-w-0 flex-col gap-3" aria-live="polite">
        <h3 className="text-h4">پاسخ</h3>
        {result ? (
          <>
            <div className="flex flex-wrap gap-2">
              <Badge variant={result.status === 200 ? "success" : "destructive"}><bdi dir="ltr">{result.status}</bdi></Badge>
              <Badge variant="outline">{formatNumber(result.latencyMs)} میلی‌ثانیه</Badge>
              {result.tokens ? <Badge variant="secondary">ورودی {formatNumber(result.tokens.input)} · خروجی {formatNumber(result.tokens.output)} توکن</Badge> : null}
            </div>
            {result.note ? <p className="text-body-sm text-muted-foreground">{result.note}</p> : null}
            <CodeBlock code={JSON.stringify(result.body, null, 2)} label="پاسخ" />
          </>
        ) : <p className="rounded-xl border border-dashed p-4 text-body-sm text-muted-foreground">درخواست را بفرستید تا پاسخ، زمان پاسخ و توکن مصرفی اینجا دیده شود.</p>}
      </div>
    </div>
  );
}

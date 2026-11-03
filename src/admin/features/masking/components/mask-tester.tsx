"use client";

import { useState } from "react";
import { ShieldAlertIcon, ShieldCheckIcon } from "lucide-react";
import { applyMasks, usePolicies } from "@/lib/policy-store";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { sampleTestText } from "../lib/fields";

type Result = ReturnType<typeof applyMasks>;

/** Highlights the tokens of a masked text. */
function Masked({ text }: { text: string }) {
  return (
    <p className="whitespace-pre-wrap rounded-lg border border-border bg-muted/40 p-3 text-body-sm leading-7">
      {text.split(/(\[[^\]]+\])/).map((part, i) =>
        /^\[[^\]]+\]$/.test(part) ? (
          <mark key={i} className="rounded bg-primary/10 px-1 text-primary">{part}</mark>
        ) : (
          <span key={i}>{part}</span>
        ),
      )}
    </p>
  );
}

/** «آزمایش»: paste a text and see what an external model would receive. */
export function MaskTester() {
  const { maskFields } = usePolicies();
  const [text, setText] = useState(sampleTestText);
  const [result, setResult] = useState<Result | null>(null);

  return (
    <section className="flex flex-col gap-4" aria-labelledby="mask-test-title">
      <div className="flex flex-col gap-1">
        <h2 id="mask-test-title" className="text-h4">آزمایش پوشاندن</h2>
        <p className="text-body-sm text-muted-foreground">متنی بنویسید یا بچسبانید تا ببینید پیش از رفتن به مدل بیرونی چه می‌شود.</p>
      </div>
      <Field>
        <FieldLabel htmlFor="mask-test-text">متن آزمایشی</FieldLabel>
        <Textarea id="mask-test-text" rows={4} value={text} onChange={(e) => { setText(e.target.value); setResult(null); }} />
      </Field>
      <div>
        <Button disabled={!text.trim()} onClick={() => setResult(applyMasks(text, maskFields))}>آزمایش</Button>
      </div>
      {result ? (
        <div className="flex flex-col gap-3" aria-live="polite">
          {result.internalOnly ? (
            <Alert variant="warning">
              <ShieldAlertIcon aria-hidden />
              <AlertTitle>این متن به مدل بیرونی نمی‌رود</AlertTitle>
              <AlertDescription>
                داده‌ی ممنوع دارد ({[...new Set(result.found.filter((f) => f.action === "internal-only").map((f) => f.label))].join("، ")})؛ فقط مدل داخلی پاسخ می‌دهد.
              </AlertDescription>
            </Alert>
          ) : (
            <Alert variant="success">
              <ShieldCheckIcon aria-hidden />
              <AlertTitle>{result.found.length ? `${result.found.length.toLocaleString("fa-IR")} مورد پوشانده شد` : "داده‌ی حساسی پیدا نشد"}</AlertTitle>
              <AlertDescription>متن زیر می‌تواند به مدل بیرونی برود؛ پاسخ پیش از نمایش به مقدارهای واقعی برگردانده می‌شود.</AlertDescription>
            </Alert>
          )}
          <Masked text={result.masked} />
          {result.found.length ? (
            <ul className="flex flex-wrap gap-2" aria-label="موارد پیدا‌شده">
              {result.found.map((f, i) => (
                <li key={i}>
                  <Badge variant={f.action === "replace" ? "outline" : "destructive"}>
                    {f.label}: <bdi dir="ltr">{f.value}</bdi>
                  </Badge>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}

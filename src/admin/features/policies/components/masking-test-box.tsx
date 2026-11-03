"use client";

import { useState } from "react";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { maskWithPolicy } from "@/lib/masking";
import type { Policies } from "@/lib/policies";

/** Shows what a model would receive for a sample text. The text is never stored. */
export function MaskingTestBox({ masking }: { masking: Policies["masking"] }) {
  const [text, setText] = useState("");
  const result = maskWithPolicy(text, masking);
  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-h4 text-foreground">آزمایش پنهان‌سازی</h2>
      <Field>
        <FieldLabel htmlFor="mask-test">متن نمونه</FieldLabel>
        <Textarea id="mask-test" value={text} placeholder="مثلاً: کد ملی من ۰۰۱۲۳۴۵۶۷۸ است" onChange={(e) => setText(e.target.value)} />
        <FieldDescription>نتیجه با تنظیم‌های بالا (حتی ذخیره‌نشده) محاسبه می‌شود و متن شما جایی نگه داشته نمی‌شود.</FieldDescription>
      </Field>
      <div className="flex flex-col gap-1" aria-live="polite">
        <span className="text-label text-foreground">آنچه مدل می‌بیند</span>
        <p className="min-h-12 whitespace-pre-wrap rounded-lg border border-border bg-muted/40 p-3 text-body-sm">
          {text.trim() ? result.masked : "برای دیدن نتیجه، متنی بنویسید."}
        </p>
        {text.trim() ? <span className="text-caption text-muted-foreground">{result.count === 0 ? "موردی برای پنهان‌کردن پیدا نشد." : `${result.count} مورد پنهان شد.`}</span> : null}
      </div>
    </section>
  );
}

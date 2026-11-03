"use client";

import { useState } from "react";
import { FlaskConicalIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { useModels } from "@/admin/features/models/hooks/use-models";
import { pickModel, type RoutePick, type SmartRouter } from "@/lib/smart-routing";

/** Try a sample question and see which model this router would choose, and why. */
export function RouterTestPanel({ router }: { router: SmartRouter }) {
  const { models, providers } = useModels();
  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState<RoutePick | null>(null);

  function test() {
    const routable = models
      .filter((m) => m.enabled)
      .map((m) => ({ id: m.id, name: m.displayName, isAvailable: providers.find((p) => p.id === m.providerId)?.status !== "unavailable", supportsImages: m.supportsImages, supportsTools: m.supportsTools }));
    setResult(pickModel(router, routable, prompt));
  }

  return (
    <div className="flex flex-col gap-3">
      <Field>
        <FieldLabel htmlFor="router-test">پرسش نمونه</FieldLabel>
        <Textarea id="router-test" rows={3} value={prompt} onChange={(event) => { setPrompt(event.target.value); setResult(null); }} placeholder="مثلاً: این قرارداد را تحلیل کن و ریسک‌هایش را بگو" />
        <FieldDescription>فقط مدل‌های فعال این مسیریاب که الان در دسترس‌اند در نظر گرفته می‌شوند.</FieldDescription>
      </Field>
      <Button type="button" variant="outline" className="w-fit" disabled={!prompt.trim()} onClick={test}><FlaskConicalIcon aria-hidden />آزمایش مسیریاب</Button>
      {result ? <p role="status" className="rounded-lg border bg-muted/40 p-3 text-body-sm">{result.reason}</p> : null}
    </div>
  );
}

"use client";

import { useState } from "react";
import { PencilIcon, Trash2Icon } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { maskFieldLabels, maskFields, type CustomPhrase, type Policies } from "@/lib/policies";
import { validatePhrase } from "../lib/phrase-form";
import { MaskingTestBox } from "./masking-test-box";
import { usePolicies } from "./policies-provider";

const sameMasking = (a: Policies["masking"], b: Policies["masking"]) => JSON.stringify(a) === JSON.stringify(b);

/** Built-in fields, the admin's own phrases, and a test box. Changes apply when saved. */
export function MaskingTab() {
  const { policies, savePolicies, saving } = usePolicies();
  const [draft, setDraft] = useState<Policies["masking"]>(policies.masking);
  const [phrase, setPhrase] = useState("");
  const [withNumber, setWithNumber] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState<string | undefined>();
  const unchanged = sameMasking(draft, policies.masking);

  function submitPhrase() {
    const problem = validatePhrase(phrase, draft.phrases, editingId ?? undefined);
    setError(problem);
    if (problem) return;
    const entry: CustomPhrase = { id: editingId ?? `phrase-${Date.now().toString(36)}`, phrase: phrase.trim(), withNumber };
    setDraft((d) => ({ ...d, phrases: editingId ? d.phrases.map((p) => (p.id === editingId ? entry : p)) : [...d.phrases, entry] }));
    toast.success(editingId ? "عبارت ویرایش شد؛ برای اعمال ذخیره کنید." : "عبارت اضافه شد؛ برای اعمال ذخیره کنید.");
    setPhrase("");
    setWithNumber(true);
    setEditingId(null);
  }

  async function save() {
    if (await savePolicies({ ...policies, masking: draft })) toast.success("پنهان‌سازی ذخیره شد.");
    else toast.error("ذخیره نشد؛ دوباره تلاش کنید.");
  }

  return (
    <div className="flex flex-col gap-8">
      <p className="max-w-reading text-body-sm text-muted-foreground">
        هر مورد زیر پیش از رسیدن پیام به مدل با یک نشانه عوض می‌شود. کاربر پاسخ را با مقدارهای اصلی می‌بیند.
      </p>
      <section className="flex flex-col gap-3">
        <h2 className="text-h4 text-foreground">فیلدهای آماده</h2>
        <ul className="flex flex-col divide-y rounded-xl border bg-card">
          {maskFields.map((field) => (
            <li key={field} className="flex min-h-12 items-center justify-between gap-3 px-4 py-2">
              <label htmlFor={`mask-${field}`} className="text-label text-foreground">{maskFieldLabels[field]}</label>
              <Switch id={`mask-${field}`} checked={draft.fields[field]} onCheckedChange={(on) => setDraft((d) => ({ ...d, fields: { ...d.fields, [field]: on } }))} />
            </li>
          ))}
        </ul>
      </section>
      <section className="flex flex-col gap-3">
        <h2 className="text-h4 text-foreground">عبارت‌های دلخواه</h2>
        <form noValidate className="flex flex-col gap-3 rounded-xl border bg-card p-4" onSubmit={(e) => { e.preventDefault(); submitPhrase(); }}>
          <Field data-invalid={error ? true : undefined}>
            <FieldLabel htmlFor="mask-phrase">{editingId ? "ویرایش عبارت" : "عبارت تازه"}</FieldLabel>
            <Input id="mask-phrase" value={phrase} placeholder="مثلاً بودجه‌ی شرکت" aria-invalid={error ? true : undefined} onChange={(e) => { setPhrase(e.target.value); setError(undefined); }} />
            <FieldError>{error}</FieldError>
          </Field>
          <label className="flex min-h-10 items-center gap-2 text-body-sm">
            <Checkbox checked={withNumber} onCheckedChange={(on) => setWithNumber(Boolean(on))} aria-label="عددِ کنار آن هم پنهان شود" />
            عددِ کنار آن هم پنهان شود
          </label>
          <div className="flex flex-wrap gap-2">
            <Button type="submit" variant="outline" className="min-h-10">{editingId ? "ثبت ویرایش" : "افزودن"}</Button>
            {editingId ? <Button type="button" variant="ghost" className="min-h-10" onClick={() => { setEditingId(null); setPhrase(""); setError(undefined); }}>انصراف</Button> : null}
          </div>
        </form>
        {draft.phrases.length === 0 ? (
          <p className="text-body-sm text-muted-foreground">هنوز عبارتی اضافه نشده.</p>
        ) : (
          <ul className="flex flex-col divide-y rounded-xl border bg-card">
            {draft.phrases.map((p) => (
              <li key={p.id} className="flex min-h-12 flex-wrap items-center justify-between gap-2 px-4 py-2">
                <span className="flex flex-col"><span className="text-label text-foreground">{p.phrase}</span><span className="text-caption text-muted-foreground">{p.withNumber ? "با عددِ کنارش" : "فقط خود عبارت"}</span></span>
                <span className="flex gap-1">
                  <Button variant="ghost" size="icon" className="size-10" aria-label={`ویرایش ${p.phrase}`} onClick={() => { setEditingId(p.id); setPhrase(p.phrase); setWithNumber(p.withNumber); setError(undefined); }}><PencilIcon aria-hidden /></Button>
                  <Button variant="ghost" size="icon" className="size-10" aria-label={`حذف ${p.phrase}`} onClick={() => setDraft((d) => ({ ...d, phrases: d.phrases.filter((x) => x.id !== p.id) }))}><Trash2Icon aria-hidden /></Button>
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
      <div><Button className="min-h-10" loading={saving} disabled={unchanged} onClick={save}>ذخیره</Button></div>
      <MaskingTestBox masking={draft} />
    </div>
  );
}

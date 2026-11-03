"use client";

import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatBytes } from "@/admin/lib/format";
import { simulateRequest } from "@/lib/simulate-request";
import { useDocuments } from "../../hooks/use-documents";
import { languageLabel } from "../../lib/detect-language";
import { sourceOf } from "../../lib/selectors";
import { validateDocName } from "../../lib/validation";
import type { DocLanguage, DocumentRecord } from "../../types";

const languages = (Object.keys(languageLabel) as DocLanguage[]).map((v) => ({ value: v, label: languageLabel[v] }));

export function InfoTab({ doc }: { doc: DocumentRecord }) {
  const { updateDocument, sources } = useDocuments();
  const [name, setName] = useState(doc.name);
  const [language, setLanguage] = useState<DocLanguage>(doc.language);
  const [confidential, setConfidential] = useState(doc.confidential);
  const [error, setError] = useState<string>();
  const [saving, setSaving] = useState(false);
  const unchanged = name === doc.name && language === doc.language && confidential === doc.confidential;

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (saving || unchanged) return;
    const err = validateDocName(name);
    setError(err);
    if (err) return;
    setSaving(true);
    await simulateRequest();
    updateDocument(doc.id, { name, language, confidential });
    setSaving(false);
    toast.success("اطلاعات سند به‌روز شد.");
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
      <FieldGroup className="md:grid md:grid-cols-2 md:gap-x-4">
        <Field data-invalid={error ? true : undefined}>
          <FieldLabel htmlFor="doc-name">نام سند</FieldLabel>
          <Input
            id="doc-name"
            autoComplete="off"
            value={name}
            disabled={saving}
            aria-invalid={error ? true : undefined}
            onChange={(e) => setName(e.target.value)}
            onBlur={() => setError(validateDocName(name))}
          />
          <FieldError>{error}</FieldError>
        </Field>
        <Field>
          <FieldLabel htmlFor="doc-language">زبان</FieldLabel>
          <Select items={languages} value={language} disabled={saving} onValueChange={(v) => setLanguage(v as DocLanguage)}>
            <SelectTrigger id="doc-language" className="w-full"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {languages.map((l) => <SelectItem key={l.value} value={l.value}>{l.label}</SelectItem>)}
              </SelectGroup>
            </SelectContent>
          </Select>
          <FieldDescription>زبان از روی سند تشخیص داده شده؛ اگر درست نیست اصلاحش کنید.</FieldDescription>
        </Field>
        <Field>
          <FieldLabel htmlFor="doc-file">نام فایل اصلی</FieldLabel>
          <Input id="doc-file" dir="ltr" readOnly className="text-start" value={doc.fileName} />
        </Field>
        <Field>
          <FieldLabel htmlFor="doc-meta">حجم و منبع</FieldLabel>
          <Input id="doc-meta" readOnly value={`${formatBytes(doc.sizeBytes)} · ${sourceOf(doc, sources)?.name ?? "بارگذاری دستی"}`} />
        </Field>
        <Field orientation="horizontal" className="md:col-span-2">
          <Checkbox
            id="doc-confidential"
            aria-label="محرمانه"
            checked={confidential}
            disabled={saving}
            onCheckedChange={(c) => setConfidential(Boolean(c))}
          />
          <div className="flex flex-col gap-0.5">
            <FieldLabel htmlFor="doc-confidential">محرمانه</FieldLabel>
            <FieldDescription>سند محرمانه فقط برای گروه‌ها و کاربرانی دیده می‌شود که صریحاً در تب «دسترسی» اضافه شده‌اند.</FieldDescription>
          </div>
        </Field>
      </FieldGroup>
      <div><Button type="submit" loading={saving} disabled={unchanged}>ذخیره</Button></div>
    </form>
  );
}

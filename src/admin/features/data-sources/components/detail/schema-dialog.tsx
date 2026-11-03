"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { hasSchemaErrors, validateSchema, type SchemaErrors } from "../../lib/schema-form";
import type { DataSchema, SchemaInput, SourceTable } from "../../types";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Schema being edited, or null for a new one. */
  schema: DataSchema | null;
  siblings: DataSchema[];
  tables: SourceTable[];
  onSubmit: (input: SchemaInput) => void;
};

/** Form of the dialog; it is mounted fresh on each opening, so its state starts clean. */
function SchemaForm({ onOpenChange, schema, siblings, tables, onSubmit }: Omit<Props, "open">) {
  const [name, setName] = useState(schema?.name ?? "");
  const [description, setDescription] = useState(schema?.description ?? "");
  const [tableIds, setTableIds] = useState<string[]>(schema?.tableIds ?? []);
  const [rowFilter, setRowFilter] = useState(schema?.rowFilter ?? "");
  const [confidential, setConfidential] = useState(schema?.confidential ?? false);
  const [errors, setErrors] = useState<SchemaErrors>({});
  const missing = tableIds.filter((id) => !tables.some((t) => t.id === id));

  function submit() {
    const found = validateSchema({ name, description, tableIds }, siblings, schema?.id);
    setErrors(found);
    if (!hasSchemaErrors(found)) onSubmit({ name, description, tableIds, rowFilter, confidential });
  }
  const toggle = (id: string, on: boolean) => {
    setTableIds((ids) => (on ? [...ids, id] : ids.filter((x) => x !== id)));
    setErrors((e) => ({ ...e, tables: undefined }));
  };

  return (
    <form noValidate onSubmit={(event) => { event.preventDefault(); submit(); }} className="grid gap-4">
      <Field data-invalid={errors.name ? true : undefined}>
        <FieldLabel htmlFor="schema-name">نام اسکیما</FieldLabel>
        <Input id="schema-name" value={name} aria-invalid={Boolean(errors.name)} placeholder="مثلاً فروش" onChange={(e) => { setName(e.target.value); setErrors((x) => ({ ...x, name: undefined })); }} />
        <FieldError>{errors.name}</FieldError>
      </Field>
      <Field>
        <FieldLabel htmlFor="schema-description">توضیح (اختیاری)</FieldLabel>
        <Textarea id="schema-description" value={description} onChange={(e) => setDescription(e.target.value)} />
      </Field>
      <fieldset className="flex flex-col gap-2" aria-describedby={errors.tables ? "schema-tables-error" : undefined}>
        <legend className="mb-2 text-label text-foreground">جدول‌های اسکیما</legend>
        <ul className="flex max-h-64 flex-col overflow-y-auto rounded-lg border border-border">
          {[...tables.map((t) => ({ id: t.id, name: t.name, gone: false })), ...missing.map((id) => ({ id, name: id, gone: true }))].map((t) => (
            <li key={t.id} className="flex min-h-10 items-center gap-3 border-b border-border px-3 last:border-b-0">
              <Checkbox id={`schema-table-${t.id}`} checked={tableIds.includes(t.id)} onCheckedChange={(on) => toggle(t.id, Boolean(on))} />
              <label htmlFor={`schema-table-${t.id}`} className="flex flex-1 flex-wrap items-center gap-2 py-2 text-body-sm">
                <bdi dir="ltr">{t.name}</bdi>
                {t.gone ? <span className="text-caption text-destructive">دیگر در پایگاه نیست</span> : null}
              </label>
            </li>
          ))}
        </ul>
        {errors.tables ? <p id="schema-tables-error" role="alert" className="text-body-sm text-destructive">{errors.tables}</p> : null}
      </fieldset>
      <Field>
        <FieldLabel htmlFor="schema-row-filter">فیلتر سطری (اختیاری)</FieldLabel>
        <Input id="schema-row-filter" value={rowFilter} placeholder="مثلاً فقط خط‌های ۱ و ۲" onChange={(e) => setRowFilter(e.target.value)} />
        <FieldDescription>خالی یعنی همه‌ی سطرهای جدول‌های این اسکیما.</FieldDescription>
      </Field>
      <Field orientation="horizontal">
        <Checkbox id="schema-confidential" checked={confidential} onCheckedChange={(on) => setConfidential(Boolean(on))} />
        <div className="flex flex-col gap-0.5">
          <FieldLabel htmlFor="schema-confidential">محرمانه</FieldLabel>
          <FieldDescription>داده‌ی این اسکیما فقط با مدل‌های داخلی (سلف‌هاست) کار می‌کند، نه مدل خارجی.</FieldDescription>
        </div>
      </Field>
      <DialogFooter>
        <Button type="submit">{schema ? "ذخیره" : "ساخت"}</Button>
        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>انصراف</Button>
      </DialogFooter>
    </form>
  );
}

export function SchemaDialog({ open, onOpenChange, ...rest }: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{rest.schema ? "ویرایش اسکیما" : "اسکیمای تازه"}</DialogTitle>
          <DialogDescription>اسکیما مجموعه‌ای از جدول‌های همین پایگاه است که می‌توانید دسترسی را فقط به آن بدهید.</DialogDescription>
        </DialogHeader>
        {open ? <SchemaForm onOpenChange={onOpenChange} {...rest} /> : null}
      </DialogContent>
    </Dialog>
  );
}

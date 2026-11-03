"use client";

import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { SearchableSelect } from "@/components/shared/searchable-select";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useDirectory } from "@/admin/features/user-management/hooks/use-directory";
import { useDataSources } from "../../hooks/use-data-sources";
import type { AccessSchema, DataSource, SchemaGrant, SourceTable } from "../../types";

type SchemaDialogProps = {
  source: DataSource;
  tables: SourceTable[];
  /** The schema being edited; null defines a new one. */
  schema: AccessSchema | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

function SchemaForm({ source, tables, schema, onClose }: Omit<SchemaDialogProps, "open" | "onOpenChange"> & { onClose: () => void }) {
  const { saveAccessSchema } = useDataSources();
  const [name, setName] = useState(schema?.name ?? "");
  const [description, setDescription] = useState(schema?.description ?? "");
  const [tableIds, setTableIds] = useState<string[]>(schema?.tableIds ?? []);
  const [confidential, setConfidential] = useState(schema?.confidential ?? false);
  const [error, setError] = useState("");

  const toggle = (id: string, on: boolean) =>
    setTableIds((ids) => (on ? [...ids, id] : ids.filter((x) => x !== id)));

  function submit(event: FormEvent) {
    event.preventDefault();
    const result = saveAccessSchema(source.id, { id: schema?.id, name, description: description.trim(), tableIds, confidential });
    if (!result.ok) {
      setError(result.error);
      return;
    }
    toast.success(schema ? "اسکیما ذخیره شد." : "اسکیما تعریف شد.");
    onClose();
  }

  return (
    <form onSubmit={submit} noValidate className="flex flex-col gap-6">
      <FieldGroup className="max-h-[60vh] overflow-y-auto pe-1">
        <Field data-invalid={error ? true : undefined}>
          <FieldLabel htmlFor="schema-name">نام اسکیما</FieldLabel>
          <Input id="schema-name" dir="ltr" placeholder="production" value={name} aria-invalid={error ? true : undefined}
            onChange={(e) => { setName(e.target.value); setError(""); }} />
          {error ? <FieldError>{error}</FieldError> : null}
        </Field>
        <Field>
          <FieldLabel htmlFor="schema-desc">توضیح</FieldLabel>
          <Textarea id="schema-desc" rows={2} value={description} onChange={(e) => setDescription(e.target.value)} />
        </Field>
        <Field>
          <FieldLabel>جدول‌های این اسکیما</FieldLabel>
          <ul className="flex flex-col divide-y divide-border rounded-lg border border-border">
            {tables.map((t) => (
              <li key={t.id}>
                <label className="flex cursor-pointer items-center gap-3 p-3">
                  <Checkbox checked={tableIds.includes(t.id)} onCheckedChange={(v) => { toggle(t.id, v === true); setError(""); }} />
                  <bdi dir="ltr">{t.name}</bdi>
                </label>
              </li>
            ))}
          </ul>
        </Field>
        <label className="flex cursor-pointer items-center gap-3">
          <Checkbox checked={confidential} onCheckedChange={(v) => setConfidential(v === true)} />
          <span>محرمانه (فقط با دسترسی صریح قابل استفاده است)</span>
        </label>
      </FieldGroup>
      <DialogFooter>
        <Button type="submit">{schema ? "ذخیره" : "تعریف اسکیما"}</Button>
        <Button type="button" variant="outline" onClick={onClose}>انصراف</Button>
      </DialogFooter>
    </form>
  );
}

export function SchemaDialog(props: SchemaDialogProps) {
  const { open, onOpenChange, schema } = props;
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{schema ? "ویرایش اسکیما" : "تعریف اسکیمای جدید"}</DialogTitle>
          <DialogDescription>جدول‌هایی را که با هم به یک گروه یا کاربر داده می‌شوند انتخاب کنید.</DialogDescription>
        </DialogHeader>
        {open ? <SchemaForm {...props} onClose={() => onOpenChange(false)} /> : null}
      </DialogContent>
    </Dialog>
  );
}

type GrantDialogProps = {
  source: DataSource;
  schema: AccessSchema | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const subjectTypes = [
  { value: "group", label: "گروه" },
  { value: "user", label: "کاربر" },
];

function GrantForm({ source, schema, onClose }: { source: DataSource; schema: AccessSchema; onClose: () => void }) {
  const { setSchemaGrant } = useDataSources();
  const { users, groups } = useDirectory();
  const [type, setType] = useState<SchemaGrant["subjectType"]>("group");
  const [subjectId, setSubjectId] = useState<string | null>(null);
  const [rowFilter, setRowFilter] = useState("");
  const [error, setError] = useState("");

  const taken = new Set(schema.grants.filter((g) => g.subjectType === type).map((g) => g.subjectId));
  const items = (type === "group"
    ? groups.filter((g) => g.status === "active").map((g) => ({ value: g.id, label: g.name }))
    : users.filter((u) => u.status === "active").map((u) => ({ value: u.id, label: u.name, hint: u.email }))
  ).filter((i) => !taken.has(i.value));

  function submit(event: FormEvent) {
    event.preventDefault();
    if (!subjectId) {
      setError(type === "group" ? "یک گروه انتخاب کنید." : "یک کاربر انتخاب کنید.");
      return;
    }
    setSchemaGrant(source.id, schema.id, { subjectType: type, subjectId, rowFilter: rowFilter.trim() });
    toast.success("دسترسی فقط‌خواندنی افزوده شد.");
    onClose();
  }

  return (
    <form onSubmit={submit} noValidate className="flex flex-col gap-6">
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="grant-type">دسترسی برای</FieldLabel>
          <Select items={subjectTypes} value={type} onValueChange={(v) => { setType(v as SchemaGrant["subjectType"]); setSubjectId(null); setError(""); }}>
            <SelectTrigger id="grant-type" className="w-full"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {subjectTypes.map((t) => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}
              </SelectGroup>
            </SelectContent>
          </Select>
        </Field>
        <Field data-invalid={error ? true : undefined}>
          <FieldLabel htmlFor="grant-subject">{type === "group" ? "گروه" : "کاربر"}</FieldLabel>
          <SearchableSelect
            id="grant-subject"
            items={items}
            value={subjectId}
            onValueChange={(v) => { setSubjectId(v); setError(""); }}
            placeholder={type === "group" ? "انتخاب گروه" : "انتخاب کاربر"}
            searchPlaceholder="جستجو"
            emptyText="موردی پیدا نشد."
          />
          {error ? <FieldError>{error}</FieldError> : null}
        </Field>
        <Field>
          <FieldLabel htmlFor="grant-filter">فیلتر سطری (اختیاری)</FieldLabel>
          <Input id="grant-filter" placeholder="مثلاً فقط خط‌های ۱ و ۲" value={rowFilter} onChange={(e) => setRowFilter(e.target.value)} />
        </Field>
        <p className="text-body-sm text-muted-foreground">دسترسی همیشه فقط‌خواندنی است.</p>
      </FieldGroup>
      <DialogFooter>
        <Button type="submit">افزودن دسترسی</Button>
        <Button type="button" variant="outline" onClick={onClose}>انصراف</Button>
      </DialogFooter>
    </form>
  );
}

export function GrantDialog({ source, schema, open, onOpenChange }: GrantDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>دسترسی به اسکیمای <bdi dir="ltr">{schema?.name}</bdi></DialogTitle>
          <DialogDescription>یک گروه یا کاربر را با دسترسی فقط‌خواندنی به این اسکیما اضافه کنید.</DialogDescription>
        </DialogHeader>
        {open && schema ? <GrantForm key={schema.id} source={source} schema={schema} onClose={() => onOpenChange(false)} /> : null}
      </DialogContent>
    </Dialog>
  );
}

"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export type FormField = {
  name: string;
  label: string;
  kind?: "text" | "textarea" | "select" | "date" | "time" | "number";
  options?: { value: string; label: string }[];
  required?: boolean;
  placeholder?: string;
  /** Technical text such as a hashtag or a code. */
  ltr?: boolean;
  initial?: string;
};

export type FormValues = Record<string, string>;

function Form({ fields, submitLabel, onSubmit }: { fields: FormField[]; submitLabel: string; onSubmit: (values: FormValues) => void }) {
  const [values, setValues] = useState<FormValues>(() => Object.fromEntries(fields.map((f) => [f.name, f.initial ?? f.options?.[0]?.value ?? ""])));
  const [invalid, setInvalid] = useState<string[]>([]);
  const set = (name: string, value: string) => { setValues((v) => ({ ...v, [name]: value })); setInvalid((list) => list.filter((n) => n !== name)); };
  function submit(event: FormEvent) {
    event.preventDefault();
    const missing = fields.filter((f) => f.required && !values[f.name]?.trim()).map((f) => f.name);
    if (missing.length) return setInvalid(missing);
    onSubmit(values);
  }
  return (
    <form noValidate onSubmit={submit} className="grid gap-3">
      {fields.map((field) => {
        const id = `fd-${field.name}`;
        const bad = invalid.includes(field.name);
        const common = { id, value: values[field.name], "aria-invalid": bad, placeholder: field.placeholder, dir: field.ltr ? ("ltr" as const) : undefined, className: field.ltr ? "font-mono" : undefined };
        return (
          <Field key={field.name} data-invalid={bad || undefined}>
            <FieldLabel htmlFor={id}>{field.label}</FieldLabel>
            {field.kind === "textarea" ? <Textarea {...common} rows={4} onChange={(e) => set(field.name, e.target.value)} />
              : field.kind === "select" ? (
                <select id={id} value={values[field.name]} onChange={(e) => set(field.name, e.target.value)} className="h-10 w-full rounded-lg border bg-background px-3 text-body-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50">
                  {field.options?.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              ) : <Input {...common} type={field.kind === "date" || field.kind === "time" || field.kind === "number" ? field.kind : "text"} onChange={(e) => set(field.name, e.target.value)} />}
            {bad ? <FieldError>این بخش را پر کنید.</FieldError> : null}
          </Field>
        );
      })}
      <Button type="submit" className="w-fit">{submitLabel}</Button>
    </form>
  );
}

/** A small «create» dialog; the form restarts empty each time it opens. */
export function FormDialog({ open, onOpenChange, title, description, fields, submitLabel, onSubmit }: {
  open: boolean; onOpenChange: (open: boolean) => void; title: string; description?: string; fields: FormField[]; submitLabel: string; onSubmit: (values: FormValues) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader><DialogTitle>{title}</DialogTitle>{description ? <DialogDescription>{description}</DialogDescription> : null}</DialogHeader>
        <Form fields={fields} submitLabel={submitLabel} onSubmit={(values) => { onSubmit(values); onOpenChange(false); }} />
      </DialogContent>
    </Dialog>
  );
}

/** A read-only dialog. */
export function InfoDialog({ open, onOpenChange, title, description, children }: { open: boolean; onOpenChange: (open: boolean) => void; title: string; description?: string; children: ReactNode }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader><DialogTitle>{title}</DialogTitle>{description ? <DialogDescription>{description}</DialogDescription> : null}</DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
}

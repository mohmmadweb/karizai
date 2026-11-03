"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { isHttpAddress } from "@/admin/features/connections/lib/validation";
import type { MlModel, SchemaField } from "../data/ml-models";

type Props = { open: boolean; onOpenChange: (open: boolean) => void; onCreate: (model: MlModel) => void };

/** One field per line: `name: type: label`, for example `stock_kg: number: موجودی`. */
function parseSchema(text: string): SchemaField[] | null {
  const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);
  const fields = lines.map((line) => {
    const [name, type = "number", label] = line.split(":").map((p) => p.trim());
    return /^[a-z_][a-z0-9_]*$/i.test(name ?? "") && ["number", "string", "date"].includes(type) ? { name, type: type as SchemaField["type"], label: label || name, sample: type === "number" ? "1" : "" } : null;
  });
  return fields.length > 0 && fields.every(Boolean) ? (fields as SchemaField[]) : null;
}

export function MlRegisterDialog({ open, onOpenChange, onCreate }: Props) {
  const [v, setV] = useState({ name: "", endpoint: "", owner: "", input: "stock_kg: number: موجودی\ndaily_use_kg: number: مصرف روزانه", output: "days_left: number: روز باقی‌مانده" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const set = (k: keyof typeof v, value: string) => { setV((c) => ({ ...c, [k]: value })); setErrors((e) => ({ ...e, [k]: "" })); };
  function submit() {
    const input = parseSchema(v.input);
    const output = parseSchema(v.output);
    const found: Record<string, string> = {};
    if (!v.name.trim()) found.name = "نام مدل را بنویسید.";
    if (!isHttpAddress(v.endpoint)) found.endpoint = "نشانی باید با http یا https شروع شود.";
    if (!input) found.input = "هر خط به شکل name: number: برچسب باشد.";
    if (!output) found.output = "هر خط به شکل name: number: برچسب باشد.";
    setErrors(found);
    if (Object.values(found).some(Boolean) || !input || !output) return;
    onCreate({ id: `ml-${Date.now()}`, name: v.name.trim(), endpoint: v.endpoint.trim(), ownerUnit: v.owner.trim() || "فناوری اطلاعات", framework: "REST", input, output, active: true });
    onOpenChange(false);
  }
  const field = (k: keyof typeof v, label: string, el: React.ReactNode, help?: string) => (
    <Field data-invalid={errors[k] ? true : undefined}>
      <FieldLabel htmlFor={`mlr-${k}`}>{label}</FieldLabel>
      {el}
      {errors[k] ? <FieldError>{errors[k]}</FieldError> : help ? <FieldDescription>{help}</FieldDescription> : null}
    </Field>
  );
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>ثبت مدل یادگیری ماشین</DialogTitle>
          <DialogDescription>مدل به‌صورت یک endpoint ثبت می‌شود و عامل‌ها و جریان‌ها آن را مثل یک ابزار با ورودی و خروجی مشخص صدا می‌زنند.</DialogDescription>
        </DialogHeader>
        <form noValidate onSubmit={(e) => { e.preventDefault(); submit(); }} className="grid gap-4">
          {field("name", "نام", <Input id="mlr-name" value={v.name} onChange={(e) => set("name", e.target.value)} placeholder="مثلاً پیش‌بینی توقف اکسترودر" />)}
          {field("endpoint", "نشانی endpoint", <Input id="mlr-endpoint" dir="ltr" placeholder="https://" value={v.endpoint} onChange={(e) => set("endpoint", e.target.value)} />)}
          {field("owner", "واحد مالک", <Input id="mlr-owner" value={v.owner} onChange={(e) => set("owner", e.target.value)} placeholder="مثلاً نگهداری و تعمیرات" />)}
          {field("input", "طرح ورودی", <Textarea id="mlr-input" dir="ltr" rows={3} value={v.input} onChange={(e) => set("input", e.target.value)} />, "هر خط یک فیلد: name: number|string|date: برچسب")}
          {field("output", "طرح خروجی", <Textarea id="mlr-output" dir="ltr" rows={2} value={v.output} onChange={(e) => set("output", e.target.value)} />)}
          <DialogFooter>
            <Button type="submit">ثبت</Button>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>انصراف</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

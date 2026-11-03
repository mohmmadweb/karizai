"use client";

import { useState, type FormEvent } from "react";
import type { MaskAction, MaskField } from "@/lib/policy-store";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { compilePattern, detectionOf, listToPattern } from "../lib/fields";

export type RuleInput = Omit<MaskField, "id" | "enabled">;
type Detection = "pattern" | "list";
type Errors = Partial<Record<"label" | "pattern", string>>;

const detectionItems = [
  { value: "pattern", label: "الگو (عبارت باقاعده)" },
  { value: "list", label: "فهرست واژه‌ها" },
];
const actionItems = [
  { value: "replace", label: "جایگزینی با نشانه" },
  { value: "internal-only", label: "ممنوع: فقط مدل داخلی" },
];

function RuleForm({ rule, onSave, onCancel }: { rule?: MaskField; onSave: (r: RuleInput) => void; onCancel: () => void }) {
  const initialList = rule && detectionOf(rule) === "فهرست";
  const [label, setLabel] = useState(rule?.label ?? "");
  const [sample, setSample] = useState(rule?.sample ?? "");
  const [detection, setDetection] = useState<Detection>(initialList ? "list" : "pattern");
  const [pattern, setPattern] = useState(initialList ? "" : (rule?.pattern ?? ""));
  const [words, setWords] = useState(initialList ? (rule?.pattern ?? "").split("|").join("\n") : "");
  const [action, setAction] = useState<MaskAction>(rule?.action ?? "replace");
  const [errors, setErrors] = useState<Errors>({});

  function submit(event: FormEvent) {
    event.preventDefault();
    const finalPattern = detection === "list" ? listToPattern(words.split(/\n|،|,/)) : pattern;
    const next: Errors = {};
    if (!label.trim()) next.label = "نام نوع داده را بنویسید.";
    if (!compilePattern(finalPattern)) next.pattern = detection === "list" ? "دست‌کم یک واژه بنویسید." : "الگو درست نیست؛ یک عبارت باقاعده‌ی معتبر بنویسید.";
    setErrors(next);
    if (Object.keys(next).length) return;
    onSave({ label: label.trim(), sample, pattern: finalPattern, action });
  }

  return (
    <form onSubmit={submit} noValidate className="flex flex-col gap-6">
      <FieldGroup>
        <Field data-invalid={errors.label ? true : undefined}>
          <FieldLabel htmlFor="rule-label">نوع داده</FieldLabel>
          <Input id="rule-label" value={label} placeholder="مثلاً شماره پلاک" aria-invalid={Boolean(errors.label)} onChange={(e) => setLabel(e.target.value)} />
          <FieldDescription>نشانه‌ی جایگزین از همین نام ساخته می‌شود، مثل [{label.trim() || "شماره پلاک"} ۱].</FieldDescription>
          <FieldError>{errors.label}</FieldError>
        </Field>
        <Field>
          <FieldLabel htmlFor="rule-sample">نمونه</FieldLabel>
          <Input id="rule-sample" value={sample} onChange={(e) => setSample(e.target.value)} />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field>
            <FieldLabel htmlFor="rule-detection">روش تشخیص</FieldLabel>
            <Select items={detectionItems} value={detection} onValueChange={(v) => v && setDetection(v as Detection)}>
              <SelectTrigger id="rule-detection" className="w-full"><SelectValue /></SelectTrigger>
              <SelectContent><SelectGroup>{detectionItems.map((i) => <SelectItem key={i.value} value={i.value}>{i.label}</SelectItem>)}</SelectGroup></SelectContent>
            </Select>
          </Field>
          <Field>
            <FieldLabel htmlFor="rule-action">اقدام پیش از مدل بیرونی</FieldLabel>
            <Select items={actionItems} value={action} onValueChange={(v) => v && setAction(v as MaskAction)}>
              <SelectTrigger id="rule-action" className="w-full"><SelectValue /></SelectTrigger>
              <SelectContent><SelectGroup>{actionItems.map((i) => <SelectItem key={i.value} value={i.value}>{i.label}</SelectItem>)}</SelectGroup></SelectContent>
            </Select>
          </Field>
        </div>
        <Field data-invalid={errors.pattern ? true : undefined}>
          {detection === "pattern" ? (
            <>
              <FieldLabel htmlFor="rule-pattern">الگو</FieldLabel>
              <Input id="rule-pattern" dir="ltr" className="text-start font-mono" spellCheck={false} autoComplete="off" value={pattern} aria-invalid={Boolean(errors.pattern)} onChange={(e) => setPattern(e.target.value)} />
            </>
          ) : (
            <>
              <FieldLabel htmlFor="rule-words">واژه‌ها</FieldLabel>
              <Textarea id="rule-words" rows={4} value={words} aria-invalid={Boolean(errors.pattern)} onChange={(e) => setWords(e.target.value)} />
              <FieldDescription>هر واژه در یک خط، مثلاً نام مشتری‌ها.</FieldDescription>
            </>
          )}
          <FieldError>{errors.pattern}</FieldError>
        </Field>
      </FieldGroup>
      <DialogFooter>
        <Button type="submit">{rule ? "ذخیره‌ی قاعده" : "افزودن قاعده"}</Button>
        <Button type="button" variant="outline" onClick={onCancel}>انصراف</Button>
      </DialogFooter>
    </form>
  );
}

type Props = { open: boolean; rule?: MaskField; onOpenChange: (open: boolean) => void; onSave: (rule: RuleInput) => void };

/** Add or edit one masking rule. */
export function RuleDialog({ open, rule, onOpenChange, onSave }: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{rule ? `ویرایش قاعده‌ی «${rule.label}»` : "قاعده‌ی تازه‌ی پوشاندن"}</DialogTitle>
          <DialogDescription>داده‌ای که این قاعده پیدا کند پیش از رفتن به مدل بیرونی پوشانده یا متوقف می‌شود.</DialogDescription>
        </DialogHeader>
        {open ? <RuleForm key={rule?.id ?? "new"} rule={rule} onSave={onSave} onCancel={() => onOpenChange(false)} /> : null}
      </DialogContent>
    </Dialog>
  );
}

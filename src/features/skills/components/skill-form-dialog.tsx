"use client";

import { useRef, useState } from "react";
import { FileUpIcon } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { Skill, SkillContent } from "@/features/agents/types";

type SkillFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** The skill being edited; empty to create. */
  skill?: Skill;
  onSave: (content: SkillContent) => void;
};

const empty: SkillContent = { name: "", description: "", instructions: "" };

/** Create, edit, or import a skill from a text file. The file is only read in the browser. */
export function SkillFormDialog({ open, onOpenChange, skill, onSave }: SkillFormDialogProps) {
  const [values, setValues] = useState<SkillContent>(skill?.pendingEdit ?? skill ?? empty);
  const [errors, setErrors] = useState<Partial<Record<keyof SkillContent, string>>>({});
  const [fileError, setFileError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const set = (key: keyof SkillContent, value: string) => {
    setValues((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
  };

  async function importFile(file: File) {
    setFileError(null);
    if (!/\.(txt|md)$/i.test(file.name)) {
      setFileError("فقط فایل متنی (txt یا md) پذیرفته می‌شود.");
      return;
    }
    const text = (await file.text()).trim();
    if (!text) {
      setFileError("فایل خالی است. فایل دیگری انتخاب کنید.");
      return;
    }
    setValues((current) => ({ ...current, name: current.name || file.name.replace(/\.(txt|md)$/i, ""), instructions: text }));
    setErrors({});
  }

  function submit() {
    const found: typeof errors = {};
    if (!values.name.trim()) found.name = "نام اسکیل را بنویسید.";
    if (!values.instructions.trim()) found.instructions = "دستورالعمل اسکیل را بنویسید.";
    setErrors(found);
    if (Object.keys(found).length > 0) return;
    onSave({ name: values.name.trim(), description: values.description.trim(), instructions: values.instructions.trim() });
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{skill ? "ویرایش اسکیل" : "اسکیل تازه"}</DialogTitle>
          <DialogDescription>
            {skill?.approval === "approved" ? "ویرایش، نسخه‌ی تازه‌ای می‌سازد که باید دوباره تأیید شود؛ تا آن زمان نسخه‌ی فعلی کار می‌کند." : "اسکیل تا تأیید ادمین غیرفعال است."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={(event) => { event.preventDefault(); submit(); }} noValidate className="grid gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <Button type="button" variant="outline" size="sm" onClick={() => fileRef.current?.click()}><FileUpIcon aria-hidden />ورود از فایل</Button>
            <input ref={fileRef} type="file" accept=".txt,.md" hidden onChange={(event) => { const file = event.target.files?.[0]; if (file) void importFile(file); event.target.value = ""; }} />
          </div>
          {fileError ? <Alert variant="destructive"><AlertDescription>{fileError}</AlertDescription></Alert> : null}
          <Field data-invalid={errors.name ? true : undefined}>
            <FieldLabel htmlFor="skill-form-name">نام (اجباری)</FieldLabel>
            <Input id="skill-form-name" value={values.name} onChange={(event) => set("name", event.target.value)} aria-invalid={Boolean(errors.name)} />
            {errors.name ? <FieldError>{errors.name}</FieldError> : null}
          </Field>
          <Field>
            <FieldLabel htmlFor="skill-form-desc">توضیح کاربرد</FieldLabel>
            <Input id="skill-form-desc" value={values.description} onChange={(event) => set("description", event.target.value)} />
            <FieldDescription>این اسکیل برای چه کاری است؟</FieldDescription>
          </Field>
          <Field data-invalid={errors.instructions ? true : undefined}>
            <FieldLabel htmlFor="skill-form-instr">دستورالعمل (اجباری)</FieldLabel>
            <Textarea id="skill-form-instr" rows={6} value={values.instructions} onChange={(event) => set("instructions", event.target.value)} aria-invalid={Boolean(errors.instructions)} />
            {errors.instructions ? <FieldError>{errors.instructions}</FieldError> : null}
          </Field>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>انصراف</Button>
            <Button type="submit">{skill ? "ثبت ویرایش" : "ساخت اسکیل"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

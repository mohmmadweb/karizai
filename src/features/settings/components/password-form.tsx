"use client";

import { useState } from "react";
import { toast } from "sonner";
import { PasswordField } from "@/components/shared/password-field";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { simulateRequest } from "@/lib/simulate-request";

type Errors = { current?: string; next?: string; repeat?: string };

/** Mock form: nothing is checked or kept. */
export function PasswordForm() {
  const [values, setValues] = useState({ current: "", next: "", repeat: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [saving, setSaving] = useState(false);
  const set = (key: keyof Errors, value: string) => {
    setValues((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
  };

  async function submit() {
    const found: Errors = {};
    if (!values.current) found.current = "رمز فعلی را وارد کنید.";
    if (values.next.length < 8) found.next = "رمز تازه باید دست‌کم ۸ نویسه باشد.";
    if (values.repeat !== values.next) found.repeat = "تکرار رمز با رمز تازه یکسان نیست.";
    setErrors(found);
    if (Object.keys(found).length > 0) return;
    setSaving(true);
    await simulateRequest(700);
    setSaving(false);
    setValues({ current: "", next: "", repeat: "" });
    toast.success("رمز عبور تغییر کرد");
  }

  return (
    <form noValidate onSubmit={(event) => { event.preventDefault(); void submit(); }} className="flex max-w-sm flex-col gap-4">
      <FieldGroup>
        {(
          [
            ["current", "رمز فعلی", "current-password"],
            ["next", "رمز تازه", "new-password"],
            ["repeat", "تکرار رمز تازه", "new-password"],
          ] as const
        ).map(([key, label, autoComplete]) => (
          <Field key={key} data-invalid={errors[key] ? true : undefined}>
            <FieldLabel htmlFor={`pw-${key}`}>{label}</FieldLabel>
            <PasswordField id={`pw-${key}`} autoComplete={autoComplete} value={values[key]} onChange={(event) => set(key, event.target.value)} aria-invalid={Boolean(errors[key])} />
            {errors[key] ? <FieldError>{errors[key]}</FieldError> : null}
          </Field>
        ))}
      </FieldGroup>
      <Button type="submit" loading={saving} className="w-fit">تغییر رمز</Button>
    </form>
  );
}

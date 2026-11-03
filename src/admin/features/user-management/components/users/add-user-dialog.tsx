"use client";

import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { PasswordField } from "@/components/shared/password-field";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { SearchableMultiSelect } from "@/components/shared/searchable-multi-select";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { useDirectory } from "../../hooks/use-directory";
import { simulateRequest } from "@/lib/simulate-request";
import {
  validateEmail,
  validatePassword,
  validateUserName,
} from "../../lib/validation";
import { UserFields, type UserFieldErrors, type UserFieldValues } from "./user-fields";

function AddUserForm({ onClose }: { onClose: () => void }) {
  const { addUser, groups } = useDirectory();
  const [groupIds, setGroupIds] = useState<string[]>([]);
  const groupOptions = groups.filter((g) => g.status === "active").map((g) => ({ value: g.id, label: g.name }));
  const [values, setValues] = useState<UserFieldValues>({ name: "", email: "" });
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<UserFieldErrors>({});
  const [passwordError, setPasswordError] = useState<string>();
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (submitting) return;
    const next: UserFieldErrors = {
      name: validateUserName(values.name),
      email: validateEmail(values.email),
    };
    const pw = validatePassword(password);
    setErrors(next);
    setPasswordError(pw);
    if (next.name || next.email || pw) return;
    setSubmitting(true);
    await simulateRequest();
    const result = addUser({ ...values, groupIds });
    setSubmitting(false);
    if (!result.ok) {
      setErrors({ email: result.error });
      return;
    }
    toast.success("کاربر افزوده شد.");
    onClose();
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
      <FieldGroup>
        <UserFields
          idPrefix="add-user"
          values={values}
          errors={errors}
          disabled={submitting}
          onChange={setValues}
          onErrors={setErrors}
        />
        <Field>
          <FieldLabel htmlFor="add-user-groups">گروه‌ها</FieldLabel>
          <SearchableMultiSelect
            id="add-user-groups"
            items={groupOptions}
            value={groupIds}
            disabled={submitting || groupOptions.length === 0}
            onValueChange={setGroupIds}
            placeholder="انتخاب گروه (اختیاری)"
            searchPlaceholder="جست‌وجوی گروه"
            emptyText="گروهی پیدا نشد."
          />
          <FieldDescription>
            {groupOptions.length === 0 ? "هنوز گروه فعالی نیست." : "کاربر همین حالا عضو گروه‌های انتخاب‌شده می‌شود."}
          </FieldDescription>
        </Field>
        <Field data-invalid={passwordError ? true : undefined}>
          <FieldLabel htmlFor="add-user-password">رمز عبور</FieldLabel>
          <PasswordField
            id="add-user-password"
            autoComplete="new-password"
            value={password}
            disabled={submitting}
            aria-invalid={passwordError ? true : undefined}
            onChange={(e) => setPassword(e.target.value)}
            onBlur={() => setPasswordError(validatePassword(password))}
          />
          <FieldError>{passwordError}</FieldError>
        </Field>
      </FieldGroup>
      <DialogFooter>
        <Button type="submit" loading={submitting}>
          افزودن
        </Button>
        <Button type="button" variant="outline" disabled={submitting} onClick={onClose}>
          انصراف
        </Button>
      </DialogFooter>
    </form>
  );
}

type AddUserDialogProps = { open: boolean; onOpenChange: (open: boolean) => void };

export function AddUserDialog({ open, onOpenChange }: AddUserDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>افزودن کاربر</DialogTitle>
          <DialogDescription>
            نام، ایمیل، رمز عبور و در صورت نیاز گروه‌های کاربر تازه را وارد کنید.
          </DialogDescription>
        </DialogHeader>
        <AddUserForm onClose={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  );
}

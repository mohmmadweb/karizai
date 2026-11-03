"use client";

import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { FieldGroup } from "@/components/ui/field";
import { useDirectory } from "../../hooks/use-directory";
import { simulateRequest } from "@/lib/simulate-request";
import { validateEmail, validateUserName } from "../../lib/validation";
import type { User } from "../../types";
import { StatusToggle } from "../status-toggle";
import { UserFields, type UserFieldErrors, type UserFieldValues } from "./user-fields";

export function UserInfoTab({ user }: { user: User }) {
  const { updateUser, setUserStatus } = useDirectory();
  const [values, setValues] = useState<UserFieldValues>({
    name: user.name,
    email: user.email,
  });
  const [errors, setErrors] = useState<UserFieldErrors>({});
  const [saving, setSaving] = useState(false);
  const unchanged = values.name === user.name && values.email === user.email;

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (saving || unchanged) return;
    const next = {
      name: validateUserName(values.name),
      email: validateEmail(values.email),
    };
    setErrors(next);
    if (next.name || next.email) return;
    setSaving(true);
    await simulateRequest();
    const result = updateUser(user.id, values);
    setSaving(false);
    if (!result.ok) {
      setErrors({ email: result.error });
      return;
    }
    toast.success("اطلاعات کاربر به‌روز شد.");
  }

  return (
    <div className="flex flex-col gap-10">
      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
        <FieldGroup>
          <UserFields
            idPrefix="edit-user"
            values={values}
            errors={errors}
            disabled={saving}
            onChange={setValues}
            onErrors={setErrors}
          />
        </FieldGroup>
        <div>
          <Button type="submit" loading={saving} disabled={unchanged}>
            ذخیره
          </Button>
        </div>
      </form>
      <section className="flex flex-col gap-3 border-t border-border pt-8">
        <h2 className="text-h4 text-foreground">وضعیت کاربر</h2>
        <p className="text-body-sm text-muted-foreground">
          کاربر هرگز حذف نمی‌شود. کاربر غیرفعال را می‌شود دوباره فعال کرد.
        </p>
        <StatusToggle
          noun="کاربر"
          name={user.name}
          active={user.status === "active"}
          consequence="این کاربر دیگر نمی‌تواند وارد شود، ولی گزارش مصرف و چت‌هایش برای ادمین می‌ماند."
          blockedReason={
            user.role === "admin" ? "ادمین نمی‌تواند خودش را غیرفعال کند." : undefined
          }
          onChange={(active) => setUserStatus(user.id, active)}
        />
      </section>
    </div>
  );
}

"use client";

import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { FieldGroup } from "@/components/ui/field";
import { useDirectory } from "../../hooks/use-directory";
import { simulateRequest } from "@/lib/simulate-request";
import { validateGroupName } from "../../lib/validation";
import type { Group } from "../../types";
import { StatusToggle } from "../status-toggle";
import { GroupFields, type GroupFieldErrors, type GroupFieldValues } from "./group-fields";

export function GroupInfoTab({ group }: { group: Group }) {
  const { updateGroup, setGroupStatus } = useDirectory();
  const [values, setValues] = useState<GroupFieldValues>({
    name: group.name,
    description: group.description,
  });
  const [errors, setErrors] = useState<GroupFieldErrors>({});
  const [saving, setSaving] = useState(false);
  const unchanged =
    values.name === group.name && values.description === group.description;

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (saving || unchanged) return;
    const name = validateGroupName(values.name);
    setErrors({ name });
    if (name) return;
    setSaving(true);
    await simulateRequest();
    const result = updateGroup(group.id, values);
    setSaving(false);
    if (!result.ok) {
      setErrors({ name: result.error });
      return;
    }
    toast.success("اطلاعات گروه به‌روز شد.");
  }

  return (
    <div className="flex flex-col gap-10">
      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
        <FieldGroup>
          <GroupFields
            idPrefix="edit-group"
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
        <h2 className="text-h4 text-foreground">وضعیت گروه</h2>
        <p className="text-body-sm text-muted-foreground">
          گروه هرگز حذف نمی‌شود. گروه غیرفعال را می‌شود دوباره فعال کرد.
        </p>
        <StatusToggle
          noun="گروه"
          name={group.name}
          active={group.status === "active"}
          consequence="اعضای این گروه و خود کاربران می‌مانند و فقط گروه غیرفعال می‌شود."
          onChange={(active) => setGroupStatus(group.id, active)}
        />
      </section>
    </div>
  );
}

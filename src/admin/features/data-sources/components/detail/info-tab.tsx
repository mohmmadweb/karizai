"use client";

import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { FieldGroup } from "@/components/ui/field";
import { simulateRequest } from "@/lib/simulate-request";
import { useDataSources } from "../../hooks/use-data-sources";
import {
  formFromSource,
  hasErrors,
  toInput,
  validateForm,
  type SourceFormErrors,
  type SourceFormValues,
} from "../../lib/source-form";
import type { DataSource } from "../../types";
import { SourceFields } from "../source-fields";
import { TestConnectionSection } from "./test-connection-section";

const connectionKeys = ["type", "host", "port", "database", "username"] as const;

export function InfoTab({ source }: { source: DataSource }) {
  const { updateSource } = useDataSources();
  const saved = formFromSource(source);
  const [values, setValues] = useState<SourceFormValues>(saved);
  const [errors, setErrors] = useState<SourceFormErrors>({});
  const [saving, setSaving] = useState(false);
  const unchanged = JSON.stringify(values) === JSON.stringify(saved);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (saving || unchanged) return;
    const next = validateForm(values, false);
    setErrors(next);
    if (hasErrors(next)) return;
    const resets = Boolean(values.password) || connectionKeys.some((k) => values[k] !== saved[k]);
    setSaving(true);
    await simulateRequest();
    const result = updateSource(source.id, toInput(values));
    setSaving(false);
    if (!result.ok) {
      setErrors({ name: result.error });
      return;
    }
    toast.success(
      resets && source.testResult !== "untested"
        ? "اطلاعات اتصال به‌روز شد. نتیجه‌ی آزمایش پاک و اتصال غیرفعال شد."
        : "اطلاعات اتصال به‌روز شد.",
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
        <FieldGroup className="md:grid md:grid-cols-2 md:gap-x-4">
          <SourceFields
            idPrefix="edit-source"
            values={values}
            errors={errors}
            disabled={saving}
            passwordOptional
            onChange={setValues}
            onErrors={setErrors}
          />
        </FieldGroup>
        <p className="text-body-sm text-muted-foreground">
          تغییر نوع، نشانی، درگاه، نام پایگاه، نام کاربری یا رمز، نتیجه‌ی آزمایش را پاک و اتصال را غیرفعال می‌کند. تغییر نام این اثر را ندارد.
        </p>
        <div>
          <Button type="submit" loading={saving} disabled={unchanged}>
            ذخیره
          </Button>
        </div>
      </form>
      <TestConnectionSection source={source} />
    </div>
  );
}

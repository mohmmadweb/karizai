"use client";

import { LockIcon } from "lucide-react";
import { FormSection } from "@/components/shared/form-section";
import { SearchableSelect } from "@/components/shared/searchable-select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useModels } from "@/features/model-catalog/components/models-provider";
import type { AgentErrors } from "../lib/agent-validation";
import type { AgentDraft } from "../types";

type AgentBasicSectionProps = {
  draft: AgentDraft;
  errors: AgentErrors;
  sensitive: boolean;
  /** The model policy is «فقط مدل داخلی». */
  internalOnly?: boolean;
  onChange: <K extends keyof AgentDraft>(key: K, value: AgentDraft[K]) => void;
};

export function AgentBasicSection({ draft, errors, sensitive, internalOnly = false, onChange }: AgentBasicSectionProps) {
  // A sensitive Agent may only use internal models; the flag is set by the admin.
  const { models: allModels } = useModels();
  const models = allModels
    .filter((model) => !(sensitive || internalOnly) || model.isInternal)
    .map((model) => ({ value: model.id, label: model.name, hint: model.description }));

  return (
    <FormSection title="اطلاعات عامل" description="عامل با این نام، هدف و دستورالعمل در گفتگو صدا زده می‌شود.">
      {sensitive ? (
        <Alert variant="warning" className="md:col-span-2">
          <LockIcon aria-hidden />
          <AlertDescription>این عامل «حساس» است و فقط با مدل داخلی اجرا می‌شود. این وضعیت را فقط ادمین می‌تواند تغییر دهد.</AlertDescription>
        </Alert>
      ) : null}
      <Field data-invalid={errors.name ? true : undefined}>
        <FieldLabel htmlFor="agent-name">نام (اجباری)</FieldLabel>
        <Input id="agent-name" value={draft.name} onChange={(event) => onChange("name", event.target.value)} aria-invalid={Boolean(errors.name)} />
        {errors.name ? <FieldError>{errors.name}</FieldError> : null}
      </Field>
      <Field data-invalid={errors.defaultModelId ? true : undefined}>
        <FieldLabel htmlFor="agent-model">مدل پیش‌فرض (اجباری)</FieldLabel>
        <SearchableSelect id="agent-model" items={models} value={draft.defaultModelId || null} onValueChange={(value) => onChange("defaultModelId", value ?? "")} placeholder="انتخاب مدل" searchPlaceholder="جست‌وجوی مدل" emptyText="مدلی پیدا نشد" />
        {errors.defaultModelId ? <FieldError>{errors.defaultModelId}</FieldError> : <FieldDescription>{internalOnly ? "سیاست مدل «فقط مدل داخلی» است؛ فقط مدل‌های روی سرورهای سازمان فهرست شده‌اند." : "فقط مدل‌هایی که به آن‌ها دسترسی دارید."}</FieldDescription>}
      </Field>
      <Field className="md:col-span-2">
        <FieldLabel htmlFor="agent-purpose">هدف</FieldLabel>
        <Input id="agent-purpose" value={draft.purpose} onChange={(event) => onChange("purpose", event.target.value)} />
        <FieldDescription>در یک جمله بنویسید این عامل چه کاری انجام می‌دهد.</FieldDescription>
      </Field>
      <Field className="md:col-span-2" data-invalid={errors.instructions ? true : undefined}>
        <FieldLabel htmlFor="agent-instructions">دستورالعمل (اجباری)</FieldLabel>
        <Textarea id="agent-instructions" rows={5} value={draft.instructions} onChange={(event) => onChange("instructions", event.target.value)} aria-invalid={Boolean(errors.instructions)} />
        {errors.instructions ? <FieldError>{errors.instructions}</FieldError> : null}
      </Field>
    </FormSection>
  );
}

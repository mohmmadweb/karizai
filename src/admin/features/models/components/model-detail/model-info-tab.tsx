"use client";

import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { FormSection } from "@/components/shared/form-section";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { simulateRequest } from "@/lib/simulate-request";
import { useModels } from "../../hooks/use-models";
import { parseNumber, validateDisplayName, validateNumber } from "../../lib/validation";
import type { AiModel } from "../../types";
import {
  ModelFeaturesFields,
  type FeatureErrors,
  type FeatureValues,
} from "./model-features-fields";
import { ModelFeaturesSummary } from "./model-features-summary";

type Values = FeatureValues & {
  displayName: string;
  description: string;
  selfHosted: boolean;
};

const text = (n: number | null) => (n === null ? "" : String(n));

const initialValues = (m: AiModel): Values => ({
  displayName: m.displayName,
  description: m.description,
  selfHosted: m.selfHosted,
  costInput: text(m.costInputPerMillion),
  costOutput: text(m.costOutputPerMillion),
  contextWindow: text(m.contextWindow),
  supportsImages: m.supportsImages,
  supportsTools: m.supportsTools,
});

export function ModelInfoTab({ model }: { model: AiModel }) {
  const { updateModelInfo, updateModelFeatures } = useModels();
  const saved = initialValues(model);
  const [values, setValues] = useState<Values>(saved);
  const [nameError, setNameError] = useState<string>();
  const [errors, setErrors] = useState<FeatureErrors>({});
  const [saving, setSaving] = useState(false);
  const unchanged = JSON.stringify(values) === JSON.stringify(saved);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (saving || unchanged) return;
    const nextName = validateDisplayName(values.displayName);
    const next: FeatureErrors = {
      costInput: validateNumber(values.costInput),
      costOutput: validateNumber(values.costOutput),
      contextWindow: validateNumber(values.contextWindow, true),
    };
    setNameError(nextName);
    setErrors(next);
    if (nextName || next.costInput || next.costOutput || next.contextWindow) return;
    setSaving(true);
    await simulateRequest();
    updateModelInfo(model.id, {
      displayName: values.displayName,
      description: values.description,
      selfHosted: values.selfHosted,
    });
    updateModelFeatures(model.id, {
      costInputPerMillion: parseNumber(values.costInput),
      costOutputPerMillion: parseNumber(values.costOutput),
      contextWindow: parseNumber(values.contextWindow),
      supportsImages: values.supportsImages,
      supportsTools: values.supportsTools,
    });
    setSaving(false);
    toast.success("اطلاعات مدل به‌روز شد.");
  }

  return (
    <div className="flex flex-col gap-8">
      <ModelFeaturesSummary model={model} />
      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-8">
        <FormSection title="اطلاعات" description="نامی که در سامانه دیده می‌شود و توضیح کوتاه آن.">
          <Field data-invalid={nameError ? true : undefined}>
            <FieldLabel htmlFor="model-display-name">نام نمایشی</FieldLabel>
            <Input
              id="model-display-name"
              autoComplete="off"
              value={values.displayName}
              disabled={saving}
              aria-invalid={nameError ? true : undefined}
              onChange={(e) => setValues({ ...values, displayName: e.target.value })}
              onBlur={() => setNameError(validateDisplayName(values.displayName))}
            />
            <FieldError>{nameError}</FieldError>
          </Field>
          <Field>
            <FieldLabel htmlFor="model-remote-id">نام مدل نزد ارائه‌دهنده</FieldLabel>
            <Input
              id="model-remote-id"
              dir="ltr"
              readOnly
              className="text-start"
              value={model.remoteId}
            />
          </Field>
          <Field className="md:col-span-2">
            <FieldLabel htmlFor="model-description">توضیح</FieldLabel>
            <Textarea
              id="model-description"
              value={values.description}
              disabled={saving}
              onChange={(e) => setValues({ ...values, description: e.target.value })}
            />
          </Field>
          <Field orientation="horizontal" className="md:col-span-2">
            <Checkbox
              id="model-self-hosted"
              aria-label="سلف‌هاست"
              checked={values.selfHosted}
              disabled={saving}
              onCheckedChange={(checked) => setValues({ ...values, selfHosted: checked })}
            />
            <div className="flex flex-col gap-0.5">
              <FieldLabel htmlFor="model-self-hosted">سلف‌هاست</FieldLabel>
              <FieldDescription>این مدل روی سرورهای خود سازمان اجرا می‌شود.</FieldDescription>
            </div>
          </Field>
        </FormSection>
        <FormSection title="ویژگی‌ها" description="همه‌ی فیلدها اختیاری‌اند؛ فیلد خالی یعنی ثبت نشده.">
          <ModelFeaturesFields
            values={values}
            errors={errors}
            disabled={saving}
            onChange={(next) => setValues({ ...values, ...next })}
            onErrors={setErrors}
          />
        </FormSection>
        <div>
          <Button type="submit" loading={saving} disabled={unchanged}>
            ذخیره
          </Button>
        </div>
      </form>
    </div>
  );
}

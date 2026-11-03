"use client";

import { Checkbox } from "@/components/ui/checkbox";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { validateNumber } from "../../lib/validation";

export type FeatureValues = {
  costInput: string;
  costOutput: string;
  contextWindow: string;
  supportsImages: boolean;
  supportsTools: boolean;
};
export type FeatureErrors = Partial<Record<"costInput" | "costOutput" | "contextWindow", string>>;

type Props = {
  values: FeatureValues;
  errors: FeatureErrors;
  disabled?: boolean;
  onChange: (values: FeatureValues) => void;
  onErrors: (errors: FeatureErrors) => void;
};

const numberProps = {
  dir: "ltr",
  inputMode: "decimal",
  autoComplete: "off",
  className: "text-start",
} as const;

/** The five optional features of a model; an empty field means «not recorded». */
export function ModelFeaturesFields({ values, errors, disabled, onChange, onErrors }: Props) {
  const number = (
    key: "costInput" | "costOutput" | "contextWindow",
    label: string,
    help: string,
    whole = false,
  ) => (
    <Field data-invalid={errors[key] ? true : undefined}>
      <FieldLabel htmlFor={`model-${key}`}>{label}</FieldLabel>
      <Input
        id={`model-${key}`}
        {...numberProps}
        value={values[key]}
        disabled={disabled}
        aria-invalid={errors[key] ? true : undefined}
        onChange={(e) => onChange({ ...values, [key]: e.target.value })}
        onBlur={() => onErrors({ ...errors, [key]: validateNumber(values[key], whole) })}
      />
      <FieldDescription>{help}</FieldDescription>
      <FieldError>{errors[key]}</FieldError>
    </Field>
  );

  return (
    <>
      {number("costInput", "هزینه‌ی ورودی", "تومان برای هر یک میلیون توکن ورودی.")}
      {number("costOutput", "هزینه‌ی خروجی", "تومان برای هر یک میلیون توکن خروجی.")}
      {number("contextWindow", "طول پنجره‌ی متن", "بیشترین تعداد توکنی که مدل یک‌جا می‌خواند.", true)}
      <div className="flex flex-col gap-3 md:col-span-2">
        <Field orientation="horizontal">
          <Checkbox
            id="model-images"
            aria-label="پشتیبانی از تصویر"
            checked={values.supportsImages}
            disabled={disabled}
            onCheckedChange={(checked) => onChange({ ...values, supportsImages: checked })}
          />
          <FieldLabel htmlFor="model-images">پشتیبانی از تصویر</FieldLabel>
        </Field>
        <Field orientation="horizontal">
          <Checkbox
            id="model-tools"
            aria-label="پشتیبانی از ابزار"
            checked={values.supportsTools}
            disabled={disabled}
            onCheckedChange={(checked) => onChange({ ...values, supportsTools: checked })}
          />
          <FieldLabel htmlFor="model-tools">پشتیبانی از ابزار</FieldLabel>
        </Field>
      </div>
    </>
  );
}

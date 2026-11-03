"use client";

import { PasswordField } from "@/components/shared/password-field";
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  validateApiKey,
  validateBaseUrl,
  validateProviderName,
} from "../../lib/validation";

export type ProviderFieldValues = { name: string; baseUrl: string; apiKey: string };
export type ProviderFieldErrors = Partial<Record<keyof ProviderFieldValues, string>>;

type ProviderFieldsProps = {
  idPrefix: string;
  values: ProviderFieldValues;
  errors: ProviderFieldErrors;
  disabled?: boolean;
  /** On edit the key may stay empty to keep the current one. */
  keyOptional?: boolean;
  onChange: (values: ProviderFieldValues) => void;
  onErrors: (errors: ProviderFieldErrors) => void;
};

/** Name, base url and key fields shared by the register and edit dialogs. */
export function ProviderFields({
  idPrefix,
  values,
  errors,
  disabled,
  keyOptional,
  onChange,
  onErrors,
}: ProviderFieldsProps) {
  return (
    <>
      <Field data-invalid={errors.name ? true : undefined}>
        <FieldLabel htmlFor={`${idPrefix}-name`}>نام</FieldLabel>
        <Input
          id={`${idPrefix}-name`}
          autoComplete="off"
          value={values.name}
          disabled={disabled}
          aria-invalid={errors.name ? true : undefined}
          onChange={(e) => onChange({ ...values, name: e.target.value })}
          onBlur={() => onErrors({ ...errors, name: validateProviderName(values.name) })}
        />
        <FieldError>{errors.name}</FieldError>
      </Field>
      <Field data-invalid={errors.baseUrl ? true : undefined}>
        <FieldLabel htmlFor={`${idPrefix}-url`}>نشانی پایه</FieldLabel>
        <Input
          id={`${idPrefix}-url`}
          type="url"
          dir="ltr"
          autoComplete="off"
          placeholder="https://api.example.com/v1"
          className="text-start"
          value={values.baseUrl}
          disabled={disabled}
          aria-invalid={errors.baseUrl ? true : undefined}
          onChange={(e) => onChange({ ...values, baseUrl: e.target.value })}
          onBlur={() => onErrors({ ...errors, baseUrl: validateBaseUrl(values.baseUrl) })}
        />
        <FieldError>{errors.baseUrl}</FieldError>
      </Field>
      <Field data-invalid={errors.apiKey ? true : undefined}>
        <FieldLabel htmlFor={`${idPrefix}-key`}>کلید دسترسی</FieldLabel>
        <PasswordField
          id={`${idPrefix}-key`}
          autoComplete="off"
          value={values.apiKey}
          disabled={disabled}
          aria-invalid={errors.apiKey ? true : undefined}
          onChange={(e) => onChange({ ...values, apiKey: e.target.value })}
          onBlur={() =>
            onErrors({ ...errors, apiKey: keyOptional ? undefined : validateApiKey(values.apiKey) })
          }
        />
        {keyOptional ? (
          <FieldDescription>برای نگه‌داشتن کلید فعلی خالی بگذارید.</FieldDescription>
        ) : null}
        <FieldError>{errors.apiKey}</FieldError>
      </Field>
    </>
  );
}

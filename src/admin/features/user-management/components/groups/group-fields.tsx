"use client";

import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { validateGroupCode, validateGroupName } from "../../lib/validation";

export type GroupFieldValues = { name: string; description: string; code?: string };
export type GroupFieldErrors = { name?: string; code?: string };

type GroupFieldsProps = {
  idPrefix: string;
  values: GroupFieldValues;
  errors: GroupFieldErrors;
  disabled?: boolean;
  /** Shows the group code field; only the create form sets it. */
  showCode?: boolean;
  onChange: (values: GroupFieldValues) => void;
  onErrors: (errors: GroupFieldErrors) => void;
};

/** Name, description, and (when creating) code fields shared by the group forms. */
export function GroupFields({
  idPrefix,
  values,
  errors,
  disabled,
  showCode,
  onChange,
  onErrors,
}: GroupFieldsProps) {
  return (
    <>
      <Field data-invalid={errors.name ? true : undefined}>
        <FieldLabel htmlFor={`${idPrefix}-name`}>نام گروه</FieldLabel>
        <Input
          id={`${idPrefix}-name`}
          autoComplete="off"
          value={values.name}
          disabled={disabled}
          aria-invalid={errors.name ? true : undefined}
          onChange={(e) => onChange({ ...values, name: e.target.value })}
          onBlur={() => onErrors({ ...errors, name: validateGroupName(values.name) })}
        />
        <FieldError>{errors.name}</FieldError>
      </Field>
      {showCode ? (
        <Field data-invalid={errors.code ? true : undefined}>
          <FieldLabel htmlFor={`${idPrefix}-code`}>کد گروه</FieldLabel>
          <Input
            id={`${idPrefix}-code`}
            dir="ltr"
            className="text-start"
            autoComplete="off"
            placeholder="sales"
            value={values.code ?? ""}
            disabled={disabled}
            aria-invalid={errors.code ? true : undefined}
            onChange={(e) => onChange({ ...values, code: e.target.value })}
            onBlur={() => onErrors({ ...errors, code: validateGroupCode(values.code ?? "") })}
          />
          <FieldDescription>
            حروف انگلیسی کوچک، عدد و خط تیره. بعد از ساخت گروه تغییر نمی‌کند.
          </FieldDescription>
          <FieldError>{errors.code}</FieldError>
        </Field>
      ) : null}
      <Field>
        <FieldLabel htmlFor={`${idPrefix}-description`}>توضیح (اختیاری)</FieldLabel>
        <Textarea
          id={`${idPrefix}-description`}
          rows={3}
          value={values.description}
          disabled={disabled}
          onChange={(e) => onChange({ ...values, description: e.target.value })}
        />
      </Field>
    </>
  );
}

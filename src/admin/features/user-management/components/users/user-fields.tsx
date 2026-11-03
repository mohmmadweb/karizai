"use client";

import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { validateEmail, validateUserName } from "../../lib/validation";

export type UserFieldValues = { name: string; email: string };
export type UserFieldErrors = Partial<Record<keyof UserFieldValues, string>>;

type UserFieldsProps = {
  idPrefix: string;
  values: UserFieldValues;
  errors: UserFieldErrors;
  disabled?: boolean;
  onChange: (values: UserFieldValues) => void;
  onErrors: (errors: UserFieldErrors) => void;
};

/** Name and email fields shared by the add and edit forms. */
export function UserFields({
  idPrefix,
  values,
  errors,
  disabled,
  onChange,
  onErrors,
}: UserFieldsProps) {
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
          onBlur={() => onErrors({ ...errors, name: validateUserName(values.name) })}
        />
        <FieldError>{errors.name}</FieldError>
      </Field>
      <Field data-invalid={errors.email ? true : undefined}>
        <FieldLabel htmlFor={`${idPrefix}-email`}>ایمیل</FieldLabel>
        <Input
          id={`${idPrefix}-email`}
          type="email"
          dir="ltr"
          autoComplete="off"
          placeholder="name@example.com"
          className="text-start"
          value={values.email}
          disabled={disabled}
          aria-invalid={errors.email ? true : undefined}
          onChange={(e) => onChange({ ...values, email: e.target.value })}
          onBlur={() => onErrors({ ...errors, email: validateEmail(values.email) })}
        />
        <FieldError>{errors.email}</FieldError>
      </Field>
    </>
  );
}

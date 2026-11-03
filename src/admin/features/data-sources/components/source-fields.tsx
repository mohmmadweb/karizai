"use client";

import { PasswordField } from "@/components/shared/password-field";
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { databaseTypes } from "../lib/database-types";
import {
  validateField,
  type SourceFormErrors,
  type SourceFormValues,
} from "../lib/source-form";
import type { DatabaseType } from "../types";

type Props = {
  idPrefix: string;
  values: SourceFormValues;
  errors: SourceFormErrors;
  disabled?: boolean;
  /** On edit the password may stay empty to keep the current one. */
  passwordOptional?: boolean;
  onChange: (values: SourceFormValues) => void;
  onErrors: (errors: SourceFormErrors) => void;
};

const typeItems = databaseTypes.map((t) => ({ value: t.value, label: t.label }));

/** Fields shared by the add dialog and the info tab. */
export function SourceFields({
  idPrefix,
  values,
  errors,
  disabled,
  passwordOptional,
  onChange,
  onErrors,
}: Props) {
  const text = (
    key: "name" | "host" | "port" | "database" | "username",
    label: string,
    extra: { ltr?: boolean; help?: string; placeholder?: string } = {},
  ) => (
    <Field data-invalid={errors[key] ? true : undefined}>
      <FieldLabel htmlFor={`${idPrefix}-${key}`}>{label}</FieldLabel>
      <Input
        id={`${idPrefix}-${key}`}
        autoComplete="off"
        dir={extra.ltr ? "ltr" : undefined}
        className={extra.ltr ? "text-start" : undefined}
        placeholder={extra.placeholder}
        inputMode={key === "port" ? "numeric" : undefined}
        value={values[key]}
        disabled={disabled}
        aria-invalid={errors[key] ? true : undefined}
        onChange={(e) => onChange({ ...values, [key]: e.target.value })}
        onBlur={() => onErrors({ ...errors, [key]: validateField(key, values, !passwordOptional) })}
      />
      {extra.help ? <FieldDescription>{extra.help}</FieldDescription> : null}
      <FieldError>{errors[key]}</FieldError>
    </Field>
  );

  return (
    <>
      {text("name", "نام اتصال")}
      <Field>
        <FieldLabel htmlFor={`${idPrefix}-type`}>نوع انبار داده</FieldLabel>
        <Select
          items={typeItems}
          value={values.type}
          disabled={disabled}
          onValueChange={(type) => onChange({ ...values, type: type as DatabaseType })}
        >
          <SelectTrigger id={`${idPrefix}-type`} className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {typeItems.map((t) => (
                <SelectItem key={t.value} value={t.value}>
                  {t.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </Field>
      {text("host", "نشانی سرور", { ltr: true, placeholder: "db.company.local" })}
      {text("port", "درگاه", { ltr: true })}
      {text("database", "نام پایگاه", { ltr: true })}
      {text("username", "نام کاربری", {
        ltr: true,
        help: "باید یک حساب فقط‌خواندنی باشد.",
      })}
      <Field data-invalid={errors.password ? true : undefined}>
        <FieldLabel htmlFor={`${idPrefix}-password`}>رمز عبور</FieldLabel>
        <PasswordField
          id={`${idPrefix}-password`}
          autoComplete="off"
          value={values.password}
          disabled={disabled}
          aria-invalid={errors.password ? true : undefined}
          onChange={(e) => onChange({ ...values, password: e.target.value })}
          onBlur={() =>
            onErrors({ ...errors, password: validateField("password", values, !passwordOptional) })
          }
        />
        {passwordOptional ? (
          <FieldDescription>برای نگه‌داشتن رمز فعلی خالی بگذارید.</FieldDescription>
        ) : null}
        <FieldError>{errors.password}</FieldError>
      </Field>
    </>
  );
}

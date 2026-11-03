"use client";

import { PasswordField } from "@/components/shared/password-field";
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { defaultPort, protocolLabel } from "../../lib/selectors";
import { validateField, type SourceFormErrors, type SourceFormValues } from "../../lib/source-form";
import type { Protocol } from "../../types";

type Props = {
  idPrefix: string;
  values: SourceFormValues;
  errors: SourceFormErrors;
  disabled?: boolean;
  passwordOptional?: boolean;
  onChange: (values: SourceFormValues) => void;
  onErrors: (errors: SourceFormErrors) => void;
};

const protocols = (Object.keys(protocolLabel) as Protocol[]).map((p) => ({ value: p, label: protocolLabel[p] }));

/** Fields shared by the add dialog and the source page. */
export function SourceFields({ idPrefix, values, errors, disabled, passwordOptional, onChange, onErrors }: Props) {
  const text = (
    key: "name" | "host" | "port" | "folderPath" | "username",
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
      {text("name", "نام منبع")}
      <Field>
        <FieldLabel htmlFor={`${idPrefix}-protocol`}>پروتکل</FieldLabel>
        <Select
          items={protocols}
          value={values.protocol}
          disabled={disabled}
          onValueChange={(next) => {
            const p = next as Protocol;
            const wasDefault = values.port === String(defaultPort[values.protocol]);
            onChange({ ...values, protocol: p, port: wasDefault ? String(defaultPort[p]) : values.port });
          }}
        >
          <SelectTrigger id={`${idPrefix}-protocol`} className="w-full"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {protocols.map((p) => <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>)}
            </SelectGroup>
          </SelectContent>
        </Select>
      </Field>
      {text("host", "نشانی سرور", { ltr: true, placeholder: "fs.company.local" })}
      {text("port", "درگاه", { ltr: true })}
      {values.protocol === "seafile"
        ? text("folderPath", "کتابخانه و مسیر پوشه", { ltr: true, placeholder: "Docs/Contracts", help: "نام کتابخانه و سپس مسیر پوشه، مثل Docs/Contracts. سامانه فقط می‌خواند و چیزی در آن نمی‌نویسد." })
        : text("folderPath", "مسیر پوشه", { ltr: true, placeholder: "/Technical/Datasheets", help: "سامانه فقط از این پوشه می‌خواند و چیزی در آن نمی‌نویسد." })}
      {text("username", "نام کاربری", { ltr: true })}
      <Field data-invalid={errors.password ? true : undefined}>
        <FieldLabel htmlFor={`${idPrefix}-password`}>رمز عبور</FieldLabel>
        <PasswordField
          id={`${idPrefix}-password`}
          autoComplete="off"
          value={values.password}
          disabled={disabled}
          aria-invalid={errors.password ? true : undefined}
          onChange={(e) => onChange({ ...values, password: e.target.value })}
          onBlur={() => onErrors({ ...errors, password: validateField("password", values, !passwordOptional) })}
        />
        {passwordOptional ? <FieldDescription>برای نگه‌داشتن رمز فعلی خالی بگذارید.</FieldDescription> : null}
        <FieldError>{errors.password}</FieldError>
      </Field>
    </>
  );
}

"use client";

import { PasswordField } from "@/components/shared/password-field";
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { ToolParam } from "@/features/connections/types";
import { paramProblem } from "@/features/connections/lib/tool-params";

type ParamFieldProps = { id: string; param: ToolParam; value: string; onChange: (value: string) => void };

/** One setting of a step. A value that is filled but not valid shows its problem at once; empty ones are checked on save. */
export function ParamField({ id, param, value, onChange }: ParamFieldProps) {
  const problem = value.trim() ? paramProblem(param, value) : null;
  const label = `${param.label}${param.required ? "" : " (اختیاری)"}`;
  return (
    <Field data-invalid={problem ? true : undefined}>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      {param.kind === "select" ? (
        <Select items={param.options ?? []} value={value || null} onValueChange={(next) => next && onChange(next)}>
          <SelectTrigger id={id}><SelectValue placeholder="انتخاب کنید" /></SelectTrigger>
          <SelectContent><SelectGroup>{(param.options ?? []).map((option) => <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>)}</SelectGroup></SelectContent>
        </Select>
      ) : null}
      {param.kind === "textarea" ? <Textarea id={id} rows={3} value={value} placeholder={param.placeholder} aria-invalid={Boolean(problem)} onChange={(event) => onChange(event.target.value)} /> : null}
      {param.kind === "secret" ? <PasswordField id={id} value={value} autoComplete="off" aria-invalid={Boolean(problem)} onChange={(event) => onChange(event.target.value)} /> : null}
      {param.kind === "url" || param.kind === "text" || param.kind === "number" ? (
        <Input id={id} inputMode={param.kind === "number" ? "decimal" : undefined} dir={param.kind === "url" || param.key === "topic" ? "ltr" : undefined} value={value} placeholder={param.placeholder} aria-invalid={Boolean(problem)} onChange={(event) => onChange(event.target.value)} />
      ) : null}
      {problem ? <FieldError>{problem}</FieldError> : param.hint ? <FieldDescription>{param.hint}</FieldDescription> : null}
    </Field>
  );
}

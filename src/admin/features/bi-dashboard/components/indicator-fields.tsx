"use client";

import { SearchableMultiSelect } from "@/components/shared/searchable-multi-select";
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useDirectory } from "@/admin/features/user-management/hooks/use-directory";
import { severityLabels, type IndicatorFormValues } from "../lib/form";
import { referenceHints, sourceLabels } from "../lib/validation";
import type { IndicatorErrors, Severity, SourceKind } from "../types";

type Props = { values: IndicatorFormValues; errors: IndicatorErrors; disabled?: boolean; onChange: (values: IndicatorFormValues) => void };

const sourceItems = (Object.keys(sourceLabels) as SourceKind[]).map((value) => ({ value, label: sourceLabels[value] }));
const severityItems = (Object.keys(severityLabels) as Severity[]).map((value) => ({ value, label: severityLabels[value] }));

/** Fields of the indicator form: what it measures, its limits, where the value comes from, and who is told. */
export function IndicatorFields({ values, errors, disabled, onChange }: Props) {
  const { users, groups } = useDirectory();
  const set = (patch: Partial<IndicatorFormValues>) => onChange({ ...values, ...patch });
  const hint = referenceHints[values.source];
  return (
    <>
      <Field data-invalid={errors.name ? true : undefined}>
        <FieldLabel htmlFor="ind-name">نام شاخص</FieldLabel>
        <Input id="ind-name" name="name" autoComplete="off" value={values.name} disabled={disabled} aria-invalid={Boolean(errors.name)} onChange={(e) => set({ name: e.target.value })} />
        <FieldError>{errors.name}</FieldError>
      </Field>
      <div className="grid grid-cols-3 gap-3">
        <Field><FieldLabel htmlFor="ind-unit">واحد</FieldLabel><Input id="ind-unit" name="unit" autoComplete="off" spellCheck={false} dir="ltr" className="text-start" value={values.unit} disabled={disabled} placeholder="°C" onChange={(e) => set({ unit: e.target.value })} /></Field>
        <Field data-invalid={errors.limits ? true : undefined}><FieldLabel htmlFor="ind-lower">حد پایین</FieldLabel><Input id="ind-lower" name="lowerLimit" autoComplete="off" inputMode="decimal" value={values.lowerLimit} disabled={disabled} aria-invalid={Boolean(errors.limits)} onChange={(e) => set({ lowerLimit: e.target.value })} /></Field>
        <Field data-invalid={errors.limits ? true : undefined}><FieldLabel htmlFor="ind-upper">حد بالا</FieldLabel><Input id="ind-upper" name="upperLimit" autoComplete="off" inputMode="decimal" value={values.upperLimit} disabled={disabled} aria-invalid={Boolean(errors.limits)} onChange={(e) => set({ upperLimit: e.target.value })} /></Field>
      </div>
      {errors.limits ? <FieldError>{errors.limits}</FieldError> : <FieldDescription>یکی از دو حد می‌تواند خالی بماند (مثلاً فقط حداکثر).</FieldDescription>}
      <Field>
        <FieldLabel htmlFor="ind-source">منبع مقدار</FieldLabel>
        <Select items={sourceItems} value={values.source} disabled={disabled} onValueChange={(next) => next && set({ source: next as SourceKind, reference: "" })}>
          <SelectTrigger id="ind-source" className="w-full"><SelectValue /></SelectTrigger>
          <SelectContent><SelectGroup>{sourceItems.map((item) => <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>)}</SelectGroup></SelectContent>
        </Select>
      </Field>
      {hint ? (
        <Field data-invalid={errors.reference ? true : undefined}>
          <FieldLabel htmlFor="ind-reference">{hint.label}</FieldLabel>
          {values.source === "sql" ? (
            <Textarea id="ind-reference" name="reference" autoComplete="off" spellCheck={false} dir="ltr" className="text-start" rows={3} value={values.reference} disabled={disabled} placeholder={hint.placeholder} aria-invalid={Boolean(errors.reference)} onChange={(e) => set({ reference: e.target.value })} />
          ) : (
            <Input id="ind-reference" name="reference" autoComplete="off" spellCheck={false} dir="ltr" className="text-start" value={values.reference} disabled={disabled} placeholder={hint.placeholder} aria-invalid={Boolean(errors.reference)} onChange={(e) => set({ reference: e.target.value })} />
          )}
          {errors.reference ? <FieldError>{errors.reference}</FieldError> : <FieldDescription>{hint.hint}</FieldDescription>}
        </Field>
      ) : <p className="text-body-sm text-muted-foreground">مقدار را کسی دستی وارد می‌کند و خوانده نمی‌شود.</p>}
      <div className="grid grid-cols-2 gap-3">
        <Field data-invalid={errors.refreshMinutes ? true : undefined}>
          <FieldLabel htmlFor="ind-refresh">هر چند دقیقه خوانده شود؟</FieldLabel>
          <Input id="ind-refresh" name="refreshMinutes" autoComplete="off" inputMode="numeric" value={values.refreshMinutes} disabled={disabled || values.source === "manual"} aria-invalid={Boolean(errors.refreshMinutes)} onChange={(e) => set({ refreshMinutes: e.target.value })} />
          <FieldError>{errors.refreshMinutes}</FieldError>
        </Field>
        <Field>
          <FieldLabel htmlFor="ind-severity">اهمیت هشدار</FieldLabel>
          <Select items={severityItems} value={values.severity} disabled={disabled} onValueChange={(next) => next && set({ severity: next as Severity })}>
            <SelectTrigger id="ind-severity" className="w-full"><SelectValue /></SelectTrigger>
            <SelectContent><SelectGroup>{severityItems.map((item) => <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>)}</SelectGroup></SelectContent>
          </Select>
        </Field>
      </div>
      <Field data-invalid={errors.responsible ? true : undefined}>
        <FieldLabel htmlFor="ind-groups">گروه‌های مسئول</FieldLabel>
        <SearchableMultiSelect id="ind-groups" items={groups.filter((g) => g.status === "active").map((g) => ({ value: g.id, label: g.name }))} value={values.groupIds} disabled={disabled} onValueChange={(groupIds) => set({ groupIds })} placeholder="انتخاب گروه" searchPlaceholder="جست‌وجوی گروه" emptyText="گروهی پیدا نشد." />
      </Field>
      <Field data-invalid={errors.responsible ? true : undefined}>
        <FieldLabel htmlFor="ind-users">کاربران مسئول</FieldLabel>
        <SearchableMultiSelect id="ind-users" items={users.filter((u) => u.status === "active").map((u) => ({ value: u.id, label: u.name, hint: u.email }))} value={values.userIds} disabled={disabled} onValueChange={(userIds) => set({ userIds })} placeholder="انتخاب کاربر" searchPlaceholder="جست‌وجوی کاربر" emptyText="کاربری پیدا نشد." />
        {errors.responsible ? <FieldError>{errors.responsible}</FieldError> : <FieldDescription>هشدار برای این گروه‌ها و کاربران در شبکه اجتماعی سازمان نمایش داده می‌شود.</FieldDescription>}
      </Field>
    </>
  );
}

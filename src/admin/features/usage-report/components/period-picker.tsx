"use client";

import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { dayLabel } from "../lib/format-rows";
import { parseDay } from "../lib/periods";
import type { RangeErrors } from "../lib/validation";
import type { CustomRange, PeriodId } from "../types";

type Props = {
  period: PeriodId;
  onPeriodChange: (period: PeriodId) => void;
  range: CustomRange;
  errors: RangeErrors;
  onRangeChange: (range: CustomRange) => void;
};

const periods: { id: PeriodId; label: string }[] = [
  { id: "today", label: "امروز" },
  { id: "week", label: "هفته" },
  { id: "month", label: "ماه" },
  { id: "custom", label: "بازه‌ی دلخواه" },
];

const caption = (value: string) => {
  const ms = parseDay(value);
  return ms === null ? undefined : dayLabel(ms);
};

export function PeriodPicker({ period, onPeriodChange, range, errors, onRangeChange }: Props) {
  const field = (key: "from" | "to", label: string) => (
    <Field data-invalid={errors[key] ? true : undefined}>
      <FieldLabel htmlFor={`usage-${key}`}>{label}</FieldLabel>
      <Input
        id={`usage-${key}`}
        type="date"
        dir="ltr"
        className="text-start"
        value={range[key]}
        aria-invalid={errors[key] ? true : undefined}
        onChange={(e) => onRangeChange({ ...range, [key]: e.target.value })}
      />
      {caption(range[key]) ? (
        <p className="text-caption text-muted-foreground">{caption(range[key])}</p>
      ) : null}
      <FieldError>{errors[key]}</FieldError>
    </Field>
  );

  return (
    <div className="flex flex-col gap-4">
      <Tabs value={period} onValueChange={(v) => onPeriodChange(v as PeriodId)}>
        <TabsList aria-label="بازه‌ی زمانی">
          {periods.map((p) => (
            <TabsTrigger key={p.id} value={p.id}>
              {p.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
      {period === "custom" ? (
        <div className="flex flex-col gap-2">
          <div className="grid gap-4 sm:max-w-lg sm:grid-cols-2">
            {field("from", "از تاریخ")}
            {field("to", "تا تاریخ")}
          </div>
          {errors.range ? (
            <p role="alert" className="text-body-sm text-destructive">
              {errors.range}
            </p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

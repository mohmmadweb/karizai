"use client";

import { Field, FieldLabel } from "@/components/ui/field";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

export type FilterOption = { value: string; label: string };

type Props = {
  id: string;
  label: string;
  value: string;
  options: FilterOption[];
  onValueChange: (value: string) => void;
  className?: string;
};

/** A labelled Select used in the filter rows of the governance pages. */
export function FilterSelect({ id, label, value, options, onValueChange, className }: Props) {
  return (
    <Field className={cn("w-full sm:w-48", className)}>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <Select items={options} value={value} onValueChange={(v) => v && onValueChange(v)}>
        <SelectTrigger id={id} className="w-full">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </Field>
  );
}

/** «همه» first, then each distinct value in order of first appearance. */
export function optionsOf(values: string[], allLabel = "همه"): FilterOption[] {
  return [{ value: "all", label: allLabel }, ...[...new Set(values)].map((v) => ({ value: v, label: v }))];
}

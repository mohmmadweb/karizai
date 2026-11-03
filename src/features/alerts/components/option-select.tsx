"use client";

import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type OptionSelectProps = { id: string; value: string; options: { value: string; label: string }[]; onChange: (value: string) => void };

/** A plain choice list for the forms of this feature. */
export function OptionSelect({ id, value, options, onChange }: OptionSelectProps) {
  return (
    <Select items={options} value={value || null} onValueChange={(next) => next && onChange(next)}>
      <SelectTrigger id={id}><SelectValue placeholder="انتخاب کنید" /></SelectTrigger>
      <SelectContent><SelectGroup>{options.map((option) => <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>)}</SelectGroup></SelectContent>
    </Select>
  );
}

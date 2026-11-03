"use client";

import { useState } from "react";
import { PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SearchableMultiSelect } from "@/components/shared/searchable-multi-select";
import { SearchableSelect } from "@/admin/components/shared/searchable-select";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Option = { value: string; label: string; hint?: string };

type MembershipPickerProps = {
  id: string;
  label: string;
  placeholder: string;
  addLabel: string;
  options: Option[];
  /** When set, the picker is disabled and this reason is shown. */
  disabledReason?: string;
  /** Adds a search box to the list; searches the label and the hint. */
  searchable?: boolean;
  /** Lets several items be ticked and added at once; the picker then spans the full row. */
  multiple?: boolean;
  onAdd: (value: string) => void;
  /** Multiple mode: receives every ticked value at once; falls back to calling onAdd for each. */
  onAddMany?: (values: string[]) => void;
  /** Texts of the search box and the empty result; the defaults talk about users. */
  searchPlaceholder?: string;
  emptyText?: string;
};

/** Select an eligible item and add it; used for groups of a user and members of a group. */
export function MembershipPicker({
  id,
  label,
  placeholder,
  addLabel,
  options,
  disabledReason,
  searchable,
  multiple,
  onAdd,
  onAddMany,
  searchPlaceholder = "جست‌وجوی نام یا ایمیل",
  emptyText = "کاربری پیدا نشد.",
}: MembershipPickerProps) {
  const [value, setValue] = useState<string | null>(null);
  const [values, setValues] = useState<string[]>([]);
  const reason =
    disabledReason ?? (options.length === 0 ? "موردی برای افزودن وجود ندارد." : undefined);

  return (
    <Field>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <div className="flex flex-wrap items-center gap-3">
        {multiple ? (
          <SearchableMultiSelect
            id={id}
            items={options}
            value={values}
            disabled={Boolean(reason)}
            onValueChange={setValues}
            placeholder={placeholder}
            searchPlaceholder={searchPlaceholder}
            emptyText={emptyText}
            className="min-w-0 flex-1 basis-56"
          />
        ) : searchable ? (
          <SearchableSelect
            id={id}
            items={options}
            value={value}
            disabled={Boolean(reason)}
            onValueChange={setValue}
            placeholder={placeholder}
            searchPlaceholder={searchPlaceholder}
            emptyText={emptyText}
            className="sm:w-64"
          />
        ) : (
        <Select
          items={options}
          value={value}
          disabled={Boolean(reason)}
          onValueChange={setValue}
        >
          <SelectTrigger id={id} className="w-full sm:w-64">
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {options.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        )}
        <Button
          type="button"
          disabled={Boolean(reason) || (multiple ? values.length === 0 : !value)}
          onClick={() => {
            if (multiple) {
              if (onAddMany) onAddMany(values);
              else values.forEach(onAdd);
              setValues([]);
              return;
            }
            if (!value) return;
            onAdd(value);
            setValue(null);
          }}
        >
          <PlusIcon aria-hidden />
          {addLabel}
        </Button>
      </div>
      {reason ? <FieldDescription>{reason}</FieldDescription> : null}
    </Field>
  );
}

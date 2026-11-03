"use client";

import { useState } from "react";
import { PlusIcon, XIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { SearchableSelect } from "./searchable-select";

export type AccessSubject = {
  id: string;
  label: string;
  /** Extra text shown in Latin direction, such as an email. */
  hint?: string;
  /** Shown with an «غیرفعال» badge. */
  inactive?: boolean;
  /** Short sentence under the name. */
  note?: string;
};

export type AccessSide = { granted: AccessSubject[]; available: AccessSubject[] };

type AccessGrantsSectionProps = {
  idPrefix: string;
  title: string;
  description: string;
  addLabel: string;
  placeholder: string;
  emptyPickerText: string;
  searchPlaceholder: string;
  side: AccessSide;
  onGrant: (id: string) => void;
  onRevoke: (id: string) => void;
};

/** One half of the access panel: an add control and the list of granted items. */
export function AccessGrantsSection({
  idPrefix,
  title,
  description,
  addLabel,
  placeholder,
  emptyPickerText,
  searchPlaceholder,
  side,
  onGrant,
  onRevoke,
}: AccessGrantsSectionProps) {
  const [value, setValue] = useState<string | null>(null);
  const items = side.available.map((s) => ({
    value: s.id,
    label: s.label,
    hint: s.hint,
  }));
  const noneLeft = items.length === 0;

  return (
    <section className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <h2 className="text-h4 text-foreground">{title}</h2>
        <p className="text-body-sm text-muted-foreground">{description}</p>
      </div>
      <Field>
        <FieldLabel htmlFor={`${idPrefix}-picker`}>{addLabel}</FieldLabel>
        <div className="flex flex-wrap items-center gap-3">
          <SearchableSelect
            id={`${idPrefix}-picker`}
            items={items}
            value={value}
            disabled={noneLeft}
            onValueChange={setValue}
            placeholder={placeholder}
            searchPlaceholder={searchPlaceholder}
            emptyText="موردی پیدا نشد."
            className="sm:w-72"
          />
          <Button
            type="button"
            disabled={!value}
            onClick={() => {
              if (!value) return;
              onGrant(value);
              setValue(null);
            }}
          >
            <PlusIcon aria-hidden />
            افزودن
          </Button>
        </div>
        {noneLeft ? <FieldDescription>{emptyPickerText}</FieldDescription> : null}
      </Field>
      {side.granted.length === 0 ? (
        <p className="text-body-sm text-muted-foreground">موردی اضافه نشده است.</p>
      ) : (
        <ul className="flex flex-col divide-y divide-border rounded-xl border border-border">
          {side.granted.map((subject) => (
            <li key={subject.id} className="flex items-center justify-between gap-3 p-3">
              <div className="flex min-w-0 flex-col gap-0.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-medium">{subject.label}</span>
                  {subject.inactive ? <Badge variant="secondary">غیرفعال</Badge> : null}
                </div>
                {subject.hint ? (
                  <bdi dir="ltr" className="truncate text-start text-caption text-muted-foreground">
                    {subject.hint}
                  </bdi>
                ) : null}
                {subject.note ? (
                  <span className="text-caption text-muted-foreground">{subject.note}</span>
                ) : null}
              </div>
              <Button variant="ghost" size="sm" onClick={() => onRevoke(subject.id)}>
                <XIcon aria-hidden />
                برداشتن
                <span className="sr-only"> {subject.label}</span>
              </Button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

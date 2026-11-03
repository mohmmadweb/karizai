"use client";

import { useState } from "react";
import { SearchableSelect } from "@/admin/components/shared/searchable-select";
import { getSelectOptions } from "../data/reference";

/** Select with a search box in its popup, for long lists. */
export function SearchableSelectDemo({ id }: { id: string }) {
  const [value, setValue] = useState<string | null>(null);
  return (
    <SearchableSelect
      id={id}
      items={getSelectOptions()}
      value={value}
      onValueChange={setValue}
      placeholder="انتخاب کنید"
      searchPlaceholder="جست‌وجو"
      emptyText="موردی پیدا نشد."
    />
  );
}

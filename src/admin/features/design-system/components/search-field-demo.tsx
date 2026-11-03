"use client";

import { useState } from "react";
import { SearchField } from "@/components/shared/search-field";

export function SearchFieldDemo() {
  const [value, setValue] = useState("");
  return (
    <SearchField
      label="جست‌وجوی نمونه"
      placeholder="جست‌وجو بر اساس نام"
      value={value}
      onValueChange={setValue}
    />
  );
}

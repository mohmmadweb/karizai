"use client";

import { SearchIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type SearchFieldProps = {
  value: string;
  onValueChange: (value: string) => void;
  /** Accessible name; the field has no visible label. */
  label: string;
  placeholder?: string;
  className?: string;
};

/** Search box with a leading icon, used above lists. */
export function SearchField({
  value,
  onValueChange,
  label,
  placeholder,
  className,
}: SearchFieldProps) {
  return (
    <div className={cn("relative w-full sm:max-w-sm", className)}>
      <SearchIcon
        aria-hidden
        className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
      />
      <Input
        type="search"
        aria-label={label}
        placeholder={placeholder}
        value={value}
        onChange={(event) => onValueChange(event.target.value)}
        className="ps-9"
      />
    </div>
  );
}

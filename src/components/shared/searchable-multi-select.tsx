"use client";

import { Combobox } from "@base-ui/react/combobox";
import { CheckIcon, ChevronDownIcon, SearchIcon } from "lucide-react";
import { formatNumber } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { SearchableSelectItem } from "./searchable-select";

type SearchableMultiSelectProps = {
  id?: string;
  items: SearchableSelectItem[];
  value: string[];
  onValueChange: (value: string[]) => void;
  placeholder: string;
  searchPlaceholder: string;
  emptyText: string;
  disabled?: boolean;
  className?: string;
};

const normalize = (text: string) =>
  text.replace(/ي/g, "ی").replace(/ك/g, "ک").trim().toLowerCase();

/** Like SearchableSelect, but several items can be ticked; the list stays open while choosing. */
export function SearchableMultiSelect({
  id,
  items,
  value,
  onValueChange,
  placeholder,
  searchPlaceholder,
  emptyText,
  disabled,
  className,
}: SearchableMultiSelectProps) {
  const selected = items.filter((item) => value.includes(item.value));

  return (
    <Combobox.Root
      multiple
      items={items}
      value={selected}
      disabled={disabled}
      itemToStringLabel={(item: SearchableSelectItem) => item.label}
      isItemEqualToValue={(a: SearchableSelectItem, b: SearchableSelectItem) => a.value === b.value}
      filter={(item: SearchableSelectItem, query: string) =>
        normalize(`${item.label} ${item.hint ?? ""}`).includes(normalize(query))
      }
      onValueChange={(next: SearchableSelectItem[]) => onValueChange(next.map((item) => item.value))}
    >
      <Combobox.Trigger
        id={id}
        className={cn(
          "flex h-10 w-full items-center justify-between gap-1.5 rounded-lg border border-input bg-transparent py-2 ps-3 pe-3 text-body-sm whitespace-nowrap transition-colors outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-input/30 dark:hover:bg-input/50",
          className,
        )}
      >
        {selected.length === 0 ? (
          <span className="text-muted-foreground">{placeholder}</span>
        ) : (
          <span className="line-clamp-1 text-start">
            {selected.length === 1
              ? selected[0].label
              : `${formatNumber(selected.length)} مورد انتخاب شده`}
          </span>
        )}
        <ChevronDownIcon aria-hidden className="size-4 shrink-0 text-muted-foreground" />
      </Combobox.Trigger>
      <Combobox.Portal>
        <Combobox.Positioner side="bottom" align="start" sideOffset={4} className="isolate z-popover">
          <Combobox.Popup
            aria-label={placeholder}
            className="flex max-h-(--available-height) w-(--anchor-width) min-w-56 origin-(--transform-origin) flex-col overflow-hidden rounded-lg bg-popover text-popover-foreground shadow-md ring-1 ring-foreground/10 duration-100 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95"
          >
            <div className="relative border-b border-border p-2">
              <SearchIcon
                aria-hidden
                className="pointer-events-none absolute start-5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
              />
              <Combobox.Input
                placeholder={searchPlaceholder}
                aria-label={searchPlaceholder}
                className="h-9 w-full rounded-md border border-input bg-transparent ps-8 pe-2 text-body-sm outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
              />
            </div>
            <Combobox.Empty className="px-3 py-4 text-center text-body-sm text-muted-foreground empty:hidden">
              {emptyText}
            </Combobox.Empty>
            <Combobox.List className="max-h-64 overflow-y-auto overscroll-contain p-1 empty:p-0">
              {(item: SearchableSelectItem) => (
                <Combobox.Item
                  key={item.value}
                  value={item}
                  className="relative flex min-h-9 w-full cursor-default flex-col justify-center rounded-md py-1 ps-2 pe-8 text-body-sm outline-hidden select-none data-highlighted:bg-accent data-highlighted:text-accent-foreground"
                >
                  <span>{item.label}</span>
                  {item.hint ? (
                    <bdi dir="ltr" className="text-start text-caption text-muted-foreground">
                      {item.hint}
                    </bdi>
                  ) : null}
                  <Combobox.ItemIndicator className="absolute end-2 top-1/2 -translate-y-1/2">
                    <CheckIcon aria-hidden className="size-4" />
                  </Combobox.ItemIndicator>
                </Combobox.Item>
              )}
            </Combobox.List>
          </Combobox.Popup>
        </Combobox.Positioner>
      </Combobox.Portal>
    </Combobox.Root>
  );
}

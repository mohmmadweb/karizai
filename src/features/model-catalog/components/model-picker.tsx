"use client";

import { ChevronDownIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useModels } from "./models-provider";
import type { ModelChoice } from "../types";

type ModelPickerProps = {
  value: ModelChoice;
  onChange: (value: ModelChoice) => void;
  /** Shown instead of the choice when a rule overrides it (sensitive Agent). */
  lockedLabel?: string;
};

/** Model choice as a drop-down: names only. Details live on the models list of the admin and in answers. */
export function ModelPicker({ value, onChange, lockedLabel }: ModelPickerProps) {
  const { models, routers } = useModels();
  const current = models.find((model) => model.id === value);
  const routerName = (id: string) => routers.find((router) => router.id === id)?.name;
  const autoLabel = value.startsWith("auto:") ? (routerName(value.slice(5)) ?? "خودکار") : "خودکار";
  const label = lockedLabel ?? current?.name ?? autoLabel;
  const autoEntries = routers.length > 0 ? routers.map((router) => ({ value: router.isDefault ? "auto" : `auto:${router.id}`, label: router.name })) : [{ value: "auto", label: "انتخاب خودکار" }];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        disabled={Boolean(lockedLabel)}
        render={<Button type="button" variant="ghost" className="rounded-full text-h4" aria-label={`مدل: ${label}`} />}
      >
        <span className="max-w-40 truncate">{label}</span>
        <ChevronDownIcon aria-hidden />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="min-w-56">
        <DropdownMenuRadioGroup value={value} onValueChange={(next) => onChange(next as ModelChoice)}>
          {autoEntries.map((entry) => (
            <DropdownMenuRadioItem key={entry.value} value={entry.value}>{entry.label}</DropdownMenuRadioItem>
          ))}
          <DropdownMenuSeparator />
          {models.map((model) => (
            <DropdownMenuRadioItem key={model.id} value={model.id} disabled={!model.isAvailable}>
              {model.name}
              {model.isInternal ? " (داخلی)" : ""}
              {!model.isAvailable ? " — موقتاً در دسترس نیست" : ""}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

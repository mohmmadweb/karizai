"use client";

import { ChevronDownIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ProviderLogo } from "@/components/shared/provider-logo";
import { useDemoFlags } from "@/lib/demo-flags";
import { formatDate } from "@/lib/format";
import { isNewModel } from "../lib/model-access";
import { useModels } from "./models-provider";
import type { CatalogModel, ModelChoice } from "../types";

type ModelPickerProps = {
  value: ModelChoice;
  onChange: (value: ModelChoice) => void;
  /** Shown instead of the choice when a rule overrides it (sensitive Agent). */
  lockedLabel?: string;
};

/** Name of the default automatic choice: the smart router picks the model. */
const smartRouterLabel = "مسیریاب هوشمند";

/** Why a model cannot be chosen right now, or `null`. */
function blockedReason(model: CatalogModel, allowed: boolean, offline: boolean): string | null {
  if (!allowed) return "این مدل برای گروه شما مجاز نیست";
  if (offline && !model.isInternal) return "اینترنت قطع است؛ فقط مدل‌های داخلی";
  if (!model.isAvailable) return "موقتاً در دسترس نیست";
  return null;
}

/** Model choice as a drop-down: name, internal or masked, new versions, and models the user's groups may not use. */
export function ModelPicker({ value, onChange, lockedLabel }: ModelPickerProps) {
  const { models, routers, isAllowed } = useModels();
  const { offline } = useDemoFlags();
  const current = models.find((model) => model.id === value);
  const routerName = (id: string) => routers.find((router) => router.id === id)?.name;
  const autoLabel = value.startsWith("auto:") ? (routerName(value.slice(5)) ?? smartRouterLabel) : smartRouterLabel;
  const label = lockedLabel ?? current?.name ?? autoLabel;
  const autoEntries = routers.length > 0 ? routers.map((router) => ({ value: router.isDefault ? "auto" : `auto:${router.id}`, label: router.isDefault ? smartRouterLabel : router.name })) : [{ value: "auto", label: smartRouterLabel }];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        disabled={Boolean(lockedLabel)}
        render={<Button type="button" variant="ghost" className="rounded-full text-h4" aria-label={`مدل: ${label}`} />}
      >
        {current ? <ProviderLogo name={`${current.provider} ${current.name}`} /> : null}
        <span className="max-w-56 truncate sm:max-w-72" title={label}>{label}</span>
        <ChevronDownIcon aria-hidden />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="min-w-72">
        <DropdownMenuRadioGroup value={value} onValueChange={(next) => onChange(next as ModelChoice)}>
          {autoEntries.map((entry) => (
            <DropdownMenuRadioItem key={entry.value} value={entry.value}>{entry.label}</DropdownMenuRadioItem>
          ))}
          <DropdownMenuSeparator />
          {models.map((model) => {
            const reason = blockedReason(model, isAllowed(model), offline);
            return (
              <DropdownMenuRadioItem key={model.id} value={model.id} disabled={reason !== null} className="items-start">
                <ProviderLogo name={`${model.provider} ${model.name}`} />
                <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                  <span className="flex flex-wrap items-center gap-1.5">
                    {model.name}
                    {model.isInternal ? <Badge variant="success">🔒 داخلی</Badge> : <Badge variant="outline" data-ai>پوشاندن</Badge>}
                    {isNewModel(model) ? <Badge variant="info">جدید · {formatDate(model.releasedAt!, { dateStyle: "medium" })}</Badge> : null}
                  </span>
                  {reason ? <span className="text-caption text-muted-foreground">{reason}</span> : null}
                </span>
              </DropdownMenuRadioItem>
            );
          })}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

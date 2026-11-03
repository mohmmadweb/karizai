"use client";

import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { useModels } from "../../hooks/use-models";
import type { AiModel } from "../../types";

/** Applies at once, so a Switch is the right control (design.md). */
export function ModelEnabledSwitch({ model }: { model: AiModel }) {
  const { setModelEnabled } = useModels();
  return (
    <span className="flex items-center gap-2">
      <Switch
        checked={model.enabled}
        aria-label={`فعال بودن مدل ${model.displayName}`}
        onCheckedChange={(checked) => {
          setModelEnabled(model.id, checked);
          toast.success(checked ? "مدل فعال شد." : "مدل غیرفعال شد.");
        }}
      />
      <span className="text-body-sm">{model.enabled ? "فعال" : "غیرفعال"}</span>
    </span>
  );
}

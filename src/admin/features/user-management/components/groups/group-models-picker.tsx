"use client";

import { useMemo } from "react";
import { useAccess } from "@/admin/features/access-control/hooks/use-access";
import { useModels } from "@/admin/features/models/hooks/use-models";
import type { SearchableSelectItem } from "@/admin/components/shared/searchable-select";

/** Models that can be given to a group, as options with the provider's name as a hint. */
export function useModelOptions(): SearchableSelectItem[] {
  const { models, providers } = useModels();
  return useMemo(
    () =>
      models.map((m) => ({
        value: m.id,
        label: m.displayName,
        hint: providers.find((p) => p.id === m.providerId)?.name,
      })),
    [models, providers],
  );
}

/** Ids of the models the group already has access to. */
export function useGroupModelIds(groupId: string): string[] {
  const { grants } = useAccess();
  return grants
    .filter((g) => g.resourceType === "model" && g.subjectType === "group" && g.subjectId === groupId)
    .map((g) => g.resourceId);
}

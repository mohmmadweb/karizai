"use client";

import { useAccess } from "@/admin/features/access-control/hooks/use-access";
import { useModels } from "./use-models";

/** Deletes a provider with its models and the access given to those models. */
export function useDeleteProvider() {
  const { deleteProvider } = useModels();
  const { revokeAllForResources } = useAccess();
  return (providerId: string): number => {
    const removed = deleteProvider(providerId);
    revokeAllForResources(removed);
    return removed.length;
  };
}

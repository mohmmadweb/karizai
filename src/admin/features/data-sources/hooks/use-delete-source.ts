"use client";

import { useAccess } from "@/admin/features/access-control/hooks/use-access";
import { useDataSources } from "./use-data-sources";

/** Deletes a connection with its descriptions and the access given to it. */
export function useDeleteSource() {
  const { deleteSource } = useDataSources();
  const { revokeAllForResources } = useAccess();
  return (sourceId: string) => {
    deleteSource(sourceId);
    revokeAllForResources([sourceId]);
  };
}

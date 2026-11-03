"use client";

import { useAccess } from "@/admin/features/access-control/hooks/use-access";
import { useDataSources } from "./use-data-sources";

/** Deletes a connection with its descriptions, schemas and the access given to them. */
export function useDeleteSource() {
  const { deleteSource, dataSchemas } = useDataSources();
  const { revokeAllForResources } = useAccess();
  return (sourceId: string) => {
    const schemaIds = dataSchemas.filter((s) => s.sourceId === sourceId).map((s) => s.id);
    deleteSource(sourceId);
    revokeAllForResources([sourceId, ...schemaIds]);
  };
}

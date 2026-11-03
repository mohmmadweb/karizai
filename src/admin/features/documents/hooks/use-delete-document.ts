"use client";

import { useAccess } from "@/admin/features/access-control/hooks/use-access";
import { useDocuments } from "./use-documents";

/** Deletes documents and sources together with the access given to them. */
export function useDeleteDocuments() {
  const { deleteDocument, deleteSource } = useDocuments();
  const { revokeAllForResources } = useAccess();
  return {
    removeDocument: (id: string) => {
      deleteDocument(id);
      revokeAllForResources([id]);
    },
    removeSource: (id: string) => {
      const docIds = deleteSource(id);
      revokeAllForResources([id, ...docIds]);
      return docIds.length;
    },
  };
}

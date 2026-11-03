"use client";

import { usePolicies } from "@/lib/policy-store";
import type { DocumentRecord } from "../types";
import { useDocuments } from "./use-documents";

/**
 * «محرمانه» of a document: kept in the shared policy store (the user chat reads
 * it) and mirrored on the record's own `confidential` field.
 */
export function useDocConfidential() {
  const { confidentialDocIds, setConfidential } = usePolicies();
  const { updateDocument } = useDocuments();
  const isConfidential = (doc: DocumentRecord) => doc.confidential || confidentialDocIds.includes(doc.id);
  const setDocConfidential = (doc: DocumentRecord, value: boolean) => {
    setConfidential(doc.id, value);
    if (doc.confidential !== value) updateDocument(doc.id, { name: doc.name, language: doc.language, confidential: value });
  };
  return { isConfidential, setDocConfidential };
}

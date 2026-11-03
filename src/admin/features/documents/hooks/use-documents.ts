"use client";

import { useContext } from "react";
import { DocumentsContext, type DocumentsContextValue } from "../components/documents-provider";

export function useDocuments(): DocumentsContextValue {
  const value = useContext(DocumentsContext);
  if (!value) throw new Error("useDocuments must be used inside DocumentsProvider");
  return value;
}

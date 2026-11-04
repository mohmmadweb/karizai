"use client";

import { createContext, useContext, useMemo, useRef, useState, type ReactNode } from "react";
import type { KnowledgeDocument } from "../types";

type KnowledgeFilesContextValue = {
  /** Files Agents and workflows made in this visit, newest first. */
  generated: KnowledgeDocument[];
  /** Adds a file made by AI (it gets the «ساخته‌شده با AI» tag) and returns its id. */
  addGenerated: (doc: Omit<KnowledgeDocument, "id">) => string;
};

const KnowledgeFilesContext = createContext<KnowledgeFilesContextValue | null>(null);

/** Files made by AI during the visit, so «دانش سازمانی» shows them beside the organization's files. In memory only. */
export function KnowledgeFilesProvider({ children }: { children: ReactNode }) {
  const [generated, setGenerated] = useState<KnowledgeDocument[]>([]);
  const counter = useRef(0);
  const value = useMemo<KnowledgeFilesContextValue>(() => ({
    generated,
    addGenerated: (doc) => {
      const id = `doc-ai-${++counter.current}`;
      setGenerated((list) => [{ ...doc, id, tags: [...new Set(["ساخته‌شده با AI", ...(doc.tags ?? [])])] }, ...list]);
      return id;
    },
  }), [generated]);
  return <KnowledgeFilesContext.Provider value={value}>{children}</KnowledgeFilesContext.Provider>;
}

export function useKnowledgeFiles(): KnowledgeFilesContextValue {
  const value = useContext(KnowledgeFilesContext);
  if (!value) throw new Error("useKnowledgeFiles must be used inside KnowledgeFilesProvider");
  return value;
}

"use client";

import { usePolicies } from "@/admin/features/policies/components/policies-provider";
import { createContext, useEffect, useMemo, useReducer, useRef, useState, type ReactNode } from "react";
import { simulateRequest } from "@/lib/simulate-request";
import { usePipelineRunner } from "../hooks/use-pipeline-runner";
import { createDocumentsState, documentsReducer, padId } from "../lib/documents-reducer";
import { detectLanguage } from "../lib/detect-language";
import { pendingSteps } from "../lib/pipeline";
import { documentsOfSource } from "../lib/selectors";
import { extensionOf } from "../lib/validation";
import { syncSampleNames } from "../lib/sync-sample";
import type {
  ActionResult,
  AddSourceResult,
  DocumentInfoInput,
  DocumentRecord,
  FileSource,
  PickedFile,
  SourceInput,
  SyncInterval,
} from "../types";

export type DocumentsContextValue = {
  documents: DocumentRecord[];
  sources: FileSource[];
  testing: Record<string, boolean | undefined>;
  syncing: Record<string, boolean | undefined>;
  /** Adds already-checked files as queued documents and starts their processing. */
  addUploads: (files: PickedFile[]) => number;
  updateDocument: (id: string, input: DocumentInfoInput) => ActionResult;
  reprocess: (id: string) => void;
  deleteDocument: (id: string) => void;
  addSource: (input: SourceInput) => AddSourceResult;
  updateSource: (id: string, input: SourceInput) => ActionResult;
  testSource: (id: string) => Promise<"success" | "failed" | undefined>;
  setSyncInterval: (id: string, minutes: SyncInterval) => void;
  syncNow: (id: string) => Promise<{ added: number; changed: number; removed: number } | undefined>;
  /** Removes the source and its documents; returns the ids of the removed documents. */
  deleteSource: (id: string) => string[];
};

export const DocumentsContext = createContext<DocumentsContextValue | null>(null);

const fail = (error: string) => ({ ok: false, error }) as const;
const same = (a: string, b: string) => a.trim().toLowerCase() === b.trim().toLowerCase();

function newDoc(id: string, file: PickedFile, sourceId: string | null, now: string): DocumentRecord {
  return {
    id,
    name: file.name.replace(/\.[^.]+$/, ""),
    fileName: file.name,
    extension: extensionOf(file.name),
    sizeBytes: file.sizeBytes,
    language: detectLanguage(file.name),
    sourceId,
    status: "queued",
    steps: pendingSteps(),
    chunkCount: null,
    confidential: false,
    createdAt: now,
    updatedAt: now,
  };
}

type Props = { initialDocuments: DocumentRecord[]; initialSources: FileSource[]; children: ReactNode };

/** Temporary in-memory state shared by the documents and sources pages. */
export function DocumentsProvider({ initialDocuments, initialSources, children }: Props) {
  const [state, dispatch] = useReducer(documentsReducer, undefined, () =>
    createDocumentsState(initialDocuments, initialSources),
  );
  const latest = useRef(state);
  useEffect(() => {
    latest.current = state;
  });
  const syncCount = useRef<Record<string, number>>({});
  const [testing, setTesting] = useState<Record<string, boolean | undefined>>({});
  const [syncing, setSyncing] = useState<Record<string, boolean | undefined>>({});
  const runner = usePipelineRunner(dispatch);
  const { policies, setConfidential } = usePolicies();

  const value = useMemo<DocumentsContextValue>(() => {
    const nameTaken = (name: string, exceptId?: string) =>
      state.sources.some((s) => s.id !== exceptId && same(s.name, name));
    // Confidentiality lives in the policies; until the admin first changes one, each document keeps its own flag.
    const saved = policies.confidentialDocumentIds;
    const documents = state.documents.map((d) => ({ ...d, confidential: saved === null ? d.confidential : saved.includes(d.id) }));
    return {
      documents,
      sources: state.sources,
      testing,
      syncing,
      addUploads: (files) => {
        const now = new Date().toISOString();
        const docs = files.map((f, i) => newDoc(padId("doc", state.nextDoc + i), f, null, now));
        dispatch({ type: "addDocuments", docs });
        docs.forEach((d) => runner.run({ id: d.id, fileName: d.fileName }));
        return docs.length;
      },
      updateDocument: (id, input) => {
        if (!input.name.trim()) return fail("نام سند را وارد کنید.");
        dispatch({ type: "updateDocument", id, input, now: new Date().toISOString() });
        const current = documents.find((d) => d.id === id);
        if (current && current.confidential !== input.confidential) {
          void setConfidential(id, input.confidential, documents.filter((d) => d.confidential).map((d) => d.id));
        }
        return { ok: true };
      },
      reprocess: (id) => {
        const doc = state.documents.find((d) => d.id === id);
        if (!doc) return;
        dispatch({ type: "setSteps", id, steps: pendingSteps(), now: new Date().toISOString() });
        runner.run({ id, fileName: doc.fileName.replace(/^error/i, "ok-") });
      },
      deleteDocument: (id) => {
        runner.cancel(id);
        dispatch({ type: "deleteDocument", id });
      },
      addSource: (input) => {
        if (nameTaken(input.name)) return fail("منبعی با این نام وجود دارد.");
        const id = padId("fsrc", state.nextSource);
        dispatch({
          type: "addSource",
          source: {
            id,
            name: input.name.trim(),
            protocol: input.protocol,
            host: input.host.trim(),
            port: input.port,
            folderPath: input.folderPath.trim(),
            username: input.username.trim(),
            hasPassword: true,
            testResult: "untested",
            syncIntervalMinutes: 60,
            lastSyncAt: null,
            lastSyncSummary: null,
            createdAt: new Date().toISOString(),
          },
        });
        return { ok: true, id };
      },
      updateSource: (id, input) => {
        if (nameTaken(input.name, id)) return fail("منبعی با این نام وجود دارد.");
        dispatch({ type: "updateSource", id, input });
        return { ok: true };
      },
      testSource: async (id) => {
        const source = latest.current.sources.find((s) => s.id === id);
        if (!source) return undefined;
        setTesting((t) => ({ ...t, [id]: true }));
        await simulateRequest(1200);
        const result = source.host.trim().toLowerCase().startsWith("error.") ? "failed" : "success";
        dispatch({ type: "setSourceTest", id, result });
        setTesting((t) => ({ ...t, [id]: undefined }));
        return result;
      },
      setSyncInterval: (id, minutes) => dispatch({ type: "setInterval", id, minutes }),
      syncNow: async (id) => {
        const source = latest.current.sources.find((s) => s.id === id);
        if (!source || source.testResult !== "success") return undefined;
        setSyncing((s) => ({ ...s, [id]: true }));
        await simulateRequest(1000);
        const round = syncCount.current[id] ?? 0;
        syncCount.current[id] = round + 1;
        const own = documentsOfSource(id, latest.current.documents);
        const now = new Date().toISOString();
        const names = syncSampleNames.slice((round * 2) % syncSampleNames.length).slice(0, 1 + (round % 2));
        const base = latest.current.nextDoc;
        const added = names.map((name, i) =>
          newDoc(padId("doc", base + i), { name, sizeBytes: 600 * 1024 + i * 211_000 }, id, now),
        );
        const changedIds = own.length > 0 ? [own[0].id] : [];
        const removedIds = round >= 1 && own.length > 1 ? [own[own.length - 1].id] : [];
        const summary = { added: added.length, changed: changedIds.length, removed: removedIds.length };
        removedIds.forEach(runner.cancel);
        dispatch({ type: "applySync", id, added, changedIds, removedIds, summary, now });
        added.forEach((d) => runner.run({ id: d.id, fileName: d.fileName }));
        changedIds.forEach((cid) => {
          const d = own.find((x) => x.id === cid);
          if (d) runner.run({ id: cid, fileName: d.fileName });
        });
        setSyncing((s) => ({ ...s, [id]: undefined }));
        return summary;
      },
      deleteSource: (id) => {
        const removed = documentsOfSource(id, state.documents).map((d) => d.id);
        removed.forEach(runner.cancel);
        dispatch({ type: "deleteSource", id });
        return removed;
      },
    };
  }, [state, testing, syncing, runner, policies.confidentialDocumentIds, setConfidential]);

  return <DocumentsContext.Provider value={value}>{children}</DocumentsContext.Provider>;
}

import type {
  DocumentInfoInput,
  DocumentRecord,
  FileSource,
  PipelineStep,
  SourceInput,
  SyncInterval,
  SyncSummary,
  TestResult,
} from "../types";
import { statusOf } from "./pipeline";

export type DocumentsState = {
  documents: DocumentRecord[];
  sources: FileSource[];
  nextDoc: number;
  nextSource: number;
};

export type DocumentsAction =
  | { type: "addDocuments"; docs: DocumentRecord[] }
  | { type: "updateDocument"; id: string; input: DocumentInfoInput; now: string }
  | { type: "setSteps"; id: string; steps: PipelineStep[]; chunkCount?: number | null; now: string }
  | { type: "deleteDocument"; id: string }
  | { type: "addSource"; source: FileSource }
  | { type: "updateSource"; id: string; input: SourceInput }
  | { type: "setSourceTest"; id: string; result: Exclude<TestResult, "untested"> }
  | { type: "setInterval"; id: string; minutes: SyncInterval }
  | { type: "applySync"; id: string; added: DocumentRecord[]; changedIds: string[]; removedIds: string[]; summary: SyncSummary; now: string }
  | { type: "deleteSource"; id: string };

export const createDocumentsState = (documents: DocumentRecord[], sources: FileSource[]): DocumentsState => ({
  documents,
  sources,
  nextDoc: documents.length + 1,
  nextSource: sources.length + 1,
});

export const padId = (prefix: string, n: number) => `${prefix}-${String(n).padStart(3, "0")}`;

const patchDoc = (docs: DocumentRecord[], id: string, change: Partial<DocumentRecord>) =>
  docs.map((d) => (d.id === id ? { ...d, ...change } : d));

const connectionChanged = (prev: FileSource, next: SourceInput) =>
  prev.protocol !== next.protocol ||
  prev.host !== next.host.trim() ||
  prev.port !== next.port ||
  prev.folderPath !== next.folderPath.trim() ||
  prev.username !== next.username.trim() ||
  Boolean(next.password);

export function documentsReducer(state: DocumentsState, action: DocumentsAction): DocumentsState {
  switch (action.type) {
    case "addDocuments":
      return {
        ...state,
        documents: [...action.docs, ...state.documents],
        nextDoc: state.nextDoc + action.docs.length,
      };
    case "updateDocument":
      return {
        ...state,
        documents: patchDoc(state.documents, action.id, {
          name: action.input.name.trim(),
          language: action.input.language,
          confidential: action.input.confidential,
          updatedAt: action.now,
        }),
      };
    case "setSteps": {
      const status = statusOf(action.steps);
      return {
        ...state,
        documents: state.documents.map((d) => {
          if (d.id !== action.id) return d;
          const chunkCount =
            status === "ready" ? (action.chunkCount ?? d.chunkCount ?? 12) : status === "error" ? null : d.chunkCount;
          return { ...d, steps: action.steps, status, chunkCount, updatedAt: action.now };
        }),
      };
    }
    case "deleteDocument":
      return { ...state, documents: state.documents.filter((d) => d.id !== action.id) };
    case "addSource":
      return { ...state, sources: [...state.sources, action.source], nextSource: state.nextSource + 1 };
    case "updateSource": {
      const prev = state.sources.find((s) => s.id === action.id);
      if (!prev) return state;
      const { input } = action;
      const reset = connectionChanged(prev, input);
      return {
        ...state,
        sources: state.sources.map((s) =>
          s.id === action.id
            ? {
                ...s,
                name: input.name.trim(),
                protocol: input.protocol,
                host: input.host.trim(),
                port: input.port,
                folderPath: input.folderPath.trim(),
                username: input.username.trim(),
                ...(reset ? { testResult: "untested" as const } : {}),
              }
            : s,
        ),
      };
    }
    case "setSourceTest":
      return {
        ...state,
        sources: state.sources.map((s) => (s.id === action.id ? { ...s, testResult: action.result } : s)),
      };
    case "setInterval":
      return {
        ...state,
        sources: state.sources.map((s) => (s.id === action.id ? { ...s, syncIntervalMinutes: action.minutes } : s)),
      };
    case "applySync": {
      const removed = new Set(action.removedIds);
      const changed = new Set(action.changedIds);
      const documents = state.documents
        .filter((d) => !removed.has(d.id))
        .map((d) => (changed.has(d.id) ? { ...d, status: "queued" as const, steps: d.steps.map((s) => ({ key: s.key, state: "pending" as const })), updatedAt: action.now } : d));
      return {
        ...state,
        documents: [...action.added, ...documents],
        nextDoc: state.nextDoc + action.added.length,
        sources: state.sources.map((s) =>
          s.id === action.id ? { ...s, lastSyncAt: action.now, lastSyncSummary: action.summary } : s,
        ),
      };
    }
    case "deleteSource":
      return {
        ...state,
        sources: state.sources.filter((s) => s.id !== action.id),
        documents: state.documents.filter((d) => d.sourceId !== action.id),
      };
  }
}

"use client";

import {
  createContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { getSourceSchema } from "../data/source-schemas";
import {
  createDataSourcesState,
  dataSourcesReducer,
  padId,
} from "../lib/data-sources-reducer";
import { simulateConnectionTest } from "../lib/simulate-test";
import { simulateRequest } from "@/lib/simulate-request";
import type {
  ActionResult,
  AddSourceResult,
  DataSchema,
  DataSource,
  SchemaDescriptions,
  SchemaInput,
  SourceInput,
  SourceTable,
  TestResult,
} from "../types";

export type DataSourcesContextValue = {
  sources: DataSource[];
  descriptions: SchemaDescriptions;
  schemas: Record<string, SourceTable[]>;
  /** Named sets of tables, with access given to each set. */
  dataSchemas: DataSchema[];
  /** Source ids with a test or a structure fetch in progress. */
  testing: Record<string, boolean | undefined>;
  fetchingSchema: Record<string, boolean | undefined>;
  addSource: (input: SourceInput) => AddSourceResult;
  updateSource: (id: string, input: SourceInput) => ActionResult;
  testSource: (id: string) => Promise<Exclude<TestResult, "untested"> | undefined>;
  setActive: (id: string, active: boolean) => ActionResult;
  deleteSource: (id: string) => void;
  saveDescriptions: (id: string, map: Record<string, string>) => void;
  refetchSchema: (id: string) => Promise<void>;
  addDataSchema: (sourceId: string, input: SchemaInput) => string;
  updateDataSchema: (id: string, input: SchemaInput) => void;
  deleteDataSchema: (id: string) => void;
};

export const DataSourcesContext = createContext<DataSourcesContextValue | null>(null);

const fail = (error: string) => ({ ok: false, error }) as const;
const same = (a: string, b: string) => a.trim().toLowerCase() === b.trim().toLowerCase();

const schemaFields = (input: SchemaInput) => ({
  name: input.name.trim(),
  description: input.description.trim(),
  tableIds: input.tableIds,
  rowFilter: input.rowFilter?.trim() ?? "",
  confidential: input.confidential ?? false,
});

type Props = {
  initialSources: DataSource[];
  initialDescriptions: SchemaDescriptions;
  initialDataSchemas?: DataSchema[];
  children: ReactNode;
};

/** Temporary in-memory state shared by the data list and connection pages. */
export function DataSourcesProvider({ initialSources, initialDescriptions, initialDataSchemas = [], children }: Props) {
  const [state, dispatch] = useReducer(dataSourcesReducer, undefined, () =>
    createDataSourcesState(
      initialSources,
      initialDescriptions,
      Object.fromEntries(
        initialSources.filter((s) => s.testResult === "success").map((s) => [s.id, getSourceSchema(s.id, 0)]),
      ),
    ),
  );
  const [dataSchemas, setDataSchemas] = useState<DataSchema[]>(initialDataSchemas);
  const nextSchema = useRef(initialDataSchemas.length + 1);
  const latest = useRef(state);
  useEffect(() => {
    latest.current = state;
  });
  const rounds = useRef<Record<string, number>>({});
  const [testing, setTesting] = useState<Record<string, boolean | undefined>>({});
  const [fetchingSchema, setFetchingSchema] = useState<Record<string, boolean | undefined>>({});

  const value = useMemo<DataSourcesContextValue>(() => {
    const nameTaken = (name: string, exceptId?: string) =>
      state.sources.some((s) => s.id !== exceptId && same(s.name, name));
    return {
      sources: state.sources,
      descriptions: state.descriptions,
      schemas: state.schemas,
      dataSchemas,
      testing,
      fetchingSchema,
      addSource: (input) => {
        if (nameTaken(input.name)) return fail("اتصالی با این نام وجود دارد.");
        dispatch({ type: "add", input, now: new Date().toISOString() });
        return { ok: true, id: padId("source", state.nextSource) };
      },
      updateSource: (id, input) => {
        if (nameTaken(input.name, id)) return fail("اتصالی با این نام وجود دارد.");
        dispatch({ type: "update", id, input });
        return { ok: true };
      },
      testSource: async (id) => {
        const source = latest.current.sources.find((s) => s.id === id);
        if (!source) return undefined;
        setTesting((t) => ({ ...t, [id]: true }));
        const result = await simulateConnectionTest(source);
        dispatch({ type: "setTest", id, result });
        if (result === "success" && !latest.current.schemas[id]) {
          dispatch({ type: "setSchema", id, tables: getSourceSchema(id, rounds.current[id] ?? 0) });
        }
        setTesting((t) => ({ ...t, [id]: undefined }));
        return result;
      },
      setActive: (id, active) => {
        const source = state.sources.find((s) => s.id === id);
        if (active && source?.testResult !== "success") return fail("ابتدا اتصال را آزمایش کنید.");
        dispatch({ type: "setActive", id, active });
        return { ok: true };
      },
      deleteSource: (id) => {
        dispatch({ type: "delete", id });
        setDataSchemas((list) => list.filter((s) => s.sourceId !== id));
      },
      saveDescriptions: (id, map) => dispatch({ type: "setDescriptions", id, map }),
      refetchSchema: async (id) => {
        setFetchingSchema((f) => ({ ...f, [id]: true }));
        await simulateRequest(900);
        const round = (rounds.current[id] ?? 0) + 1;
        rounds.current[id] = round;
        dispatch({ type: "setSchema", id, tables: getSourceSchema(id, round) });
        setFetchingSchema((f) => ({ ...f, [id]: undefined }));
      },
      addDataSchema: (sourceId, input) => {
        const id = padId("schema", nextSchema.current++ + 100);
        setDataSchemas((list) => [...list, { id, sourceId, ...schemaFields(input) }]);
        return id;
      },
      updateDataSchema: (id, input) =>
        setDataSchemas((list) => list.map((s) => (s.id === id ? { ...s, ...schemaFields(input) } : s))),
      deleteDataSchema: (id) => setDataSchemas((list) => list.filter((s) => s.id !== id)),
    };
  }, [state, dataSchemas, testing, fetchingSchema]);

  return <DataSourcesContext.Provider value={value}>{children}</DataSourcesContext.Provider>;
}

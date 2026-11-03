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
import { seedAccessSchemas } from "../data/access-schemas";
import { getSourceSchema } from "../data/source-schemas";
import {
  createDataSourcesState,
  dataSourcesReducer,
  padId,
} from "../lib/data-sources-reducer";
import { simulateConnectionTest } from "../lib/simulate-test";
import { simulateRequest } from "@/lib/simulate-request";
import type {
  AccessSchema,
  ActionResult,
  SchemaGrant,
  AddSourceResult,
  DataSource,
  SchemaDescriptions,
  SourceInput,
  SourceTable,
  TestResult,
} from "../types";

export type DataSourcesContextValue = {
  sources: DataSource[];
  descriptions: SchemaDescriptions;
  schemas: Record<string, SourceTable[]>;
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
  /** Defined schemas by source id. */
  accessSchemas: Record<string, AccessSchema[]>;
  saveAccessSchema: (
    sourceId: string,
    schema: Omit<AccessSchema, "id" | "grants"> & { id?: string },
  ) => ActionResult;
  deleteAccessSchema: (sourceId: string, schemaId: string) => void;
  setSchemaGrant: (sourceId: string, schemaId: string, grant: SchemaGrant) => void;
  removeSchemaGrant: (
    sourceId: string,
    schemaId: string,
    subjectType: SchemaGrant["subjectType"],
    subjectId: string,
  ) => void;
};

export const DataSourcesContext = createContext<DataSourcesContextValue | null>(null);

const fail = (error: string) => ({ ok: false, error }) as const;
const same = (a: string, b: string) => a.trim().toLowerCase() === b.trim().toLowerCase();

type Props = {
  initialSources: DataSource[];
  initialDescriptions: SchemaDescriptions;
  children: ReactNode;
};

/** Temporary in-memory state shared by the data list and connection pages. */
export function DataSourcesProvider({ initialSources, initialDescriptions, children }: Props) {
  const [state, dispatch] = useReducer(dataSourcesReducer, undefined, () =>
    createDataSourcesState(
      initialSources,
      initialDescriptions,
      Object.fromEntries(
        initialSources.filter((s) => s.testResult === "success").map((s) => [s.id, getSourceSchema(0, s.id)]),
      ),
      seedAccessSchemas,
    ),
  );
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
          dispatch({ type: "setSchema", id, tables: getSourceSchema(rounds.current[id] ?? 0, id) });
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
      deleteSource: (id) => dispatch({ type: "delete", id }),
      saveDescriptions: (id, map) => dispatch({ type: "setDescriptions", id, map }),
      accessSchemas: state.accessSchemas,
      saveAccessSchema: (sourceId, schema) => {
        const name = schema.name.trim();
        if (!name) return fail("نام اسکیما را وارد کنید.");
        if ((state.accessSchemas[sourceId] ?? []).some((x) => x.id !== schema.id && same(x.name, name))) {
          return fail("اسکیمایی با این نام وجود دارد.");
        }
        if (schema.tableIds.length === 0) return fail("دست‌کم یک جدول انتخاب کنید.");
        dispatch({ type: "saveSchema", sourceId, schema: { ...schema, name } });
        return { ok: true };
      },
      deleteAccessSchema: (sourceId, schemaId) => dispatch({ type: "deleteSchema", sourceId, schemaId }),
      setSchemaGrant: (sourceId, schemaId, grant) =>
        dispatch({ type: "setSchemaGrant", sourceId, schemaId, grant }),
      removeSchemaGrant: (sourceId, schemaId, subjectType, subjectId) =>
        dispatch({ type: "removeSchemaGrant", sourceId, schemaId, subjectType, subjectId }),
      refetchSchema: async (id) => {
        setFetchingSchema((f) => ({ ...f, [id]: true }));
        await simulateRequest(900);
        const round = (rounds.current[id] ?? 0) + 1;
        rounds.current[id] = round;
        dispatch({ type: "setSchema", id, tables: getSourceSchema(round, id) });
        setFetchingSchema((f) => ({ ...f, [id]: undefined }));
      },
    };
  }, [state, testing, fetchingSchema]);

  return <DataSourcesContext.Provider value={value}>{children}</DataSourcesContext.Provider>;
}

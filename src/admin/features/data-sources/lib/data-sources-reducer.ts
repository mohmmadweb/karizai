import type { AccessSchema, DataSource, SchemaGrant, SchemaDescriptions, SourceInput, SourceTable, TestResult } from "../types";

export type DataSourcesState = {
  sources: DataSource[];
  descriptions: SchemaDescriptions;
  /** Tables read after a successful test, by source id. */
  schemas: Record<string, SourceTable[]>;
  nextSource: number;
  /** Defined schemas with their read-only grants, by source id. */
  accessSchemas: Record<string, AccessSchema[]>;
  nextSchema: number;
};

export type DataSourcesAction =
  | { type: "add"; input: SourceInput; now: string }
  | { type: "update"; id: string; input: SourceInput }
  | { type: "setTest"; id: string; result: Exclude<TestResult, "untested"> }
  | { type: "setSchema"; id: string; tables: SourceTable[] }
  | { type: "setActive"; id: string; active: boolean }
  | { type: "delete"; id: string }
  | { type: "saveSchema"; sourceId: string; schema: Omit<AccessSchema, "id" | "grants"> & { id?: string } }
  | { type: "deleteSchema"; sourceId: string; schemaId: string }
  | { type: "setSchemaGrant"; sourceId: string; schemaId: string; grant: SchemaGrant }
  | { type: "removeSchemaGrant"; sourceId: string; schemaId: string; subjectType: SchemaGrant["subjectType"]; subjectId: string }
  | { type: "setDescriptions"; id: string; map: Record<string, string> };

export function createDataSourcesState(
  sources: DataSource[],
  descriptions: SchemaDescriptions,
  schemas: Record<string, SourceTable[]>,
  accessSchemas: Record<string, AccessSchema[]> = {},
): DataSourcesState {
  const count = Object.values(accessSchemas).reduce((n, list) => n + list.length, 0);
  return { sources, descriptions, schemas, nextSource: sources.length + 1, accessSchemas, nextSchema: count + 1 };
}

export const padId = (prefix: string, n: number) => `${prefix}-${String(n).padStart(3, "0")}`;

/** Details that need a new test when they change; the name alone does not. */
function connectionChanged(prev: DataSource, next: SourceInput) {
  return (
    prev.type !== next.type ||
    prev.host !== next.host.trim() ||
    prev.port !== next.port ||
    prev.database !== next.database.trim() ||
    prev.username !== next.username.trim() ||
    Boolean(next.password)
  );
}

const patch = (state: DataSourcesState, id: string, change: Partial<DataSource>) => ({
  ...state,
  sources: state.sources.map((s) => (s.id === id ? { ...s, ...change } : s)),
});

export function dataSourcesReducer(
  state: DataSourcesState,
  action: DataSourcesAction,
): DataSourcesState {
  switch (action.type) {
    case "add": {
      const { input } = action;
      const source: DataSource = {
        id: padId("source", state.nextSource),
        name: input.name.trim(),
        type: input.type,
        host: input.host.trim(),
        port: input.port,
        database: input.database.trim(),
        username: input.username.trim(),
        hasPassword: true,
        testResult: "untested",
        active: false,
        createdAt: action.now,
      };
      return { ...state, sources: [...state.sources, source], nextSource: state.nextSource + 1 };
    }
    case "update": {
      const prev = state.sources.find((s) => s.id === action.id);
      if (!prev) return state;
      const { input } = action;
      const reset = connectionChanged(prev, input);
      const next = patch(state, action.id, {
        name: input.name.trim(),
        type: input.type,
        host: input.host.trim(),
        port: input.port,
        database: input.database.trim(),
        username: input.username.trim(),
        ...(reset ? { testResult: "untested" as const, active: false } : {}),
      });
      if (!reset) return next;
      const { [action.id]: _dropped, ...schemas } = state.schemas;
      void _dropped;
      return { ...next, schemas };
    }
    case "setTest":
      return patch(state, action.id, {
        testResult: action.result,
        ...(action.result === "failed" ? { active: false } : {}),
      });
    case "setSchema":
      return { ...state, schemas: { ...state.schemas, [action.id]: action.tables } };
    case "setActive": {
      const source = state.sources.find((s) => s.id === action.id);
      if (!source || (action.active && source.testResult !== "success")) return state;
      return patch(state, action.id, { active: action.active });
    }
    case "delete": {
      const { [action.id]: _s, ...schemas } = state.schemas;
      const { [action.id]: _d, ...descriptions } = state.descriptions;
      void _s;
      void _d;
      const { [action.id]: _a, ...accessSchemas } = state.accessSchemas;
      void _a;
      return {
        ...state,
        sources: state.sources.filter((s) => s.id !== action.id),
        schemas,
        descriptions,
        accessSchemas,
      };
    }
    case "setDescriptions":
      return {
        ...state,
        descriptions: { ...state.descriptions, [action.id]: action.map },
      };
    case "saveSchema": {
      const list = state.accessSchemas[action.sourceId] ?? [];
      const { id, ...fields } = action.schema;
      if (id && list.some((x) => x.id === id)) {
        return setSchemas(state, action.sourceId, list.map((x) => (x.id === id ? { ...x, ...fields } : x)));
      }
      const created: AccessSchema = { ...fields, id: padId("schema", state.nextSchema), grants: [] };
      return { ...setSchemas(state, action.sourceId, [...list, created]), nextSchema: state.nextSchema + 1 };
    }
    case "deleteSchema":
      return setSchemas(
        state,
        action.sourceId,
        (state.accessSchemas[action.sourceId] ?? []).filter((x) => x.id !== action.schemaId),
      );
    case "setSchemaGrant":
      return mapSchema(state, action.sourceId, action.schemaId, (x) => ({
        ...x,
        grants: [
          ...x.grants.filter((g) => !(g.subjectType === action.grant.subjectType && g.subjectId === action.grant.subjectId)),
          action.grant,
        ],
      }));
    case "removeSchemaGrant":
      return mapSchema(state, action.sourceId, action.schemaId, (x) => ({
        ...x,
        grants: x.grants.filter((g) => !(g.subjectType === action.subjectType && g.subjectId === action.subjectId)),
      }));
  }
}

const setSchemas = (state: DataSourcesState, sourceId: string, list: AccessSchema[]): DataSourcesState => ({
  ...state,
  accessSchemas: { ...state.accessSchemas, [sourceId]: list },
});

const mapSchema = (
  state: DataSourcesState,
  sourceId: string,
  schemaId: string,
  fn: (x: AccessSchema) => AccessSchema,
) =>
  setSchemas(
    state,
    sourceId,
    (state.accessSchemas[sourceId] ?? []).map((x) => (x.id === schemaId ? fn(x) : x)),
  );

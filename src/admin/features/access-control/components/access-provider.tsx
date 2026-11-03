"use client";

import { createContext, useMemo, useReducer, type ReactNode } from "react";
import type { AccessGrant, AccessPermission } from "../types";

export type AccessContextValue = {
  grants: AccessGrant[];
  grant: (grant: AccessGrant) => void;
  revoke: (grant: AccessGrant) => void;
  /** Changes the kind of permission of an existing grant. */
  setPermission: (grant: AccessGrant, permission: AccessPermission) => void;
  /** Removes every grant of the given resources, for example after a provider is deleted. */
  revokeAllForResources: (resourceIds: string[]) => void;
};

export const AccessContext = createContext<AccessContextValue | null>(null);

type Action =
  | { type: "grant"; grant: AccessGrant }
  | { type: "revoke"; grant: AccessGrant }
  | { type: "permission"; grant: AccessGrant; permission: AccessPermission }
  | { type: "revokeResources"; ids: string[] };

const same = (a: AccessGrant, b: AccessGrant) =>
  a.resourceType === b.resourceType &&
  a.resourceId === b.resourceId &&
  a.subjectType === b.subjectType &&
  a.subjectId === b.subjectId;

function reducer(state: AccessGrant[], action: Action): AccessGrant[] {
  switch (action.type) {
    case "grant":
      return state.some((g) => same(g, action.grant)) ? state : [...state, action.grant];
    case "revoke":
      return state.filter((g) => !same(g, action.grant));
    case "permission":
      return state.map((g) => (same(g, action.grant) ? { ...g, permission: action.permission } : g));
    case "revokeResources":
      return state.filter((g) => !action.ids.includes(g.resourceId));
  }
}

/** Temporary in-memory access grants shared by every page that sets access. */
export function AccessProvider({
  initialGrants,
  children,
}: {
  initialGrants: AccessGrant[];
  children: ReactNode;
}) {
  const [grants, dispatch] = useReducer(reducer, initialGrants);
  const value = useMemo<AccessContextValue>(
    () => ({
      grants,
      grant: (grant) => dispatch({ type: "grant", grant }),
      revoke: (grant) => dispatch({ type: "revoke", grant }),
      setPermission: (grant, permission) => dispatch({ type: "permission", grant, permission }),
      revokeAllForResources: (ids) => dispatch({ type: "revokeResources", ids }),
    }),
    [grants],
  );
  return <AccessContext.Provider value={value}>{children}</AccessContext.Provider>;
}

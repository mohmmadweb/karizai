import type { Account, CurrentUser, Quota } from "../types";

export function getCurrentUser(): CurrentUser {
  return { id: "user-1", name: "مریم احمدی", email: "maryam@example.com", groupIds: ["group-001", "group-005"] };
}

export function getQuota(): Quota {
  return { limit: 200000, used: 128400, resetsAt: "2026-11-22T00:00:00.000Z" };
}

export function getAccount(): Account {
  return { ...getCurrentUser(), groups: ["فروش", "منابع انسانی"], authType: "local" };
}

/** Features the user may use; home starters are filtered with it. */
export function getCapabilities(): string[] {
  return ["knowledge", "data"];
}

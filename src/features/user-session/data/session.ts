import type { Account, CurrentUser, Quota } from "../types";

const users: CurrentUser[] = [
  { id: "user-1", name: "مریم احمدی", email: "m.ahmadi@parsapolymer.ir", groupIds: ["group-003"] },
  { id: "user-2", name: "رضا کریمی", email: "reza@example.com", groupIds: ["group-002"] },
];
const groupNames: Record<string, string> = { "group-001": "فروش", "group-002": "مالی", "group-003": "کیفیت و فرمولاسیون", "group-005": "منابع انسانی" };
let currentUserId = users[0].id;

/** The user the panel acts as. The switch in the top bar changes it for a demo of two roles; it resets on reload. */
export function getCurrentUser(): CurrentUser {
  return users.find((user) => user.id === currentUserId) ?? users[0];
}

export function getDemoUsers(): CurrentUser[] {
  return users;
}

export function setCurrentUserId(id: string) {
  currentUserId = id;
}

export function getQuota(): Quota {
  return { limit: 200000, used: 128400, resetsAt: "2026-11-22T00:00:00.000Z" };
}

export function getAccount(): Account {
  return { ...getCurrentUser(), groups: getCurrentUser().groupIds.map((id) => groupNames[id] ?? id), authType: "local" };
}

/** Features the user may use; home starters are filtered with it. */
export function getCapabilities(): string[] {
  return ["knowledge", "data"];
}

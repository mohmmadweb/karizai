import type { Membership } from "../types";

const memberships: Membership[] = [
  { userId: "user-002", groupId: "group-001" },
  { userId: "user-003", groupId: "group-001" },
  { userId: "user-003", groupId: "group-003" },
  { userId: "user-004", groupId: "group-002" },
  { userId: "user-005", groupId: "group-004" },
  { userId: "user-006", groupId: "group-003" },
  { userId: "user-006", groupId: "group-002" },
  { userId: "user-007", groupId: "group-003" },
];

export function getMemberships(): Membership[] {
  return memberships;
}

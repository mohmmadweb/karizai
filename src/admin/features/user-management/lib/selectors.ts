import type { Group, Membership, User } from "../types";

/** Same letters typed with Arabic keyboards match Persian ones. */
function normalize(value: string) {
  return value.replace(/ي/g, "ی").replace(/ك/g, "ک").trim().toLowerCase();
}

export function filterUsers(users: User[], query: string): User[] {
  const q = normalize(query);
  if (!q) return users;
  return users.filter(
    (u) => normalize(u.name).includes(q) || normalize(u.email).includes(q),
  );
}

export function filterGroups(groups: Group[], query: string): Group[] {
  const q = normalize(query);
  if (!q) return groups;
  return groups.filter(
    (g) => normalize(g.name).includes(q) || normalize(g.code).includes(q),
  );
}

export function groupsOfUser(
  userId: string,
  groups: Group[],
  memberships: Membership[],
): Group[] {
  const ids = new Set(
    memberships.filter((m) => m.userId === userId).map((m) => m.groupId),
  );
  return groups.filter((g) => ids.has(g.id));
}

export function membersOfGroup(
  groupId: string,
  users: User[],
  memberships: Membership[],
): User[] {
  const ids = new Set(
    memberships.filter((m) => m.groupId === groupId).map((m) => m.userId),
  );
  return users.filter((u) => ids.has(u.id));
}

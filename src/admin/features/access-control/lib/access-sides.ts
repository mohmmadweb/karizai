import type { AccessSide, AccessSubject } from "@/admin/components/shared/access-grants-panel";
import type { AccessGrant, AccessResourceType } from "../types";
import type { Group, Membership, User } from "@/admin/features/user-management/types";

type Input = {
  resourceType: AccessResourceType;
  resourceId: string;
  grants: AccessGrant[];
  users: User[];
  groups: Group[];
  memberships: Membership[];
  /** A wider resource whose grants also count, for example the whole database for one schema. */
  alsoVia?: { resourceType: AccessResourceType; resourceId: string; label: string };
};

const forResource = (grants: AccessGrant[], type: AccessResourceType, resourceId: string) =>
  grants.filter((g) => g.resourceType === type && g.resourceId === resourceId);

/** Groups of this resource: those that have access, and active ones that could be added. */
export function groupAccessSide({ resourceType, resourceId, grants, groups }: Input): AccessSide {
  const ids = new Set(
    forResource(grants, resourceType, resourceId).filter((g) => g.subjectType === "group").map((g) => g.subjectId),
  );
  const own = forResource(grants, resourceType, resourceId).filter((g) => g.subjectType === "group");
  const toSubject = (g: Group): AccessSubject => ({
    id: g.id,
    label: g.name,
    inactive: g.status === "inactive",
    permission: own.find((grant) => grant.subjectId === g.id)?.permission ?? "read",
  });
  return {
    granted: groups.filter((g) => ids.has(g.id)).map(toSubject),
    available: groups.filter((g) => !ids.has(g.id) && g.status === "active").map(toSubject),
  };
}

/** Users with special access. Notes tell when a user also gets access through a group. */
export function userAccessSide({ resourceType, resourceId, grants, users, groups, memberships, alsoVia }: Input): AccessSide {
  const own = forResource(grants, resourceType, resourceId);
  const userIds = new Set(own.filter((g) => g.subjectType === "user").map((g) => g.subjectId));
  const groupIds = new Set(own.filter((g) => g.subjectType === "group").map((g) => g.subjectId));
  const reaches = (ids: Set<string>, userId: string) =>
    memberships.some(
      (m) =>
        m.userId === userId &&
        ids.has(m.groupId) &&
        groups.some((g) => g.id === m.groupId && g.status === "active"),
    );
  const viaGroup = (userId: string) => reaches(groupIds, userId);
  const wide = alsoVia ? forResource(grants, alsoVia.resourceType, alsoVia.resourceId) : [];
  const wideUsers = new Set(wide.filter((g) => g.subjectType === "user").map((g) => g.subjectId));
  const wideGroups = new Set(wide.filter((g) => g.subjectType === "group").map((g) => g.subjectId));
  const viaWide = (userId: string) => wideUsers.has(userId) || reaches(wideGroups, userId);
  const toSubject = (u: User): AccessSubject => ({
    id: u.id,
    label: u.name,
    hint: u.email,
    inactive: u.status === "inactive",
    note:
      [
        viaGroup(u.id) ? "از طریق گروه‌هایش هم دسترسی دارد." : "",
        viaWide(u.id) && alsoVia ? `از طریق ${alsoVia.label} هم دسترسی دارد.` : "",
      ]
        .filter(Boolean)
        .join(" ") || undefined,
    permission: own.find((g) => g.subjectType === "user" && g.subjectId === u.id)?.permission ?? "read",
  });
  return {
    granted: users.filter((u) => userIds.has(u.id)).map(toSubject),
    available: users
      .filter((u) => !userIds.has(u.id) && u.status === "active")
      .map((u) => {
        const subject = toSubject(u);
        return subject.note
          ? { ...subject, label: `${u.name} (دسترسی گروهی دارد)` }
          : subject;
      }),
  };
}

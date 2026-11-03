export type EntityStatus = "active" | "inactive";

export type UserRole = "admin" | "user";

/** The password is never part of a user record. */
export type User = {
  id: string;
  name: string;
  email: string;
  status: EntityStatus;
  role: UserRole;
  /** ISO date string. */
  createdAt: string;
};

export type Group = {
  id: string;
  /** Short unique English code; fixed when the group is created. */
  code: string;
  name: string;
  description: string;
  status: EntityStatus;
  /** ISO date string. */
  createdAt: string;
};

/** One row of the many-to-many link between a user and a group. */
export type Membership = {
  userId: string;
  groupId: string;
};

export type ExcelPreviewRow = {
  id: string;
  name: string;
  email: string;
  groupName: string;
};

export type NewUserInput = {
  name: string;
  email: string;
  /** Groups the new user joins at once; inactive groups are skipped. */
  groupIds?: string[];
};

export type GroupEditInput = { name: string; description: string };

export type NewGroupInput = GroupEditInput & { code: string };

/** Result of a state action: an error message in Persian, or success. */
export type ActionResult = { ok: true } | { ok: false; error: string };

/** Result of creating a group: the new id, or an error message in Persian. */
export type AddGroupResult = { ok: true; id: string } | { ok: false; error: string };

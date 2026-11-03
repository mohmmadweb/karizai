/** What can be shared. Later features add their own resource types. */
export type AccessResourceType = "model" | "database" | "document" | "folder" | "agent" | "schema";

export type AccessSubjectType = "group" | "user";

/** Read only, or read and write (for example a tool of an Agent that can record an order). */
export type AccessPermission = "read" | "readwrite";

export const accessPermissionLabels: Record<AccessPermission, string> = {
  read: "خواندن",
  readwrite: "خواندن‌ونوشتن",
};

/** One row of the many-to-many link between a resource and a group or user. */
export type AccessGrant = {
  resourceType: AccessResourceType;
  resourceId: string;
  subjectType: AccessSubjectType;
  subjectId: string;
  /** Kind of permission. A grant without it is read-only. */
  permission?: AccessPermission;
};

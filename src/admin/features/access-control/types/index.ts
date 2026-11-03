/** What can be shared. Later features add their own resource types. */
export type AccessResourceType = "model" | "database" | "document" | "folder";

export type AccessSubjectType = "group" | "user";

/** One row of the many-to-many link between a resource and a group or user. */
export type AccessGrant = {
  resourceType: AccessResourceType;
  resourceId: string;
  subjectType: AccessSubjectType;
  subjectId: string;
};

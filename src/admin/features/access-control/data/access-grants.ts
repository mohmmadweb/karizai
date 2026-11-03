import type { AccessGrant } from "../types";

const grants: AccessGrant[] = [
  { resourceType: "model", resourceId: "model-001", subjectType: "group", subjectId: "group-001" },
  { resourceType: "model", resourceId: "model-001", subjectType: "group", subjectId: "group-003" },
  { resourceType: "model", resourceId: "model-002", subjectType: "group", subjectId: "group-003" },
  { resourceType: "model", resourceId: "model-002", subjectType: "user", subjectId: "user-002" },
  { resourceType: "model", resourceId: "model-004", subjectType: "group", subjectId: "group-004" },
  { resourceType: "model", resourceId: "model-004", subjectType: "group", subjectId: "group-002" },
  { resourceType: "model", resourceId: "model-005", subjectType: "user", subjectId: "user-004" },
  { resourceType: "database", resourceId: "source-001", subjectType: "group", subjectId: "group-001" },
  { resourceType: "database", resourceId: "source-001", subjectType: "group", subjectId: "group-002" },
  { resourceType: "database", resourceId: "source-001", subjectType: "user", subjectId: "user-007" },
  { resourceType: "document", resourceId: "doc-001", subjectType: "group", subjectId: "group-005" },
  { resourceType: "document", resourceId: "doc-001", subjectType: "user", subjectId: "user-002" },
  { resourceType: "document", resourceId: "doc-003", subjectType: "group", subjectId: "group-002" },
  { resourceType: "document", resourceId: "doc-004", subjectType: "group", subjectId: "group-001" },
  { resourceType: "document", resourceId: "doc-008", subjectType: "group", subjectId: "group-003" },
  { resourceType: "folder", resourceId: "fsrc-001", subjectType: "group", subjectId: "group-003" },
];

export function getAccessGrants(): AccessGrant[] {
  return grants;
}

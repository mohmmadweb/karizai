import type { AccessGrant } from "@/admin/features/access-control/types";
import type { Group, User } from "@/admin/features/user-management/types";
import type { DocStatus, DocumentRecord, FileSource } from "../types";

const norm = (v: string) => v.replace(/ي/g, "ی").replace(/ك/g, "ک").trim().toLowerCase();

export function filterDocuments(docs: DocumentRecord[], query: string, status: DocStatus | "all"): DocumentRecord[] {
  const q = norm(query);
  return docs.filter(
    (d) => (status === "all" || d.status === status) && (!q || norm(d.name).includes(q) || norm(d.fileName).includes(q)),
  );
}

export const documentsOfSource = (sourceId: string, docs: DocumentRecord[]) =>
  docs.filter((d) => d.sourceId === sourceId);

export const sourceOf = (doc: DocumentRecord, sources: FileSource[]) =>
  doc.sourceId ? sources.find((s) => s.id === doc.sourceId) : undefined;

/** Groups and users that reach a document only through its folder. */
export function folderGrantNames(
  doc: DocumentRecord,
  grants: AccessGrant[],
  groups: Group[],
  users: User[],
): { groups: string[]; users: string[] } {
  if (!doc.sourceId) return { groups: [], users: [] };
  const own = grants.filter((g) => g.resourceType === "folder" && g.resourceId === doc.sourceId);
  return {
    groups: own.filter((g) => g.subjectType === "group").map((g) => groups.find((x) => x.id === g.subjectId)?.name ?? "گروه حذف‌شده"),
    users: own.filter((g) => g.subjectType === "user").map((g) => users.find((x) => x.id === g.subjectId)?.name ?? "کاربر حذف‌شده"),
  };
}

/** True when nobody can see the document: no grant on it and none on its folder. */
export function hasNoAccess(doc: DocumentRecord, grants: AccessGrant[]) {
  return !grants.some(
    (g) =>
      (g.resourceType === "document" && g.resourceId === doc.id) ||
      (g.resourceType === "folder" && doc.sourceId !== null && g.resourceId === doc.sourceId),
  );
}

export const protocolLabel = { smb: "SMB", ftp: "FTP", sftp: "SFTP", seafile: "Seafile" } as const;

export const defaultPort = { smb: 445, ftp: 21, sftp: 22, seafile: 443 } as const;

export const intervalLabel: Record<number, string> = {
  15: "هر ۱۵ دقیقه",
  60: "ساعتی",
  360: "هر شش ساعت",
  1440: "روزانه",
};

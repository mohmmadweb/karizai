import { downloadGeneratedFile } from "@/features/chat/lib/generated-file-export";
import { formatDate, formatNumber } from "@/lib/format";
import type { KnowledgeDocument } from "../types";

export type SortKey = "title" | "updatedAt" | "sizeKb";
export type SortDirection = "asc" | "desc";

export const kindLabels: Record<KnowledgeDocument["kind"], string> = { word: "Word", excel: "Excel" };

export const sizeText = (kb: number) => (kb >= 1024 ? `${formatNumber(Math.round((kb / 1024) * 10) / 10)} مگابایت` : `${formatNumber(kb)} کیلوبایت`);

/** Folders are the places documents come from, with how many documents each holds. */
export function folderCounts(documents: KnowledgeDocument[]): { name: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const doc of documents) counts.set(doc.source, (counts.get(doc.source) ?? 0) + 1);
  return [...counts].map(([name, count]) => ({ name, count })).sort((a, b) => a.name.localeCompare(b.name, "fa"));
}

export function sortDocuments(documents: KnowledgeDocument[], key: SortKey, direction: SortDirection): KnowledgeDocument[] {
  const factor = direction === "asc" ? 1 : -1;
  const value = (doc: KnowledgeDocument) => (key === "title" ? doc.title : key === "sizeKb" ? doc.sizeKb : doc.updatedAt ?? "");
  return [...documents].sort((a, b) => {
    const [x, y] = [value(a), value(b)];
    return (typeof x === "number" && typeof y === "number" ? x - y : String(x).localeCompare(String(y), "fa")) * factor;
  });
}

/** The file is built in the browser from the document's details; the document's own content is not kept in this app. */
export function downloadDocument(doc: KnowledgeDocument) {
  const details: [string, string][] = [
    ["پوشه", doc.source],
    ["دسته", doc.collection],
    ["آخرین به‌روزرسانی", doc.updatedAt ? formatDate(doc.updatedAt) : "نامشخص"],
    ["حجم", sizeText(doc.sizeKb)],
  ];
  downloadGeneratedFile(doc.kind === "excel"
    ? { id: doc.id, kind: "excel", name: doc.title, title: doc.title, columns: ["مشخصه", "مقدار"], rows: details }
    : { id: doc.id, kind: "word", name: doc.title, title: doc.title, sections: [{ heading: "مشخصات سند", lines: details.map(([k, v]) => `${k}: ${v}`) }] });
}

import { downloadGeneratedFile } from "@/features/chat/lib/generated-file-export";
import { formatDate, formatNumber } from "@/lib/format";
import type { KnowledgeDocument } from "../types";

export type SortKey = "title" | "updatedAt" | "sizeKb";
export type SortDirection = "asc" | "desc";

export const kindLabels: Record<KnowledgeDocument["kind"], string> = { pdf: "PDF", word: "Word", excel: "Excel" };

export const sizeText = (kb: number) => (kb >= 1024 ? `${formatNumber(Math.round((kb / 1024) * 10) / 10)} مگابایت` : `${formatNumber(kb)} کیلوبایت`);

/** Folders are the places documents come from, with how many documents each holds; empty folders the user made are kept. */
export function folderCounts(documents: KnowledgeDocument[], extra: string[] = []): { name: string; count: number }[] {
  const counts = new Map<string, number>(extra.map((name) => [name, 0]));
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

/**
 * «✦ جستجوی معنایی»: ranks documents by the concepts of the question, not only the name.
 * Simulated with concept words per document; the real index comes with the backend.
 */
export function semanticSearch(documents: KnowledgeDocument[], query: string): { doc: KnowledgeDocument; score: number }[] {
  const words = query.replace(/[«»"،.؟?]/g, " ").split(/\s+/).filter((word) => word.length > 2);
  if (words.length === 0) return [];
  return documents
    .map((doc) => {
      const haystack = [...(doc.keywords ?? []), ...(doc.tags ?? []), doc.title, doc.summary ?? ""].join(" ");
      const hits = words.filter((word) => haystack.includes(word) || haystack.includes(word.replace(/ی$/, ""))).length;
      return { doc, score: hits === 0 ? 0 : Math.min(97, 55 + Math.round((hits / words.length) * 40) + (doc.keywords?.some((k) => words.includes(k)) ? 6 : 0)) };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score);
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
    : { id: doc.id, kind: "word", name: doc.title, title: doc.title, sections: [{ heading: "مشخصات سند", lines: [...details.map(([k, v]) => `${k}: ${v}`), ...(doc.summary ? [`خلاصه: ${doc.summary}`] : [])] }] });
}

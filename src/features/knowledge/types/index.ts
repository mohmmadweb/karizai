export type DocumentKind = "pdf" | "word" | "excel";

export type KnowledgeDocument = {
  id: string;
  title: string;
  /** Where the document comes from, for example a folder or system. */
  source: string;
  collection: string;
  kind: DocumentKind;
  sizeKb: number;
  /** ISO date; absent when unknown. */
  updatedAt?: string;
  /** «برچسب‌های هوشمند» the AI gave the file. */
  tags?: string[];
  /** One-line content summary; used by «✦ خلاصه» and the semantic search. */
  summary?: string;
  /** Concepts for the semantic search. */
  keywords?: string[];
  /** Metadata «✦ استخراج» finds in the file. */
  meta?: { type: string; code?: string; owner: string; confidentiality: string };
  /** The same document in the admin's document list; the admin can mark it confidential there. */
  adminDocId?: string;
};

/** A source the organization's knowledge is built from, with its sync state. */
export type KnowledgeCollection = {
  id: string;
  title: string;
  source: string;
  icon: "folder" | "archive" | "mail" | "chat" | "scan";
  /** For example «۲۳۴ سند». */
  countLabel: string;
  sync: { state: "synced"; ago?: string } | { state: "processing"; percent: number };
  /** Prepared answer of «✦ گفتگو درباره این مجموعه». */
  answer: string;
};

export type KnowledgeDocument = {
  id: string;
  title: string;
  /** Where the document comes from, for example a folder or system. */
  source: string;
  collection: string;
  /** Word or Excel file. */
  kind: "word" | "excel";
  sizeKb: number;
  /** ISO date; absent when unknown. */
  updatedAt?: string;
  /** The document's own flag; the saved policies override it once the admin changes the list. */
  confidential?: boolean;
};

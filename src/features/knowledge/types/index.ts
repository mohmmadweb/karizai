export type KnowledgeDocument = {
  id: string;
  title: string;
  /** Where the document comes from, for example a folder or system. */
  source: string;
  collection: string;
  /** ISO date; absent when unknown. */
  updatedAt?: string;
};

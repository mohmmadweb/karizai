import type { Metadata } from "next";
import { KnowledgePageContent } from "@/features/knowledge/components/knowledge-page-content";
import { getKnowledgeDocuments } from "@/features/knowledge/data/documents";

export const metadata: Metadata = { title: "دانش سازمان | موشکاف" };

export default function KnowledgePage() {
  return <KnowledgePageContent documents={getKnowledgeDocuments()} />;
}

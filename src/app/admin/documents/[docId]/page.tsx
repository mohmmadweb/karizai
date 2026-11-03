import { Suspense } from "react";
import { ListSkeleton } from "@/components/shared/list-skeleton";
import { DocumentDetail } from "@/admin/features/documents/components/detail/document-detail";
import { getDocuments } from "@/admin/features/documents/data/documents";
import { toParams } from "@/lib/static-params";

async function DocContent({ params }: { params: Promise<{ docId: string }> }) {
  const { docId } = await params;
  return <DocumentDetail docId={docId} />;
}

export function generateStaticParams() {
  return toParams("docId", [...getDocuments().map((item) => item.id), ...Array.from({ length: 120 }, (_, i) => `doc-${String(i + 1).padStart(3, "0")}`)]);
}

export default function DocumentPage({ params }: { params: Promise<{ docId: string }> }) {
  return (
    <Suspense fallback={<ListSkeleton title="اسناد" />}>
      <DocContent params={params} />
    </Suspense>
  );
}

import { Suspense } from "react";
import { ListSkeleton } from "@/components/shared/list-skeleton";
import { SourceDetail } from "@/admin/features/documents/components/sources/source-detail";
import { getFileSources } from "@/admin/features/documents/data/file-sources";
import { toParams } from "@/lib/static-params";

async function SourceContent({ params }: { params: Promise<{ sourceId: string }> }) {
  const { sourceId } = await params;
  return <SourceDetail sourceId={sourceId} />;
}

export function generateStaticParams() {
  return toParams("sourceId", [...getFileSources().map((item) => item.id), ...Array.from({ length: 20 }, (_, i) => `fsrc-${String(i + 1).padStart(3, "0")}`)]);
}

export default function SourcePage({ params }: { params: Promise<{ sourceId: string }> }) {
  return (
    <Suspense fallback={<ListSkeleton title="اسناد" />}>
      <SourceContent params={params} />
    </Suspense>
  );
}

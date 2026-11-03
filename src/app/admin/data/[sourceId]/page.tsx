import { Suspense } from "react";
import { ListSkeleton } from "@/components/shared/list-skeleton";
import { SourceDetail } from "@/admin/features/data-sources/components/detail/source-detail";
import { getDataSources } from "@/admin/features/data-sources/data/data-sources";
import { toParams } from "@/lib/static-params";

async function SourceContent({ params }: { params: Promise<{ sourceId: string }> }) {
  const { sourceId } = await params;
  return <SourceDetail sourceId={sourceId} />;
}

export function generateStaticParams() {
  return toParams("sourceId", [...getDataSources().map((item) => item.id), ...Array.from({ length: 20 }, (_, i) => `source-${String(i + 1).padStart(3, "0")}`)]);
}

export default function SourcePage({ params }: { params: Promise<{ sourceId: string }> }) {
  return (
    <Suspense fallback={<ListSkeleton title="داده" />}>
      <SourceContent params={params} />
    </Suspense>
  );
}

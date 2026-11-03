import { Suspense } from "react";
import { ListSkeleton } from "@/components/shared/list-skeleton";
import { ModelDetail } from "@/admin/features/models/components/model-detail/model-detail";
import { getModels } from "@/admin/features/models/data/models";
import { toParams } from "@/lib/static-params";

async function ModelContent({ params }: { params: Promise<{ modelId: string }> }) {
  const { modelId } = await params;
  return <ModelDetail modelId={modelId} />;
}

export function generateStaticParams() {
  return toParams("modelId", [...getModels().map((item) => item.id), ...Array.from({ length: 150 }, (_, i) => `model-${String(i + 1).padStart(3, "0")}`)]);
}

export default function ModelPage({
  params,
}: {
  params: Promise<{ modelId: string }>;
}) {
  return (
    <Suspense fallback={<ListSkeleton title="مدل" />}>
      <ModelContent params={params} />
    </Suspense>
  );
}

import { Suspense } from "react";
import { ListSkeleton } from "@/components/shared/list-skeleton";
import { ProviderModelsPage } from "@/admin/features/models/components/provider-models/provider-models-page";
import { getProviders } from "@/admin/features/models/data/providers";
import { toParams } from "@/lib/static-params";

async function ProviderContent({ params }: { params: Promise<{ providerId: string }> }) {
  const { providerId } = await params;
  return <ProviderModelsPage providerId={providerId} />;
}

export function generateStaticParams() {
  return toParams("providerId", [...getProviders().map((item) => item.id), ...Array.from({ length: 20 }, (_, i) => `provider-${String(i + 1).padStart(3, "0")}`)]);
}

export default function ProviderPage({ params }: { params: Promise<{ providerId: string }> }) {
  return (
    <Suspense fallback={<ListSkeleton title="مدل‌های ارائه‌دهنده" />}>
      <ProviderContent params={params} />
    </Suspense>
  );
}

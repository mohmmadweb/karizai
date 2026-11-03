import { Suspense } from "react";
import { ListSkeleton } from "@/components/shared/list-skeleton";
import { ConnectionDetail } from "@/admin/features/connections/components/connection-detail";
import { getSampleConnections } from "@/admin/features/connections/data/connections";
import { runtimeIds, toParams } from "@/lib/static-params";

async function ConnectionContent({ params }: { params: Promise<{ connectionId: string }> }) {
  const { connectionId } = await params;
  return <ConnectionDetail connectionId={connectionId} />;
}

export function generateStaticParams() {
  return toParams("connectionId", [...getSampleConnections().map((item) => item.id), ...runtimeIds("conn-new", 30)]);
}

export default function ConnectionPage({ params }: { params: Promise<{ connectionId: string }> }) {
  return (
    <Suspense fallback={<ListSkeleton title="اتصال" />}>
      <ConnectionContent params={params} />
    </Suspense>
  );
}

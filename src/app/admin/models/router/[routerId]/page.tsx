import { Suspense } from "react";
import { ListSkeleton } from "@/components/shared/list-skeleton";
import { RouterDetail } from "@/admin/features/smart-router/components/router-detail";
import { getSampleRouters } from "@/admin/features/smart-router/data/routers";
import { runtimeIds, toParams } from "@/lib/static-params";

async function RouterContent({ params }: { params: Promise<{ routerId: string }> }) {
  const { routerId } = await params;
  return <RouterDetail routerId={routerId} />;
}

export function generateStaticParams() {
  return toParams("routerId", [...getSampleRouters().map((item) => item.id), ...runtimeIds("router-new", 30)]);
}

export default function RouterPage({ params }: { params: Promise<{ routerId: string }> }) {
  return (
    <Suspense fallback={<ListSkeleton title="مسیریاب هوشمند" />}>
      <RouterContent params={params} />
    </Suspense>
  );
}

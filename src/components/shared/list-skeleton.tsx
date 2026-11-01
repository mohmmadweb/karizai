import { PageHeader } from "@/components/shared/page-header";
import { Skeleton } from "@/components/ui/skeleton";

/** Loading state shared by the users and groups list routes. */
export function ListSkeleton({ title }: { title: string }) {
  return (
    <div className="flex flex-col gap-8" aria-busy="true">
      <PageHeader title={title} />
      <div className="flex flex-col gap-4">
        <Skeleton className="h-10 w-full sm:max-w-sm" />
        {Array.from({ length: 5 }, (_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    </div>
  );
}

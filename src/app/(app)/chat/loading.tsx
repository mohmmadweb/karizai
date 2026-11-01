import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="flex flex-1 flex-col gap-4 page-gutter py-6" aria-busy="true">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-20 w-full max-w-reading" />
      <Skeleton className="h-20 w-full max-w-reading" />
    </div>
  );
}

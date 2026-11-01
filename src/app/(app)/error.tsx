"use client";

import { TriangleAlertIcon } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";

export default function AppError({ reset }: { reset: () => void }) {
  return (
    <EmptyState
      icon={<TriangleAlertIcon />}
      title="نمایش این صفحه ممکن نشد"
      description="مشکلی پیش آمد. لطفاً دوباره تلاش کنید."
      action={<Button onClick={reset}>تلاش دوباره</Button>}
    />
  );
}

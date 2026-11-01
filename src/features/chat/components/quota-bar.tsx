import { Progress, ProgressLabel, ProgressValue } from "@/components/ui/progress";
import { formatNumber } from "@/lib/format";
import type { Quota } from "@/features/user-session/types";

/** Usage of the current period beside the composer. */
export function QuotaBar({ quota, used }: { quota: Quota; used: number }) {
  return (
    <Progress value={Math.min(used, quota.limit)} max={quota.limit} className="gap-1">
      <ProgressLabel className="text-caption text-muted-foreground">
        مصرف شما: {formatNumber(used)} از {formatNumber(quota.limit)} توکن
      </ProgressLabel>
      <ProgressValue className="sr-only" />
    </Progress>
  );
}

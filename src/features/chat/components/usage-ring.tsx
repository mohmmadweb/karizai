"use client";

import Link from "@/components/shared/app-link";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import type { Quota } from "@/features/user-session/types";
import { formatDate, formatNumber, formatPercent } from "@/lib/format";
import { cn } from "@/lib/utils";

const size = 22;
const stroke = 3;
const radius = (size - stroke) / 2;
const circumference = 2 * Math.PI * radius;

/** A small ring that shows how much of the quota is used; a click opens the details. */
export function UsageRing({ quota, used }: { quota: Quota; used: number }) {
  const fraction = Math.min(used / quota.limit, 1);
  const remaining = Math.max(quota.limit - used, 0);
  const tone = fraction >= 1 ? "text-destructive" : fraction >= 0.8 ? "text-warning" : "text-primary";

  return (
    <Popover>
      <PopoverTrigger
        aria-label={`مصرف شما: ${formatPercent(fraction)} از سهمیه`}
        title="سهمیه‌ی مصرف توکن" className="flex h-9 items-center gap-1.5 rounded-full px-2 outline-none hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50"
      >
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90" aria-hidden>
          <circle cx={size / 2} cy={size / 2} r={radius} fill="none" strokeWidth={stroke} className="stroke-muted" />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={circumference * (1 - fraction)}
            className={cn("stroke-current transition-[stroke-dashoffset] motion-reduce:transition-none", tone)}
          />
        </svg>
        <span className="text-caption tabular-nums text-muted-foreground">{formatPercent(fraction)}</span>
      </PopoverTrigger>
      <PopoverContent align="end">
        <div className="flex flex-col gap-3">
          <div className="flex items-baseline justify-between gap-2">
            <h3 className="text-label">مصرف شما</h3>
            <span className="text-h4">{formatPercent(fraction)}</span>
          </div>
          <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-body-sm">
            <dt className="text-muted-foreground">مصرف‌شده</dt>
            <dd>{formatNumber(used)} از {formatNumber(quota.limit)} توکن</dd>
            <dt className="text-muted-foreground">باقی‌مانده</dt>
            <dd>{formatNumber(remaining)} توکن</dd>
            <dt className="text-muted-foreground">بازنشانی</dt>
            <dd>{formatDate(quota.resetsAt)}</dd>
          </dl>
          {fraction >= 0.8 ? <p className={cn("text-body-sm", fraction >= 1 ? "text-destructive" : "text-warning-foreground dark:text-warning")}>{fraction >= 1 ? "سهمیه‌ی شما تمام شده است." : "به سقف سهمیه نزدیک شده‌اید."}</p> : null}
          <Link href="/usage" className="w-fit text-body-sm underline-offset-4 hover:underline">جزئیات مصرف</Link>
        </div>
      </PopoverContent>
    </Popover>
  );
}

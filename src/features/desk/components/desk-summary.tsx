"use client";

import Link from "next/link";
import { SparklesIcon } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type DeskSummaryProps = { lines: string[] };

/** The assistant's short reading of the day, written from what the desk shows below it. */
export function DeskSummary({ lines }: DeskSummaryProps) {
  return (
    <section aria-label="خلاصه‌ی هوشمند امروز" className="flex flex-col gap-4 rounded-2xl border border-primary/20 bg-linear-to-br from-primary/10 via-info/10 to-chart-4/15 p-5 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="flex items-center gap-2 text-h4 text-primary"><span className="flex size-9 items-center justify-center rounded-xl bg-chart-4/20 text-chart-4"><SparklesIcon className="size-5" aria-hidden /></span>خلاصه‌ی هوشمند امروز</h2>
        <span className="text-caption text-muted-foreground">ساخته‌شده از گروه‌ها، وظایف، تقویم و جریان‌های شما</span>
      </div>
      {lines.length === 0 ? <p className="text-body-sm text-muted-foreground">امروز مورد فوری ندارید.</p> : (
        <ul className="flex flex-col gap-2 text-body">
          {lines.map((line) => <li key={line} className="flex gap-2"><span aria-hidden className="mt-2.5 size-1.5 shrink-0 rounded-full bg-chart-4" />{line}</li>)}
        </ul>
      )}
      <div className="flex flex-wrap gap-2">
        <Link href="/messenger/grp-quality" className={cn(buttonVariants({ variant: "outline", size: "sm" }), "bg-card")}>خلاصه‌ی گروه کیفیت</Link>
        <Link href="/messenger/tasks" className={cn(buttonVariants({ variant: "outline", size: "sm" }), "bg-card")}>وظایف من</Link>
        <Link href="/chat" className={cn(buttonVariants({ variant: "outline", size: "sm" }), "bg-card")}>گفتگو با دستیار</Link>
      </div>
    </section>
  );
}

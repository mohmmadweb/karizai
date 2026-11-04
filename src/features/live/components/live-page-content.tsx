"use client";

import Link from "@/components/shared/app-link";
import { ActivityIcon } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RunStatusBadge } from "@/features/workflows/components/workflow-status-badge";
import { useWorkflows } from "@/features/workflows/components/workflows-provider";
import { formatNumber } from "@/lib/format";
import { formatTime } from "@/features/social/lib/jalali";
import { effectMeta } from "../lib/effect-meta";
import { useLive } from "./live-provider";
import { LiveSwitch } from "./live-switch";

/** «فعالیت زنده»: everything the workflows of this visit did in the system, run by run, with links to where it landed. */
export function LivePageContent() {
  const { visitRuns, effects, summaryOf } = useLive();
  const { workflows } = useWorkflows();
  const cost = visitRuns.reduce((sum, run) => sum + summaryOf(run).costToman, 0);
  const stats = [
    { label: "اجرا", value: formatNumber(visitRuns.length) },
    { label: "اقدام در سیستم", value: formatNumber(effects.length) },
    { label: "هزینه‌ی مدل‌ها (تومان)", value: formatNumber(cost) },
  ];
  return (
    <div className="mx-auto flex w-full max-w-page flex-col gap-6 page-gutter py-8">
      <PageHeader title="فعالیت زنده" description="هر گام جریان‌ها در بخش‌های دیگر سیستم چه کرد: پیام، وظیفه، جلسه، فایل، گفتگو، اعلان و ممیزی." action={<LiveSwitch className="lg:hidden" />} />
      {visitRuns.length === 0 ? (
        <EmptyState icon={<ActivityIcon />} title="هنوز جریانی در این بازدید اجرا نشده است" description="یکی از جریان‌ها را اجرا کنید یا حالت زنده را روشن کنید تا اثرش را در سیستم ببینید." action={<Button nativeButton={false} render={<Link href="/workflows" />}>رفتن به جریان‌ها</Button>} />
      ) : (
        <>
          <dl className="grid gap-3 sm:grid-cols-3">
            {stats.map((item) => <div key={item.label} className="rounded-xl border bg-card p-4"><dt className="text-body-sm text-muted-foreground">{item.label}</dt><dd className="text-h3 tabular-nums">{item.value}</dd></div>)}
          </dl>
          <div className="flex flex-col gap-4">
            {visitRuns.map((run) => {
              const items = effects.filter((item) => item.runId === run.id);
              const name = workflows.find((item) => item.id === run.workflowId)?.name;
              return (
                <Card key={run.id}>
                  <CardHeader>
                    <CardTitle className="flex flex-wrap items-center gap-2">
                      <Link href={`/workflows/${run.workflowId}`} className="hover:underline">{name ?? "جریان"}</Link>
                      <RunStatusBadge status={run.status} />
                    </CardTitle>
                    <p className="text-body-sm text-muted-foreground">{formatTime(run.startedAt)} · {run.startedBy} · {formatNumber(items.length)} اقدام</p>
                  </CardHeader>
                  <CardContent>
                    {items.length === 0 ? <p className="text-body-sm text-muted-foreground">هنوز اقدامی ثبت نشده است.</p> : (
                      <ol className="flex flex-col divide-y">
                        {items.map((item) => {
                          const Icon = effectMeta[item.kind].icon;
                          return (
                            <li key={item.id} className="flex flex-wrap items-center gap-3 py-2.5 first:pt-0 last:pb-0">
                              <span aria-hidden className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary"><Icon className="size-5" /></span>
                              <div className="min-w-0 flex-1 basis-56">
                                <p className="text-label">{item.label}</p>
                                <p className="truncate text-body-sm text-muted-foreground">{item.stepLabel ? `گام «${item.stepLabel}»` : "کل اجرا"}{item.detail ? ` · ${item.detail}` : ""}</p>
                              </div>
                              <time dateTime={item.at} className="text-caption text-muted-foreground tabular-nums">{formatTime(item.at)}</time>
                              <Link href={item.href} className="text-body-sm text-primary hover:underline">مشاهده</Link>
                            </li>
                          );
                        })}
                      </ol>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

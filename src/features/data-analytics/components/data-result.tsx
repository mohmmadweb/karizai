"use client";

import { useRouter } from "next/navigation";
import { DownloadIcon, LayoutDashboardIcon, SendIcon } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BarChart } from "@/features/chat/components/result-charts";
import { downloadExcel } from "@/features/chat/components/result-download";
import type { Dashboard, DataAnswer } from "../types";

type Props = { answer: DataAnswer; dashboards: Dashboard[]; onAddToDashboard: (dashboardId: string) => void };

/** The chart with its AI insight, the generated read-only query, and what to do with the result. */
export function DataResult({ answer, dashboards, onAddToDashboard }: Props) {
  const router = useRouter();
  const dashboard = dashboards.find((item) => item.id === answer.dashboardId);
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <section className="flex flex-col gap-3" aria-label="نمودار">
        <h2 className="text-h4">{answer.chartTitle}</h2>
        <BarChart result={answer.result} />
        <p data-ai className="rounded-lg bg-primary/5 p-3 text-body-sm"><span className="text-primary">✦ </span>{answer.insight}</p>
      </section>
      <section className="flex min-w-0 flex-col gap-3" aria-label="کوئری تولیدشده">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="text-h4">کوئری تولیدشده</h2>
          <Badge variant="success">فقط SELECT · محدود به خطوط مجاز شما</Badge>
        </div>
        <pre dir="ltr" className="max-w-full overflow-x-auto whitespace-pre-wrap break-words rounded-lg bg-muted p-3 text-left font-mono text-caption">{answer.result.query}</pre>
        <div className="flex flex-wrap gap-2">
          <Button type="button" size="sm" variant="soft" onClick={() => { onAddToDashboard(answer.dashboardId); toast.success(`به داشبورد «${dashboard?.name ?? ""}» افزوده شد.`); }}><LayoutDashboardIcon aria-hidden />افزودن به داشبورد</Button>
          <Button type="button" size="sm" variant="soft" onClick={() => { downloadExcel(answer.result); toast.success("خروجی Excel ساخته شد."); }}><DownloadIcon aria-hidden />خروجی Excel</Button>
          <Button type="button" size="sm" variant="soft" onClick={() => toast.success(`در گروه «${answer.groupName}» ارسال شد.`, { action: { label: "دیدن گروه", onClick: () => router.push("/messenger/groups") } })}><SendIcon aria-hidden />ارسال به گروه</Button>
        </div>
      </section>
    </div>
  );
}

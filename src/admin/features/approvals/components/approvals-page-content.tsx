"use client";

import { useState } from "react";
import { ClipboardCheckIcon } from "lucide-react";
import { toast } from "sonner";
import { EmptyState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useApprovalQueue } from "../hooks/use-approval-queue";
import { approvalTypeLabels, type ApprovalItem, type ApprovalType } from "../types";
import { ApprovalCard } from "./approval-card";
import { RejectDialog } from "./reject-dialog";

type Filter = ApprovalType | "all";
type Decision = { key: string; title: string; type: ApprovalType; approved: boolean; reason?: string };
const types = Object.keys(approvalTypeLabels) as ApprovalType[];
const n = (v: number) => v.toLocaleString("fa-IR");

/** «صف تأیید»: Agents, skills, workflows and connections waiting for the admin. */
export function ApprovalsPageContent() {
  const queue = useApprovalQueue();
  const [filter, setFilter] = useState<Filter>("all");
  const [rejecting, setRejecting] = useState<ApprovalItem | null>(null);
  const [done, setDone] = useState<Decision[]>([]);
  const visible = queue.filter((i) => filter === "all" || i.type === filter);
  const count = (t: Filter) => (t === "all" ? queue.length : queue.filter((i) => i.type === t).length);

  function decide(item: ApprovalItem, approved: boolean, reason?: string) {
    item.decide(approved, reason);
    setDone((list) => [{ key: item.key, title: item.title, type: item.type, approved, reason }, ...list]);
    toast.success(approved ? `«${item.title}» تأیید شد و درخواست‌دهنده باخبر شد.` : "رد شد؛ دلیل برای درخواست‌دهنده فرستاده شد.");
  }

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="صف تأیید"
        description="هر عامل، مهارت، جریان خودکار یا اتصالی که به داده یا اقدام حساس دسترسی می‌خواهد، پیش از فعال‌شدن اینجا تأیید می‌شود."
      />
      <Tabs value={filter} onValueChange={(v) => setFilter(v as Filter)}>
        <div className="overflow-x-auto">
          <TabsList aria-label="نوع درخواست">
            {(["all", ...types] as Filter[]).map((t) => (
              <TabsTrigger key={t} value={t}>
                {t === "all" ? "همه" : approvalTypeLabels[t]} ({n(count(t))})
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
      </Tabs>
      {visible.length === 0 ? (
        <EmptyState
          icon={<ClipboardCheckIcon />}
          title="درخواستی در صف نیست"
          description="وقتی کاربری عاملی را به اشتراک بگذارد یا جریانی را فعال کند، اینجا دیده می‌شود."
        />
      ) : (
        <ul className="grid gap-4 md:grid-cols-2">
          {visible.map((item) => (
            <li key={item.key}>
              <ApprovalCard item={item} onApprove={() => decide(item, true)} onReject={() => setRejecting(item)} />
            </li>
          ))}
        </ul>
      )}
      {done.length > 0 ? (
        <section className="flex flex-col gap-3" aria-labelledby="done-title">
          <h2 id="done-title" className="text-h4">تصمیم‌های این نشست</h2>
          <ul className="flex flex-col divide-y divide-border rounded-xl border border-border bg-card">
            {done.map((d) => (
              <li key={d.key} className="flex flex-wrap items-center justify-between gap-3 p-3">
                <span className="flex flex-col">
                  <span className="font-medium">{approvalTypeLabels[d.type]}: {d.title}</span>
                  {d.reason ? <span className="text-caption text-muted-foreground">دلیل: {d.reason}</span> : null}
                </span>
                <Badge variant={d.approved ? "success" : "destructive"}>{d.approved ? "تأیید شد" : "رد شد"}</Badge>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
      <RejectDialog
        title={rejecting?.title ?? null}
        onOpenChange={(open) => !open && setRejecting(null)}
        onReject={(reason) => {
          if (rejecting) decide(rejecting, false, reason);
          setRejecting(null);
        }}
      />
    </div>
  );
}

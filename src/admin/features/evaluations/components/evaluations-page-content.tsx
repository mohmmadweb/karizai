"use client";

import { useState } from "react";
import { PlayIcon, RocketIcon, ShieldAlertIcon, SparklesIcon } from "lucide-react";
import { toast } from "sonner";
import { DataTable } from "@/admin/components/shared/data-table/data-table";
import type { DataTableActionGroup, DataTableColumn } from "@/admin/components/shared/data-table/types";
import { PageHeader } from "@/components/shared/page-header";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { getEvalRows, type EvalRow } from "../data/evaluations";
import { change, pct, ver } from "./format";
import { RunDialog } from "./run-dialog";

function StatusCell({ row }: { row: EvalRow }) {
  if (row.status === "blocked" && row.candidate)
    return <Badge variant="destructive">نسخه‌ی {ver(row.candidate.version)} متوقف: افت دقت</Badge>;
  if (row.status === "ready") return <Badge variant="info">{row.candidate ? `نسخه‌ی ${ver(row.candidate.version)} آماده‌ی انتشار` : "آماده‌ی انتشار"}</Badge>;
  if (row.candidate) return <Badge variant="warning">نسخه‌ی {ver(row.candidate.version)} در انتظار ارزیابی</Badge>;
  return <Badge variant="success">منتشرشده</Badge>;
}

/** «ارزیابی عامل‌ها»: accuracy of every version; a drop blocks the release. */
export function EvaluationsPageContent() {
  const [rows, setRows] = useState(getEvalRows);
  const [running, setRunning] = useState<EvalRow | null>(null);
  const patch = (id: string, p: Partial<EvalRow>) => setRows((list) => list.map((r) => (r.id === id ? { ...r, ...p } : r)));
  const blocked = rows.find((r) => r.status === "blocked" && r.candidate);

  function finish(row: EvalRow, accuracy: number) {
    if (!row.candidate) return patch(row.id, { accuracy, previous: row.accuracy, status: "published" });
    patch(row.id, { status: accuracy < row.accuracy ? "blocked" : "ready", candidate: { ...row.candidate, result: accuracy } });
  }

  function publish(row: EvalRow) {
    if (!row.candidate) return patch(row.id, { status: "published" });
    patch(row.id, { version: row.candidate.version, previous: row.accuracy, accuracy: row.candidate.result ?? row.accuracy, candidate: undefined, status: "published" });
    toast.success(`نسخه‌ی ${ver(row.candidate.version)} «${row.agent}» منتشر شد.`);
  }

  const columns: DataTableColumn<EvalRow>[] = [
    {
      id: "agent",
      header: "عامل",
      cell: (r) => (
        <span className="flex flex-col">
          <span className="font-medium">{r.agent}</span>
          <span className="text-caption text-muted-foreground">مدل: <bdi dir="ltr">{r.model}</bdi></span>
        </span>
      ),
    },
    { id: "version", header: "نسخه", cell: (r) => ver(r.version) },
    { id: "set", header: "مجموعه‌ی ارزیابی", hideBelow: "lg", cell: (r) => `${r.setSize.toLocaleString("fa-IR")} نمونه` },
    { id: "accuracy", header: "دقت", align: "end", cell: (r) => pct(r.accuracy) },
    { id: "change", header: "تغییر", hideBelow: "lg", cell: (r) => <bdi dir="ltr" className="text-body-sm text-muted-foreground">{change(r.accuracy, r.previous)}</bdi> },
    { id: "status", header: "انتشار", cell: (r) => <StatusCell row={r} /> },
  ];

  const actionsOf = (r: EvalRow): DataTableActionGroup[] => [
    [
      r.status === "ready"
        ? { label: "انتشار نسخه", icon: <RocketIcon aria-hidden />, inline: true, onSelect: () => publish(r) }
        : { label: "اجرای ارزیابی", icon: <PlayIcon aria-hidden />, inline: true, onSelect: () => setRunning(r) },
    ],
    r.status === "ready" ? [{ label: "اجرای دوباره‌ی ارزیابی", icon: <PlayIcon aria-hidden />, onSelect: () => setRunning(r) }] : [],
  ];

  return (
    <div className="flex flex-col gap-8">
      <PageHeader title="ارزیابی عامل‌ها" description="هر عامل یک مجموعه‌ی پرسش و پاسخ درست دارد؛ دقت هر نسخه روی همان مجموعه سنجیده می‌شود." />
      <Alert variant="info">
        <SparklesIcon aria-hidden />
        <AlertTitle>قاعده‌ی انتشار</AlertTitle>
        <AlertDescription>✦ پیش از انتشار هر نسخه یا تغییر مدل، ارزیابی خودکار اجرا می‌شود؛ افت دقت مانع انتشار است.</AlertDescription>
      </Alert>
      {blocked?.candidate ? (
        <Alert variant="destructive">
          <ShieldAlertIcon aria-hidden />
          <AlertTitle>انتشار «{blocked.agent}» نسخه‌ی {ver(blocked.candidate.version)} متوقف شد</AlertTitle>
          <AlertDescription>
            {blocked.candidate.change}: دقت از {pct(blocked.accuracy)} به {pct(blocked.candidate.result ?? 0)} رسید. نسخه‌ی {ver(blocked.version)} همچنان فعال است.
          </AlertDescription>
        </Alert>
      ) : null}
      <DataTable
        label="ارزیابی عامل‌ها"
        rows={rows}
        columns={columns}
        getRowId={(r) => r.id}
        getRowLabel={(r) => `ارزیابی ${r.agent}`}
        getRowActions={actionsOf}
        hidePagerWhenSingle
      />
      <RunDialog row={running} onOpenChange={(open) => !open && setRunning(null)} onFinish={finish} />
    </div>
  );
}

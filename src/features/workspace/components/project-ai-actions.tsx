"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { AiAction } from "@/features/social/components/ai-dialog";
import { AiBullets } from "@/features/social/components/ai-parts";
import { SuggestedTasks } from "@/features/social/components/suggested-tasks";
import { sampleMinutes } from "@/features/social/data/ai-answers";
import type { SuggestedTask } from "@/features/social/types";
import { formatNumber } from "@/lib/format";
import { tasksFromMinutes } from "../lib/minutes";
import type { ProjectStatus } from "../lib/project-status";
import { riskLabels, type Project, type RiskLevel } from "../types";

const riskVariant: Record<RiskLevel, "destructive" | "warning" | "success"> = { high: "destructive", medium: "warning", low: "success" };

export function RiskChip({ risk }: { risk: RiskLevel }) {
  return <Badge variant={riskVariant[risk]}>✦ ریسک تأخیر: {riskLabels[risk]}</Badge>;
}

const publishToChannel = () => toast.success("در کانال «اطلاع‌رسانی پروژه‌ها» منتشر شد");

/** «✦ گزارش وضعیت»، «✦ ریسک» و «✦ وظایف از صورت‌جلسه» for one project. */
export function ProjectAiActions({ project, status }: { project: Project; status: ProjectStatus }) {
  return (
    <div className="relative flex flex-wrap gap-2">
      <AiAction label="گزارش وضعیت" size="xs" context={project.name}>
        <div className="flex flex-col gap-2">
          <h3 className="text-label">گزارش وضعیت هفتگی (پیش‌نویس)</h3>
          <p>پیشرفت {formatNumber(status.percent)}٪ · {formatNumber(status.done)} وظیفه انجام‌شده، {formatNumber(status.open)} باز{status.overdue > 0 ? ` و ${formatNumber(status.overdue)} عقب‌افتاده` : ""}.</p>
          <p><span className="text-muted-foreground">ریسک اصلی: </span>{status.insight.reason}</p>
          <Button size="sm" variant="outline" className="w-fit" onClick={publishToChannel}>انتشار در کانال</Button>
        </div>
      </AiAction>
      <AiAction label="ریسک" size="xs" context={project.name}>
        <div className="flex flex-col gap-2">
          <h3 className="text-label">تحلیل ریسک تأخیر پروژه</h3>
          <RiskChip risk={status.insight.risk} />
          <p>{status.insight.reason}</p>
          <p><span className="text-muted-foreground">پیشنهاد: </span>{status.insight.suggestion}</p>
        </div>
      </AiAction>
      <AiAction label="وظایف از صورت‌جلسه" size="xs" context={project.name}>{(close) => <MinutesToTasks projectId={project.id} onDone={close} />}</AiAction>
    </div>
  );
}

function MinutesToTasks({ projectId, onDone }: { projectId: string; onDone: () => void }) {
  const [text, setText] = useState(sampleMinutes);
  const [found, setFound] = useState<SuggestedTask[] | null>(null);
  if (found) {
    return found.length === 0 ? <p>در این متن بندی برای وظیفه پیدا نشد؛ هر اقدام را در یک خط با «-» بنویسید.</p> : (
      <div className="flex flex-col gap-2">
        <h3 className="text-label">{formatNumber(found.length)} وظیفه از صورت‌جلسه استخراج شد</h3>
        <SuggestedTasks tasks={found} source="minutes" projectId={projectId} addAllLabel="افزودن به پروژه" onAdded={onDone} />
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-2">
      <Field>
        <FieldLabel htmlFor={`minutes-${projectId}`}>متن صورت‌جلسه</FieldLabel>
        <Textarea id={`minutes-${projectId}`} rows={6} value={text} onChange={(e) => setText(e.target.value)} />
        <FieldDescription>هر اقدام در یک خط با «-»؛ نام مسئول را بنویسید.</FieldDescription>
      </Field>
      <Button size="sm" className="w-fit" disabled={!text.trim()} onClick={() => setFound(tasksFromMinutes(text, projectId))}>✦ استخراج وظایف</Button>
    </div>
  );
}

/** «✦ گزارش وضعیت همه پروژه‌ها» with «انتشار در کانال». */
export function AllProjectsReport({ rows }: { rows: { project: Project; status: ProjectStatus }[] }) {
  return (
    <div className="flex flex-col gap-3">
      <AiBullets items={rows.map(({ project, status }) => <span key={project.id}><b>{project.name}</b>: پیشرفت {formatNumber(status.percent)}٪، {formatNumber(status.open)} وظیفه‌ی باز{status.overdue > 0 ? `، ${formatNumber(status.overdue)} عقب‌افتاده` : ""} · ریسک تأخیر {riskLabels[status.insight.risk]}</span>)} />
      <p><span className="text-muted-foreground">نیازمند توجه: </span>{rows.filter((r) => r.status.insight.risk === "high").map((r) => `«${r.project.name}»`).join(" و ") || "هیچ پروژه‌ای ریسک بالا ندارد."}</p>
      <Button size="sm" variant="outline" className="w-fit" onClick={publishToChannel}>انتشار در کانال</Button>
    </div>
  );
}

"use client";

import { useState } from "react";
import { PencilIcon, PlusIcon, Trash2Icon } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { ReportSchedule } from "../types";
import { useAlerts } from "./alerts-provider";
import { ReportDialog } from "./report-dialog";

/** Scheduled reports: the list and the form to add or change one. */
export function ReportsTab() {
  const { reports, saveReport, removeReport } = useAlerts();
  const [editing, setEditing] = useState<ReportSchedule | "new" | null>(null);
  return (
    <section aria-label="گزارش‌های زمان‌بندی‌شده" className="flex flex-col gap-4">
      <div className="flex justify-end"><Button type="button" onClick={() => setEditing("new")}><PlusIcon aria-hidden />گزارش تازه</Button></div>
      {reports.length === 0 ? (
        <EmptyState title="گزارشی زمان‌بندی نشده" description="گزارش دوره‌ای بسازید تا خلاصه‌ی تغییرات اصلی به‌موقع برای گیرندگان برسد." />
      ) : (
        <Table>
          <TableHeader><TableRow><TableHead>گزارش</TableHead><TableHead>زمان ارسال</TableHead><TableHead>گیرندگان</TableHead><TableHead>فعال</TableHead><TableHead><span className="sr-only">عملیات</span></TableHead></TableRow></TableHeader>
          <TableBody>
            {reports.map((report) => (
              <TableRow key={report.id}>
                <TableCell><span className="block text-label">{report.name}</span><span className="text-caption text-muted-foreground">{report.summary}</span></TableCell>
                <TableCell>{report.day}، ساعت <bdi dir="ltr">{report.time}</bdi></TableCell>
                <TableCell>{report.recipients}</TableCell>
                <TableCell><Switch checked={report.enabled} aria-label={`فعال بودن «${report.name}»`} onCheckedChange={(enabled) => saveReport({ ...report, enabled })} /></TableCell>
                <TableCell>
                  <span className="flex gap-1">
                    <Button type="button" variant="ghost" size="icon" aria-label={`ویرایش «${report.name}»`} onClick={() => setEditing(report)}><PencilIcon aria-hidden /></Button>
                    <Button type="button" variant="ghost" size="icon" aria-label={`حذف «${report.name}»`} onClick={() => removeReport(report.id)}><Trash2Icon aria-hidden /></Button>
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
      <ReportDialog open={editing !== null} report={editing === "new" ? null : editing} onClose={() => setEditing(null)} onSave={saveReport} />
    </section>
  );
}

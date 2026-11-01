"use client";

import { PlayIcon, RocketIcon, SaveIcon } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { WorkflowStatus } from "../types";
import { WorkflowStatusBadge } from "./workflow-status-badge";

type EditorHeaderProps = {
  name: string;
  onRename: (name: string) => void;
  status: WorkflowStatus;
  dirty: boolean;
  running: boolean;
  onSave: () => void;
  onTest: () => void;
  onActivate: () => void;
};

export function EditorHeader({ name, onRename, status, dirty, running, onSave, onTest, onActivate }: EditorHeaderProps) {
  return (
    <PageHeader
      title={
        <span className="flex flex-wrap items-center gap-3">
          <Input aria-label="نام کار" value={name} onChange={(event) => onRename(event.target.value)} className="h-11 w-full max-w-sm text-h4" />
          <WorkflowStatusBadge status={status} />
        </span>
      }
      action={
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={onSave} disabled={!dirty}><SaveIcon aria-hidden />ذخیره</Button>
          <Button variant="outline" onClick={onTest} loading={running}><PlayIcon aria-hidden />اجرای آزمایشی</Button>
          <Button onClick={onActivate} disabled={status === "active" || status === "pending-approval"}><RocketIcon aria-hidden />{status === "paused" ? "فعال‌سازی دوباره" : "فعال‌سازی"}</Button>
        </div>
      }
    />
  );
}

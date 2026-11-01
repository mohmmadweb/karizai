"use client";

import { PlugIcon } from "lucide-react";
import { toolParams } from "@/features/connections/lib/tool-params";
import type { Connection } from "@/features/connections/types";
import type { WorkflowDraft } from "../hooks/use-workflow-draft";
import type { WorkflowNode } from "../types";
import { ParamField } from "./param-field";

/** The connection a tool step belongs to, and the tool's own settings. */
export function ToolSettings({ node, draft, connection }: { node: WorkflowNode; draft: WorkflowDraft; connection?: Connection }) {
  const tool = connection?.tools.find((item) => item.id === node.config.toolId);
  if (!connection || !tool) return null;
  const values = node.config.params ?? {};
  return (
    <section className="flex flex-col gap-3 rounded-lg bg-muted p-3" aria-label="تنظیم‌های ابزار">
      <div className="flex flex-col gap-1">
        <p className="flex items-center gap-2 text-label"><PlugIcon className="size-4" aria-hidden />{connection.name}</p>
        {connection.endpoint ? <p className="text-caption text-muted-foreground">نشانی اتصال: <bdi dir="ltr">{connection.endpoint}</bdi></p> : null}
        <p className="text-caption text-muted-foreground">کلید و ورود این اتصال را ادمین تعریف کرده است و اینجا دیده نمی‌شود.</p>
      </div>
      {toolParams(tool).map((param) => (
        <ParamField key={param.key} id={`param-${param.key}`} param={param} value={values[param.key] ?? ""} onChange={(value) => draft.updateNode(node.id, { config: { params: { ...values, [param.key]: value } } })} />
      ))}
    </section>
  );
}

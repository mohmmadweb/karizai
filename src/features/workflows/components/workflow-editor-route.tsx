"use client";

import { useQueryParam } from "@/lib/use-query-param";
import { WorkflowEditor } from "./workflow-editor";

/** Reads `?tab=runs` in the browser, so the built page shows the editor at once. */
export function WorkflowEditorRoute({ workflowId }: { workflowId: string }) {
  return <WorkflowEditor workflowId={workflowId} initialTab={useQueryParam("tab") === "runs" ? "runs" : "design"} />;
}

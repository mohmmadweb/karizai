"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { ListSkeleton } from "@/components/shared/list-skeleton";
import { WorkflowEditor } from "./workflow-editor";

/** Reads `?tab=runs` in the browser so the page can be built ahead of time. */
function EditorWithTab({ workflowId }: { workflowId: string }) {
  const tab = useSearchParams().get("tab");
  return <WorkflowEditor workflowId={workflowId} initialTab={tab === "runs" ? "runs" : "design"} />;
}

export function WorkflowEditorRoute({ workflowId }: { workflowId: string }) {
  return (
    <Suspense fallback={<ListSkeleton title="کار" />}>
      <EditorWithTab workflowId={workflowId} />
    </Suspense>
  );
}

import { Suspense } from "react";
import { ListSkeleton } from "@/components/shared/list-skeleton";
import { WorkflowEditor } from "@/features/workflows/components/workflow-editor";

type Props = { params: Promise<{ workflowId: string }>; searchParams: Promise<{ tab?: string }> };

async function EditorContent({ params, searchParams }: Props) {
  const { workflowId } = await params;
  const { tab } = await searchParams;
  return <WorkflowEditor workflowId={workflowId} initialTab={tab === "runs" ? "runs" : "design"} />;
}

export default function WorkflowPage(props: Props) {
  return (
    <Suspense fallback={<ListSkeleton title="کار" />}>
      <EditorContent {...props} />
    </Suspense>
  );
}

import { getWorkflows } from "@/features/workflows/data/workflows";
import { WorkflowEditorRoute } from "@/features/workflows/components/workflow-editor-route";
import { runtimeIds, toParams } from "@/lib/static-params";

export function generateStaticParams() {
  return toParams("workflowId", [...getWorkflows().map((item) => item.id), ...runtimeIds("wf-new")]);
}

export default async function WorkflowPage({ params }: { params: Promise<{ workflowId: string }> }) {
  const { workflowId } = await params;
  return <WorkflowEditorRoute workflowId={workflowId} />;
}

import { AgentForm } from "@/features/agents/components/agent-form";

export default async function EditAgentPage({ params }: { params: Promise<{ agentId: string }> }) {
  const { agentId } = await params;
  return <AgentForm agentId={agentId} />;
}

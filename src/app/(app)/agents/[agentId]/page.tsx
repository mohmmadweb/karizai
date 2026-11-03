import { AgentForm } from "@/features/agents/components/agent-form";
import { getMyAgents, getSharedAgents } from "@/features/agents/data/agents";
import { runtimeIds, toParams } from "@/lib/static-params";

export function generateStaticParams() {
  return toParams("agentId", [...getMyAgents(), ...getSharedAgents()].map((item) => item.id).concat(runtimeIds("agent-new")));
}

export default async function EditAgentPage({ params }: { params: Promise<{ agentId: string }> }) {
  const { agentId } = await params;
  return <AgentForm agentId={agentId} />;
}

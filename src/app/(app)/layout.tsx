import type { ReactNode } from "react";
import { ApiKeysProvider } from "@/features/api-keys/components/api-keys-provider";
import { AgentsProvider } from "@/features/agents/components/agents-provider";
import { getMyAgents, getSharedAgents, getSkills } from "@/features/agents/data/agents";
import { ConnectionsProvider } from "@/features/connections/components/connections-provider";
import { getUserConnections } from "@/features/connections/data/connections";
import { ModelsProvider } from "@/features/model-catalog/components/models-provider";
import { WorkflowsProvider } from "@/features/workflows/components/workflows-provider";
import { getRuns, getWorkflows } from "@/features/workflows/data/workflows";
import { IdleTimeout } from "@/features/auth/components/idle-timeout";
import { ChatProvider } from "@/features/chat/components/chat-provider";
import { getConversations, getInitialMessages } from "@/features/chat/data/conversations";
import { UserShell } from "@/features/user-shell/components/user-shell";

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <ModelsProvider>
    <AgentsProvider initialAgents={[...getMyAgents(), ...getSharedAgents()]} initialSkills={getSkills()}>
      <ConnectionsProvider initialConnections={getUserConnections()}>
      <ChatProvider initialConversations={getConversations()} initialMessages={getInitialMessages()}>
        <WorkflowsProvider initialWorkflows={getWorkflows()} initialRuns={getRuns()}>
          <ApiKeysProvider>
            <UserShell>{children}</UserShell>
          </ApiKeysProvider>
        </WorkflowsProvider>
        <IdleTimeout />
      </ChatProvider>
      </ConnectionsProvider>
    </AgentsProvider>
    </ModelsProvider>
  );
}

import type { ReactNode } from "react";
import { AgentsProvider } from "@/features/agents/components/agents-provider";
import { getMyAgents, getSharedAgents, getSkills } from "@/features/agents/data/agents";
import { ConnectionsProvider } from "@/features/connections/components/connections-provider";
import { getUserConnections } from "@/features/connections/data/connections";
import { UserSessionBoundary } from "@/features/user-session/components/user-session-boundary";
import { AlertsProvider } from "@/features/alerts/components/alerts-provider";
import { PoliciesProvider } from "@/features/policies/components/policies-provider";
import { ModelsProvider } from "@/features/model-catalog/components/models-provider";
import { MessengerProvider } from "@/features/messenger/components/messenger-provider";
import { WorkspaceProvider } from "@/features/workspace/components/workspace-provider";
import { WorkflowsProvider } from "@/features/workflows/components/workflows-provider";
import { getRuns, getWorkflows } from "@/features/workflows/data/workflows";
import { ChatProvider } from "@/features/chat/components/chat-provider";
import { getConversations, getInitialMessages } from "@/features/chat/data/conversations";
import { UserShell } from "@/features/user-shell/components/user-shell";

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <UserSessionBoundary>
    <PoliciesProvider>
    <ModelsProvider>
    <AgentsProvider initialAgents={[...getMyAgents(), ...getSharedAgents()]} initialSkills={getSkills()}>
      <ConnectionsProvider initialConnections={getUserConnections()}>
      <ChatProvider initialConversations={getConversations()} initialMessages={getInitialMessages()}>
        <WorkflowsProvider initialWorkflows={getWorkflows()} initialRuns={getRuns()}>
          <AlertsProvider>
          <MessengerProvider>
            <WorkspaceProvider><UserShell>{children}</UserShell></WorkspaceProvider>
          </MessengerProvider>
          </AlertsProvider>
        </WorkflowsProvider>
      </ChatProvider>
      </ConnectionsProvider>
    </AgentsProvider>
    </ModelsProvider>
    </PoliciesProvider>
    </UserSessionBoundary>
  );
}

import type { ReactNode } from "react";
import { AgentsProvider } from "@/features/agents/components/agents-provider";
import { getMyAgents, getSharedAgents, getSkills } from "@/features/agents/data/agents";
import { AlertsProvider } from "@/features/alerts/components/alerts-provider";
import { ConnectionsProvider } from "@/features/connections/components/connections-provider";
import { getUserConnections } from "@/features/connections/data/connections";
import { ModelsProvider } from "@/features/model-catalog/components/models-provider";
import { MessengerProvider } from "@/features/messenger/components/messenger-provider";
import { PoliciesProvider } from "@/features/policies/components/policies-provider";
import { UserSessionBoundary } from "@/features/user-session/components/user-session-boundary";
import { WorkspaceProvider } from "@/features/workspace/components/workspace-provider";
import { RunNotifier } from "@/features/workflows/components/run-notifier";
import { WorkflowsProvider } from "@/features/workflows/components/workflows-provider";
import { getRuns, getWorkflows } from "@/features/workflows/data/workflows";
import { DemoFlagsProvider } from "@/lib/demo-flags";
import { OrgSkillsProvider } from "@/lib/org-skills";
import { ChatProvider } from "@/features/chat/components/chat-provider";
import { getConversations, getInitialMessages } from "@/features/chat/data/conversations";

/**
 * State shared by the user panel and the admin panel, so what a user sends for
 * approval shows up in the admin queue in the same visit. All of it is
 * temporary: a refresh returns to the sample data.
 *
 * Policies sit above the user session, so what the admin saves survives a demo
 * user switch; everything that depends on `getCurrentUser()` (models, Agents,
 * connections, chats, workflows, messenger, tasks) sits inside
 * `UserSessionBoundary`, which remounts it for the new user.
 */
export function SharedProviders({ children }: { children: ReactNode }) {
  return (
    <DemoFlagsProvider>
    <PoliciesProvider>
    <OrgSkillsProvider>
    <UserSessionBoundary>
    <ModelsProvider>
      <AgentsProvider initialAgents={[...getMyAgents(), ...getSharedAgents()]} initialSkills={getSkills()}>
        <ConnectionsProvider initialConnections={getUserConnections()}>
          <ChatProvider initialConversations={getConversations()} initialMessages={getInitialMessages()}>
            <WorkflowsProvider initialWorkflows={getWorkflows()} initialRuns={getRuns()}>
              <AlertsProvider>
                <MessengerProvider>
                  <WorkspaceProvider>
                    <RunNotifier />
                    {children}
                  </WorkspaceProvider>
                </MessengerProvider>
              </AlertsProvider>
            </WorkflowsProvider>
          </ChatProvider>
        </ConnectionsProvider>
      </AgentsProvider>
    </ModelsProvider>
    </UserSessionBoundary>
    </OrgSkillsProvider>
    </PoliciesProvider>
    </DemoFlagsProvider>
  );
}

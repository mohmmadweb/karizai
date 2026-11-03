import type { ReactNode } from "react";
import { AgentsProvider } from "@/features/agents/components/agents-provider";
import { getMyAgents, getSharedAgents, getSkills } from "@/features/agents/data/agents";
import { ConnectionsProvider } from "@/features/connections/components/connections-provider";
import { getUserConnections } from "@/features/connections/data/connections";
import { ModelsProvider } from "@/features/model-catalog/components/models-provider";
import { MessengerProvider } from "@/features/messenger/components/messenger-provider";
import { WorkspaceProvider } from "@/features/workspace/components/workspace-provider";
import { RunNotifier } from "@/features/workflows/components/run-notifier";
import { WorkflowsProvider } from "@/features/workflows/components/workflows-provider";
import { getRuns, getWorkflows } from "@/features/workflows/data/workflows";
import { DemoFlagsProvider } from "@/lib/demo-flags";
import { PolicyProvider } from "@/lib/policy-store";
import { OrgSkillsProvider } from "@/lib/org-skills";
import { ChatProvider } from "@/features/chat/components/chat-provider";
import { getConversations, getInitialMessages } from "@/features/chat/data/conversations";

/**
 * State shared by the user panel and the admin panel, so what a user sends for
 * approval shows up in the admin queue in the same visit. All of it is
 * temporary: a refresh returns to the sample data.
 */
export function SharedProviders({ children }: { children: ReactNode }) {
  return (
    <DemoFlagsProvider>
    <PolicyProvider>
    <OrgSkillsProvider>
    <ModelsProvider>
      <AgentsProvider initialAgents={[...getMyAgents(), ...getSharedAgents()]} initialSkills={getSkills()}>
        <ConnectionsProvider initialConnections={getUserConnections()}>
          <ChatProvider initialConversations={getConversations()} initialMessages={getInitialMessages()}>
            <WorkflowsProvider initialWorkflows={getWorkflows()} initialRuns={getRuns()}>
              <MessengerProvider>
                <WorkspaceProvider>
                  <RunNotifier />
                  {children}
                </WorkspaceProvider>
              </MessengerProvider>
            </WorkflowsProvider>
          </ChatProvider>
        </ConnectionsProvider>
      </AgentsProvider>
    </ModelsProvider>
    </OrgSkillsProvider>
    </PolicyProvider>
    </DemoFlagsProvider>
  );
}

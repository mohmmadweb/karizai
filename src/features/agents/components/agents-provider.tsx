"use client";

import { createContext, useContext, useMemo, useRef, useState, type ReactNode } from "react";
import { nextVersion } from "../lib/version";
import type { Agent, AgentDraft, ShareTarget, Skill, SkillContent } from "../types";

type AgentsContextValue = {
  agents: Agent[];
  skills: Skill[];
  /** Creates (id null) or updates a personal Agent and returns its id. */
  saveAgent: (id: string | null, draft: AgentDraft) => string;
  requestShare: (agentId: string, targets: ShareTarget[]) => void;
  /** New skills stay pending until the admin approves them. */
  addSkill: (content: Omit<SkillContent, "instructions"> & { instructions?: string }) => Skill;
  /** Edits a skill. An approved skill gets a pending version; others change directly and wait for approval. */
  editSkill: (id: string, content: SkillContent) => void;
  /** Sets exactly which of the user's Agents use this skill. */
  setSkillAgents: (skillId: string, agentIds: string[]) => void;
  /** Admin approval queue: decide a share request of an Agent. */
  decideShare: (agentId: string, shareId: string, approved: boolean, reason?: string) => void;
  /** Admin approval queue: approve or reject a pending skill (or its pending edit). */
  decideSkill: (skillId: string, approved: boolean, reason?: string) => void;
};

const AgentsContext = createContext<AgentsContextValue | null>(null);

export function AgentsProvider({
  initialAgents,
  initialSkills,
  children,
}: {
  initialAgents: Agent[];
  initialSkills: Skill[];
  children: ReactNode;
}) {
  const [agents, setAgents] = useState(initialAgents);
  const [skills, setSkills] = useState(initialSkills);
  const counter = useRef(0);

  const value = useMemo<AgentsContextValue>(
    () => ({
      agents,
      skills,
      saveAgent: (id, draft) => {
        const now = new Date().toISOString();
        if (id) {
          // Every save is a new version, so evaluation results and approvals refer to a known version.
          setAgents((list) => list.map((item) => (item.id === id ? { ...item, ...draft, version: nextVersion(item.version), updatedAt: now } : item)));
          return id;
        }
        const created: Agent = {
          ...draft,
          id: `agent-new-${++counter.current}`,
          isSensitive: false,
          isEnabled: true,
          kind: "personal",
          shareRequests: [],
          useCount: 0,
          version: "1.0",
          updatedAt: now,
        };
        setAgents((list) => [created, ...list]);
        return created.id;
      },
      requestShare: (agentId, targets) =>
        setAgents((list) =>
          list.map((item) =>
            item.id === agentId
              ? {
                  ...item,
                  shareRequests: [
                    { id: `share-new-${++counter.current}`, targets, status: "pending", requestedAt: new Date().toISOString() },
                    ...item.shareRequests,
                  ],
                }
              : item,
          ),
        ),
      editSkill: (id, content) =>
        setSkills((list) =>
          list.map((item) =>
            item.id !== id
              ? item
              : item.approval === "approved"
                ? { ...item, pendingEdit: content }
                : { ...item, ...content, approval: "pending", rejectionReason: undefined },
          ),
        ),
      setSkillAgents: (skillId, agentIds) =>
        setAgents((list) =>
          list.map((item) => {
            if (item.kind !== "personal") return item;
            const without = item.skillIds.filter((id) => id !== skillId);
            return { ...item, skillIds: agentIds.includes(item.id) ? [...without, skillId] : without };
          }),
        ),
      decideShare: (agentId, shareId, approved, reason) =>
        setAgents((list) =>
          list.map((item) =>
            item.id !== agentId
              ? item
              : { ...item, shareRequests: item.shareRequests.map((share) => (share.id === shareId ? { ...share, status: approved ? "approved" : "rejected", rejectionReason: approved ? undefined : (reason ?? "ادمین این درخواست را تأیید نکرد.") } : share)) },
          ),
        ),
      decideSkill: (skillId, approved, reason) =>
        setSkills((list) =>
          list.map((item) => {
            if (item.id !== skillId) return item;
            if (item.pendingEdit) return approved ? { ...item, ...item.pendingEdit, pendingEdit: undefined } : { ...item, pendingEdit: undefined };
            return approved ? { ...item, approval: "approved", rejectionReason: undefined } : { ...item, approval: "rejected", rejectionReason: reason ?? "ادمین این مهارت را تأیید نکرد." };
          }),
        ),
      addSkill: (content) => {
        const skill: Skill = { instructions: "", ...content, id: `skill-new-${++counter.current}`, approval: "pending" };
        setSkills((list) => [...list, skill]);
        return skill;
      },
    }),
    [agents, skills],
  );

  return <AgentsContext.Provider value={value}>{children}</AgentsContext.Provider>;
}

export function useAgents(): AgentsContextValue {
  const value = useContext(AgentsContext);
  if (!value) throw new Error("useAgents must be used inside AgentsProvider");
  return value;
}

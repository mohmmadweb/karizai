"use client";

import { ActiveWorkflowItem } from "./active-workflow-item";
import { useWorkflows } from "./workflows-provider";

type ActiveWorkflowsListProps = { activeId: string | null; onNavigate?: () => void };

/** Workflows that run by their triggers, for the sidebar. */
export function ActiveWorkflowsList({ activeId, onNavigate }: ActiveWorkflowsListProps) {
  const { workflows } = useWorkflows();
  const active = workflows.filter((item) => item.status === "active");
  if (active.length === 0) {
    return <p className="px-3 py-2 text-caption text-muted-foreground">جریان فعالی ندارید.</p>;
  }
  return (
    <ul className="flex flex-col gap-0.5">
      {active.map((item) => <ActiveWorkflowItem key={item.id} workflow={item} active={item.id === activeId} onNavigate={onNavigate} />)}
    </ul>
  );
}

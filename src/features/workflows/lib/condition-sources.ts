import type { Connection, ToolOutput } from "@/features/connections/types";
import { upstreamOf } from "./graph";
import type { ConditionOperator, WorkflowEdge, WorkflowNode } from "../types";

export const operatorLabels: Record<ConditionOperator, string> = {
  ">": "بیشتر از", "<": "کمتر از", ">=": "بیشتر یا برابر", "<=": "کمتر یا برابر", "=": "برابر با", "!=": "نابرابر با",
};

export type ConditionSource = { node: WorkflowNode; outputs: ToolOutput[] };

/** Earlier tool steps that return numbers a condition can compare. */
export function conditionSources(conditionId: string, nodes: WorkflowNode[], edges: WorkflowEdge[], connections: Connection[]): ConditionSource[] {
  const before = upstreamOf(conditionId, edges);
  return nodes
    .filter((node) => before.has(node.id) && node.kind === "tool")
    .map((node) => ({ node, outputs: connections.find((item) => item.id === node.config.connectionId)?.tools.find((tool) => tool.id === node.config.toolId)?.outputs ?? [] }))
    .filter((source) => source.outputs.length > 0);
}

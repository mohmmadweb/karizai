import type { WorkflowEdge, WorkflowNode } from "../types";

/** True when following the arrows can come back to a step already visited. */
export function hasCycle(nodes: WorkflowNode[], edges: WorkflowEdge[]): boolean {
  const next = new Map<string, string[]>();
  edges.forEach((edge) => next.set(edge.source, [...(next.get(edge.source) ?? []), edge.target]));
  const state = new Map<string, 1 | 2>();
  const visit = (id: string): boolean => {
    if (state.get(id) === 1) return true;
    if (state.get(id) === 2) return false;
    state.set(id, 1);
    const cyclic = (next.get(id) ?? []).some(visit);
    state.set(id, 2);
    return cyclic;
  };
  return nodes.some((node) => visit(node.id));
}

/** Steps that start the work: nobody points at them. */
export function startNodes(nodes: WorkflowNode[], edges: WorkflowEdge[]) {
  const targets = new Set(edges.map((edge) => edge.target));
  return nodes.filter((node) => !targets.has(node.id));
}

/** Everything that comes before a step. */
export function upstreamOf(id: string, edges: WorkflowEdge[]): Set<string> {
  const found = new Set<string>();
  const queue = [id];
  while (queue.length) {
    const current = queue.pop()!;
    edges.filter((edge) => edge.target === current).forEach((edge) => {
      if (!found.has(edge.source)) {
        found.add(edge.source);
        queue.push(edge.source);
      }
    });
  }
  return found;
}

/**
 * The order in which steps run. At a condition step the «بله» path is taken
 * when it exists; steps on the other path are skipped.
 */
export function runOrder(nodes: WorkflowNode[], edges: WorkflowEdge[]): { order: WorkflowNode[]; skipped: WorkflowNode[] } {
  const byId = new Map(nodes.map((node) => [node.id, node]));
  const order: WorkflowNode[] = [];
  const seen = new Set<string>();
  const queue = startNodes(nodes, edges).map((node) => node.id);
  while (queue.length) {
    const id = queue.shift()!;
    const node = byId.get(id);
    if (!node || seen.has(id)) continue;
    seen.add(id);
    order.push(node);
    const out = edges.filter((edge) => edge.source === id);
    const chosen = node.kind === "condition" ? out.filter((edge) => edge.label !== "خیر") : out;
    chosen.forEach((edge) => queue.push(edge.target));
  }
  return { order, skipped: nodes.filter((node) => !seen.has(node.id)) };
}

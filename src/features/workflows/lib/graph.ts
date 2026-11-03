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

export const errorLabel = "خطا";

export type RunPlan = {
  /** Steps that run, in a valid order. */
  order: WorkflowNode[];
  skipped: WorkflowNode[];
  /** For each step, the steps that must finish first (only paths that are taken). */
  deps: Map<string, string[]>;
  /** Steps that run at the same time as another step. */
  parallel: Set<string>;
};

/**
 * Which steps run and what each waits for. A condition takes the path `choose`
 * returns; a step that `fails` follows its «خطا» path when it has one and its
 * setting says so, and stops the run otherwise. Branches after a parallel
 * (fork) step have no order between them, so they run at the same time.
 */
export function planRun(
  nodes: WorkflowNode[],
  edges: WorkflowEdge[],
  choose: (node: WorkflowNode) => "بله" | "خیر",
  fails: (node: WorkflowNode) => boolean,
): RunPlan {
  const byId = new Map(nodes.map((node) => [node.id, node]));
  const taken: WorkflowEdge[] = [];
  const seen = new Set<string>();
  const queue = startNodes(nodes, edges).map((node) => node.id);
  while (queue.length) {
    const id = queue.shift()!;
    const node = byId.get(id);
    if (!node || seen.has(id)) continue;
    seen.add(id);
    const out = edges.filter((edge) => edge.source === id);
    const normal = out.filter((edge) => edge.label !== errorLabel);
    let next = normal;
    if (fails(node)) {
      const policy = node.config.onError ?? "stop";
      next = policy === "continue" ? normal : policy === "branch" ? out.filter((edge) => edge.label === errorLabel) : [];
    } else if (node.kind === "condition") {
      const choice = choose(node);
      next = normal.filter((edge) => (choice === "خیر" ? edge.label === "خیر" : edge.label !== "خیر"));
    }
    next.forEach((edge) => {
      taken.push(edge);
      queue.push(edge.target);
    });
  }
  const deps = new Map<string, string[]>();
  seen.forEach((id) => deps.set(id, [...new Set(taken.filter((edge) => edge.target === id && seen.has(edge.source)).map((edge) => edge.source))]));
  // Put each step after everything it waits for.
  const order: WorkflowNode[] = [];
  const placed = new Set<string>();
  const place = (id: string, trail: Set<string>) => {
    if (placed.has(id) || trail.has(id)) return;
    trail.add(id);
    (deps.get(id) ?? []).forEach((dep) => place(dep, trail));
    placed.add(id);
    order.push(byId.get(id)!);
  };
  seen.forEach((id) => place(id, new Set()));
  const ancestors = new Map<string, Set<string>>();
  const ancestorsOf = (id: string): Set<string> => {
    const known = ancestors.get(id);
    if (known) return known;
    const found = new Set<string>();
    ancestors.set(id, found);
    (deps.get(id) ?? []).forEach((dep) => {
      found.add(dep);
      ancestorsOf(dep).forEach((item) => found.add(item));
    });
    return found;
  };
  const parallel = new Set<string>();
  const ids = [...seen];
  ids.forEach((a) => ids.forEach((b) => {
    if (a !== b && !ancestorsOf(a).has(b) && !ancestorsOf(b).has(a)) parallel.add(a);
  }));
  return { order, skipped: nodes.filter((node) => !seen.has(node.id)), deps, parallel };
}

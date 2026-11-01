import type { Run, RunStep } from "../types";

export type Tokens = { input: number; output: number; total: number };

const empty = (): Tokens => ({ input: 0, output: 0, total: 0 });

function add(into: Tokens, step: Pick<RunStep, "inputTokens" | "outputTokens">) {
  into.input += step.inputTokens ?? 0;
  into.output += step.outputTokens ?? 0;
  into.total = into.input + into.output;
}

export function tokensOfRun(run: Run): Tokens {
  const sum = empty();
  run.steps.forEach((step) => add(sum, step));
  return sum;
}

export type StepCost = { label: string; tokens: Tokens; modelName?: string };

/** What each step cost across all runs of a workflow, most expensive first. */
export function costByStep(runs: Run[]): StepCost[] {
  const byStep = new Map<string, StepCost>();
  for (const run of runs) {
    for (const step of run.steps) {
      if (!step.inputTokens && !step.outputTokens) continue;
      const found = byStep.get(step.nodeId) ?? { label: step.label, tokens: empty(), modelName: step.modelName };
      add(found.tokens, step);
      byStep.set(step.nodeId, found);
    }
  }
  return [...byStep.values()].sort((a, b) => b.tokens.total - a.tokens.total);
}

export function totalTokens(runs: Run[]): Tokens {
  const sum = empty();
  runs.forEach((run) => run.steps.forEach((step) => add(sum, step)));
  return sum;
}

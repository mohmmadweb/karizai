"use client";

import { useCallback, useEffect, useRef, type Dispatch, type SetStateAction } from "react";
import { toast } from "sonner";
import { formatNumber } from "@/lib/format";
import { getMlModel } from "../data/ml-models";
import { planRun, type RunPlan } from "../lib/graph";
import { taskFromStep } from "../lib/task-step";
import type { NodeKind, Run, RunStep, Workflow, WorkflowNode } from "../types";

const outputs: Record<NodeKind, string> = {
  agent: "عامل کار را انجام داد و نتیجه را برگرداند.",
  skill: "اسکیل اجرا شد و نتیجه را برگرداند.",
  tool: "ابزار با موفقیت اجرا شد.",
  condition: "شرط بررسی شد.",
  approval: "تأیید شد.",
  orchestrator: "هماهنگ‌کننده کار را بین عامل‌ها تقسیم کرد و نتیجه‌ها را جمع کرد.",
  code: "اسکریپت اجرا شد.",
  "ml-model": "مدل اجرا شد.",
  "prompt-optimizer": "✦ پرامپت بهینه شد: نقش، قالب خروجی و ارجاع به رویه‌ی QC-SOP-07 اضافه شد و ۳۸٪ توکن کمتر مصرف می‌کند.",
  router: "مسیریاب درخواست را سپرد.",
  supervisor: "ناظر خروجی را بررسی کرد.",
  fork: "شاخه‌ها هم‌زمان شروع شدند.",
  join: "همه‌ی شاخه‌ها تمام شدند و نتیجه‌ها یکی شد.",
};

/** What known tools return in the sample run (numbers match the plant sample data). */
const toolOutputs: Record<string, string> = {
  "tool-6": "موجودی انبار مرکزی: PE سنگین HD5502 ۱۸ تن (نقطه‌ی سفارش ۴۰ تن، پوشش ۳ روز)؛ POE الاستومر ۴ تن؛ PP هموپلیمر H350 ۴۲ تن.",
  "tool-20": "۳ ماده از ۶ ماده زیر نقطه‌ی سفارش است؛ HD5502 با ۱۸ تن فقط ۳ روز پوشش دارد.",
  "tool-22": "محموله‌ی ۴۰ تنی HD5502 تا ۱۸ آبان در گمرک است.",
  "tool-60": "پیش‌نویس سفارش خرید PO-1405-0871 در راهکاران ثبت شد: ۸۰ تن PE سنگین HD5502 از پلیمر خزر، وضعیت «پیش‌نویس».",
  "tool-61": "۱۴ سفارش باز فروش برای ۱۰ روز آینده، جمعاً ۳۱۲ تن در ۶ گرید.",
  "tool-24": "ظرفیت امروز: خط ۱ و ۲ آماده، خط ۳ از ساعت ۱۴ تا ۱۸ توقف برنامه‌ریزی‌شده.",
  "tool-30": "یک توقف برنامه‌ریزی‌شده: تعویض اسکرو خط ۳، ۴ ساعت.",
};

/** Typical token use per kind of step; steps without a model spend none. */
const baseTokens: Record<NodeKind, [number, number]> = {
  agent: [620, 380],
  skill: [420, 260],
  condition: [90, 12],
  approval: [0, 0],
  tool: [0, 0],
  orchestrator: [2400, 1500],
  code: [0, 0],
  "ml-model": [0, 0],
  "prompt-optimizer": [380, 240],
  router: [160, 20],
  supervisor: [900, 180],
  fork: [0, 0],
  join: [0, 0],
};

function tokensOf(node: WorkflowNode): Pick<RunStep, "inputTokens" | "outputTokens"> {
  const [input, output] = baseTokens[node.kind];
  if (input === 0) return {};
  const spread = (node.label.length * 17) % 140;
  return { inputTokens: input + spread, outputTokens: output + Math.round(spread / 2) };
}

const has = (node: WorkflowNode, word: RegExp) => word.test(node.config.instruction ?? "");
/** Demo rules: «خطای موقت» fails once, «کند» goes past the timeout, any other «خطا» always fails. */
function failsOnAttempt(node: WorkflowNode, attempt: number): string | null {
  if (has(node, /کند/)) return `زمان گام از ${formatNumber(node.config.timeoutSec ?? 30)} ثانیه گذشت و متوقف شد.`;
  if (has(node, /خطای موقت/)) return attempt === 1 ? "سامانه‌ی مقصد موقتاً پاسخ نداد." : null;
  if (has(node, /خطا/)) return "این گام با خطا روبه‌رو شد. تنظیم آن را بررسی کنید.";
  return null;
}
const failsFinally = (node: WorkflowNode) => failsOnAttempt(node, (node.config.retries ?? 0) + 1) !== null;

/** «بله» or «خیر» for a condition; a rule on an ML model's number is really compared. */
function choose(node: WorkflowNode, nodes: WorkflowNode[]): "بله" | "خیر" {
  const rule = node.config.rule;
  const source = nodes.find((item) => item.id === rule?.sourceNodeId);
  if (!rule || source?.kind !== "ml-model") return "بله";
  const value = getMlModel(source.config.mlModelId)?.sample[rule.field];
  const limit = Number(rule.value);
  if (value === undefined || Number.isNaN(limit)) return "بله";
  const ok = { ">": value > limit, "<": value < limit, ">=": value >= limit, "<=": value <= limit, "=": value === limit, "!=": value !== limit }[rule.operator];
  return ok ? "بله" : "خیر";
}

function describeMl(node: WorkflowNode): string {
  const model = getMlModel(node.config.mlModelId);
  if (!model) return outputs["ml-model"];
  const values = model.outputs.map((item) => `${item.label} = ${formatNumber(model.sample[item.key] ?? 0)}${item.unit ? ` ${item.unit}` : ""}`).join(" · ");
  return `✦ مدل «${model.name}» اجرا شد: ${values}`;
}

type Names = { model: (node: WorkflowNode) => string | undefined; agent: (id: string) => string | undefined };

function outputOf(node: WorkflowNode, nodes: WorkflowNode[], names: Names, plan: RunPlan): string {
  const task = taskFromStep(node);
  if (task) return `وظیفه‌ی «${task.title}» در وظایف من ثبت شد.`;
  const c = node.config;
  switch (node.kind) {
    case "tool": return toolOutputs[c.toolId ?? ""] ?? outputs.tool;
    case "ml-model": return describeMl(node);
    case "code": return `اسکریپت ${c.language === "javascript" ? "JavaScript" : "Python"} در محیط ایزوله اجرا شد · خروجی: ${c.language === "javascript" ? "{ lateOrders: 2 }" : "{\"cpk\": 1.12, \"batches\": 6}"}`;
    case "condition": return `شرط «${c.condition ?? node.label}» بررسی شد: مسیر «${choose(node, nodes)}».`;
    case "router": return `✦ مسیریاب درخواست را به «${names.agent(c.childAgentIds?.[0] ?? "") ?? "عامل مناسب"}» سپرد (اطمینان ۸۷٪)؛ چون داده حساس است، مدل داخلی انتخاب شد.`;
    case "supervisor": {
      const count = formatNumber(c.checks?.length ?? 0);
      return `✦ ناظر ${count} معیار را بررسی کرد: ${count} از ${count} برقرار است؛ خروجی تأیید شد.`;
    }
    case "fork": return `${formatNumber([...plan.deps.values()].filter((deps) => deps.includes(node.id)).length)} شاخه هم‌زمان شروع شد.`;
    case "join": return `${formatNumber(plan.deps.get(node.id)?.length ?? 0)} شاخه تمام شد و نتیجه‌ها یکی شد.`;
    default: return outputs[node.kind];
  }
}

const planOf = (workflow: Workflow, fixed: Set<string>) =>
  planRun(workflow.nodes, workflow.edges, (node) => choose(node, workflow.nodes), (node) => !fixed.has(node.id) && failsFinally(node));

let counter = 0;

/**
 * Simulated run. Every step starts once the steps it waits for are done, so
 * parallel branches run at the same time. A step retries, times out, and on
 * failure stops the run, continues, or follows its «خطا» path. Approval steps
 * pause the run (one at a time) until the user decides. Nothing runs on a server.
 */
export function useRunEngine(setRuns: Dispatch<SetStateAction<Run[]>>, modelNameOf: (node: WorkflowNode) => string | undefined, agentNameOf: (id: string) => string | undefined) {
  const timers = useRef(new Set<ReturnType<typeof setTimeout>>());
  const names = useRef<Names>({ model: modelNameOf, agent: agentNameOf });
  useEffect(() => {
    names.current = { model: modelNameOf, agent: agentNameOf };
  });
  const waiting = useRef(new Map<string, (approved: boolean) => void>());
  const approvals = useRef(new Map<string, Promise<unknown>>());

  useEffect(() => {
    const active = timers.current;
    return () => active.forEach(clearTimeout);
  }, []);

  const update = useCallback(
    (runId: string, change: (run: Run) => Run) => setRuns((list) => list.map((run) => (run.id === runId ? change(run) : run))),
    [setRuns],
  );
  const patchStep = useCallback(
    (runId: string, nodeId: string, patch: Partial<RunStep>) =>
      update(runId, (run) => ({ ...run, steps: run.steps.map((step) => (step.nodeId === nodeId ? { ...step, ...patch } : step)) })),
    [update],
  );

  /** Runs every step of the plan that is not in `done`. `fixed` steps succeed this time (after «اجرای دوباره»). */
  const execute = useCallback(
    async (runId: string, workflow: Workflow, plan: RunPlan, done: Set<string>, fixed: Set<string>) => {
      const wait = (ms: number) => new Promise<void>((resolve) => timers.current.add(setTimeout(resolve, ms)));
      const began = Date.now();
      let waited = 0;
      let work = 0;
      let stopped = false;
      const memo = new Map<string, Promise<boolean>>();
      const fail = (message: string, description: string) => {
        stopped = true;
        update(runId, (run) => ({ ...run, status: "failed", endedAt: new Date().toISOString() }));
        toast.error(message, { description });
      };

      const approve = async (node: WorkflowNode, stepStart: number): Promise<boolean> => {
        const before = approvals.current.get(runId) ?? Promise.resolve();
        const mine = before.then(async () => {
          if (stopped) return false;
          const asked = Date.now();
          update(runId, (run) => ({ ...run, status: "waiting-approval" }));
          patchStep(runId, node.id, { status: "waiting-approval" });
          const approved = await new Promise<boolean>((resolve) => waiting.current.set(runId, resolve));
          waited += Date.now() - asked;
          update(runId, (run) => ({ ...run, status: "running" }));
          return approved;
        });
        approvals.current.set(runId, mine);
        const approved = await mine;
        if (!approved && !stopped) {
          patchStep(runId, node.id, { status: "failed", error: "تأیید داده نشد و کار متوقف شد.", durationMs: Date.now() - stepStart });
          fail(`کار «${workflow.name}» متوقف شد.`, "تأیید داده نشد.");
        }
        return approved;
      };

      const step = async (node: WorkflowNode): Promise<boolean> => {
        if (stopped) return false;
        patchStep(runId, node.id, { status: "running", output: undefined, error: undefined });
        const stepStart = Date.now();
        if (node.kind === "approval") {
          if (!(await approve(node, stepStart))) return false;
          patchStep(runId, node.id, { status: "succeeded", output: outputs.approval, durationMs: Date.now() - stepStart });
          return true;
        }
        const tries = (node.config.retries ?? 0) + 1;
        let problem: string | null = null;
        let attempt = 1;
        for (; attempt <= tries; attempt += 1) {
          const quick = node.kind === "fork" || node.kind === "join" || node.kind === "condition";
          await wait(quick ? 300 : 900 + (node.label.length % 5) * 150);
          if (stopped) return false;
          problem = fixed.has(node.id) ? null : failsOnAttempt(node, attempt);
          if (!problem) break;
          if (attempt < tries) patchStep(runId, node.id, { output: `تلاش ${formatNumber(attempt)} ناموفق بود (${problem}) — تلاش دوباره…`, attempts: attempt });
        }
        const durationMs = Date.now() - stepStart;
        work += durationMs;
        const used = Math.min(attempt, tries);
        const attempts = used > 1 ? used : undefined;
        if (problem) {
          const policy = node.config.onError ?? "stop";
          if (policy === "stop") {
            patchStep(runId, node.id, { status: "failed", error: problem, durationMs, attempts });
            fail(`کار «${workflow.name}» ناموفق بود.`, `گام «${node.label}» خطا داد. می‌توانید از همین گام دوباره اجرا کنید.`);
            return false;
          }
          patchStep(runId, node.id, { status: "failed", error: problem, output: policy === "branch" ? "جریان به مسیر «خطا» رفت." : "خطا نادیده گرفته شد و جریان ادامه یافت.", durationMs, attempts });
          return true;
        }
        patchStep(runId, node.id, {
          status: "succeeded", output: outputOf(node, workflow.nodes, names.current, plan), durationMs, attempts,
          modelName: node.kind === "ml-model" ? getMlModel(node.config.mlModelId)?.framework : names.current.model(node), ...tokensOf(node),
        });
        return true;
      };

      const exec = (id: string): Promise<boolean> => {
        if (done.has(id)) return Promise.resolve(true);
        const known = memo.get(id);
        if (known) return known;
        const node = workflow.nodes.find((item) => item.id === id)!;
        const promise = Promise.all((plan.deps.get(id) ?? []).map(exec)).then((results) => (results.every(Boolean) ? step(node) : false));
        memo.set(id, promise);
        return promise;
      };

      await Promise.all(plan.order.map((node) => exec(node.id)));
      approvals.current.delete(runId);
      if (stopped) return;
      const wall = Date.now() - began - waited;
      const savedMs = plan.parallel.size > 0 && work - wall > 300 ? work - wall : undefined;
      update(runId, (run) => ({ ...run, status: "succeeded", endedAt: new Date().toISOString(), savedMs }));
      toast.success(`کار «${workflow.name}» تمام شد.`, {
        description: `${formatNumber(Math.max(1, Math.round((Date.now() - began) / 1000)))} ثانیه طول کشید${savedMs ? ` · ${formatNumber(Math.max(1, Math.round(savedMs / 1000)))} ثانیه با اجرای موازی صرفه‌جویی شد` : ""}.`,
      });
    },
    [patchStep, update],
  );

  const start = useCallback(
    (workflow: Workflow, startedBy: string): string => {
      const plan = planOf(workflow, new Set());
      const runId = `run-new-${++counter}`;
      const steps: RunStep[] = [
        ...plan.order.map((node) => ({ nodeId: node.id, label: node.label, status: "pending" as const, parallel: plan.parallel.has(node.id) || undefined })),
        ...plan.skipped.map((node) => ({ nodeId: node.id, label: node.label, status: "skipped" as const })),
      ];
      setRuns((list) => [{ id: runId, workflowId: workflow.id, startedAt: new Date().toISOString(), status: "running", startedBy, steps }, ...list]);
      void execute(runId, workflow, plan, new Set(), new Set());
      return runId;
    },
    [execute, setRuns],
  );

  /** Runs a failed run again from one step: earlier steps keep their results; this step and the ones after it run again. */
  const rerunFrom = useCallback(
    (run: Run, workflow: Workflow, nodeId: string) => {
      const fixed = new Set([nodeId]);
      const plan = planOf(workflow, fixed);
      const again = new Set([nodeId]);
      let grew = true;
      while (grew) {
        grew = false;
        plan.deps.forEach((deps, id) => {
          if (!again.has(id) && deps.some((dep) => again.has(dep))) {
            again.add(id);
            grew = true;
          }
        });
      }
      // Steps that never finished last time run too.
      plan.order.forEach((node) => {
        const status = run.steps.find((step) => step.nodeId === node.id)?.status;
        if (status !== "succeeded" && status !== "failed") again.add(node.id);
      });
      const done = new Set(plan.order.map((node) => node.id).filter((id) => !again.has(id)));
      const steps: RunStep[] = [
        ...plan.order.map((node) => (again.has(node.id) ? { nodeId: node.id, label: node.label, status: "pending" as const, parallel: plan.parallel.has(node.id) || undefined } : run.steps.find((step) => step.nodeId === node.id)!)),
        ...plan.skipped.map((node) => ({ nodeId: node.id, label: node.label, status: "skipped" as const })),
      ];
      update(run.id, (current) => ({ ...current, status: "running", endedAt: undefined, savedMs: undefined, steps }));
      toast.info(`اجرای دوباره از گام «${run.steps.find((step) => step.nodeId === nodeId)?.label ?? ""}» شروع شد.`);
      void execute(run.id, workflow, plan, done, fixed);
    },
    [execute, update],
  );

  const decide = useCallback((runId: string, approved: boolean) => {
    waiting.current.get(runId)?.(approved);
    waiting.current.delete(runId);
  }, []);

  return { start, decide, rerunFrom };
}

import { documentSources, type PlannedStep } from "../lib/orchestration";
import { approvedDecision, decideSupervision, type SupervisionOutcome } from "../lib/supervisor";
import type { Source, TimelineStep } from "../types";

type Deps = {
  plan: PlannedStep[];
  /** Capabilities of the calling user; an agent never gets more than this. */
  capabilities: string[];
  question: string;
  thinkingModel: string;
  agentModelName: (agentId?: string) => string;
  update: (steps: TimelineStep[]) => void;
  /** Waits; rejects when the user stops the answer. */
  wait: (ms: number) => Promise<void>;
  askApproval: () => Promise<boolean>;
  supervisor?: {
    sensitive: boolean;
    /** A model other than the one that answered, or `null` when none may be used (a sensitive Agent without an internal model). */
    independentModel: string | null;
    /** A stronger model than the one that answered, or `null` when the answer already came from the strongest allowed one. */
    strongerModel: string | null;
  };
};

const tokens = (text: string, extra = 0) => Math.max(20, Math.round(text.length / 2.2) + extra);

export type TimelineOutcome = {
  steps: TimelineStep[];
  text: string;
  sources: Source[];
  toolNames: string[];
  supervision?: { outcome: SupervisionOutcome; model: string };
};

const accessDenied = (capability: "data" | "knowledge") =>
  capability === "data" ? "شما به داده‌ی سازمان (دستیار هوش تجاری) دسترسی ندارید." : "شما به اسناد سازمان دسترسی ندارید.";

/** Runs the planned steps one by one and reports each change. Nothing leaves the browser. */
export async function runTimeline(deps: Deps): Promise<TimelineOutcome> {
  let supervision: TimelineOutcome["supervision"];
  const steps: TimelineStep[] = deps.plan.map((item) => ({ id: item.id, kind: item.kind, title: item.title, via: item.via, status: "pending", lines: [], approval: item.approval }));
  const push = () => deps.update(steps.map((step) => ({ ...step, lines: [...step.lines] })));
  const set = (index: number, change: Partial<TimelineStep>) => { steps[index] = { ...steps[index], ...change }; push(); };

  for (let index = 0; index < deps.plan.length; index++) {
    const item = deps.plan[index];
    set(index, { status: "running", modelName: item.kind === "thinking" ? deps.thinkingModel : item.agentId ? deps.agentModelName(item.agentId) : undefined });

    if (item.kind === "supervisor") {
      const proposed = decideSupervision(deps.question, deps.plan.some((p) => p.kind === "agent"));
      // A re-run needs a stronger model; without one the answer is simply approved.
      const decision = proposed.outcome === "rerun" && !deps.supervisor?.strongerModel ? approvedDecision : proposed;
      const model = (decision.outcome === "rerun" ? deps.supervisor?.strongerModel : deps.supervisor?.independentModel) ?? null;
      if (!model) {
        await deps.wait(500);
        set(index, { status: "failed", error: deps.supervisor?.sensitive ? "مدل داخلی در دسترس نیست؛ چون Agent حساس است، بررسی انجام نشد." : "مدل ناظر در دسترس نیست و بررسی انجام نشد.", inputTokens: 0, outputTokens: 0 });
        continue;
      }
      set(index, { modelName: model });
      for (const line of decision.lines) {
        await deps.wait(650);
        set(index, { lines: [...steps[index].lines, line] });
      }
      await deps.wait(450);
      supervision = { outcome: decision.outcome, model };
      set(index, { status: "done", result: decision.result, inputTokens: tokens(deps.question, 140), outputTokens: tokens(decision.result, 30) });
      continue;
    }
    if (item.capability && !deps.capabilities.includes(item.capability)) {
      await deps.wait(500);
      set(index, { status: "failed", error: accessDenied(item.capability), inputTokens: 0, outputTokens: 0 });
      continue;
    }
    if (item.kind === "approval") {
      set(index, { status: "waiting-approval" });
      const approved = await deps.askApproval();
      if (!approved) {
        set(index, { status: "failed", error: "ارسال رد شد و انجام نشد.", inputTokens: 0, outputTokens: 0 });
        continue;
      }
      set(index, { status: "running" });
    }
    for (const line of item.lines) {
      await deps.wait(650);
      set(index, { lines: [...steps[index].lines, line] });
    }
    await deps.wait(450);
    set(index, { status: "done", result: item.result, inputTokens: tokens(deps.question, 60 + index * 80), outputTokens: tokens(item.result) });
  }

  const done = (id: string) => steps.find((step) => step.id === id)?.status === "done";
  const parts = [
    done("bi") ? `- **فروش:** ${deps.plan.find((p) => p.id === "bi")?.result}` : "- **فروش:** آمار فروش به‌دست نیامد.",
    done("writer") ? `- **قراردادها:** ${deps.plan.find((p) => p.id === "writer")?.result}` : "- **قراردادها:** قراردادهای مرتبط بررسی نشد.",
    ...(steps.some((step) => step.id === "send") ? [done("send") ? "- **ارسال:** خلاصه برای مدیر فرستاده شد." : "- **ارسال:** خلاصه ارسال نشد."] : []),
  ];
  const failed = steps.filter((step) => step.status === "failed").length;
  const draft = `خلاصه برای مدیر:\n\n${parts.join("\n")}\n\n${failed > 0 ? `${failed.toLocaleString("fa-IR")} گام انجام نشد؛ دلیلش در بخش گام‌ها نوشته شده است.` : "برای نتیجه‌ی دقیق‌تر می‌توانید بازه‌ی زمانی یا استان مشخصی را بخواهید."}`;
  // The supervisor's correction shows in the final text.
  const text = supervision?.outcome === "corrected" ? draft.replace("۳۸٪", "۳۶٪") : draft;
  return {
    steps,
    supervision,
    text,
    sources: done("writer") ? documentSources : [],
    toolNames: [done("bi") ? "دستیار هوش تجاری" : "", done("writer") ? "دستیار سند" : "", done("send") ? "ارسال پیامک" : ""].filter(Boolean),
  };
}

import { getTemplates } from "../data/templates";
import type { Trigger, WorkflowTemplate } from "../types";

function guessTrigger(text: string): Trigger {
  if (/هر\s*(روز|شب|صبح)/.test(text)) return { kind: "schedule", every: "daily", time: "08:00" };
  if (/هر\s*ساعت/.test(text)) return { kind: "schedule", every: "hourly", time: "00:00" };
  if (/هر\s*(هفته|شنبه)/.test(text)) return { kind: "schedule", every: "weekly", weekday: "sat", time: "08:00" };
  if (/وقتی.*(مشتری)/.test(text)) return { kind: "event", event: "new-customer" };
  if (/وقتی.*(ایمیل|نامه)/.test(text)) return { kind: "event", event: "new-email" };
  return { kind: "manual" };
}

/**
 * Turns a sentence into a first draft. Real language understanding comes with
 * the backend; here a few key words pick a template or a single-step draft.
 */
export function generateFromText(text: string): WorkflowTemplate {
  const templates = getTemplates();
  const trigger = guessTrigger(text);
  const base = /(برنامه.?ریزی|زمان.?بندی\s*خط|تعویض\s*فرمول)/.test(text)
    ? templates[6]
    : /(کمبود|سفارش\s*مواد|مواد\s*اولیه)/.test(text)
    ? templates[5]
    : /(جلسه|چند\s*agent|چندایجنت)/i.test(text)
    ? templates[2]
    : /(مشتری)/.test(text)
      ? templates[1]
      : /(گزارش|فروش)/.test(text)
        ? templates[0]
        : null;
  if (base) return { ...base, id: "generated", name: text.trim().slice(0, 40) || base.name, triggers: [trigger] };
  return {
    id: "generated",
    name: text.trim().slice(0, 40) || "کار تازه",
    description: text.trim(),
    triggers: [trigger],
    nodes: [{ id: "n1", kind: "agent", label: "انجام کار", position: { x: 0, y: 0 }, config: { agentId: "agent-2", instruction: text.trim() } }],
    edges: [],
  };
}

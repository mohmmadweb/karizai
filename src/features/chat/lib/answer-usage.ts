import { tomanPer1kTokens } from "@/lib/policy-store";
import type { Message } from "../types";
import { countTokens } from "./prompt-optimizer";

export type AnswerUsage = { inputTokens: number; outputTokens: number; costToman: number; seconds: number };

/** Tokens, toman cost and time of one finished answer (R11.2). Costs use the organization's rates per 1,000 tokens. */
export function answerUsage(message: Message, question: string, internal: boolean): AnswerUsage {
  const steps = message.timeline ?? [];
  const inputTokens = (message.optimization?.after ?? countTokens(question) + 420) + steps.reduce((sum, step) => sum + (step.inputTokens ?? 0), 0);
  const outputTokens = countTokens(message.text) + steps.reduce((sum, step) => sum + (step.outputTokens ?? 0), 0);
  const rate = internal ? tomanPer1kTokens.internal : tomanPer1kTokens.external;
  const elapsed = message.finishedAt ? (new Date(message.finishedAt).getTime() - new Date(message.createdAt).getTime()) / 1000 : 0;
  const seconds = elapsed > 0 && elapsed < 600 ? elapsed : 1.4 + outputTokens / 90 + steps.length * 1.3;
  return { inputTokens, outputTokens, costToman: Math.max(1, Math.round(((inputTokens + outputTokens) / 1000) * rate)), seconds };
}

import type { Message, ScriptedReply, TimelineStep } from "../types";

/** Rough token count used only to fill the timeline of a prepared answer. */
const tokens = (text: string) => Math.max(20, Math.round(text.length / 2.2));

/** Builds the question and its finished answer, as they would appear in a conversation's history. */
export function scriptedExchange(options: { key: string; question: string; reply: ScriptedReply; at: string; modelName: string; agentName?: string }): Message[] {
  const { key, question, reply, at, modelName, agentName } = options;
  const timeline: TimelineStep[] = reply.steps.map((step) => ({
    id: step.id,
    kind: step.kind,
    title: step.title,
    via: step.via,
    status: "done",
    lines: step.lines,
    result: step.result,
    modelName: step.kind === "thinking" ? modelName : undefined,
    inputTokens: tokens(question) + 60,
    outputTokens: tokens(step.result),
  }));
  const answeredAt = new Date(new Date(at).getTime() + 45_000).toISOString();
  return [
    { id: `${key}-q`, role: "user", text: question, createdAt: at, status: "done", sources: [], attachments: [] },
    {
      id: `${key}-a`, role: "assistant", text: reply.text, createdAt: answeredAt, status: "done",
      modelName: reply.fixed ? undefined : modelName, agentName, timeline,
      toolNames: reply.steps.filter((step) => step.kind === "tool").map((step) => step.title),
      sources: reply.sources ?? [], attachments: [], structured: reply.structured,
    },
  ];
}

export type AuditChannel = "chat" | "workflow" | "api";
export type AuditResult = "success" | "pending" | "denied";

export const channelLabels: Record<AuditChannel, string> = { chat: "گفتگو", workflow: "جریان", api: "API" };
export const resultLabels: Record<AuditResult, string> = { success: "موفق", pending: "منتظر تأیید", denied: "دسترسی رد شد" };

export type AuditEvent = {
  id: string;
  /** ISO date. */
  at: string;
  user: string;
  unit: string;
  agent: string;
  /** Tool or data source that was used. */
  source: string;
  model: string;
  channel: AuditChannel;
  result: AuditResult;
  /** What was asked or done, in one line. */
  action: string;
  /** Why access was denied or what is awaited. */
  reason?: string;
  maskedCount: number;
  durationMs: number;
};

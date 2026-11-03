export type ApprovalType = "agent" | "skill" | "workflow" | "connection";

export const approvalTypeLabels: Record<ApprovalType, string> = {
  agent: "عامل",
  skill: "مهارت",
  workflow: "جریان",
  connection: "اتصال",
};

/** One card of the queue, whatever it came from. */
export type ApprovalItem = {
  key: string;
  type: ApprovalType;
  title: string;
  requester: string;
  /** What is asked, in one sentence. */
  ask: string;
  /** Short conditions, such as «ارزیابی ۹۱٪» or «فقط مدل داخلی». */
  conditions: string[];
  /** ISO date, when known. */
  requestedAt?: string;
  decide: (approved: boolean, reason?: string) => void;
};

/** A request kept only on this page (connections, publishing an organization Agent). */
export type LocalRequest = Omit<ApprovalItem, "decide">;

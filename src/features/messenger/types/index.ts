export type Colleague = {
  id: string;
  name: string;
  /** Job title shown under the name. */
  role: string;
  online: boolean;
};

export type AlertField = { label: string; value: string };

/** What a workflow tells the user: a title, a few figures and the workflow it came from. */
export type AlertContent = {
  title: string;
  tone: "warning" | "info";
  fields: AlertField[];
  workflowId: string;
};

export type MessengerMessage = {
  id: string;
  /** "alerts" and "flows" for the two bots, otherwise a colleague id. */
  threadId: string;
  from: "me" | "other" | "system";
  text: string;
  /** ISO date. */
  createdAt: string;
  read: boolean;
  alert?: AlertContent;
};

export const alertsThreadId = "alerts";
export const flowsThreadId = "flows";

/** A bot is a sender that only writes to the user: the alert bot and the workflow bot. */
export type Bot = { id: string; name: string; description: string };

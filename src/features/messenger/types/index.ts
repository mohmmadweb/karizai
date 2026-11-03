export type Colleague = {
  id: string;
  name: string;
  /** Job title shown under the name. */
  role: string;
  online: boolean;
};

/**
 * A group of colleagues or an announcement channel, as the chat list shows it. Groups and channels have their
 * own pages (`/messenger/groups`, `/messenger/channels`); `href` opens the item there.
 */
export type Group = { id: string; name: string; description: string; kind: "group" | "channel"; href: string };

export const salesGroupId = "grp-sales";

export type AlertField = { label: string; value: string };

/** What a workflow tells the user: a title, a few figures and the workflow it came from. */
export type AlertContent = {
  title: string;
  tone: "warning" | "info";
  fields: AlertField[];
  /** Absent when the alert did not come from a workflow. */
  workflowId?: string;
};

export type MessengerMessage = {
  id: string;
  /** "alerts" and "flows" for the two bots, otherwise a colleague id. */
  threadId: string;
  /** "agent" is an Agent answering inside a colleague chat after «@دستیار». */
  from: "me" | "other" | "system" | "agent";
  text: string;
  /** Who wrote it, shown in groups; absent in one-to-one chats. */
  sender?: string;
  /** ISO date. */
  createdAt: string;
  read: boolean;
  alert?: AlertContent;
  /** Only for Agent answers: who answered and the sources it used. */
  agent?: { name: string; sources: string[] };
};

/** What a workflow run (or any page) can post to the alert bot. */
export type PostAlertInput = { title: string; text: string; workflowId?: string; runId?: string; tone?: "warning" | "info"; fields?: AlertField[] };

export const alertsThreadId = "alerts";
export const flowsThreadId = "flows";

/** A bot is a sender that only writes to the user: the alert bot and the workflow bot. */
export type Bot = { id: string; name: string; description: string };

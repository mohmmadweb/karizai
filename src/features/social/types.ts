/** A task the assistant proposes (from minutes, a group or a chat) before the user adds it. */
export type SuggestedTask = { title: string; assigneeId: string; /** ISO date. */ dueDate: string; projectId: string };

/** An Agent as a member of the organization: it can be called in groups and chats with its handle. */
export type AgentMember = { id: string; name: string; handle: string; unit: string };

export type AgentAnswer = { agentId: string; agentName: string; text: string; sources: string[] };

export type GroupSummary = {
  unread: number;
  topic: string;
  points: string[];
  openDecision: string;
  actions: SuggestedTask[];
};

export type Group = {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  /** Agents that read the group and answer when called. */
  agentIds: string[];
  summary: GroupSummary;
};

export type GroupMessage = {
  id: string;
  groupId: string;
  /** A person id (colleague or the current user) or an Agent id. */
  authorId: string;
  text: string;
  /** ISO date. */
  createdAt: string;
  /** Only for Agent answers. */
  sources?: string[];
  /** A short note from the system, for example an Agent that is not in the group. */
  system?: boolean;
};

export type CalendarEvent = {
  id: string;
  title: string;
  /** ISO date and time of the start. */
  start: string;
  durationMinutes: number;
  place: string;
  /** The meeting was recorded or has notes, so the assistant can write minutes and tasks. */
  hasMinutes?: boolean;
  /** Added from «✦ پیشنهاد زمان جلسه». */
  suggested?: boolean;
};

export type MeetingMinutes = { eventId: string; decisions: string[]; tasks: SuggestedTask[] };

export type Member = {
  id: string;
  name: string;
  role: string;
  unit: string;
  /** Free text, for example «امروز ۰۹:۱۲». */
  lastActive: string;
};

export type ChannelPost = {
  id: string;
  channelId: string;
  author: string;
  text: string;
  /** ISO date. */
  createdAt: string;
  /** Posted by a workflow or an Agent, with the workflow to open. */
  automatic?: { workflowId: string; label: string };
};

export type Channel = { id: string; name: string; description: string; memberCount: number; /** Who may post, for example «جریان شاخص‌ها». */ publisher?: string; automatic?: boolean };

export type NewsCategory = "quality" | "production" | "events" | "culture";

export type NewsItem = {
  id: string;
  title: string;
  category: NewsCategory;
  /** ISO date. */
  publishedAt: string;
  body: string;
  summary: string[];
  english: { title: string; body: string };
  draft?: boolean;
};

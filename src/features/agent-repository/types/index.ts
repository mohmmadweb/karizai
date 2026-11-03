import type { AgentToolRef } from "@/features/agents/types";

/** An Agent a colleague made public. Adding it gives the user a personal copy. */
export type RepositoryAgent = {
  id: string;
  name: string;
  purpose: string;
  instructions: string;
  defaultModelId: string;
  tools: AgentToolRef[];
  /** The area it belongs to, for the filter. */
  category: string;
  /** The unit or person that published it. */
  author: string;
  /** How many people use it. */
  usage: number;
  /** ISO date. */
  publishedAt: string;
  /** Average of users' stars, 1..5. */
  rating: number;
  /** A ready-made package of Kariz, not a colleague's Agent. */
  official: boolean;
};

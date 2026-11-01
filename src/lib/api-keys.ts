/**
 * API keys (کلیدهای API). The admin decides which groups may create keys and for
 * what; users create keys for the models, agents or knowledge they can already
 * use. The same file lives in both apps; keep the copies identical.
 * The key itself is never part of a record: only a hash is stored on the server.
 */
export type ApiKeyKind = "model" | "agent" | "knowledge";

export const apiKeyKinds: ApiKeyKind[] = ["model", "agent", "knowledge"];

export const apiKeyKindLabels: Record<ApiKeyKind, string> = {
  model: "مدل",
  agent: "عامل",
  knowledge: "پایگاه دانش",
};

/** What a group may do with API keys. A group without kinds cannot create keys. */
export type ApiKeyPolicy = {
  groupId: string;
  kinds: ApiKeyKind[];
  /** Monthly token ceiling for each key of the group; null means no ceiling. */
  monthlyTokenLimit: number | null;
};

export type ApiKeyRecord = {
  id: string;
  name: string;
  ownerId: string;
  ownerName: string;
  kind: ApiKeyKind;
  /** Model id, agent id, or "knowledge" for the organization's knowledge base. */
  resourceId: string;
  resourceName: string;
  /** Last four characters of the key, for recognizing it in a list. */
  last4: string;
  /** ISO dates. */
  createdAt: string;
  expiresAt: string | null;
  lastUsedAt: string | null;
  revokedAt: string | null;
};

export type ApiKeyStatus = "active" | "expired" | "revoked";

export const apiKeyStatusLabels: Record<ApiKeyStatus, string> = {
  active: "فعال",
  expired: "منقضی",
  revoked: "ابطال‌شده",
};

export function apiKeyStatus(key: ApiKeyRecord, now: number = Date.now()): ApiKeyStatus {
  if (key.revokedAt) return "revoked";
  if (key.expiresAt && new Date(key.expiresAt).getTime() <= now) return "expired";
  return "active";
}

/** What the groups of one user allow together: the union of kinds and the loosest ceiling. */
export function combinePolicies(policies: ApiKeyPolicy[], groupIds: string[]): { kinds: ApiKeyKind[]; monthlyTokenLimit: number | null } {
  const mine = policies.filter((policy) => groupIds.includes(policy.groupId) && policy.kinds.length > 0);
  const kinds = apiKeyKinds.filter((kind) => mine.some((policy) => policy.kinds.includes(kind)));
  const monthlyTokenLimit = mine.some((policy) => policy.monthlyTokenLimit === null) ? null : Math.max(0, ...mine.map((policy) => policy.monthlyTokenLimit ?? 0));
  return { kinds, monthlyTokenLimit: kinds.length === 0 ? null : monthlyTokenLimit };
}

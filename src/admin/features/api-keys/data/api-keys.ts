import type { ApiKeyPolicy, ApiKeyRecord } from "@/lib/api-keys";

/** Sample policies and keys for the static demo. */
export function getSamplePolicies(): ApiKeyPolicy[] {
  return [
    { groupId: "group-003", kinds: ["model", "agent", "knowledge"], monthlyTokenLimit: 5_000_000 },
    { groupId: "group-001", kinds: ["agent"], monthlyTokenLimit: 1_000_000 },
  ];
}

export function getSampleKeys(): ApiKeyRecord[] {
  return [
    { id: "key-1", name: "اتصال MES به مدل داخلی", ownerId: "user-003", ownerName: "علی کریمی", kind: "model", resourceId: "model-004", resourceName: "Qwen ۲٫۵", last4: "a91f", createdAt: "2026-10-02T08:00:00.000Z", expiresAt: "2027-04-02T08:00:00.000Z", lastUsedAt: "2026-11-02T16:20:00.000Z", revokedAt: null },
    { id: "key-2", name: "پرتال فروش", ownerId: "user-002", ownerName: "سارا احمدی", kind: "agent", resourceId: "agent-sales", resourceName: "دستیار فروش", last4: "07cd", createdAt: "2026-09-15T08:00:00.000Z", expiresAt: null, lastUsedAt: "2026-11-01T10:05:00.000Z", revokedAt: null },
    { id: "key-3", name: "آزمایشی قدیمی", ownerId: "user-003", ownerName: "علی کریمی", kind: "knowledge", resourceId: "knowledge", resourceName: "پایگاه دانش سازمان", last4: "5b2e", createdAt: "2026-06-01T08:00:00.000Z", expiresAt: "2026-09-01T08:00:00.000Z", lastUsedAt: "2026-08-20T09:00:00.000Z", revokedAt: null },
  ];
}

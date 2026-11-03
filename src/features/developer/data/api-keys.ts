import type { ApiKeyKind, ApiKeyRecord } from "@/lib/api-keys";

/** Keys the current user made earlier. Only the last four characters are known; the key itself was shown once. */
const keys: ApiKeyRecord[] = [
  { id: "key-u1", name: "اسکریپت گزارش روزانه‌ی کیفیت", ownerId: "user-1", ownerName: "مریم احمدی", kind: "agent", resourceId: "agent-quality", resourceName: "دستیار کیفیت و فرمولاسیون", last4: "q7Xa", createdAt: "2026-09-14T08:00:00.000Z", expiresAt: "2027-03-14T08:00:00.000Z", lastUsedAt: "2026-11-02T06:10:00.000Z", revokedAt: null },
  { id: "key-u2", name: "داشبورد Power BI آزمایشگاه", ownerId: "user-1", ownerName: "مریم احمدی", kind: "knowledge", resourceId: "knowledge", resourceName: "دانش سازمانی", last4: "M2pk", createdAt: "2026-08-02T10:30:00.000Z", expiresAt: null, lastUsedAt: "2026-10-30T12:00:00.000Z", revokedAt: null },
  { id: "key-u3", name: "آزمایش مدل داخلی", ownerId: "user-1", ownerName: "مریم احمدی", kind: "model", resourceId: "model-8", resourceName: "Qwen", last4: "z91L", createdAt: "2026-06-20T09:00:00.000Z", expiresAt: "2026-09-20T09:00:00.000Z", lastUsedAt: "2026-09-19T15:40:00.000Z", revokedAt: null },
];

export function getMyApiKeys(): ApiKeyRecord[] {
  return keys;
}

/** What the user's groups allow (set by the admin in «کلیدهای API»). */
export const myKeyPolicy: { kinds: ApiKeyKind[]; monthlyTokenLimit: number | null } = { kinds: ["model", "agent", "knowledge"], monthlyTokenLimit: 2_000_000 };

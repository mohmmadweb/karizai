/** The budget month of the sample data: day 22 of 30 of آبان ۱۴۰۵. */
export const budgetMonth = { label: "آبان ۱۴۰۵", daysPassed: 22, daysInMonth: 30 };

export type UserLimit = {
  id: string;
  name: string;
  groupId: string;
  /** Toman per month. */
  monthlyToman: number;
  /** Tokens used so far this month. */
  internalTokens: number;
  externalTokens: number;
};

const users: UserLimit[] = [
  { id: "user-002", name: "سارا احمدی", groupId: "group-001", monthlyToman: 1_500_000, internalTokens: 2_100_000, externalTokens: 1_120_000 },
  { id: "user-003", name: "علی کریمی", groupId: "group-001", monthlyToman: 1_200_000, internalTokens: 900_000, externalTokens: 1_310_000 },
  { id: "user-004", name: "نرگس موسوی", groupId: "group-002", monthlyToman: 1_000_000, internalTokens: 3_400_000, externalTokens: 420_000 },
  { id: "user-006", name: "زهرا نوری", groupId: "group-003", monthlyToman: 2_500_000, internalTokens: 6_800_000, externalTokens: 960_000 },
  { id: "user-007", name: "امیر صادقی", groupId: "group-003", monthlyToman: 2_000_000, internalTokens: 4_200_000, externalTokens: 1_520_000 },
  { id: "user-008", name: "فاطمه حیدری", groupId: "group-005", monthlyToman: 600_000, internalTokens: 1_100_000, externalTokens: 180_000 },
];

export type ExhaustAction = "lock" | "internal-light" | "notify";

export const exhaustedLabels: Record<ExhaustAction, string> = {
  lock: "قفل",
  "internal-light": "تغییر به مدل سبک داخلی",
  notify: "هشدار به مدیر واحد",
};

/** What happens to a group's people when their monthly limit runs out; a missing group locks. */
export const exhaustedByGroup: Record<string, ExhaustAction> = {
  "group-001": "internal-light",
  "group-002": "notify",
  "group-003": "internal-light",
  "group-005": "lock",
};

export function getUserLimits(): UserLimit[] {
  return users;
}

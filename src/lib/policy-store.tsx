"use client";

import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

/**
 * Policies the admin sets in «مرکز قواعد و سیاست‌ها» that the user panel obeys
 * in the same visit: masked fields in the chat box, confidential files that only
 * internal models may read, and weekly toman budgets per group. Temporary: a
 * refresh returns to the sample policies.
 */

export type MaskAction = "replace" | "internal-only";

export type MaskField = {
  id: string;
  /** Shown to the admin, for example «کد ملی». */
  label: string;
  /** Regular expression source that finds the value in a message. */
  pattern: string;
  /** Example value, shown in the admin table and the test box. */
  sample: string;
  /** replace: swapped for a token before an external model. internal-only: the message may only go to internal models. */
  action: MaskAction;
  enabled: boolean;
};

export type GroupBudget = {
  groupId: string;
  groupName: string;
  /** Toman per week for the models the group may use. */
  weeklyToman: number;
  /** Spent this week, toman. */
  spentToman: number;
  /** What happens when the budget runs out. */
  onExhausted: "lock" | "internal-light" | "notify";
};

export type Permission = "read" | "read-write";

export type PermissionGrant = {
  id: string;
  groupId: string;
  groupName: string;
  /** What the grant is about, for example «راهکاران: سفارش خرید». */
  resource: string;
  resourceKind: "connection" | "data" | "knowledge" | "agent";
  permission: Permission;
};

/** Toman per 1,000 tokens; every token cost in the panels is shown in toman with these rates. */
export const tomanPer1kTokens = { internal: 40, external: 900 } as const;

const sampleFields: MaskField[] = [
  { id: "mask-1", label: "کد ملی", pattern: "(?<![0-9۰-۹])[0-9۰-۹]{10}(?![0-9۰-۹])", sample: "۰۰۱۲۳۴۵۶۷۸", action: "replace", enabled: true },
  { id: "mask-2", label: "شماره شبا", pattern: "IR[0-9۰-۹]{24}", sample: "IR820540102680020817909002", action: "replace", enabled: true },
  { id: "mask-3", label: "شماره همراه", pattern: "(?<![0-9۰-۹])(?:09|۰۹)[0-9۰-۹]{9}(?![0-9۰-۹])", sample: "09121234567", action: "replace", enabled: true },
  { id: "mask-4", label: "بودجه‌ی شرکت", pattern: "بودجه(?:‌ی)?\\s*(?:سال|شرکت|سالانه)", sample: "بودجه‌ی سالانه‌ی ۱۴۰۵", action: "internal-only", enabled: true },
  { id: "mask-5", label: "فرمول کامپاند", pattern: "فرمول(?:‌ی)?\\s*(?:کامپاند|PP|PE|مستربچ)", sample: "فرمول کامپاند PP-H30", action: "internal-only", enabled: true },
  { id: "mask-6", label: "قیمت فروش", pattern: "قیمت\\s*فروش", sample: "قیمت فروش آریاپلاست", action: "internal-only", enabled: true },
];

const sampleBudgets: GroupBudget[] = [
  { groupId: "group-001", groupName: "فروش", weeklyToman: 4_000_000, spentToman: 2_650_000, onExhausted: "internal-light" },
  { groupId: "group-002", groupName: "مالی", weeklyToman: 2_000_000, spentToman: 1_840_000, onExhausted: "notify" },
  { groupId: "group-003", groupName: "فنی", weeklyToman: 6_000_000, spentToman: 2_100_000, onExhausted: "internal-light" },
  { groupId: "group-005", groupName: "منابع انسانی", weeklyToman: 1_000_000, spentToman: 310_000, onExhausted: "lock" },
];

const sampleGrants: PermissionGrant[] = [
  { id: "perm-1", groupId: "group-001", groupName: "فروش", resource: "دیدار CRM: مشتریان و سرنخ‌ها", resourceKind: "connection", permission: "read-write" },
  { id: "perm-2", groupId: "group-001", groupName: "فروش", resource: "راهکاران: موجودی انبار", resourceKind: "connection", permission: "read" },
  { id: "perm-3", groupId: "group-002", groupName: "مالی", resource: "سپیدار: حسابداری", resourceKind: "connection", permission: "read-write" },
  { id: "perm-4", groupId: "group-003", groupName: "فنی", resource: "انبار داده تولید: اسکیمای production", resourceKind: "data", permission: "read" },
  { id: "perm-5", groupId: "group-003", groupName: "فنی", resource: "پوشه‌ی کیفیت و QC-SOP", resourceKind: "knowledge", permission: "read-write" },
  { id: "perm-6", groupId: "group-005", groupName: "منابع انسانی", resource: "دستیار منابع انسانی", resourceKind: "agent", permission: "read" },
];

type PolicyStore = {
  maskFields: MaskField[];
  setMaskFields: (update: (list: MaskField[]) => MaskField[]) => void;
  /** Ids of admin documents tagged «محرمانه»: external models never read them. */
  confidentialDocIds: string[];
  setConfidential: (docId: string, confidential: boolean) => void;
  budgets: GroupBudget[];
  setBudgets: (update: (list: GroupBudget[]) => GroupBudget[]) => void;
  grants: PermissionGrant[];
  setGrants: (update: (list: PermissionGrant[]) => PermissionGrant[]) => void;
};

const PolicyContext = createContext<PolicyStore | null>(null);

export function PolicyProvider({ children }: { children: ReactNode }) {
  const [maskFields, setMaskFields] = useState(sampleFields);
  const [confidentialDocIds, setConfidentialDocIds] = useState<string[]>(["doc-001", "doc-003"]);
  const [budgets, setBudgets] = useState(sampleBudgets);
  const [grants, setGrants] = useState(sampleGrants);
  const value = useMemo<PolicyStore>(
    () => ({
      maskFields,
      setMaskFields,
      confidentialDocIds,
      setConfidential: (docId, confidential) =>
        setConfidentialDocIds((list) => (confidential ? [...new Set([...list, docId])] : list.filter((id) => id !== docId))),
      budgets,
      setBudgets,
      grants,
      setGrants,
    }),
    [maskFields, confidentialDocIds, budgets, grants],
  );
  return <PolicyContext.Provider value={value}>{children}</PolicyContext.Provider>;
}

export function usePolicies(): PolicyStore {
  const value = useContext(PolicyContext);
  if (!value) throw new Error("usePolicies must be used inside PolicyProvider");
  return value;
}

/**
 * Applies the enabled mask fields to a message. Returns the text with values
 * replaced by tokens like «[کد ملی ۱]», the matches found, and whether a field
 * that forbids external models was found.
 */
export function applyMasks(text: string, fields: MaskField[]) {
  let masked = text;
  const found: { label: string; value: string; action: MaskAction }[] = [];
  for (const field of fields) {
    if (!field.enabled) continue;
    let index = 0;
    masked = masked.replace(new RegExp(field.pattern, "g"), (value) => {
      found.push({ label: field.label, value, action: field.action });
      return field.action === "replace" ? `[${field.label} ${(++index).toLocaleString("fa-IR")}]` : value;
    });
  }
  return { masked, found, internalOnly: found.some((item) => item.action === "internal-only") };
}

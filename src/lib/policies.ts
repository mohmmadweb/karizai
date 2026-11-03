/**
 * Policies (سیاست‌ها): confidentiality, weekly budget per group, masking of
 * sensitive fields, and read or write access to connection tools. The admin
 * panel saves them in `policies.json`; the user panel reads them in the chat.
 * The same file lives in both apps; keep the copies identical.
 */
export type MaskField = "nationalId" | "mobile" | "card" | "iban" | "email";

export const maskFieldLabels: Record<MaskField, string> = {
  nationalId: "کد ملی",
  mobile: "شماره‌ی موبایل",
  card: "شماره‌ی کارت بانکی",
  iban: "شماره‌ی شبا",
  email: "ایمیل",
};

export const maskFields = Object.keys(maskFieldLabels) as MaskField[];

/** A phrase to hide, such as «بودجه‌ی شرکت»; with `withNumber` the number written after it is hidden too. */
export type CustomPhrase = { id: string; phrase: string; withNumber: boolean };

export type ToolMode = "read" | "readwrite";

export const toolModeLabels: Record<ToolMode, string> = {
  read: "فقط خواندن",
  readwrite: "خواندن و نوشتن",
};

export type Policies = {
  /** Ids of confidential documents; null until the admin first changes one, so documents keep their own flags. */
  confidentialDocumentIds: string[] | null;
  /** Weekly ceiling in tomans by group id; null or missing means no ceiling. */
  weeklyLimits: Record<string, number | null>;
  masking: { fields: Record<MaskField, boolean>; phrases: CustomPhrase[] };
  /** Mode by group id, then connection id; missing means read and write. */
  toolAccess: Record<string, Record<string, ToolMode>>;
};

export function defaultPolicies(): Policies {
  return {
    confidentialDocumentIds: null,
    weeklyLimits: {},
    masking: { fields: { nationalId: true, mobile: true, card: true, iban: true, email: true }, phrases: [] },
    toolAccess: {},
  };
}

/** The loosest mode among the user's groups wins; no entry at all means read and write. */
export function toolModeFor(policies: Policies, groupIds: string[], connectionId: string): ToolMode {
  const modes = groupIds.map((id) => policies.toolAccess[id]?.[connectionId]);
  if (modes.length === 0 || modes.some((mode) => mode === undefined || mode === "readwrite")) return "readwrite";
  return "read";
}

export function isConfidential(policies: Policies, documentId: string): boolean {
  return policies.confidentialDocumentIds?.includes(documentId) ?? false;
}

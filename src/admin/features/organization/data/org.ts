export type OrgUnit = { id: string; name: string; manager: string; members: number; adGroup: string; groupId: string | null; children?: OrgUnit[] };

export function getOrgTree(): OrgUnit {
  return {
    id: "ceo", name: "مدیرعامل", manager: "محمد کاظمی", members: 4, adGroup: "PP-Management", groupId: null,
    children: [
      { id: "vp-ops", name: "معاونت تولید و فنی", manager: "رضا محمدی", members: 3, adGroup: "PP-Operations", groupId: "group-003", children: [
        { id: "u-prod", name: "تولید", manager: "حمید شریفی", members: 68, adGroup: "PP-Production", groupId: "group-003" },
        { id: "u-qc", name: "کیفیت", manager: "مریم احمدی", members: 22, adGroup: "PP-Quality", groupId: "group-003" },
        { id: "u-maint", name: "نگهداری و تعمیرات", manager: "رضا محمدی", members: 31, adGroup: "PP-Maintenance", groupId: "group-003" },
      ] },
      { id: "vp-com", name: "معاونت بازرگانی", manager: "نرگس حسینی", members: 2, adGroup: "PP-Commercial", groupId: "group-001", children: [
        { id: "u-proc", name: "تدارکات", manager: "سارا کریمی", members: 14, adGroup: "PP-Procurement", groupId: null },
        { id: "u-sales", name: "فروش", manager: "نرگس حسینی", members: 19, adGroup: "PP-Sales", groupId: "group-001" },
      ] },
      { id: "vp-fin", name: "معاونت مالی و پشتیبانی", manager: "علی رضایی", members: 2, adGroup: "PP-Support", groupId: "group-002", children: [
        { id: "u-fin", name: "مالی", manager: "زهرا موسوی", members: 16, adGroup: "PP-Finance", groupId: "group-002" },
        { id: "u-it", name: "فناوری اطلاعات", manager: "مهدی صادقی", members: 11, adGroup: "PP-IT", groupId: "group-003" },
      ] },
    ],
  };
}

export type AdminRole = "super" | "unit" | "auditor";

export const roleLabels: Record<AdminRole, string> = { super: "ادمین کل", unit: "ادمین واحد", auditor: "ممیز" };

export const roleScopes: Record<AdminRole, string> = {
  super: "همه‌ی واحدها و همه‌ی بخش‌های پنل",
  unit: "فقط واحد خود و زیرواحدهایش",
  auditor: "همه‌ی واحدها، فقط خواندن",
};

/** What each role may do; «واحد» means only inside the assigned unit. */
export const permissionMatrix: { capability: string; super: string; unit: string; auditor: string }[] = [
  { capability: "مدل‌ها، مسیریاب و محدودیت نرخ", super: "کامل", unit: "—", auditor: "خواندن" },
  { capability: "کاربران و گروه‌ها", super: "کامل", unit: "واحد", auditor: "خواندن" },
  { capability: "سهمیه‌ی کاربران", super: "کامل", unit: "واحد", auditor: "خواندن" },
  { capability: "صف تأیید عامل‌ها و جریان‌ها", super: "کامل", unit: "واحد", auditor: "—" },
  { capability: "ممیزی و گزارش مصرف", super: "کامل", unit: "واحد", auditor: "خواندن" },
  { capability: "اتصال‌ها، وب‌هوک‌ها و AD", super: "کامل", unit: "—", auditor: "خواندن" },
];

export type RoleAssignment = { id: string; person: string; role: AdminRole; unitId: string | null };

export function getAssignments(): RoleAssignment[] {
  return [
    { id: "ra-1", person: "مریم احمدی", role: "super", unitId: null },
    { id: "ra-2", person: "مهدی صادقی", role: "super", unitId: null },
    { id: "ra-3", person: "مریم احمدی", role: "unit", unitId: "u-qc" },
    { id: "ra-4", person: "نرگس حسینی", role: "unit", unitId: "u-sales" },
    { id: "ra-5", person: "حمید شریفی", role: "unit", unitId: "u-prod" },
    { id: "ra-6", person: "دفتر حسابرسی داخلی", role: "auditor", unitId: null },
  ];
}

export function flatten(unit: OrgUnit): OrgUnit[] {
  return [unit, ...(unit.children ?? []).flatMap(flatten)];
}

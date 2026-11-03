import type { Group } from "../types";

const groups: Group[] = [
  { id: "group-001", code: "sales", name: "فروش", description: "تیم فروش و ارتباط با مشتریان.", status: "active", createdAt: "2026-01-10T08:00:00.000Z" },
  { id: "group-002", code: "finance", name: "مالی", description: "کارکنان واحد مالی و حسابداری.", status: "active", createdAt: "2026-01-12T08:00:00.000Z" },
  { id: "group-003", code: "tech", name: "فنی", description: "توسعه و پشتیبانی فنی.", status: "active", createdAt: "2026-02-01T08:00:00.000Z" },
  { id: "group-004", code: "legacy-project", name: "پروژه‌ی قدیمی", description: "گروهی که دیگر استفاده نمی‌شود.", status: "inactive", createdAt: "2026-02-20T08:00:00.000Z" },
  { id: "group-005", code: "hr", name: "منابع انسانی", description: "", status: "active", createdAt: "2026-03-05T08:00:00.000Z" },
];

export function getGroups(): Group[] {
  return groups;
}

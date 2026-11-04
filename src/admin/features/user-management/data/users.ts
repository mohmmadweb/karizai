import type { User } from "../types";

const users: User[] = [
  { id: "user-001", name: "مریم احمدی", email: "admin@parsapolymer.ir", status: "active", role: "admin", createdAt: "2026-01-05T08:00:00.000Z" },
  { id: "user-002", name: "سارا کریمی", email: "sara.karimi@example.com", status: "active", role: "user", createdAt: "2026-02-11T09:30:00.000Z" },
  { id: "user-003", name: "علی رضایی", email: "ali.rezaei@example.com", status: "active", role: "user", createdAt: "2026-02-14T10:15:00.000Z" },
  { id: "user-004", name: "نرگس حسینی", email: "narges.hosseini@example.com", status: "active", role: "user", createdAt: "2026-03-02T07:45:00.000Z" },
  { id: "user-005", name: "رضا محمدی", email: "reza.mohammadi@example.com", status: "inactive", role: "user", createdAt: "2026-03-20T12:00:00.000Z" },
  { id: "user-006", name: "محمد کاظمی", email: "mohammad.kazemi@example.com", status: "active", role: "user", createdAt: "2026-04-08T11:20:00.000Z" },
  { id: "user-007", name: "مهدی صادقی", email: "mehdi.sadeghi@example.com", status: "active", role: "user", createdAt: "2026-05-17T14:10:00.000Z" },
  { id: "user-008", name: "زهرا موسوی", email: "zahra.mousavi@example.com", status: "active", role: "user", createdAt: "2026-06-23T13:05:00.000Z" },
];

export function getUsers(): User[] {
  return users;
}

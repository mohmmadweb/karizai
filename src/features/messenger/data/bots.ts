import type { Bot } from "../types";
import { alertsThreadId, flowsThreadId } from "../types";

const bots: Bot[] = [
  { id: alertsThreadId, name: "ربات هشدار", description: "هشدارهای مهم جریان‌ها و شاخص‌ها را همین‌جا می‌فرستد" },
  { id: flowsThreadId, name: "ربات جریان‌ها", description: "گزارش اجرای جریان‌های شما: موفق یا ناموفق" },
];

export function getBots(): Bot[] {
  return bots;
}

export function getBotById(id: string): Bot | undefined {
  return bots.find((bot) => bot.id === id);
}

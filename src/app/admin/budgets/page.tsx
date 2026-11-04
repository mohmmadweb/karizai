import type { Metadata } from "next";
import { BudgetsPageContent } from "@/admin/features/budgets/components/budgets-page-content";

export const metadata: Metadata = { title: "سهمیه‌ی کاربران | کاریز" };

export default function BudgetsPage() {
  return <BudgetsPageContent />;
}

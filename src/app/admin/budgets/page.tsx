import type { Metadata } from "next";
import { BudgetsPageContent } from "@/admin/features/budgets/components/budgets-page-content";

export const metadata: Metadata = { title: "بودجه و سهمیه | کاریز" };

export default function BudgetsPage() {
  return <BudgetsPageContent />;
}

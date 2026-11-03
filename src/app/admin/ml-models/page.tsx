import type { Metadata } from "next";
import { MlModelsPageContent } from "@/admin/features/ml-models/components/ml-models-page-content";

export const metadata: Metadata = { title: "مدل‌های یادگیری ماشین | کاریز" };

export default function MlModelsPage() {
  return <MlModelsPageContent />;
}

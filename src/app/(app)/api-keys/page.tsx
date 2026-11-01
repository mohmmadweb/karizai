import type { Metadata } from "next";
import { ApiKeysPageContent } from "@/features/api-keys/components/api-keys-page-content";

export const metadata: Metadata = { title: "API من | موشکاف" };

export default function ApiKeysPage() {
  return <ApiKeysPageContent />;
}

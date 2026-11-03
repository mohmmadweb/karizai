import type { Metadata } from "next";
import { SettingsPageContent } from "@/features/settings/components/settings-page-content";
import { getAccount } from "@/features/user-session/data/session";

export const metadata: Metadata = { title: "تنظیمات | کاریز" };

export default function SettingsPage() {
  return <SettingsPageContent account={getAccount()} />;
}

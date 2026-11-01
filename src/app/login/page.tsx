import type { Metadata } from "next";
import { LoginPageContent } from "@/features/auth/components/login-page-content";

export const metadata: Metadata = { title: "ورود | موشکاف" };

export default function LoginPage() {
  return <LoginPageContent />;
}

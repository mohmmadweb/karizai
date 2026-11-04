import type { Metadata } from "next";
import { AgentForm } from "@/features/agents/components/agent-form";

export const metadata: Metadata = { title: "ساخت عامل | کاریز" };

export default function NewAgentPage() {
  return <AgentForm />;
}

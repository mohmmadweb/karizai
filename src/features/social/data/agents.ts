import type { AgentMember } from "../types";

/** The plant Agents that are members of the organization; names match `features/agents/data`. */
const agentMembers: AgentMember[] = [
  { id: "agent-quality", name: "دستیار کیفیت و فرمولاسیون", handle: "@دستیار کیفیت", unit: "کیفیت" },
  { id: "agent-maint", name: "دستیار نگهداری و تعمیرات", handle: "@دستیار نگهداری", unit: "نگهداری" },
  { id: "agent-indicators", name: "تحلیل‌گر شاخص‌های تولید", handle: "@تحلیل‌گر شاخص‌ها", unit: "تولید" },
  { id: "agent-pricing", name: "دستیار فروش و قیمت‌گذاری", handle: "@دستیار فروش", unit: "فروش" },
  { id: "agent-doc", name: "دستیار سند", handle: "@دستیار سند", unit: "همه‌ی واحدها" },
];

export function getAgentMembers(): AgentMember[] {
  return agentMembers;
}

export function getAgentMember(id: string): AgentMember | undefined {
  return agentMembers.find((item) => item.id === id);
}

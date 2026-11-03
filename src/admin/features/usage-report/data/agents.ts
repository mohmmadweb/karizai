/** Agents whose runs appear in the usage records; ids match the user panel's Agents. */
const agents = [
  { id: "agent-quality", name: "دستیار کیفیت و فرمولاسیون", weight: 5 },
  { id: "agent-maint", name: "دستیار نگهداری و تعمیرات", weight: 3 },
  { id: "agent-pricing", name: "دستیار فروش و قیمت‌گذاری", weight: 3 },
  { id: "agent-indicators", name: "تحلیل‌گر شاخص‌های تولید", weight: 2 },
  { id: "agent-doc", name: "دستیار سند", weight: 2 },
  { id: "none", name: "گفتگوی مستقیم (بدون عامل)", weight: 4 },
];

const total = agents.reduce((sum, a) => sum + a.weight, 0);

/**
 * The agent that made a sample record, derived from its id so it is always
 * the same. Real records carry the agent id themselves.
 */
export function agentOfRecord(recordId: string): { id: string; name: string } {
  const n = [...recordId].reduce((sum, char) => (sum * 31 + char.charCodeAt(0)) % 10007, 17);
  let point = n % total;
  for (const agent of agents) {
    point -= agent.weight;
    if (point < 0) return agent;
  }
  return agents[agents.length - 1];
}

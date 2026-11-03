import type { AgentRun, ComparisonTask, ComponentSeed, Thresholds } from "../types";

/** Components that are not managed in another section: tools, web search and internal parts. */
export function getSeededComponents(): ComponentSeed[] {
  return [
    { id: "tool-mcp", name: "ابزارهای MCP", group: "tools", status: "healthy", medianMs: 420, p95Ms: 1100 },
    { id: "tool-api", name: "ابزارهای API", group: "tools", status: "slow", medianMs: 1900, p95Ms: 4300 },
    { id: "tool-n8n", name: "n8n (جریان کاری هوشمند)", group: "tools", status: "healthy", medianMs: 650, p95Ms: 1600 },
    { id: "tool-dify", name: "Dify", group: "tools", status: "healthy", medianMs: 780, p95Ms: 1900 },
    { id: "web-search", name: "وب‌سرچ", group: "webSearch", status: "healthy", medianMs: 900, p95Ms: 2200 },
    { id: "int-router", name: "مسیریاب هوشمند", group: "internal", status: "healthy", medianMs: 35, p95Ms: 90 },
    { id: "int-input", name: "مدیریت ورودی", group: "internal", status: "healthy", medianMs: 22, p95Ms: 60 },
    { id: "int-parser", name: "تجزیه‌گر اسناد و OCR", group: "internal", status: "healthy", medianMs: 310, p95Ms: 720 },
    { id: "int-db", name: "پایگاه داده‌ی سامانه", group: "internal", status: "healthy", medianMs: 12, p95Ms: 38 },
  ];
}

export function getAgentRuns(): AgentRun[] {
  return [
    {
      id: "agent-sales-contracts",
      name: "تحلیل فروش و قرارداد",
      description: "جریان کاری چندمرحله‌ای که فروش را با قراردادها می‌سنجد.",
      steps: [
        { id: "s1", name: "فهم پرسش", kind: "model", ms: 2400 },
        { id: "s2", name: "پرس‌وجو از انبار داده", kind: "warehouse", ms: 6800 },
        { id: "s3", name: "بازیابی از اسناد قرارداد", kind: "documents", ms: 3100 },
        { id: "s4", name: "نگارش گزارش", kind: "model", ms: 4900 },
      ],
    },
    {
      id: "agent-doc-summary",
      name: "خلاصه‌ساز اسناد",
      description: "اسناد سازمان را بازیابی و خلاصه می‌کند.",
      steps: [
        { id: "s1", name: "بازیابی از اسناد", kind: "documents", ms: 1800 },
        { id: "s2", name: "خلاصه‌سازی", kind: "model", ms: 3600 },
      ],
    },
    {
      id: "agent-hr",
      name: "دستیار منابع انسانی",
      description: "به پرسش‌های کارکنان درباره‌ی مقررات پاسخ می‌دهد.",
      steps: [
        { id: "s1", name: "فهم پرسش", kind: "model", ms: 1200 },
        { id: "s2", name: "فراخوانی API کارکنان", kind: "api", ms: 2300 },
        { id: "s3", name: "ابزار تقویم مرخصی", kind: "tool", ms: 800 },
        { id: "s4", name: "نگارش پاسخ", kind: "model", ms: 1700 },
      ],
    },
  ];
}

/** Cost is in tomans, time in seconds. Both modes were run under the same test conditions. */
export function getComparisonTasks(): ComparisonTask[] {
  return [
    {
      id: "cmp-tech-summary",
      name: "خلاصه‌سازی سند فنی",
      direct: { cost: 4200, tokens: 18500, accuracy: 88, seconds: 14 },
      multi: { cost: 5100, tokens: 24600, accuracy: 93, seconds: 21 },
    },
    {
      id: "cmp-sales-contracts",
      name: "مقایسه‌ی فروش با قراردادها",
      direct: { cost: 6100, tokens: 26000, accuracy: 71, seconds: 19 },
      multi: { cost: 5400, tokens: 21800, accuracy: 90, seconds: 26 },
    },
    {
      id: "cmp-hr-question",
      name: "پاسخ به پرسش منابع انسانی",
      direct: { cost: 1800, tokens: 7200, accuracy: 92, seconds: 6 },
      multi: { cost: 1800, tokens: 7200, accuracy: 92, seconds: 9 },
    },
    {
      id: "cmp-monthly-finance",
      name: "گزارش مالی ماهانه",
      direct: { cost: 9800, tokens: 41000, accuracy: 64, seconds: 33 },
      multi: { cost: 8700, tokens: 36500, accuracy: 87, seconds: 41 },
    },
  ];
}

export function getDefaultThresholds(): Thresholds {
  return { ttftP95Sec: 5, e2eP95Sec: 30, errorRatePercent: 5 };
}

/** Fixed figures: the real error rate and uptime come from monitoring later. */
export function getPeriodFigures(period: "today" | "week" | "month") {
  return {
    today: { errorRate: 0.018, baseUptime: 99.98, speedFactor: 0.97 },
    week: { errorRate: 0.021, baseUptime: 99.94, speedFactor: 1 },
    month: { errorRate: 0.024, baseUptime: 99.91, speedFactor: 1.03 },
  }[period];
}

export const UPTIME_TARGET = 99.5;

import type { UsagePeriod, UsageReport } from "../types";

const reports: Record<UsagePeriod, UsageReport> = {
  daily: {
    series: [
      { label: "شنبه", requests: 12, tokens: 9200 }, { label: "یکشنبه", requests: 18, tokens: 14100 },
      { label: "دوشنبه", requests: 9, tokens: 6800 }, { label: "سه‌شنبه", requests: 25, tokens: 21300 },
      { label: "چهارشنبه", requests: 14, tokens: 11000 }, { label: "پنجشنبه", requests: 4, tokens: 2900 },
      { label: "جمعه", requests: 0, tokens: 0 },
    ],
    byModel: [{ name: "Qwen (داخلی)", requests: 48, tokens: 34600, internal: true }, { name: "Claude Sonnet", requests: 22, tokens: 17800 }, { name: "Llama (داخلی)", requests: 12, tokens: 7900, internal: true }],
    byAgent: [{ name: "دستیار کیفیت و فرمولاسیون", requests: 30, tokens: 24000, externalShare: 0.1 }, { name: "دستیار سند", requests: 18, tokens: 12500, externalShare: 0.3 }, { name: "بدون عامل", requests: 34, tokens: 23800, externalShare: 0.4 }],
  },
  weekly: {
    series: [
      { label: "هفته‌ی ۱", requests: 70, tokens: 52000 }, { label: "هفته‌ی ۲", requests: 95, tokens: 71000 },
      { label: "هفته‌ی ۳", requests: 60, tokens: 44000 }, { label: "هفته‌ی ۴", requests: 82, tokens: 61300 },
    ],
    byModel: [{ name: "Qwen (داخلی)", requests: 180, tokens: 141000, internal: true }, { name: "Claude Sonnet", requests: 70, tokens: 55300 }, { name: "DeepSeek", requests: 40, tokens: 39000 }, { name: "Llama (داخلی)", requests: 17, tokens: 12000, internal: true }],
    byAgent: [{ name: "دستیار کیفیت و فرمولاسیون", requests: 120, tokens: 92000, externalShare: 0.1 }, { name: "دستیار سند", requests: 70, tokens: 52300, externalShare: 0.3 }, { name: "دستیار نگهداری و تعمیرات", requests: 37, tokens: 28000, externalShare: 0 }, { name: "بدون عامل", requests: 80, tokens: 75000, externalShare: 0.4 }],
  },
  monthly: {
    series: [
      { label: "تیر", requests: 210, tokens: 160000 }, { label: "مرداد", requests: 260, tokens: 198000 },
      { label: "شهریور", requests: 240, tokens: 183000 }, { label: "مهر", requests: 307, tokens: 228300 },
    ],
    byModel: [{ name: "Qwen (داخلی)", requests: 630, tokens: 476000, internal: true }, { name: "DeepSeek", requests: 240, tokens: 184000 }, { name: "Claude Sonnet", requests: 60, tokens: 51300 }, { name: "Llama (داخلی)", requests: 87, tokens: 58000, internal: true }],
    byAgent: [{ name: "دستیار کیفیت و فرمولاسیون", requests: 380, tokens: 290000, externalShare: 0.1 }, { name: "دستیار سند", requests: 220, tokens: 189000, externalShare: 0.3 }, { name: "دستیار فروش و قیمت‌گذاری", requests: 97, tokens: 69300, externalShare: 0.9 }, { name: "بدون عامل", requests: 320, tokens: 221000, externalShare: 0.4 }],
  },
};

/** Usage of the signed-in user only. */
export function getUsageReport(period: UsagePeriod): UsageReport {
  return reports[period];
}

import type { UsagePeriod, UsageReport } from "../types";

const reports: Record<UsagePeriod, UsageReport> = {
  daily: {
    series: [
      { label: "شنبه", requests: 12, tokens: 9200 }, { label: "یکشنبه", requests: 18, tokens: 14100 },
      { label: "دوشنبه", requests: 9, tokens: 6800 }, { label: "سه‌شنبه", requests: 25, tokens: 21300 },
      { label: "چهارشنبه", requests: 14, tokens: 11000 }, { label: "پنجشنبه", requests: 4, tokens: 2900 },
      { label: "جمعه", requests: 0, tokens: 0 },
    ],
    byModel: [{ name: "Claude Sonnet", requests: 52, tokens: 41200 }, { name: "GPT", requests: 21, tokens: 18900 }, { name: "Qwen", requests: 9, tokens: 5200 }],
    byAgent: [{ name: "دستیار فروش", requests: 30, tokens: 24000 }, { name: "بدون Agent", requests: 44, tokens: 36100 }, { name: "گزارش مالی ماهانه", requests: 8, tokens: 5200 }],
  },
  weekly: {
    series: [
      { label: "هفته‌ی ۱", requests: 70, tokens: 52000 }, { label: "هفته‌ی ۲", requests: 95, tokens: 71000 },
      { label: "هفته‌ی ۳", requests: 60, tokens: 44000 }, { label: "هفته‌ی ۴", requests: 82, tokens: 61300 },
    ],
    byModel: [{ name: "Claude Sonnet", requests: 160, tokens: 122000 }, { name: "GPT", requests: 90, tokens: 70500 }, { name: "Qwen", requests: 40, tokens: 24000 }, { name: "Gemini Flash", requests: 17, tokens: 11800 }],
    byAgent: [{ name: "دستیار فروش", requests: 120, tokens: 92000 }, { name: "بدون Agent", requests: 150, tokens: 111000 }, { name: "بررسی پرونده‌ی پرسنلی", requests: 37, tokens: 25300 }],
  },
  monthly: {
    series: [
      { label: "تیر", requests: 210, tokens: 160000 }, { label: "مرداد", requests: 260, tokens: 198000 },
      { label: "شهریور", requests: 240, tokens: 183000 }, { label: "مهر", requests: 307, tokens: 228300 },
    ],
    byModel: [{ name: "Claude Sonnet", requests: 480, tokens: 370000 }, { name: "GPT", requests: 300, tokens: 231000 }, { name: "Qwen", requests: 150, tokens: 99000 }, { name: "Gemini Flash", requests: 87, tokens: 69300 }],
    byAgent: [{ name: "دستیار فروش", requests: 400, tokens: 310000 }, { name: "بدون Agent", requests: 520, tokens: 400000 }, { name: "گزارش مالی ماهانه", requests: 97, tokens: 59300 }],
  },
};

/** Usage of the signed-in user only. */
export function getUsageReport(period: UsagePeriod): UsageReport {
  return reports[period];
}

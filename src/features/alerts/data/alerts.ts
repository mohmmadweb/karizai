import type { AlertRule, Frequency, ReportSchedule, Sensitivity } from "../types";

export const sensitivityLabels: Record<Sensitivity, string> = { low: "کم", medium: "متوسط", high: "زیاد" };
export const frequencyLabels: Record<Frequency, string> = { instant: "فوری", hourly: "ساعتی (خلاصه)", daily: "روزانه (خلاصه)" };

const rules: AlertRule[] = [
  { id: "rule-1", name: "دمای ناحیه‌ی ۴ اکسترودر", metric: "دمای ناحیه‌ی ۴ اکسترودر خط ۲", sensitivity: "high", recipient: "سرپرست خط ۲", frequency: "instant", enabled: true },
  { id: "rule-2", name: "ضایعات خط", metric: "درصد ضایعات خط ۲", sensitivity: "medium", recipient: "مدیر تولید", frequency: "hourly", enabled: true },
  { id: "rule-3", name: "افت ناگهانی فروش گرید", metric: "فروش ماهانه‌ی هر گرید", sensitivity: "medium", recipient: "مدیر فروش", frequency: "daily", enabled: true },
  { id: "rule-4", name: "پوشش موجودی مواد اولیه", metric: "روزهای پوشش موجودی", sensitivity: "low", recipient: "کارشناس تدارک", frequency: "daily", enabled: false },
];

const reports: ReportSchedule[] = [
  { id: "report-1", name: "گزارش هفتگی مدیریتی", day: "شنبه", time: "08:00", recipients: "مدیرعامل، مدیر تولید، مدیر فروش", summary: "فروش و موجودی، شاخص‌های تولید و مهم‌ترین ناهنجاری‌های هفته", enabled: true },
  { id: "report-2", name: "گزارش روزانه‌ی خط ۲", day: "همه‌ی روزها", time: "07:00", recipients: "سرپرست خط ۲", summary: "OEE، ضایعات و توقف‌های روز قبل", enabled: false },
];

export const metricOptions = ["دمای ناحیه‌ی ۴ اکسترودر خط ۲", "درصد ضایعات خط ۲", "فشار قالب", "OEE خط ۲", "فروش ماهانه‌ی هر گرید", "روزهای پوشش موجودی", "قیمت مواد اولیه"];
export const recipientOptions = ["خودم", "سرپرست خط ۲", "مدیر تولید", "مدیر فروش", "کارشناس تدارک", "مدیرعامل"];
export const dayOptions = ["شنبه", "یکشنبه", "دوشنبه", "سه‌شنبه", "چهارشنبه", "پنجشنبه", "جمعه", "همه‌ی روزها"];

export const getAlertRules = (): AlertRule[] => rules;
export const getReportSchedules = (): ReportSchedule[] => reports;

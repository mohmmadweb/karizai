import type { BiAlarm, Indicator, Reading } from "../types";

const base = { enabled: true, refreshMinutes: 5, groupIds: ["group-003"] };

const indicators: Indicator[] = [
  { ...base, id: "ind-temp4", name: "دمای ناحیه‌ی ۴ اکسترودر خط ۲", unit: "°C", lowerLimit: 225, upperLimit: 240, source: "iot", reference: "plant/line2/zone4/temp", severity: "warning", userIds: ["user-003"] },
  { ...base, id: "ind-pressure", name: "فشار قالب خط ۲", unit: "بار", lowerLimit: null, upperLimit: 60, source: "iot", reference: "plant/line2/die/pressure", severity: "warning", userIds: ["user-003"] },
  { ...base, id: "ind-scrap", name: "ضایعات خط ۲", unit: "٪", lowerLimit: null, upperLimit: 4, source: "mes", reference: "scrap_rate_line2", severity: "critical", userIds: ["user-003", "user-007"], refreshMinutes: 15 },
  { ...base, id: "ind-oee", name: "OEE خط ۲", unit: "٪", lowerLimit: 75, upperLimit: null, source: "mes", reference: "oee_line2", severity: "info", userIds: [], refreshMinutes: 15 },
  { ...base, id: "ind-moisture", name: "رطوبت گرانول مصرفی", unit: "٪", lowerLimit: null, upperLimit: 0.05, source: "sql", reference: "SELECT TOP 1 MoisturePct FROM QcMoisture ORDER BY MeasuredAt DESC", severity: "warning", userIds: [], groupIds: ["group-003", "group-001"], refreshMinutes: 60 },
  { ...base, id: "ind-mfi", name: "MFI آخرین بچ", unit: "g/10min", lowerLimit: 10, upperLimit: 14, source: "sql", reference: "SELECT TOP 1 Mfi FROM BatchResults ORDER BY TestedAt DESC", severity: "warning", userIds: ["user-004"], groupIds: [], refreshMinutes: 60 },
  { ...base, id: "ind-cover", name: "پوشش موجودی PE سنگین HD5502", unit: "روز", lowerLimit: 5, upperLimit: null, source: "sql", reference: "SELECT CoverDays FROM InventoryCover WHERE MaterialCode = 'HD5502'", severity: "critical", userIds: ["user-002"], groupIds: ["group-002"], refreshMinutes: 60 },
];

/** Current value of each seeded indicator; the day before is derived from it. */
const currents: Record<string, number> = {
  "ind-temp4": 248, "ind-pressure": 52, "ind-scrap": 4.8, "ind-oee": 81, "ind-moisture": 0.04, "ind-mfi": 11.8, "ind-cover": 3,
};

const history: BiAlarm[] = [
  { id: "alarm-h1", indicatorId: "ind-scrap", indicatorName: "ضایعات خط ۲", value: 5.2, unit: "٪", limitText: "بالاتر از ۴", severity: "critical", raisedAt: "2026-10-17T10:20:00.000Z", recipients: ["فنی", "علی کریمی", "امیر صادقی"], state: "acknowledged", resolved: true },
  { id: "alarm-h2", indicatorId: "ind-mfi", indicatorName: "MFI آخرین بچ", value: 15.1, unit: "g/10min", limitText: "بالاتر از ۱۴", severity: "warning", raisedAt: "2026-10-16T08:05:00.000Z", recipients: ["نرگس موسوی"], state: "acknowledged", resolved: true },
  { id: "alarm-h3", indicatorId: "ind-moisture", indicatorName: "رطوبت گرانول مصرفی", value: 0.08, unit: "٪", limitText: "بالاتر از ۰٫۰۵", severity: "warning", raisedAt: "2026-10-14T12:40:00.000Z", recipients: ["فنی", "فروش"], state: "acknowledged", resolved: true },
];

export function getIndicators(): Indicator[] {
  return indicators;
}

export function getSeededCurrents(): Record<string, number> {
  return currents;
}

export function getAlarmHistory(): BiAlarm[] {
  return history;
}

export type { Reading };

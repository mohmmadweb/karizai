import type { Dashboard, DataAnswer } from "../types";

const answers: DataAnswer[] = [
  {
    id: "scrap", question: "ضایعات خط ۲ در ۶ ماه گذشته به تفکیک ماه چقدر بوده؟", match: /ضایعات/, chartTitle: "ضایعات خط ۲ (درصد)", dashboardId: "dash-quality", groupName: "تولید خط ۲",
    insight: "ضایعات از مرداد ۳۳٪ کاهش یافته و هم‌زمان با تنظیم دمای ناحیه‌ی ۴ اکسترودر است.",
    result: {
      query: "SELECT month, ROUND(SUM(scrap_kg)*100.0/SUM(output_kg),1) AS scrap_pct\nFROM prod.line_daily\nWHERE line_id = 2 AND date >= DATEADD(month,-6,GETDATE())\nGROUP BY month ORDER BY month;",
      columns: ["ماه", "ضایعات (٪)"], rows: [["اردیبهشت", 3.4], ["خرداد", 3.6], ["تیر", 3.1], ["مرداد", 3.3], ["شهریور", 2.8], ["مهر", 2.2]], suggested: "bar",
    },
  },
  {
    id: "materials", question: "مصرف مواد اولیه در مهر به تفکیک ماده چقدر بوده؟", match: /(مصرف|مواد اولیه)/, chartTitle: "مصرف مواد اولیه در مهر (تن)", dashboardId: "dash-materials", groupName: "تدارک و انبار",
    insight: "مصرف POE نسبت به شهریور ۱۸٪ بیشتر شده است؛ به‌خاطر سفارش گرید ضربه‌ای مشتری.",
    result: {
      query: "SELECT material, ROUND(SUM(qty_kg)/1000.0,1) AS tons\nFROM prod.material_usage\nWHERE month = '1405-07' AND line_id IN (1,2,3)\nGROUP BY material ORDER BY tons DESC;",
      columns: ["ماده", "مصرف (تن)"], rows: [["PP کوپلیمر", 412], ["تالک میکرونیزه", 118], ["POE", 96], ["HD5502", 74], ["مستربچ مشکی", 21]], suggested: "bar",
    },
  },
  {
    id: "oee", question: "OEE خطوط تولید در مهر چقدر بوده؟", match: /(OEE|راندمان|بهره‌وری)/i, chartTitle: "OEE خطوط در مهر (درصد)", dashboardId: "dash-oee", groupName: "تولید خط ۲",
    insight: "OEE خط ۲ با ۷۱٪ پایین‌ترین است؛ بیشتر به‌خاطر ۱۴ ساعت توقف آلارم E-217.",
    result: {
      query: "SELECT line_name, ROUND(AVG(oee)*100,0) AS oee_pct\nFROM prod.line_shift\nWHERE month = '1405-07'\nGROUP BY line_name ORDER BY line_name;",
      columns: ["خط", "OEE (٪)"], rows: [["خط ۱", 82], ["خط ۲", 71], ["خط ۳", 78]], suggested: "bar",
    },
  },
];

const dashboards: Dashboard[] = [
  { id: "dash-quality", name: "کیفیت تولید", charts: 6, note: "به‌روز هر ساعت" },
  { id: "dash-materials", name: "مصرف مواد اولیه", charts: 4 },
  { id: "dash-oee", name: "OEE خطوط", charts: 3 },
];

export function getDataAnswers(): DataAnswer[] {
  return answers;
}

/** The prepared answer for a question, or `undefined` when none fits. */
export function findDataAnswer(question: string): DataAnswer | undefined {
  return answers.find((answer) => answer.match.test(question));
}

export function getDashboards(): Dashboard[] {
  return dashboards;
}

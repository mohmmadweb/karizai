export type Connection = { id: string; personId: string; unit: string; mutual: number; since: string };
export type ConnectionRequest = { id: string; personId: string; unit: string; note: string; at: string };

export const connections: Connection[] = [
  { id: "cn-1", personId: "col-ali", unit: "تدارک و خرید", mutual: 5, since: "2026-10-28T08:00:00.000Z" },
  { id: "cn-2", personId: "col-sara", unit: "انبار مواد اولیه", mutual: 4, since: "2026-10-21T08:00:00.000Z" },
  { id: "cn-3", personId: "col-reza", unit: "تولید، خط ۲ اکسترودر", mutual: 6, since: "2026-10-02T08:00:00.000Z" },
  { id: "cn-4", personId: "col-narges", unit: "آزمایشگاه و QC", mutual: 7, since: "2026-09-14T08:00:00.000Z" },
];

export const requests: ConnectionRequest[] = [
  { id: "rq-1", personId: "col-mohammad", unit: "فروش", note: "برای هماهنگی پیش‌فاکتور PP-T20 با شما در ارتباط باشم.", at: "2026-11-03T10:15:00.000Z" },
  { id: "rq-2", personId: "col-mehdi", unit: "نگهداری و تعمیرات", note: "درباره‌ی گرمکن ناحیه‌ی ۴ خط ۲ هماهنگ شویم.", at: "2026-11-02T13:40:00.000Z" },
];

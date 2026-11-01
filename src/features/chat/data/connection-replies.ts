import type { Connection } from "@/features/connections/types";
import type { FixedConnectionReply } from "../types";

const replies: FixedConnectionReply[] = [
  {
    connectionId: "conn-mvw2siew-1",
    connectionName: "MES کارخانه",
    steps: [
      {
        id: "mes-orders",
        title: "وضعیت سفارش تولید",
        lines: ["پیشرفت سفارش‌های هر سه خط خوانده می‌شود"],
        result: "سفارش ۱۲۴۰ روی خط ۲ ۶۰٪ تولید شده و طبق برنامه باید ۷۲٪ می‌بود.",
      },
      {
        id: "mes-stops",
        title: "توقف‌های خط",
        lines: ["توقف‌های امروز خط‌ها با علت و مدت فهرست می‌شود"],
        result: "یک توقف ۴۰ دقیقه‌ای در خط ۲، به علت خرابی نوار نقاله (کد ۴۱۲).",
      },
    ],
    text: `بر اساس داده‌ی MES (آخرین به‌روزرسانی ۱۰:۴۵):

**خط ۲ امروز ۱۲٪ از برنامه عقب است.**
- سفارش ۱۲۴۰ (پلی‌اتیلن سنگین، ۲۰ تن): ۶۰٪ تولید شده؛ طبق برنامه تا این ساعت باید ۷۲٪ می‌بود.
- توقف: ۴۰ دقیقه، از ۰۸:۱۰ تا ۰۸:۵۰، به علت خرابی نوار نقاله (کد ۴۱۲).
- ضایعات امروز: ۳٫۱٪ (حد مجاز ۴٪).
- خط ۱ و خط ۳ طبق برنامه پیش می‌روند.

پیشنهاد: برای جبران عقب‌ماندگی، یک ساعت اضافه‌کاری در شیفت عصر خط ۲ و بازبینی نوار نقاله پیش از شروع شیفت بعد.`,
  },
];

/** The fixed answer of the first selected connection that has one, found by id or name. */
export function getFixedConnectionReply(selected: Pick<Connection, "id" | "name">[]): FixedConnectionReply | undefined {
  return replies.find((reply) => selected.some((item) => item.id === reply.connectionId || item.name === reply.connectionName));
}

import type { MeetingMinutes } from "../types";
import { minutesTasks } from "./ai-answers";

const minutes: MeetingMinutes[] = [
  {
    eventId: "evt-4",
    decisions: ["سفارش ۸۰ تن HD5502 به جریان سفارش‌دهی خودکار سپرده شد و تأیید نهایی با مسئول کیفیت است.", "نقطه‌ی سفارش POE از ۱۲ به ۱۵ تن می‌رسد."],
    tasks: [
      { title: "تنظیم نقطه‌ی سفارش POE در سامانه‌ی انبار", assigneeId: "col-sara", dueDate: "2026-11-04T00:00:00.000Z", projectId: "proj-3" },
      { title: "استعلام قیمت HD5502 از دو تأمین‌کننده‌ی داخلی", assigneeId: "col-ali", dueDate: "2026-11-06T00:00:00.000Z", projectId: "proj-3" },
    ],
  },
  {
    eventId: "evt-1",
    decisions: ["گرید جایگزین مستربچ پیش از سفارش تازه روی خط ۲ آزمون می‌شود.", "بند ۴.۲ رویه‌ی QC-SOP-07 درباره‌ی نمونه‌برداری رنگ بازنگری می‌شود.", "حسگر دمای ناحیه‌ی ۴ پیش از آزمون کالیبره می‌شود."],
    tasks: minutesTasks,
  },
];

export function getMinutes(eventId: string): MeetingMinutes | undefined {
  return minutes.find((item) => item.eventId === eventId);
}

export type EventExtra = { kind: "meeting" | "event"; capacity: number | null; registered: number; pinned: boolean; agenda: string };

export const kindLabels = { meeting: "جلسه", event: "رویداد" } as const;

/** Extra sample fields of the calendar events, by id. */
export const eventExtras: Record<string, EventExtra> = {
  "evt-1": { kind: "meeting", capacity: 12, registered: 9, pinned: true, agenda: "۱) مرور مردودی بچ‌های آبان\n۲) نتیجه‌ی آزمون رطوبت PP-T20\n۳) بازنگری بند ۴٫۲ رویه‌ی QC-SOP-07\n۴) اقدام اصلاحی بچ B-1405-2217\n۵) مصوبات و مسئول پیگیری" },
  "evt-2": { kind: "meeting", capacity: 6, registered: 4, pinned: false, agenda: "۱) موجودی HD5502 و مستربچ\n۲) مقایسه‌ی دو تأمین‌کننده‌ی داخلی\n۳) تصمیم درباره‌ی سفارش ۸۰ تنی\n۴) زمان‌بندی تحویل" },
  "evt-3": { kind: "event", capacity: 200, registered: 64, pinned: true, agenda: "۱) هماهنگی غرفه و نمونه‌ی گریدها\n۲) برنامه‌ی بازدید مشتریان\n۳) مسئولان هر شیفت غرفه" },
  "evt-4": { kind: "meeting", capacity: null, registered: 5, pinned: false, agenda: "۱) مرور وضعیت تأمین\n۲) ریسک‌های هفته‌ی آینده" },
};

export const defaultExtra: EventExtra = { kind: "meeting", capacity: null, registered: 1, pinned: false, agenda: "۱) هدف جلسه\n۲) مرور موارد باز\n۳) مصوبات و مسئول پیگیری" };

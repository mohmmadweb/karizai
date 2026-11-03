import type { Project, ProjectInsight, Task } from "../types";

const projects: Project[] = [
  { id: "proj-1", name: "بهینه‌سازی خط ۲", description: "کاهش ضایعات و پایدار کردن دمای ناحیه‌ی ۴ اکسترودر.", ownerId: "col-reza", memberIds: ["col-reza", "col-mehdi", "col-narges", "user-1"], dueDate: "2026-11-20T00:00:00.000Z" },
  { id: "proj-2", name: "توسعه‌ی گرید PP-T20 با ضربه‌ی بالا", description: "فرمولاسیون تازه و آزمون‌های مقاومت ضربه برای مشتری آریاپلاست.", ownerId: "col-narges", memberIds: ["col-narges", "col-mohammad", "user-1"], dueDate: "2026-12-15T00:00:00.000Z" },
  { id: "proj-3", name: "کاهش ریسک تأمین مواد اولیه", description: "تأمین‌کننده‌ی جایگزین برای HD5502 و POE و تنظیم نقطه‌ی سفارش.", ownerId: "col-ali", memberIds: ["col-ali", "col-sara", "user-1"], dueDate: "2026-11-30T00:00:00.000Z" },
  { id: "proj-4", name: "گزارش‌های مدیریتی خودکار", description: "گزارش فروش و شاخص‌ها هر هفته خودکار برای مدیران ارسال شود.", ownerId: "user-1", memberIds: ["user-1", "col-mohammad"], dueDate: "2026-12-05T00:00:00.000Z" },
  { id: "proj-5", name: "بهبود کیفیت ۱۴۰۵", description: "کاهش مردودی بچ‌ها به زیر ۲٪ و بازنگری رویه‌های کنترل کیفیت.", ownerId: "user-1", memberIds: ["user-1", "col-narges", "col-reza", "col-ali"], dueDate: "2026-12-20T00:00:00.000Z" },
];

const tasks: Task[] = [
  { id: "task-1", projectId: "proj-1", title: "بازبینی تنظیمات گرمکن ناحیه‌ی ۴", assigneeId: "col-mehdi", status: "doing", priority: "high", dueDate: "2026-11-05T00:00:00.000Z", source: "minutes" },
  { id: "task-2", projectId: "proj-1", title: "ثبت علت‌های ضایعات در هفته‌ی گذشته", assigneeId: "user-1", status: "todo", priority: "normal", dueDate: "2026-11-08T00:00:00.000Z", source: "manual" },
  { id: "task-3", projectId: "proj-1", title: "نصب حسگر دمای دوم روی قالب", assigneeId: "col-reza", status: "done", priority: "normal", dueDate: "2026-10-28T00:00:00.000Z", source: "manual" },
  { id: "task-4", projectId: "proj-2", title: "آزمون ضربه‌ی آیزود روی سه نمونه", assigneeId: "col-narges", status: "doing", priority: "high", dueDate: "2026-11-10T00:00:00.000Z", source: "manual" },
  { id: "task-5", projectId: "proj-2", title: "بازبینی پیش‌فاکتور آریاپلاست", assigneeId: "user-1", status: "todo", priority: "high", dueDate: "2026-11-04T00:00:00.000Z", source: "manual" },
  { id: "task-6", projectId: "proj-3", title: "تأیید سفارش ۸۰ تن PE سنگین HD5502", assigneeId: "user-1", status: "todo", priority: "high", dueDate: "2026-11-02T00:00:00.000Z", source: "reorder-flow" },
  { id: "task-7", projectId: "proj-3", title: "استعلام قیمت از دو تأمین‌کننده‌ی داخلی", assigneeId: "col-ali", status: "doing", priority: "normal", dueDate: "2026-10-31T00:00:00.000Z", source: "minutes" },
  { id: "task-8", projectId: "proj-3", title: "شمارش موجودی مستربچ مشکی", assigneeId: "col-sara", status: "done", priority: "low", dueDate: "2026-11-01T00:00:00.000Z", source: "manual" },
  { id: "task-9", projectId: "proj-4", title: "تعیین گیرندگان گزارش فروش هفتگی", assigneeId: "user-1", status: "doing", priority: "normal", dueDate: "2026-11-07T00:00:00.000Z", source: "manual" },
  { id: "task-10", projectId: "proj-4", title: "بررسی قالب گزارش با مدیر فروش", assigneeId: "col-mohammad", status: "todo", priority: "low", dueDate: "2026-11-12T00:00:00.000Z", source: "manual" },
  { id: "task-11", projectId: "proj-5", title: "بازنگری بند ۴.۲ رویه‌ی QC-SOP-07", assigneeId: "user-1", status: "todo", priority: "normal", dueDate: "2026-11-11T00:00:00.000Z", source: "minutes" },
  { id: "task-12", projectId: "proj-5", title: "اقدام اصلاحی بچ B-1405-2217", assigneeId: "user-1", status: "doing", priority: "high", dueDate: "2026-11-05T00:00:00.000Z", source: "quality-agent" },
  { id: "task-13", projectId: "proj-5", title: "گزارش ماهانه‌ی کیفیت", assigneeId: "user-1", status: "todo", priority: "low", dueDate: "2026-11-21T00:00:00.000Z", source: "manual" },
  { id: "task-14", projectId: "proj-5", title: "آزمون رطوبت گرانول بچ‌های آبان", assigneeId: "col-narges", status: "done", priority: "normal", dueDate: "2026-10-30T00:00:00.000Z", source: "quality-agent" },
];

/** The assistant's reading of each sample project's delay risk. */
const insights: ProjectInsight[] = [
  { projectId: "proj-1", risk: "high", reason: "بازبینی گرمکن ناحیه‌ی ۴ در مسیر بحرانی است و دمای ناحیه هنوز ۸ درجه بالاتر از حد ثبت می‌شود.", suggestion: "کالیبراسیون حسگر را جلو بیندازید و آزمون خط ۲ را یک هفته عقب ببرید." },
  { projectId: "proj-2", risk: "medium", reason: "آزمون ضربه‌ی آیزود هنوز تمام نشده و پیش‌فاکتور آریاپلاست به نتیجه‌ی آن وابسته است.", suggestion: "نتیجه‌ی دو نمونه‌ی اول را زودتر برای فروش بفرستید." },
  { projectId: "proj-3", risk: "high", reason: "استعلام تأمین‌کننده‌ی جایگزین از موعد گذشته و تأمین مستربچ یک وابستگی بیرونی باز دارد.", suggestion: "یک تأمین‌کننده‌ی جایگزین دیگر اضافه کنید و نقطه‌ی سفارش HD5502 را بالا ببرید." },
  { projectId: "proj-4", risk: "low", reason: "وظایف باز کم‌اهمیت‌اند و موعد پروژه یک ماه فاصله دارد.", suggestion: "قالب گزارش را تا پایان هفته نهایی کنید." },
  { projectId: "proj-5", risk: "medium", reason: "اقدام اصلاحی بچ B-1405-2217 تا سه روز دیگر موعد دارد و بازنگری QC-SOP-07 به آن وابسته است.", suggestion: "نتیجه‌ی آزمون مستربچ قبلی را پیش از بازنگری رویه بگیرید." },
];

export function getProjects(): Project[] {
  return projects;
}

export function getTasks(): Task[] {
  return tasks;
}

export function getProjectInsight(projectId: string): ProjectInsight | undefined {
  return insights.find((item) => item.projectId === projectId);
}

/** Only the sample projects have their own page in the static build; projects made during a visit open in place. */
export function hasProjectPage(projectId: string): boolean {
  return projects.some((item) => item.id === projectId);
}

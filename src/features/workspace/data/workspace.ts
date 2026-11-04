import type { Project, Task } from "../types";

const projects: Project[] = [
  { id: "proj-1", name: "بهینه‌سازی خط ۲", description: "کاهش ضایعات و پایدار کردن دمای ناحیه‌ی ۴ اکسترودر.", ownerId: "col-reza", memberIds: ["col-reza", "col-mehdi", "col-narges", "user-1"], dueDate: "2026-11-20T00:00:00.000Z" },
  { id: "proj-2", name: "توسعه‌ی گرید PP-T20 با ضربه‌ی بالا", description: "فرمولاسیون تازه و آزمون‌های مقاومت ضربه برای مشتری.", ownerId: "col-narges", memberIds: ["col-narges", "col-mohammad", "user-1"], dueDate: "2026-12-15T00:00:00.000Z" },
  { id: "proj-3", name: "کاهش ریسک تأمین مواد اولیه", description: "تأمین‌کننده‌ی جایگزین برای HD5502 و POE و تنظیم نقطه‌ی سفارش.", ownerId: "col-ali", memberIds: ["col-ali", "col-sara", "user-1"], dueDate: "2026-11-30T00:00:00.000Z" },
  { id: "proj-4", name: "گزارش‌های مدیریتی خودکار", description: "گزارش فروش و شاخص‌ها هر هفته خودکار برای مدیران ارسال شود.", ownerId: "user-1", memberIds: ["user-1", "col-mohammad"], dueDate: "2026-12-05T00:00:00.000Z" },
];

const tasks: Task[] = [
  { id: "task-1", projectId: "proj-1", title: "بازبینی تنظیمات گرمکن ناحیه‌ی ۴", assigneeId: "col-mehdi", status: "doing", priority: "high", dueDate: "2026-11-05T00:00:00.000Z" },
  { id: "task-2", projectId: "proj-1", title: "ثبت علت‌های ضایعات در هفته‌ی گذشته", assigneeId: "user-1", status: "todo", priority: "normal", dueDate: "2026-11-08T00:00:00.000Z" },
  { id: "task-3", projectId: "proj-1", title: "نصب حسگر دمای دوم روی قالب", assigneeId: "col-reza", status: "done", priority: "normal", dueDate: "2026-10-28T00:00:00.000Z" },
  { id: "task-4", projectId: "proj-2", title: "آزمون ضربه‌ی آیزود روی سه نمونه", assigneeId: "col-narges", status: "doing", priority: "high", dueDate: "2026-11-10T00:00:00.000Z" },
  { id: "task-5", projectId: "proj-2", title: "بازبینی پیش‌فاکتور فروش", assigneeId: "user-1", status: "todo", priority: "high", dueDate: "2026-11-04T00:00:00.000Z" },
  { id: "task-7", projectId: "proj-3", title: "استعلام قیمت از دو تأمین‌کننده‌ی داخلی", assigneeId: "col-ali", status: "doing", priority: "normal", dueDate: "2026-11-06T00:00:00.000Z" },
  { id: "task-8", projectId: "proj-3", title: "شمارش موجودی مستربچ مشکی", assigneeId: "col-sara", status: "done", priority: "low", dueDate: "2026-11-01T00:00:00.000Z" },
  { id: "task-9", projectId: "proj-4", title: "تعیین گیرندگان گزارش فروش هفتگی", assigneeId: "user-1", status: "doing", priority: "normal", dueDate: "2026-11-07T00:00:00.000Z" },
  { id: "task-10", projectId: "proj-4", title: "بررسی قالب گزارش با مدیر فروش", assigneeId: "col-mohammad", status: "todo", priority: "low", dueDate: "2026-11-12T00:00:00.000Z" },
];

export function getProjects(): Project[] {
  return projects;
}

export function getTasks(): Task[] {
  return tasks;
}

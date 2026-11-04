import { BellIcon, BellRingIcon, CalendarPlusIcon, CheckCircle2Icon, Clock3Icon, FileTextIcon, HandIcon, ListChecksIcon, MegaphoneIcon, MessageCircleIcon, MessageSquareTextIcon, ScrollTextIcon, SparklesIcon, UsersRoundIcon, XCircleIcon, ZapIcon, type LucideIcon } from "lucide-react";
import type { EffectKind, NotificationIcon } from "../types";

/** Icon of each effect and the short line the workflow editor shows after a step («→ وظیفه ثبت شد»). */
export const effectMeta: Record<EffectKind, { icon: LucideIcon; short: string; label: string }> = {
  message: { icon: MessageCircleIcon, short: "پیام رفت", label: "پیام به همکار فرستاده شد" },
  group: { icon: UsersRoundIcon, short: "در گروه گذاشته شد", label: "پیام در گروه گذاشته شد" },
  channel: { icon: MegaphoneIcon, short: "در کانال منتشر شد", label: "اطلاعیه در کانال منتشر شد" },
  alert: { icon: BellRingIcon, short: "هشدار ثبت شد", label: "هشدار در «ربات هشدار» ثبت شد" },
  task: { icon: ListChecksIcon, short: "وظیفه ثبت شد", label: "وظیفه در «فعالیت و وظایف من» ثبت شد" },
  calendar: { icon: CalendarPlusIcon, short: "جلسه رزرو شد", label: "جلسه در تقویم رزرو شد" },
  file: { icon: FileTextIcon, short: "فایل ساخته شد", label: "فایل در «دانش سازمانی» ساخته شد" },
  chat: { icon: MessageSquareTextIcon, short: "گزارش در گفتگو نشست", label: "گزارش در گفتگوهای اخیر نشست" },
  notification: { icon: BellIcon, short: "اعلان رفت", label: "اعلان برای شما ثبت شد" },
  audit: { icon: ScrollTextIcon, short: "در ممیزی ثبت شد", label: "در گزارش ممیزی ثبت شد" },
};

const extraIcons: Record<Exclude<NotificationIcon, EffectKind>, LucideIcon> = { run: CheckCircle2Icon, failed: XCircleIcon, approval: HandIcon, schedule: Clock3Icon, event: ZapIcon };

export const notificationIconOf = (icon: NotificationIcon): LucideIcon =>
  icon in extraIcons ? extraIcons[icon as keyof typeof extraIcons] : (effectMeta[icon as EffectKind]?.icon ?? SparklesIcon);

export const fileExtensions = { pdf: "pdf", word: "docx", excel: "xlsx" } as const;

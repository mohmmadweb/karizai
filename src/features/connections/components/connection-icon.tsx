import { DatabaseIcon, FactoryIcon, FlaskConicalIcon, MessageSquareIcon, MessagesSquareIcon, PlugIcon, RadioIcon, TagsIcon, UsersIcon, WrenchIcon, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

/** What a connection is about, found from its name and area, with a colour that tells the kinds apart. */
const kinds: { match: RegExp; icon: LucideIcon; tone: string }[] = [
  { match: /MES|اجرای تولید/i, icon: FactoryIcon, tone: "bg-orange-500/15 text-orange-600 dark:text-orange-400" },
  { match: /IoT|MQTT|حسگر/i, icon: RadioIcon, tone: "bg-teal-500/15 text-teal-600 dark:text-teal-400" },
  { match: /SQL|پایگاه|انبار|تدارک|راهکاران/i, icon: DatabaseIcon, tone: "bg-blue-500/15 text-blue-600 dark:text-blue-400" },
  { match: /شبکه اجتماعی|نجوا|اعلان/i, icon: MessagesSquareIcon, tone: "bg-violet-500/15 text-violet-600 dark:text-violet-400" },
  { match: /LIMS|آزمایشگاه/i, icon: FlaskConicalIcon, tone: "bg-green-500/15 text-green-600 dark:text-green-400" },
  { match: /CMMS|تعمیرات/i, icon: WrenchIcon, tone: "bg-amber-500/15 text-amber-600 dark:text-amber-400" },
  { match: /قیمت|سپیدار|مالی/i, icon: TagsIcon, tone: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400" },
  { match: /پیامک|کاوه/i, icon: MessageSquareIcon, tone: "bg-sky-500/15 text-sky-600 dark:text-sky-400" },
  { match: /CRM|دیدار|پیام‌گستر/i, icon: UsersIcon, tone: "bg-rose-500/15 text-rose-600 dark:text-rose-400" },
];

export function ConnectionIcon({ name, domain = "", className }: { name: string; domain?: string; className?: string }) {
  const kind = kinds.find((item) => item.match.test(`${name} ${domain}`));
  const Icon = kind?.icon ?? PlugIcon;
  return (
    <span aria-hidden className={cn("inline-flex size-7 shrink-0 items-center justify-center rounded-lg", kind?.tone ?? "bg-muted text-muted-foreground", className)}>
      <Icon className="size-4" />
    </span>
  );
}

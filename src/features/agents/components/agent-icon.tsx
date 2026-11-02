import { ActivityIcon, BotIcon, ChartColumnIcon, FileSearchIcon, FlaskConicalIcon, HeadsetIcon, MailIcon, TagsIcon, UsersIcon, WalletIcon, WrenchIcon, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

/** What an Agent does, found from its name and purpose, with a colour that tells the kinds apart. */
const kinds: { match: RegExp; icon: LucideIcon; tone: string }[] = [
  { match: /هوش تجاری|BI/i, icon: ChartColumnIcon, tone: "bg-blue-500/15 text-blue-600 dark:text-blue-400" },
  { match: /شاخص/, icon: ActivityIcon, tone: "bg-orange-500/15 text-orange-600 dark:text-orange-400" },
  { match: /کیفیت|فرمول|آزمایشگاه/, icon: FlaskConicalIcon, tone: "bg-green-500/15 text-green-600 dark:text-green-400" },
  { match: /نگهداری|تعمیر/, icon: WrenchIcon, tone: "bg-amber-500/15 text-amber-600 dark:text-amber-400" },
  { match: /قیمت|فروش/, icon: TagsIcon, tone: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400" },
  { match: /مالی|هزینه/, icon: WalletIcon, tone: "bg-yellow-500/15 text-yellow-700 dark:text-yellow-400" },
  { match: /پشتیبانی|تیکت/, icon: HeadsetIcon, tone: "bg-teal-500/15 text-teal-600 dark:text-teal-400" },
  { match: /پرسنل|منابع انسانی/, icon: UsersIcon, tone: "bg-rose-500/15 text-rose-600 dark:text-rose-400" },
  { match: /نامه|نگارش/, icon: MailIcon, tone: "bg-sky-500/15 text-sky-600 dark:text-sky-400" },
  { match: /سند/, icon: FileSearchIcon, tone: "bg-violet-500/15 text-violet-600 dark:text-violet-400" },
];

export function AgentIcon({ name, purpose = "", className }: { name: string; purpose?: string; className?: string }) {
  const kind = kinds.find((item) => item.match.test(name)) ?? kinds.find((item) => item.match.test(purpose));
  const Icon = kind?.icon ?? BotIcon;
  return (
    <span aria-hidden className={cn("inline-flex size-11 shrink-0 items-center justify-center rounded-xl", kind?.tone ?? "bg-primary/10 text-primary", className)}>
      <Icon className="size-6" />
    </span>
  );
}

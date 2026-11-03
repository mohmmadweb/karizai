import { BellIcon, ChartColumnIcon, UsersIcon } from "lucide-react";
import { BrandLogo } from "@/components/brand/brand-logo";
import { Button } from "@/components/ui/button";
import { PreviewGroup } from "./preview-section";

const items = [
  { title: "بخش اول", icon: UsersIcon, current: true },
  { title: "بخش دوم", icon: ChartColumnIcon, current: false },
];

/** Static picture of the admin frame pattern: sidebar and top bar. */
export function ShellExample() {
  return (
    <PreviewGroup title="ساید بار و تاپ بار (قاب پنل)">
      <div className="flex h-56 overflow-hidden rounded-lg border bg-background">
        <aside className="flex w-36 shrink-0 flex-col gap-3 border-e bg-card p-2 sm:w-48">
          <div className="flex h-10 items-center justify-center">
            <BrandLogo alt="" variant="text" className="w-20" />
          </div>
          <ul className="flex flex-col gap-1">
            {items.map(({ title, icon: Icon, current }) => (
              <li
                key={title}
                aria-current={current ? "page" : undefined}
                className="relative flex h-10 items-center gap-2 rounded-lg px-3 text-label text-muted-foreground aria-[current=page]:bg-primary/10 aria-[current=page]:text-primary aria-[current=page]:before:absolute aria-[current=page]:before:inset-y-2 aria-[current=page]:before:start-0 aria-[current=page]:before:w-1 aria-[current=page]:before:rounded-full aria-[current=page]:before:bg-primary"
              >
                <Icon className="size-4" aria-hidden />
                <span className="truncate">{title}</span>
              </li>
            ))}
          </ul>
        </aside>
        <div className="flex min-w-0 flex-1 flex-col">
          <div className="flex h-14 items-center justify-between gap-2 border-b px-3">
            <span className="truncate text-body-sm text-muted-foreground">
              ادمین › <span className="text-foreground">بخش اول</span>
            </span>
            <Button variant="outline" size="icon-sm" aria-label="اعلان‌ها">
              <BellIcon aria-hidden />
            </Button>
          </div>
          <div className="p-4 text-body-sm text-muted-foreground">
            ناحیه‌ی محتوا
          </div>
        </div>
      </div>
    </PreviewGroup>
  );
}

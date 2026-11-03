import { ArrowRightIcon, PlusIcon, SearchIcon, Trash2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { PreviewGroup, PreviewSection } from "./preview-section";

const variants = [
  { value: "default", label: "اصلی" },
  { value: "secondary", label: "ثانویه" },
  { value: "outline", label: "حاشیه‌دار" },
  { value: "ghost", label: "شفاف" },
  { value: "soft", label: "ملایم" },
  { value: "destructive", label: "حذف" },
  { value: "link", label: "پیوند" },
] as const;

const sizes = [
  { value: "xs", label: "خیلی کوچک ۳۲" },
  { value: "sm", label: "کوچک ۳۶" },
  { value: "default", label: "متوسط ۴۰" },
  { value: "lg", label: "بزرگ ۴۸" },
] as const;

export function ActionsSection() {
  return (
    <PreviewSection
      id="actions"
      title="اقدام‌ها"
    >
      <PreviewGroup title="نوع‌ها">
        <div className="flex flex-wrap gap-3">
          {variants.map((v) => (
            <Button key={v.value} variant={v.value}>{v.label}</Button>
          ))}
        </div>
      </PreviewGroup>
      <PreviewGroup title="اندازه‌ها">
        <div className="flex flex-wrap items-center gap-3">
          {sizes.map((s) => (
            <Button key={s.value} size={s.value}>{s.label}</Button>
          ))}
        </div>
      </PreviewGroup>
      <PreviewGroup title="آیکون قبل و بعد از برچسب">
        <div className="flex flex-wrap gap-3">
          <Button>
            <PlusIcon data-icon="inline-start" />
            افزودن
          </Button>
          <Button variant="outline">
            ادامه
            <ArrowRightIcon data-icon="inline-end" className="rtl:-scale-x-100" />
          </Button>
          <Button variant="destructive">
            <Trash2Icon data-icon="inline-start" />
            حذف
          </Button>
        </div>
      </PreviewGroup>
      <PreviewGroup title="فقط آیکون (با نام قابل دسترس و راهنما)">
        <div className="flex flex-wrap items-center gap-3">
          {[
            { size: "icon-sm", name: "جستجو" },
            { size: "icon", name: "جستجو" },
            { size: "icon-lg", name: "جستجو" },
          ].map((item) => (
            <Tooltip key={item.size}>
              <TooltipTrigger
                render={
                  <Button
                    variant="outline"
                    size={item.size as "icon" | "icon-sm" | "icon-lg"}
                    aria-label={item.name}
                  />
                }
              >
                <SearchIcon />
              </TooltipTrigger>
              <TooltipContent>{item.name}</TooltipContent>
            </Tooltip>
          ))}
        </div>
      </PreviewGroup>
      <PreviewGroup title="بارگذاری و غیرفعال (عرض دکمه ثابت می‌ماند)">
        <div className="flex flex-wrap gap-3">
          <Button loading>در حال ذخیره</Button>
          <Button variant="outline" loading>در حال ذخیره</Button>
          <Button disabled>غیرفعال</Button>
          <Button variant="outline" disabled>غیرفعال</Button>
        </div>
      </PreviewGroup>
      <PreviewGroup title="گروه دکمه‌ها (اقدام اصلی در سمت شروع)">
        <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4 sm:flex-row sm:items-center">
          <Button className="w-full sm:w-auto">ذخیره</Button>
          <Button variant="outline" className="w-full sm:w-auto">انصراف</Button>
        </div>
      </PreviewGroup>
    </PreviewSection>
  );
}

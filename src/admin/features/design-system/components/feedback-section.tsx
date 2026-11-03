"use client";

import { CircleCheckIcon, InboxIcon, InfoIcon, OctagonXIcon, TriangleAlertIcon } from "lucide-react";
import { toast } from "sonner";
import { EmptyState } from "@/components/shared/empty-state";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Progress, ProgressLabel, ProgressValue } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import { PreviewGroup, PreviewSection } from "./preview-section";

const alerts = [
  { variant: "default", icon: InfoIcon, title: "پیام عادی", text: "توضیح کوتاه درباره‌ی وضعیت فعلی." },
  { variant: "info", icon: InfoIcon, title: "اطلاع", text: "اطلاعاتی که خوب است بدانید." },
  { variant: "success", icon: CircleCheckIcon, title: "انجام شد", text: "کار با موفقیت پایان یافت." },
  { variant: "warning", icon: TriangleAlertIcon, title: "هشدار", text: "پیش از ادامه این مورد را بررسی کنید." },
  { variant: "destructive", icon: OctagonXIcon, title: "خطا", text: "مشکلی پیش آمد. دوباره تلاش کنید." },
] as const;

export function FeedbackSection() {
  return (
    <PreviewSection
      id="feedback"
      title="بازخورد"
    >
      <PreviewGroup title="هشدارهای درون‌صفحه">
        <div className="grid gap-3 md:grid-cols-2">
          {alerts.map(({ variant, icon: Icon, title, text }) => (
            <Alert key={variant} variant={variant}>
              <Icon />
              <AlertTitle>{title}</AlertTitle>
              <AlertDescription>{text}</AlertDescription>
            </Alert>
          ))}
        </div>
      </PreviewGroup>
      <PreviewGroup title="پیام کوتاه (Toast)">
        <div className="flex flex-wrap gap-3">
          <Button variant="outline" onClick={() => toast.success("اقدام انجام شد.")}>
            نمایش پیام موفقیت
          </Button>
          <Button variant="outline" onClick={() => toast.error("اقدام انجام نشد.")}>
            نمایش پیام خطا
          </Button>
        </div>
      </PreviewGroup>
      <PreviewGroup title="پیشرفت و بارگذاری">
        <div className="grid gap-6 md:grid-cols-2">
          <Progress value={60} locale="fa-IR" format={{ style: "percent" }}>
            <ProgressLabel>پیشرفت</ProgressLabel>
            <ProgressValue />
          </Progress>
          <div className="flex items-center gap-3">
            <Spinner className="size-5" />
            <span className="text-body-sm text-muted-foreground">در حال بارگذاری</span>
          </div>
        </div>
        <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4">
          <Skeleton className="h-6 w-1/3" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-4/5" />
        </div>
      </PreviewGroup>
      <PreviewGroup title="حالت خالی">
        <div className="rounded-xl border border-border bg-card">
          <EmptyState
            icon={<InboxIcon />}
            title="چیزی برای نمایش نیست"
            description="وقتی مورد جدیدی اضافه شود، اینجا دیده می‌شود."
            action={<Button variant="outline">اقدام بعدی</Button>}
          />
        </div>
      </PreviewGroup>
    </PreviewSection>
  );
}

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTableDemo } from "./data-table-demo";
import { TrendChartDemo } from "./trend-chart-demo";
import { PreviewGroup, PreviewSection } from "./preview-section";

const badges = [
  { variant: "default", label: "پیش‌فرض" },
  { variant: "secondary", label: "ثانویه" },
  { variant: "outline", label: "حاشیه‌دار" },
  { variant: "success", label: "موفق" },
  { variant: "warning", label: "هشدار" },
  { variant: "info", label: "اطلاع" },
  { variant: "destructive", label: "خطا" },
] as const;

export function DataDisplaySection() {
  return (
    <PreviewSection
      id="data-display"
      title="نمایش داده"
    >
      <PreviewGroup title="کارت">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>عنوان کارت</CardTitle>
            <CardDescription>توضیح کوتاه درباره‌ی محتوای کارت.</CardDescription>
          </CardHeader>
          <CardContent className="text-body-sm">محتوای نمونه برای نمایش فاصله‌ها و چیدمان.</CardContent>
        </Card>
      </PreviewGroup>
      <PreviewGroup title="نمودار روند (TrendChart)">
        <div className="rounded-xl border border-border bg-card p-4">
          <TrendChartDemo />
        </div>
      </PreviewGroup>
      <PreviewGroup title="نشان وضعیت و آواتار">
        <div className="flex flex-wrap items-center gap-3">
          {badges.map((b) => (
            <Badge key={b.variant} variant={b.variant}>{b.label}</Badge>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <Avatar size="sm"><AvatarFallback>الف</AvatarFallback></Avatar>
          <Avatar><AvatarFallback>ب</AvatarFallback></Avatar>
          <Avatar size="lg"><AvatarFallback>پ</AvatarFallback></Avatar>
        </div>
      </PreviewGroup>
      <PreviewGroup title="جدول با صفحه‌بندی و عملیات ردیف">
        <DataTableDemo />
      </PreviewGroup>
    </PreviewSection>
  );
}

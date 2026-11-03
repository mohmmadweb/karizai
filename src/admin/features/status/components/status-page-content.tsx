"use client";

import { useEffect, useState } from "react";
import { CircleAlertIcon, CircleCheckIcon, TriangleAlertIcon, WifiOffIcon } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { MeterBar } from "@/admin/features/budgets/components/meter-bar";
import { formatNumber } from "@/admin/lib/format";
import { useDemoFlags } from "@/lib/demo-flags";
import { getComponents, getIncidents, SLA_TARGET, type ComponentState } from "../data/status";
import { UptimeHistory } from "./uptime-history";

const stateView: Record<ComponentState, { label: string; variant: "success" | "warning" | "destructive"; Icon: typeof CircleCheckIcon }> = {
  up: { label: "سالم", variant: "success", Icon: CircleCheckIcon },
  degraded: { label: "کند", variant: "warning", Icon: TriangleAlertIcon },
  down: { label: "قطع", variant: "destructive", Icon: CircleAlertIcon },
};

const CAPACITY = 400;

const offlineStatus = [
  ["مدل‌های داخلی (Qwen و Llama)", "کار می‌کند"],
  ["مدل‌های بیرونی و جست‌وجوی وب", "در دسترس نیست"],
  ["داده، اسناد و اتصال‌های داخلی", "کار می‌کند"],
  ["عامل‌ها", "با مدل داخلی کار می‌کنند"],
  ["API سازمانی و وب‌هوک‌های داخلی", "کار می‌کند"],
] as const;

/** Health of every part, live concurrent users, monthly SLA history, incidents, and the internet-cut simulation. */
export function StatusPageContent() {
  const { offline, setOffline } = useDemoFlags();
  const [concurrent, setConcurrent] = useState(138);
  useEffect(() => {
    const timer = setInterval(() => setConcurrent((c) => Math.max(90, Math.min(220, c + Math.round((Math.random() - 0.48) * 12)))), 2000);
    return () => clearInterval(timer);
  }, []);
  const components = getComponents().map((c) => (offline && c.external ? { ...c, state: "down" as const, note: "اینترنت بین‌الملل قطع است" } : c));
  const down = components.filter((c) => c.state !== "up").length;

  return (
    <div className="flex flex-col gap-8">
      <PageHeader title="وضعیت و SLA" description={`وضعیت اجزای سامانه، کاربران هم‌زمان و تاریخچه‌ی دسترس‌پذیری در برابر تعهد ${formatNumber(SLA_TARGET)}٪.`} />
      <div className="flex flex-col gap-1 rounded-xl border border-border bg-card p-4">
        <label className="flex items-center gap-3 text-label">
          <Switch checked={offline} onCheckedChange={(checked) => setOffline(checked)} aria-label="شبیه‌سازی قطع اینترنت" />
          شبیه‌سازی قطع اینترنت
        </label>
        <p className="text-body-sm text-muted-foreground">پنل کاربر هم در همین بازدید واکنش نشان می‌دهد. با تازه‌کردن صفحه خاموش می‌شود.</p>
      </div>
      {offline ? (
        <Alert variant="warning">
          <WifiOffIcon aria-hidden />
          <AlertTitle>اینترنت بین‌الملل قطع است؛ درخواست‌ها خودکار به مدل‌های داخلی می‌روند</AlertTitle>
          <AlertDescription>
            <ul className="mt-2 grid gap-1 sm:grid-cols-2">
              {offlineStatus.map(([what, state]) => <li key={what}><span className="font-medium">{what}:</span> {state}</li>)}
            </ul>
          </AlertDescription>
        </Alert>
      ) : null}
      <div className="grid gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader><CardTitle>کاربران هم‌زمان الان</CardTitle></CardHeader>
          <CardContent className="flex flex-col gap-3">
            <p className="text-h2 tabular-nums" aria-live="polite">{formatNumber(concurrent)}<span className="text-body text-muted-foreground"> از ظرفیت {formatNumber(CAPACITY)}</span></p>
            <MeterBar value={concurrent} max={CAPACITY} label="کاربران هم‌زمان در برابر ظرفیت" />
            <p className="text-caption text-muted-foreground">بیشینه‌ی امروز ۲۰۷ نفر (ساعت ۱۰:۳۰). ظرفیت با دو کارت GPU و درگاه فعلی.</p>
          </CardContent>
        </Card>
        <Card className="lg:col-span-2">
          <CardHeader><CardTitle>تعهد سطح خدمت (SLA)</CardTitle></CardHeader>
          <CardContent>
            <ul className="grid gap-2 text-body-sm sm:grid-cols-2">
              <li>دسترس‌پذیری ماهانه: <b className="tabular-nums">{formatNumber(SLA_TARGET)}٪</b> (حداکثر حدود ۳ ساعت و ۳۸ دقیقه قطعی در ماه)</li>
              <li>پاسخ به حادثه‌ی بحرانی: <b>۳۰ دقیقه</b>؛ رفع: <b>۴ ساعت</b></li>
              <li>پنجره‌ی نگهداری: پنجشنبه‌ها ۲۲ تا ۲۴، با اعلام ۴۸ ساعت قبل</li>
              <li>هنگام قطع اینترنت بین‌الملل، سامانه با مدل‌های داخلی در دسترس می‌ماند</li>
            </ul>
          </CardContent>
        </Card>
      </div>
      <section className="flex flex-col gap-3" aria-label="اجزای سامانه">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-h3">اجزای سامانه</h2>
          {down > 0 ? <Badge variant="warning">{formatNumber(down)} جزء کند یا قطع</Badge> : <Badge variant="success">همه سالم‌اند</Badge>}
        </div>
        <ul className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {components.map((c) => {
            const v = stateView[c.state];
            return (
              <li key={c.id} className="flex flex-col gap-1 rounded-xl border border-border bg-card p-4">
                <div className="flex items-start justify-between gap-2">
                  <span className="font-medium">{c.name}</span>
                  <Badge variant={v.variant}><v.Icon aria-hidden />{v.label}</Badge>
                </div>
                <span className="text-caption text-muted-foreground">{c.group}{c.external ? " · بیرونی" : " · داخل شبکه‌ی سازمان"} · {c.note}</span>
              </li>
            );
          })}
        </ul>
      </section>
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>دسترس‌پذیری ۱۲ ماه گذشته</CardTitle></CardHeader>
          <CardContent><UptimeHistory /></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>حادثه‌های اخیر</CardTitle></CardHeader>
          <CardContent>
            <ul className="flex flex-col divide-y divide-border">
              {getIncidents().map((i) => (
                <li key={i.id} className="flex flex-col gap-1 py-3 first:pt-0">
                  <span className="flex flex-wrap items-center gap-2"><span className="tabular-nums text-caption text-muted-foreground">{i.date}</span><span className="font-medium">{i.title}</span></span>
                  <span className="text-body-sm text-muted-foreground">مدت: {i.duration} · {i.impact} · <Badge variant="secondary">رفع شد</Badge></span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

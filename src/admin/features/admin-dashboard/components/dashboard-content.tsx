"use client";

import { useMemo, useState } from "react";
import { SlidersHorizontalIcon } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useDataSources } from "@/admin/features/data-sources/hooks/use-data-sources";
import { useDocuments } from "@/admin/features/documents/hooks/use-documents";
import { useModels } from "@/admin/features/models/hooks/use-models";
import { getReportNow, getUsageRecords } from "@/admin/features/usage-report/data/usage-records";
import { bindToModels, inRange } from "@/admin/features/usage-report/lib/aggregate";
import { resolvePeriod } from "@/admin/features/usage-report/lib/periods";
import { simulateRequest } from "@/lib/simulate-request";
import { getAgentRuns, getComparisonTasks, getDefaultThresholds, getPeriodFigures, getSeededComponents } from "../data/telemetry";
import { computeAlerts } from "../lib/alerts";
import { buildCredits } from "../lib/credits";
import { buildComponents, countByStatus, isOffline, overallStatus } from "../lib/health";
import { keyFigures } from "../lib/kpi";
import { modelSpeeds } from "../lib/model-speed";
import { hourlyLoad } from "../lib/peak";
import type { DashboardPeriod, Thresholds } from "../types";
import { AgentPerformance } from "./agent-performance";
import { AlertsSection } from "./alerts-section";
import { ComparisonTable } from "./comparison-table";
import { DashboardSection } from "./dashboard-section";
import { HealthGrid } from "./health-grid";
import { KeyFigures } from "./key-figures";
import { ModelSpeedTable } from "./model-speed-table";
import { OfflinePanel } from "./offline-panel";
import { PeakHours } from "./peak-hours";
import { ProviderCredits } from "./provider-credits";
import { StatusBanner } from "./status-banner";
import { ThresholdsDialog } from "./thresholds-dialog";

const now = getReportNow();
const periods: { id: DashboardPeriod; label: string }[] = [
  { id: "today", label: "امروز" },
  { id: "week", label: "هفته" },
  { id: "month", label: "ماه" },
];

export function DashboardContent() {
  const { providers, models } = useModels();
  const { sources: dataSources } = useDataSources();
  const { sources: fileSources } = useDocuments();
  const [period, setPeriod] = useState<DashboardPeriod>("month");
  const [thresholds, setThresholds] = useState<Thresholds>(getDefaultThresholds);
  const [thresholdsOpen, setThresholdsOpen] = useState(false);
  const [checks, setChecks] = useState<Record<string, number | undefined>>({});
  const [checking, setChecking] = useState<Record<string, boolean | undefined>>({});

  const view = useMemo(() => {
    const all = bindToModels(getUsageRecords(), models);
    const records = inRange(all, resolvePeriod(period, { from: "", to: "" }, now)!);
    const components = buildComponents({
      providers, models, dataSources, fileSources, seeded: getSeededComponents(), nowIso: now,
    });
    const speeds = modelSpeeds(models, providers, period);
    const figures = keyFigures(records, models, components, period);
    return {
      components,
      speeds,
      figures,
      hours: hourlyLoad(records),
      credits: buildCredits({ providers, models, records: all, checks, nowIso: now }),
      alerts: computeAlerts({
        components, speeds, errorRate: getPeriodFigures(period).errorRate, thresholds, nowIso: now,
      }),
    };
  }, [providers, models, dataSources, fileSources, period, thresholds, checks]);

  async function checkAgain(providerId: string) {
    setChecking((c) => ({ ...c, [providerId]: true }));
    await simulateRequest(1000);
    setChecks((c) => ({ ...c, [providerId]: (c[providerId] ?? 0) + 1 }));
    setChecking((c) => ({ ...c, [providerId]: false }));
  }

  const counts = countByStatus(view.components);
  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-4">
        <p className="text-body-sm text-muted-foreground">وضعیت سامانه، سرعت مدل‌ها و ایجنت‌ها و هشدارها را یک‌جا ببینید.</p>
        <Tabs value={period} onValueChange={(v) => setPeriod(v as DashboardPeriod)}>
          <TabsList aria-label="بازه‌ی زمانی">
            {periods.map((p) => <TabsTrigger key={p.id} value={p.id}>{p.label}</TabsTrigger>)}
          </TabsList>
        </Tabs>
      </div>
      <div className="flex flex-col gap-4">
        <StatusBanner status={overallStatus(view.components)} {...counts} />
        <OfflinePanel offline={isOffline(providers, models)} />
      </div>
      <KeyFigures figures={view.figures} />
      <DashboardSection title="سلامت اجزا" description="وضعیت هر جزء با تأخیر میانه و صدک ۹۵ و زمان آخرین بررسی.">
        <HealthGrid components={view.components} />
      </DashboardSection>
      <DashboardSection title="سرعت مدل‌ها" description="مدل‌های فعال با زمان تا اولین کلمه، سرعت تولید و زمان کامل درخواست.">
        <ModelSpeedTable speeds={view.speeds} hasEnabledModel={models.some((m) => m.enabled)} />
      </DashboardSection>
      <DashboardSection title="عملکرد ایجنت‌ها" description="میانگین زمان اجرا و سهم هر مرحله؛ کندترین مرحله گلوگاه است.">
        <AgentPerformance agents={getAgentRuns()} />
      </DashboardSection>
      <DashboardSection title="ساعات اوج" description="بار و تأخیر در ساعت‌های شبانه‌روز برای بازه‌ی انتخاب‌شده.">
        <PeakHours hours={view.hours} />
      </DashboardSection>
      <DashboardSection title="مقایسه‌ی اجرای مستقیم و چندایجنتی" description="هزینه، توکن، دقت و زمان پاسخ برای چند نوع کار.">
        <ComparisonTable tasks={getComparisonTasks()} />
      </DashboardSection>
      <DashboardSection title="اعتبار تأمین‌کننده‌ها" description="مصرف طبق گزارش تأمین‌کننده در برابر مصرف ثبت‌شده‌ی سامانه.">
        <ProviderCredits credits={view.credits} checking={checking} onCheck={checkAgain} />
      </DashboardSection>
      <DashboardSection
        title="هشدارها"
        description="جزء قطع، تأخیر از آستانه گذشته و نرخ خطای بالا."
        action={
          <Button variant="outline" onClick={() => setThresholdsOpen(true)}>
            <SlidersHorizontalIcon data-icon="inline-start" aria-hidden />
            تنظیم آستانه‌ها
          </Button>
        }
      >
        <AlertsSection alerts={view.alerts} />
      </DashboardSection>
      <ThresholdsDialog
        open={thresholdsOpen}
        thresholds={thresholds}
        onOpenChange={setThresholdsOpen}
        onSave={(next) => {
          setThresholds(next);
          setThresholdsOpen(false);
          toast.success("آستانه‌ها ذخیره شد.");
        }}
      />
    </div>
  );
}

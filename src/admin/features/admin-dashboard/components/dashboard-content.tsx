"use client";

import { useId, useMemo, useState } from "react";
import { ChevronDownIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useDataSources } from "@/admin/features/data-sources/hooks/use-data-sources";
import { useDocuments } from "@/admin/features/documents/hooks/use-documents";
import { useModels } from "@/admin/features/models/hooks/use-models";
import { getReportNow, getUsageRecords } from "@/admin/features/usage-report/data/usage-records";
import { bindToModels, inRange } from "@/admin/features/usage-report/lib/aggregate";
import { resolvePeriod } from "@/admin/features/usage-report/lib/periods";
import { simulateRequest } from "@/lib/simulate-request";
import { getSeededComponents } from "../data/telemetry";
import { buildCredits } from "../lib/credits";
import { buildComponents, countByStatus, isOffline, overallStatus } from "../lib/health";
import { keyFigures } from "../lib/kpi";
import { modelSpeeds } from "../lib/model-speed";
import type { DashboardPeriod } from "../types";
import { DashboardSection } from "./dashboard-section";
import { HealthGrid } from "./health-grid";
import { KeyFigures } from "./key-figures";
import { ModelSpeedTable } from "./model-speed-table";
import { OfflinePanel } from "./offline-panel";
import { ProviderCredits } from "./provider-credits";
import { StatusBanner } from "./status-banner";

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
  const [open, setOpen] = useState(false);
  const bodyId = useId();
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
      credits: buildCredits({ providers, models, records: all, checks, nowIso: now }),
    };
  }, [providers, models, dataSources, fileSources, period, checks]);

  async function checkAgain(providerId: string) {
    setChecking((c) => ({ ...c, [providerId]: true }));
    await simulateRequest(1000);
    setChecks((c) => ({ ...c, [providerId]: (c[providerId] ?? 0) + 1 }));
    setChecking((c) => ({ ...c, [providerId]: false }));
  }

  const counts = countByStatus(view.components);
  return (
    <section aria-labelledby="system-health-title" className="flex flex-col gap-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex flex-col gap-1">
          <h2 id="system-health-title" className="text-h3 text-foreground">سلامت سامانه و مدل‌ها</h2>
          <p className="text-body-sm text-muted-foreground">سلامت اجزا، سرعت مدل‌ها و تطبیق اعتبار تأمین‌کننده‌ها.</p>
        </div>
        <Button variant="outline" aria-expanded={open} aria-controls={bodyId} onClick={() => setOpen((o) => !o)}>
          <ChevronDownIcon data-icon="inline-start" aria-hidden className={open ? "rotate-180" : undefined} />
          {open ? "پنهان‌کردن جزئیات" : "نمایش جزئیات"}
        </Button>
      </div>
      <div className="flex flex-col gap-4">
        <StatusBanner status={overallStatus(view.components)} {...counts} />
        <OfflinePanel offline={isOffline(providers, models)} />
      </div>
      <div id={bodyId} hidden={!open} className="flex flex-col gap-10 pt-4">
        <Tabs value={period} onValueChange={(v) => setPeriod(v as DashboardPeriod)}>
          <TabsList aria-label="بازه‌ی زمانی سلامت سامانه">
            {periods.map((p) => <TabsTrigger key={p.id} value={p.id}>{p.label}</TabsTrigger>)}
          </TabsList>
        </Tabs>
        <KeyFigures figures={view.figures} />
        <DashboardSection title="سلامت اجزا" description="وضعیت هر جزء با تأخیر میانه و صدک ۹۵ و زمان آخرین بررسی.">
          <HealthGrid components={view.components} />
        </DashboardSection>
        <DashboardSection title="سرعت مدل‌ها" description="مدل‌های فعال با زمان تا اولین کلمه، سرعت تولید و زمان کامل درخواست.">
          <ModelSpeedTable speeds={view.speeds} hasEnabledModel={models.some((m) => m.enabled)} />
        </DashboardSection>
        <DashboardSection title="اعتبار تأمین‌کننده‌ها" description="مصرف طبق گزارش تأمین‌کننده در برابر مصرف ثبت‌شده‌ی سامانه.">
          <ProviderCredits credits={view.credits} checking={checking} onCheck={checkAgain} />
        </DashboardSection>
      </div>
    </section>
  );
}

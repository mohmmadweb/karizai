"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { PencilIcon, ZapIcon } from "lucide-react";
import { DataTable } from "@/admin/components/shared/data-table/data-table";
import type { DataTableColumn } from "@/admin/components/shared/data-table/types";
import { PageHeader } from "@/components/shared/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MeterBar } from "@/admin/features/budgets/components/meter-bar";
import { useModels } from "@/admin/features/models/hooks/use-models";
import { formatNumber } from "@/admin/lib/format";
import { defaultLimits, getSampleEvents, limitKeys, shortLabels, startingLoad, type Limits, type ThrottleEvent } from "../data/limits";
import { useLiveLoad } from "../hooks/use-live-load";
import { LimitsDialog } from "./limits-dialog";

type Row = { id: string; name: string; hint: string; kind: "provider" | "model"; selfHosted: boolean };

const clock = () => new Intl.DateTimeFormat("fa-IR", { hour: "2-digit", minute: "2-digit" }).format(new Date());

/** RPM, RPD, TPM and parallel limits per provider and model, with simulated live usage and throttle events. */
export function LimitsPageContent() {
  const { providers, models } = useModels();
  const rows = useMemo<Row[]>(() => [
    ...providers.map((p) => ({ id: p.id, name: p.name, hint: "ارائه‌دهنده", kind: "provider" as const, selfHosted: models.some((m) => m.providerId === p.id && m.selfHosted) })),
    ...models.filter((m) => m.enabled).map((m) => ({ id: m.id, name: m.displayName, hint: providers.find((p) => p.id === m.providerId)?.name ?? "", kind: "model" as const, selfHosted: m.selfHosted })),
  ], [providers, models]);
  const [custom, setCustom] = useState<Record<string, Limits>>({});
  const [editing, setEditing] = useState<Row | null>(null);
  const [peak, setPeak] = useState(false);
  const [events, setEvents] = useState<ThrottleEvent[]>(getSampleEvents);
  const start = useCallback((i: number) => startingLoad(i), []);
  const load = useLiveLoad(rows.map((r) => r.id), start, peak);
  const limitsOf = (r: Row) => custom[r.id] ?? defaultLimits(r.kind, r.selfHosted);
  const seen = useRef(new Set<string>());

  useEffect(() => {
    if (!peak) { seen.current.clear(); return; }
    const fresh: ThrottleEvent[] = [];
    for (const r of rows) {
      for (const k of limitKeys) {
        const tag = `${r.id}-${k}`;
        if ((load[r.id]?.[k] ?? 0) >= 1 && !seen.current.has(tag)) {
          seen.current.add(tag);
          fresh.push({ id: `${tag}-${Date.now()}`, at: clock(), target: r.name, limit: k, action: r.selfHosted ? "درخواست‌های اضافه در صف GPU ماندند" : "پاسخ ۴۲۹؛ درخواست‌ها به Qwen داخلی رفتند" });
        }
      }
    }
    if (fresh.length) setEvents((list) => [...fresh, ...list].slice(0, 20));
  }, [load, peak, rows]);

  function simulatePeak() {
    setPeak(true);
    setTimeout(() => setPeak(false), 9000);
  }

  const meter = (r: Row, k: (typeof limitKeys)[number]) => {
    const limit = limitsOf(r)[k];
    const used = Math.round((load[r.id]?.[k] ?? 0) * limit);
    return (
      <span className="flex min-w-24 flex-col gap-1">
        <MeterBar value={used} max={limit} label={`${shortLabels[k]} ${r.name}`} warnAt={0.85} />
        <span className="text-caption tabular-nums text-muted-foreground">{formatNumber(Math.min(used, limit))} / {formatNumber(limit)}</span>
      </span>
    );
  };
  const columns: DataTableColumn<Row>[] = [
    { id: "name", header: "نام", cell: (r) => <span className="flex flex-col"><span className="font-medium">{r.name}</span><span className="text-caption text-muted-foreground">{r.hint}{r.selfHosted ? " · داخلی" : ""}</span></span> },
    ...limitKeys.map((k) => ({ id: k, header: shortLabels[k], cell: (r: Row) => meter(r, k) })),
  ];
  const table = (kind: Row["kind"]) => (
    <DataTable
      label={kind === "model" ? "محدودیت مدل‌ها" : "محدودیت ارائه‌دهنده‌ها"}
      rows={rows.filter((r) => r.kind === kind)}
      columns={columns}
      getRowId={(r) => r.id}
      getRowLabel={(r) => r.name}
      getRowActions={(r) => [[{ label: "ویرایش حدها", icon: <PencilIcon aria-hidden />, inline: true, onSelect: () => setEditing(r) }]]}
      hidePagerWhenSingle
    />
  );

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="محدودیت نرخ"
        description="حد درخواست و توکن در دقیقه و روز و تعداد درخواست هم‌زمان برای هر ارائه‌دهنده و مدل. اعداد مصرف لحظه‌ای‌اند."
        action={<Button variant="outline" disabled={peak} onClick={simulatePeak}><ZapIcon aria-hidden />{peak ? "اوج بار در جریان است…" : "شبیه‌سازی اوج بار"}</Button>}
      />
      <Tabs defaultValue="model">
        <TabsList>
          <TabsTrigger value="model">مدل‌ها</TabsTrigger>
          <TabsTrigger value="provider">ارائه‌دهنده‌ها</TabsTrigger>
        </TabsList>
        <TabsContent value="model" className="pt-4">{table("model")}</TabsContent>
        <TabsContent value="provider" className="pt-4">{table("provider")}</TabsContent>
      </Tabs>
      <Card>
        <CardHeader><CardTitle>رویدادهای محدودسازی</CardTitle></CardHeader>
        <CardContent>
          <ul className="flex flex-col divide-y divide-border" aria-live="polite">
            {events.map((e) => (
              <li key={e.id} className="flex flex-wrap items-center gap-x-3 gap-y-1 py-2 text-body-sm">
                <span className="tabular-nums text-muted-foreground">{e.at}</span>
                <span className="font-medium">{e.target}</span>
                <Badge variant="warning">{shortLabels[e.limit]} پر شد</Badge>
                <span className="text-muted-foreground">{e.action}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
      <LimitsDialog
        target={editing ? { id: editing.id, name: editing.name, limits: limitsOf(editing) } : null}
        onOpenChange={(open) => { if (!open) setEditing(null); }}
        onSave={(id, limits) => setCustom((c) => ({ ...c, [id]: limits }))}
      />
    </div>
  );
}

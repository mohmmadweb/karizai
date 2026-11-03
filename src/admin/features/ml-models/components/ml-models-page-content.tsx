"use client";

import { useState } from "react";
import { FlaskConicalIcon, PlusIcon } from "lucide-react";
import { toast } from "sonner";
import { DataTable } from "@/admin/components/shared/data-table/data-table";
import type { DataTableColumn } from "@/admin/components/shared/data-table/types";
import { PageHeader } from "@/components/shared/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getMlModels, type MlModel, type SchemaField } from "../data/ml-models";
import { FineTuneTab } from "./fine-tune-tab";
import { MlRegisterDialog } from "./ml-register-dialog";
import { MlTestDialog } from "./ml-test-dialog";

const schema = (fields: SchemaField[]) => <span className="flex flex-wrap gap-1">{fields.map((f) => <Badge key={f.name} variant="outline" title={f.label}><bdi dir="ltr">{f.name}: {f.type}</bdi></Badge>)}</span>;

/** Prediction and optimization models as endpoints, and the organization's own fine-tuned models. */
export function MlModelsPageContent() {
  const [models, setModels] = useState(getMlModels);
  const [testing, setTesting] = useState<MlModel | null>(null);
  const [registering, setRegistering] = useState(false);
  const columns: DataTableColumn<MlModel>[] = [
    { id: "name", header: "مدل", cell: (m) => <span className="flex flex-col gap-0.5"><span className="font-medium">{m.name}</span><bdi dir="ltr" className="max-w-64 truncate text-caption text-muted-foreground">{m.endpoint}</bdi></span> },
    { id: "owner", header: "واحد مالک", cell: (m) => <span className="flex flex-col"><span>{m.ownerUnit}</span><span className="text-caption text-muted-foreground">{m.framework}</span></span> },
    { id: "input", header: "ورودی", hideBelow: "lg", cell: (m) => schema(m.input) },
    { id: "output", header: "خروجی", hideBelow: "xl", cell: (m) => schema(m.output) },
  ];
  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="مدل‌های یادگیری ماشین"
        description="مدل‌های پیش‌بینی و بهینه‌سازی سازمان را با ورودی و خروجی مشخص ثبت کنید تا عامل‌ها و جریان‌ها از خروجی عددی‌شان استفاده کنند."
        action={<Button onClick={() => setRegistering(true)}><PlusIcon aria-hidden />ثبت مدل</Button>}
      />
      <Tabs defaultValue="endpoints">
        <TabsList>
          <TabsTrigger value="endpoints">مدل‌های پیش‌بینی و بهینه‌سازی</TabsTrigger>
          <TabsTrigger value="fine-tune">مدل‌های اختصاصی (Fine-tune)</TabsTrigger>
        </TabsList>
        <TabsContent value="endpoints" className="pt-4">
          <DataTable
            label="مدل‌های یادگیری ماشین"
            rows={models}
            columns={columns}
            getRowId={(m) => m.id}
            getRowLabel={(m) => m.name}
            getRowActions={(m) => [[{ label: "آزمون", icon: <FlaskConicalIcon aria-hidden />, inline: true, onSelect: () => setTesting(m) }], [{ label: "حذف", destructive: true, onSelect: () => setModels((l) => l.filter((x) => x.id !== m.id)), confirm: { title: `«${m.name}» حذف شود؟`, description: "جریان‌هایی که از این مدل استفاده می‌کنند دیگر خروجی آن را نمی‌گیرند.", confirmLabel: "حذف" } }]]}
            hidePagerWhenSingle
          />
        </TabsContent>
        <TabsContent value="fine-tune" className="pt-4"><FineTuneTab /></TabsContent>
      </Tabs>
      <MlTestDialog model={testing} onOpenChange={(open) => { if (!open) setTesting(null); }} />
      <MlRegisterDialog open={registering} onOpenChange={setRegistering} onCreate={(m) => { setModels((l) => [...l, m]); toast.success("مدل ثبت شد؛ آن را آزمون کنید."); }} />
    </div>
  );
}

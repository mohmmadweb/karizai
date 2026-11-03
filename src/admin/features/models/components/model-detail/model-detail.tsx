"use client";

import { BackLink } from "@/components/shared/back-link";
import { EntityNotFound } from "@/components/shared/entity-not-found";
import { PageHeader } from "@/components/shared/page-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useModels } from "../../hooks/use-models";
import { isNewModel, isSetAside, providerOf } from "../../lib/selectors";
import { formatDate } from "@/admin/lib/format";
import { ModelFlags } from "../models/model-badges";
import { ModelEnabledSwitch } from "../models/model-enabled-switch";
import { ModelAccessTab } from "./model-access-tab";
import { ModelInfoTab } from "./model-info-tab";

export function ModelDetail({ modelId }: { modelId: string }) {
  const { models, providers } = useModels();
  const model = models.find((m) => m.id === modelId);

  if (!model) {
    return (
      <div className="flex flex-col gap-8">
        <BackLink href="/admin/models">بازگشت به مدل‌ها</BackLink>
        <EntityNotFound title="مدل پیدا نشد" backHref="/admin/models" backLabel="بازگشت به مدل‌ها" />
      </div>
    );
  }

  const provider = providerOf(model, providers);
  // Toggling «فعال» must not reset unsaved edits, so it is left out of the key.
  const { enabled: _enabled, ...editable } = model;
  void _enabled;
  return (
    <div className="flex flex-col gap-6">
      <BackLink href="/admin/models">بازگشت به مدل‌ها</BackLink>
      <PageHeader
        title={
          <span className="flex flex-wrap items-center gap-3">
            {model.displayName}
            <ModelFlags selfHosted={model.selfHosted} setAside={isSetAside(model, providers)} isNew={isNewModel(model)} />
          </span>
        }
        description={`ارائه‌دهنده: ${provider?.name ?? "—"}${model.releasedAt ? ` · انتشار: ${formatDate(model.releasedAt, { dateStyle: "medium" })}` : ""}`}
        action={<ModelEnabledSwitch model={model} />}
      />
      <Tabs defaultValue="info">
        <TabsList>
          <TabsTrigger value="info">اطلاعات</TabsTrigger>
          <TabsTrigger value="access">دسترسی</TabsTrigger>
        </TabsList>
        <TabsContent value="info" className="pt-4">
          <ModelInfoTab key={JSON.stringify(editable)} model={model} />
        </TabsContent>
        <TabsContent value="access" className="pt-4">
          <ModelAccessTab model={model} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

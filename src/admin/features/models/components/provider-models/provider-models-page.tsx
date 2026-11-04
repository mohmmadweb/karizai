"use client";

import { useState } from "react";
import { notFound } from "next/navigation";
import { BotIcon, RefreshCwIcon, SearchXIcon } from "lucide-react";
import { BackLink } from "@/components/shared/back-link";
import { EmptyState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";
import { SearchField } from "@/components/shared/search-field";
import { Button } from "@/components/ui/button";
import { useModels } from "../../hooks/use-models";
import { modelsOfProvider } from "../../lib/selectors";
import { ProviderStatusBadge } from "../models/model-badges";
import { ProviderModelsTable } from "./provider-models-table";
import { ProviderSyncField } from "./provider-sync-field";

export function ProviderModelsPage({ providerId }: { providerId: string }) {
  const { providers, models, fetchStatus, fetchModels } = useModels();
  const [query, setQuery] = useState("");
  const provider = providers.find((item) => item.id === providerId);
  if (!provider) notFound();

  const all = modelsOfProvider(provider.id, models);
  const needle = query.trim().toLowerCase();
  const visible = needle ? all.filter((model) => model.displayName.toLowerCase().includes(needle)) : all;
  const fetching = fetchStatus[provider.id] === "fetching";

  return (
    <div className="flex flex-col gap-8">
      <BackLink href="/admin/models">بازگشت به ارائه‌دهنده‌ها</BackLink>
      <PageHeader
        title={provider.name}
        description={
          <span className="flex flex-wrap items-center gap-3">
            <ProviderStatusBadge status={provider.status} />
            <bdi dir="ltr" className="font-mono">{provider.baseUrl}</bdi>
          </span>
        }
        action={
          <Button variant="outline" loading={fetching} onClick={() => void fetchModels(provider.id, provider.baseUrl)}>
            <RefreshCwIcon aria-hidden />
            به‌روزرسانی فهرست مدل‌ها
          </Button>
        }
      />
      <ProviderSyncField provider={provider} />
      {all.length === 0 ? (
        <EmptyState icon={<BotIcon />} title="هنوز مدلی دریافت نشده" description="فهرست مدل‌ها را از این ارائه‌دهنده به‌روز کنید." />
      ) : (
        <div className="flex flex-col gap-4">
          <SearchField label="جست‌وجوی مدل‌ها" placeholder="جست‌وجو بر اساس نام مدل" value={query} onValueChange={setQuery} />
          {visible.length === 0 ? (
            <EmptyState
              icon={<SearchXIcon />}
              title="مدلی پیدا نشد"
              description="نام دیگری را امتحان کنید."
              action={<Button variant="outline" onClick={() => setQuery("")}>پاک‌کردن جست‌وجو</Button>}
            />
          ) : (
            <ProviderModelsTable models={visible} setAside={provider.status === "unavailable"} />
          )}
        </div>
      )}
    </div>
  );
}

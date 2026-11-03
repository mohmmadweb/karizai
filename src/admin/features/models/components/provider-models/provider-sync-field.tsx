"use client";

import { toast } from "sonner";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatDateTime } from "@/admin/lib/format";
import { useModels } from "../../hooks/use-models";
import { nextSyncAt, syncLabels } from "../../lib/selectors";
import type { ModelProvider, SyncInterval } from "../../types";

const items = (Object.keys(syncLabels) as SyncInterval[]).map((value) => ({ value, label: syncLabels[value] }));

/** How often the models list is fetched again on its own; new versions then show up with the «جدید» badge. */
export function ProviderSyncField({ provider }: { provider: ModelProvider }) {
  const { setProviderSync } = useModels();
  const next = nextSyncAt(provider);
  return (
    <Field className="max-w-sm">
      <FieldLabel htmlFor="provider-sync">همگام‌سازی زمان‌بندی‌شده</FieldLabel>
      <Select items={items} value={provider.syncEvery ?? "off"} onValueChange={(value) => { if (value) { setProviderSync(provider.id, value as SyncInterval); toast.success("زمان‌بندی همگام‌سازی ذخیره شد."); } }}>
        <SelectTrigger id="provider-sync" className="w-full"><SelectValue /></SelectTrigger>
        <SelectContent><SelectGroup>{items.map((item) => <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>)}</SelectGroup></SelectContent>
      </Select>
      <FieldDescription>
        {provider.lastFetchedAt ? `آخرین دریافت: ${formatDateTime(provider.lastFetchedAt)}` : "فهرست مدل‌ها هنوز دریافت نشده است."}
        {next ? ` · بعدی: ${formatDateTime(next)}` : ""}
      </FieldDescription>
    </Field>
  );
}

"use client";

import { useState } from "react";
import { DatabaseZapIcon, RefreshCwIcon } from "lucide-react";
import { toast } from "sonner";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { useDataSources } from "../../hooks/use-data-sources";
import type { DataSource } from "../../types";
import { StructureTableCard } from "./structure-table-card";

const clean = (map: Record<string, string>) =>
  JSON.stringify(Object.entries(map).filter(([, v]) => v.trim()).sort());

export function StructureTab({ source, onGoToInfo }: { source: DataSource; onGoToInfo: () => void }) {
  const { schemas, descriptions, saveDescriptions, refetchSchema, fetchingSchema } = useDataSources();
  const tables = schemas[source.id];
  const saved = descriptions[source.id] ?? {};
  const [draft, setDraft] = useState<Record<string, string>>(saved);
  const unchanged = clean(draft) === clean(saved);

  if (!tables) {
    return (
      <EmptyState
        icon={<DatabaseZapIcon />}
        title="ابتدا اتصال را آزمایش کنید"
        description="ساختار انبار داده بعد از یک آزمایش موفق خوانده می‌شود."
        action={<Button variant="outline" onClick={onGoToInfo}>رفتن به آزمایش اتصال</Button>}
      />
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center gap-3">
        <Button
          disabled={unchanged}
          onClick={() => {
            saveDescriptions(
              source.id,
              Object.fromEntries(Object.entries(draft).filter(([, v]) => v.trim())),
            );
            toast.success("توضیح‌ها ذخیره شد.");
          }}
        >
          ذخیره‌ی توضیح‌ها
        </Button>
        <Button
          variant="outline"
          loading={Boolean(fetchingSchema[source.id])}
          onClick={async () => {
            await refetchSchema(source.id);
            toast.success("ساختار انبار داده به‌روز شد.");
          }}
        >
          <RefreshCwIcon aria-hidden />
          دریافت دوباره‌ی ساختار
        </Button>
      </div>
      <ul className="flex flex-col gap-3">
        {tables.map((table) => (
          <StructureTableCard
            key={table.id}
            table={table}
            draft={draft}
            onChange={(key, value) => setDraft((d) => ({ ...d, [key]: value }))}
          />
        ))}
      </ul>
    </div>
  );
}

"use client";

import Link from "next/link";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import { formatNumber } from "@/admin/lib/format";
import { useModels } from "../../hooks/use-models";
import type { ModelProvider } from "../../types";

/** Model count plus the progress or failure of receiving the models list. */
export function ProviderModelsCell({ provider, count }: { provider: ModelProvider; count: number }) {
  const { fetchStatus, fetchModels } = useModels();
  const status = fetchStatus[provider.id];

  if (status === "fetching")
    return (
      <span className="flex items-center gap-2 text-body-sm text-muted-foreground" role="status">
        <Spinner aria-hidden />
        در حال دریافت فهرست مدل‌ها
      </span>
    );
  return (
    <span className="flex flex-col items-start gap-1">
      <Link href={`/admin/models/provider/${provider.id}`} className="rounded-sm underline-offset-4 outline-none hover:underline focus-visible:ring-3 focus-visible:ring-ring/50">
        {formatNumber(count)} مدل
      </Link>
      {status === "error" ? (
        <span className="flex flex-wrap items-center gap-2 text-body-sm text-destructive" role="alert">
          فهرست مدل‌ها دریافت نشد.
          <Button
            variant="outline"
            size="xs"
            onClick={() => void fetchModels(provider.id, provider.baseUrl)}
          >
            تلاش دوباره
            <span className="sr-only"> برای {provider.name}</span>
          </Button>
        </span>
      ) : null}
    </span>
  );
}

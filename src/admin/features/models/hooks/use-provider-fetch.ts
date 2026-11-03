"use client";

import { useState } from "react";
import { toast } from "sonner";
import { formatNumber } from "@/admin/lib/format";
import { hasServer } from "@/lib/static-params";
import { simulateRequest } from "@/lib/simulate-request";
import { getRemoteModels } from "../data/remote-models";
import type { FetchStatus } from "../types";

type Options = {
  /** How many of the received models are not known yet for this provider. */
  countNew: (providerId: string, remoteIds: string[]) => number;
  onReceived: (providerId: string, remoteIds: string[], now: string) => void;
};

/**
 * Asks the provider for its models through the server (`/api/providers/:id/models`),
 * which uses the stored encrypted key. Progress per provider is temporary state.
 */
export function useProviderFetch({ countNew, onReceived }: Options) {
  const [status, setStatus] = useState<Record<string, FetchStatus | undefined>>({});
  const [rounds, setRounds] = useState<Record<string, number>>({});

  /** Without a server (the static demo) the list comes from the sample stand-in. */
  async function receive(providerId: string, baseUrl: string): Promise<string[]> {
    if (!hasServer) {
      await simulateRequest(900);
      const round = (rounds[providerId] ?? 0) + 1;
      setRounds((r) => ({ ...r, [providerId]: round }));
      return getRemoteModels(baseUrl, round);
    }
    const response = await fetch(`/api/admin/providers/${providerId}/models`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ baseUrl }),
    });
    const result = (await response.json()) as { remoteIds?: string[]; error?: string };
    if (!response.ok || !result.remoteIds) throw new Error(result.error ?? "فهرست مدل‌ها دریافت نشد.");
    return result.remoteIds;
  }

  async function fetchModels(providerId: string, baseUrl: string) {
    setStatus((s) => ({ ...s, [providerId]: "fetching" }));
    try {
      const remoteIds = await receive(providerId, baseUrl);
      const added = countNew(providerId, remoteIds);
      onReceived(providerId, remoteIds, new Date().toISOString());
      setStatus((s) => ({ ...s, [providerId]: undefined }));
      toast.success(added > 0 ? `نسخه‌ی تازه آمد: ${formatNumber(added)} مدل تازه دریافت شد.` : "مدل تازه‌ای پیدا نشد.");
    } catch (error) {
      setStatus((s) => ({ ...s, [providerId]: "error" }));
      toast.error(error instanceof Error ? error.message : "فهرست مدل‌ها دریافت نشد.");
    }
  }

  return { fetchStatus: status, fetchModels };
}

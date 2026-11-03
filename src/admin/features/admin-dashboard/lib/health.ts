import type { TestResult as FileTest, FileSource } from "@/admin/features/documents/types";
import type { DataSource } from "@/admin/features/data-sources/types";
import type { AiModel, ModelProvider } from "@/admin/features/models/types";
import type { ComponentGroupId, ComponentHealth, ComponentSeed, HealthStatus } from "../types";
import { minutesAfter, seed } from "./seed";

export const groupLabels: Record<ComponentGroupId, string> = {
  providers: "ارائه‌دهنده‌های مدل",
  selfHosted: "مدل‌های سلف‌هاست",
  tools: "ابزارها",
  warehouse: "انبار داده",
  fileServers: "فایل‌سرورها",
  webSearch: "وب‌سرچ",
  internal: "اجزای داخلی",
};

export const groupOrder = Object.keys(groupLabels) as ComponentGroupId[];

export const statusLabels: Record<HealthStatus, string> = {
  healthy: "سالم",
  slow: "کند",
  down: "قطع",
  unknown: "نامشخص",
};

/** A component is slow when its P95 passes the limit of its class. */
const slowLimitMs: Record<ComponentGroupId, number> = {
  providers: 4000,
  selfHosted: 6000,
  tools: 3000,
  warehouse: 2500,
  fileServers: 3000,
  webSearch: 3500,
  internal: 800,
};

function measured(
  id: string,
  name: string,
  group: ComponentGroupId,
  alive: boolean,
  nowIso: string,
  base: number,
  spread: number,
): ComponentHealth {
  const n = seed(id);
  const checkedAt = minutesAfter(nowIso, -(1 + (n % 5)));
  if (!alive) return { id, name, group, status: "down", medianMs: null, p95Ms: null, checkedAt };
  const medianMs = base + (n % spread);
  const p95Ms = Math.round(medianMs * (2 + (n % 5) / 5));
  const status: HealthStatus = p95Ms > slowLimitMs[group] ? "slow" : "healthy";
  return { id, name, group, status, medianMs, p95Ms, checkedAt };
}

function fromTest(
  id: string,
  name: string,
  group: ComponentGroupId,
  result: FileTest | DataSource["testResult"],
  nowIso: string,
): ComponentHealth {
  if (result === "untested") {
    return { id, name, group, status: "unknown", medianMs: null, p95Ms: null, checkedAt: nowIso };
  }
  return measured(id, name, group, result === "success", nowIso, 300, 500);
}

export function buildComponents(input: {
  providers: ModelProvider[];
  models: AiModel[];
  dataSources: DataSource[];
  fileSources: FileSource[];
  seeded: ComponentSeed[];
  nowIso: string;
}): ComponentHealth[] {
  const { providers, models, dataSources, fileSources, seeded, nowIso } = input;
  const providerOf = new Map(providers.map((p) => [p.id, p]));
  const result: ComponentHealth[] = [];

  for (const p of providers) {
    result.push(measured(p.id, p.name, "providers", p.status === "available", nowIso, 500, 700));
  }
  for (const m of models.filter((x) => x.selfHosted && x.enabled)) {
    const alive = providerOf.get(m.providerId)?.status === "available";
    result.push(measured(`self-${m.id}`, m.displayName, "selfHosted", alive, nowIso, 800, 1500));
  }
  for (const s of dataSources) result.push(fromTest(s.id, s.name, "warehouse", s.testResult, nowIso));
  for (const s of fileSources) result.push(fromTest(s.id, s.name, "fileServers", s.testResult, nowIso));
  for (const s of seeded) {
    const checkedAt = minutesAfter(nowIso, -(1 + (seed(s.id) % 5)));
    result.push({ ...s, checkedAt });
  }
  return result;
}

export function countByStatus(components: ComponentHealth[]) {
  const count = (s: HealthStatus) => components.filter((c) => c.status === s).length;
  return { slow: count("slow"), down: count("down"), unknown: count("unknown") };
}

export function overallStatus(components: ComponentHealth[]): "healthy" | "slow" | "down" {
  const { slow, down } = countByStatus(components);
  return down > 0 ? "down" : slow > 0 ? "slow" : "healthy";
}

/** Providers with at least one model that is not self-hosted. */
export function externalProviders(providers: ModelProvider[], models: AiModel[]) {
  return providers.filter((p) => models.some((m) => m.providerId === p.id && !m.selfHosted));
}

/** Offline only when external providers exist and every one of them is unavailable. */
export function isOffline(providers: ModelProvider[], models: AiModel[]) {
  const external = externalProviders(providers, models);
  return external.length > 0 && external.every((p) => p.status === "unavailable");
}

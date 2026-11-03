import type { ModelProvider } from "../types";

const providers: ModelProvider[] = [
  {
    id: "provider-001",
    name: "OpenRouter",
    baseUrl: "https://openrouter.ai/api/v1",
    hasApiKey: true,
    status: "available",
    lastFetchedAt: "2026-10-10T09:00:00.000Z",
    createdAt: "2026-09-20T08:00:00.000Z",
  },
  {
    id: "provider-002",
    name: "سرور مدل‌های سازمان",
    baseUrl: "http://10.0.0.15:8000/v1",
    hasApiKey: true,
    status: "available",
    lastFetchedAt: "2026-10-11T10:30:00.000Z",
    createdAt: "2026-09-25T11:00:00.000Z",
  },
  {
    id: "provider-003",
    name: "ارائه‌دهنده‌ی آزمایشی",
    baseUrl: "https://api.example-provider.com/v1",
    hasApiKey: true,
    status: "unavailable",
    lastFetchedAt: "2026-10-05T15:00:00.000Z",
    createdAt: "2026-10-01T12:00:00.000Z",
  },
];

export function getProviders(): ModelProvider[] {
  return providers;
}

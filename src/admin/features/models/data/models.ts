import type { AiModel } from "../types";

const base = {
  description: "",
  selfHosted: false,
  costInputPerMillion: null,
  costOutputPerMillion: null,
  supportsImages: false,
  supportsTools: false,
  contextWindow: null,
} satisfies Partial<AiModel>;

const models: AiModel[] = [
  {
    ...base,
    id: "model-001",
    providerId: "provider-001",
    remoteId: "openai/gpt-4o",
    displayName: "GPT-4o",
    description: "مدل همه‌منظوره برای پرسش و پاسخ و تحلیل متن.",
    enabled: true,
    costInputPerMillion: 150000,
    costOutputPerMillion: 450000,
    supportsImages: true,
    supportsTools: true,
    contextWindow: 128000,
  },
  {
    ...base,
    id: "model-002",
    providerId: "provider-001",
    remoteId: "anthropic/claude-sonnet",
    displayName: "Claude Sonnet",
    description: "مناسب نوشتن و خلاصه‌کردن متن‌های بلند.",
    enabled: true,
    costInputPerMillion: 120000,
    costOutputPerMillion: 380000,
    supportsImages: true,
    supportsTools: true,
    contextWindow: 200000,
  },
  {
    ...base,
    id: "model-003",
    providerId: "provider-001",
    remoteId: "meta/llama-3-70b",
    displayName: "meta/llama-3-70b",
    enabled: false,
  },
  {
    ...base,
    id: "model-004",
    providerId: "provider-002",
    remoteId: "qwen2.5-72b-instruct",
    displayName: "Qwen ۲٫۵",
    description: "روی سرورهای خود سازمان اجرا می‌شود.",
    enabled: true,
    selfHosted: true,
    supportsTools: true,
    contextWindow: 32000,
  },
  {
    ...base,
    id: "model-005",
    providerId: "provider-002",
    remoteId: "llama3.1-8b",
    displayName: "Llama سبک",
    enabled: true,
    selfHosted: true,
    contextWindow: 8000,
  },
  {
    ...base,
    id: "model-006",
    providerId: "provider-003",
    remoteId: "mistral-large",
    displayName: "Mistral بزرگ",
    enabled: true,
  },
  {
    ...base,
    id: "model-007",
    providerId: "provider-003",
    remoteId: "mistral-small",
    displayName: "mistral-small",
    enabled: false,
  },
];

export function getModels(): AiModel[] {
  return models;
}

import type { CatalogModel } from "../types";

const models: CatalogModel[] = [
  { id: "model-1", name: "GPT", provider: "OpenAI", description: "مدل همه‌منظوره برای نوشتن، تحلیل و برنامه‌نویسی.", isInternal: false, supportsImages: true, supportsTools: true, isAvailable: false },
  { id: "model-2", name: "Claude Opus", provider: "Anthropic", description: "قدرتمندترین مدل Anthropic برای کارهای سنگین و استدلال طولانی.", isInternal: false, supportsImages: true, supportsTools: true, isAvailable: true },
  { id: "model-3", name: "Claude Sonnet", provider: "Anthropic", description: "تعادل خوب بین کیفیت و سرعت برای کارهای روزمره.", isInternal: false, supportsImages: true, supportsTools: true, isAvailable: true },
  { id: "model-4", name: "Claude Haiku", provider: "Anthropic", description: "سریع و سبک برای پاسخ‌های کوتاه.", isInternal: false, supportsImages: true, supportsTools: true, isAvailable: true },
  { id: "model-5", name: "Gemini Pro", provider: "Google", description: "تحلیل متن بلند، تصویر و جدول.", isInternal: false, supportsImages: true, supportsTools: true, isAvailable: true },
  { id: "model-6", name: "Gemini Flash", provider: "Google", description: "پاسخ بسیار سریع برای کارهای ساده.", isInternal: false, supportsImages: true, supportsTools: true, isAvailable: true },
  { id: "model-7", name: "DeepSeek", provider: "DeepSeek", description: "استدلال و برنامه‌نویسی با هزینه‌ی کم.", isInternal: false, supportsImages: false, supportsTools: true, isAvailable: true },
  { id: "model-8", name: "Qwen", provider: "Alibaba", description: "مدل چندزبانه که روی سرورهای سازمان اجرا می‌شود؛ مناسب داده‌های حساس.", isInternal: true, supportsImages: false, supportsTools: true, isAvailable: true },
  { id: "model-9", name: "Llama", provider: "Meta", description: "مدل متن‌باز روی سرورهای سازمان؛ فقط گفتگوی متنی.", isInternal: true, supportsImages: false, supportsTools: false, isAvailable: true },
  { id: "model-10", name: "Mistral", provider: "Mistral AI", description: "مدل سبک و سریع اروپایی برای متن و خلاصه‌سازی.", isInternal: false, supportsImages: false, supportsTools: true, isAvailable: true },
];

/** Enabled models the current user may use. */
export function getAvailableModels(): CatalogModel[] {
  return models;
}

export function getModelById(id: string): CatalogModel | undefined {
  return models.find((model) => model.id === id);
}

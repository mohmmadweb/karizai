import type { SmartRouter } from "@/lib/smart-routing";

/** Sample routers for the static demo; model ids match the sample models. */
export function getSampleRouters(): SmartRouter[] {
  return [
    {
      id: "router-default",
      name: "مسیریاب پیش‌فرض سازمان",
      description: "پرسش‌های ساده به مدل داخلی، پرسش‌های متوسط به Claude Sonnet و تحلیل‌های سنگین به GPT-4o می‌رود.",
      isDefault: true,
      groupIds: [],
      members: [
        { modelId: "model-004", tier: "light" },
        { modelId: "model-002", tier: "medium" },
        { modelId: "model-001", tier: "heavy" },
      ],
      weights: { quality: 50, speed: 25, cost: 25 },
    },
    {
      id: "router-sensitive",
      name: "مسیریاب داده‌ی محرمانه",
      description: "برای واحد مالی: همه‌ی سطح‌ها فقط روی مدل داخلی سازمان اجرا می‌شوند.",
      isDefault: false,
      groupIds: ["group-002"],
      members: [
        { modelId: "model-004", tier: "light" },
        { modelId: "model-004", tier: "medium" },
        { modelId: "model-004", tier: "heavy" },
      ],
      weights: { quality: 40, speed: 20, cost: 40 },
    },
  ];
}

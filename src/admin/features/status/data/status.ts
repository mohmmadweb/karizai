export type ComponentState = "up" | "degraded" | "down";

export type SystemComponent = { id: string; name: string; group: string; external: boolean; state: ComponentState; note: string };

export const SLA_TARGET = 99.5;

export function getComponents(): SystemComponent[] {
  return [
    { id: "gateway", name: "درگاه کاریز (API Gateway)", group: "هسته", external: false, state: "up", note: "میانه‌ی پاسخ ۳۸ میلی‌ثانیه" },
    { id: "gpu", name: "سرور GPU داخلی (Qwen ۲٫۵ و Llama)", group: "مدل‌ها", external: false, state: "up", note: "۲ از ۲ کارت فعال · بار ۶۴٪" },
    { id: "openrouter", name: "OpenRouter (GPT-4o و Claude)", group: "مدل‌ها", external: true, state: "up", note: "میانه‌ی پاسخ ۱٫۲ ثانیه" },
    { id: "deepseek", name: "DeepSeek (با پوشاندن داده)", group: "مدل‌ها", external: true, state: "degraded", note: "کند: صدک ۹۵ برابر ۵٫۸ ثانیه" },
    { id: "websearch", name: "جست‌وجوی وب", group: "ابزارها", external: true, state: "up", note: "در دسترس" },
    { id: "vector", name: "پایگاه داده‌ی برداری (اسناد و دانش)", group: "داده", external: false, state: "up", note: "۴۸٬۳۰۰ قطعه‌ی نمایه‌شده" },
    { id: "rahkaran", name: "راهکاران (ERP)", group: "اتصال‌ها", external: false, state: "up", note: "همگام" },
    { id: "mes", name: "MES و SCADA خط تولید", group: "اتصال‌ها", external: false, state: "up", note: "آخرین داده ۱۲ ثانیه پیش" },
    { id: "lims", name: "LIMS آزمایشگاه", group: "اتصال‌ها", external: false, state: "up", note: "همگام" },
  ];
}

/** Monthly availability, oldest first, Solar Hijri month names. */
export function getUptimeHistory(): { month: string; uptime: number }[] {
  const months = ["آذر ۱۴۰۴", "دی", "بهمن", "اسفند", "فروردین ۱۴۰۵", "اردیبهشت", "خرداد", "تیر", "مرداد", "شهریور", "مهر", "آبان"];
  const values = [99.82, 99.91, 99.64, 99.97, 99.88, 99.41, 99.93, 99.95, 99.79, 99.9, 99.96, 99.87];
  return months.map((month, i) => ({ month, uptime: values[i] }));
}

export type Incident = { id: string; date: string; title: string; duration: string; impact: string };

export function getIncidents(): Incident[] {
  return [
    { id: "inc-3", date: "۱۴۰۵/۰۸/۰۹", title: "کندی DeepSeek؛ درخواست‌ها به Qwen داخلی منتقل شد", duration: "۴۲ دقیقه", impact: "بدون قطعی برای کاربران" },
    { id: "inc-2", date: "۱۴۰۵/۰۶/۲۱", title: "قطع اینترنت بین‌الملل", duration: "۳ ساعت و ۱۰ دقیقه", impact: "فقط مدل‌های داخلی؛ سامانه در دسترس ماند" },
    { id: "inc-1", date: "۱۴۰۵/۰۲/۱۴", title: "به‌روزرسانی درایور GPU", duration: "۴ ساعت و ۱۵ دقیقه", impact: "زیر هدف SLA در اردیبهشت" },
  ];
}

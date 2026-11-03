import type { ConnectionType, DefinedTool } from "@/lib/connections";

export type ConnectionTemplate = {
  id: string;
  label: string;
  hint: string;
  name: string;
  domain: string;
  description: string;
  type: ConnectionType;
  endpoint: string;
  tools: DefinedTool[];
};

/** Ready starting points for the systems a plant usually has; every field stays editable afterwards. */
const templates: ConnectionTemplate[] = [
  {
    id: "tpl-rahkaran",
    label: "راهکاران همکاران سیستم (ERP)",
    hint: "موجودی، سفارش خرید و فروش، فاکتورها",
    name: "راهکاران (ERP)",
    domain: "برنامه‌ریزی منابع سازمان، تدارکات و فروش",
    description: "خواندن موجودی و سفارش‌ها از راهکاران و ثبت پیش‌نویس سفارش خرید پس از تأیید کاربر.",
    type: "erp",
    endpoint: "https://erp.parsapolymer.local/rahkaran/api",
    tools: [
      { id: "tpl-rk-1", name: "موجودی کالا در انبارها", description: "موجودی یک کالا یا ماده‌ی اولیه را در همه‌ی انبارها می‌خواند.", requiresApproval: false },
      { id: "tpl-rk-2", name: "پیش‌نویس سفارش خرید در راهکاران", description: "پیش‌نویس سفارش خرید می‌سازد؛ ثبت نهایی با کارشناس تدارکات است.", requiresApproval: true },
      { id: "tpl-rk-3", name: "وضعیت سفارش فروش", description: "مرحله‌ی یک سفارش فروش و موعد تحویلش را می‌خواند.", requiresApproval: false },
      { id: "tpl-rk-4", name: "فاکتورهای باز مشتری", description: "فاکتورهای پرداخت‌نشده‌ی یک مشتری را فهرست می‌کند.", requiresApproval: false },
    ],
  },
  {
    id: "tpl-scada",
    label: "SCADA خط تولید (OPC-UA)",
    hint: "تگ‌های لحظه‌ای، روند دما و فشار، آلارم‌ها",
    name: "SCADA خط اکستروژن (OPC-UA)",
    domain: "کنترل و پایش خط تولید",
    description: "خواندن تگ‌های لحظه‌ای اکسترودرها، روند دمای نواحی و آلارم‌های فعال؛ فقط‌خواندنی.",
    type: "opcua",
    endpoint: "opc.tcp://scada.parsapolymer.local:4840",
    tools: [
      { id: "tpl-sc-1", name: "خواندن تگ لحظه‌ای", description: "مقدار فعلی یک تگ (مثل دمای ناحیه ۴ اکسترودر ۲) را می‌خواند.", requiresApproval: false },
      { id: "tpl-sc-2", name: "روند یک تگ در بازه", description: "مقدارهای یک تگ را در بازه‌ی زمانی دلخواه برمی‌گرداند.", requiresApproval: false },
      { id: "tpl-sc-3", name: "آلارم‌های فعال خط", description: "آلارم‌های باز خط تولید را با شدت و زمان شروع فهرست می‌کند.", requiresApproval: false },
    ],
  },
];

export function getConnectionTemplates(): ConnectionTemplate[] {
  return templates;
}

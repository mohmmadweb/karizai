import type { ConnectionType } from "@/lib/connections";

type CatalogTool = { name: string; description: string; requiresApproval: boolean; writes?: boolean };

type CatalogEntry = { domain: string; tools: CatalogTool[] };

const catalog: Partial<Record<ConnectionType, CatalogEntry>> = {
  gitlab: {
    domain: "مدیریت کد و توسعه",
    tools: [
      { name: "جست‌وجوی کد و مخزن", description: "در مخزن‌ها و کد پروژه‌ها جست‌وجو می‌کند.", requiresApproval: false },
      { name: "خواندن Issueها", description: "فهرست و جزئیات Issueهای پروژه را می‌خواند.", requiresApproval: false },
      { name: "خواندن درخواست‌های ادغام", description: "درخواست‌های ادغام (Merge Request) و وضعیتشان را می‌خواند.", requiresApproval: false },
      { name: "ساخت Issue", description: "یک Issue تازه در پروژه می‌سازد.", requiresApproval: true, writes: true },
    ],
  },
  mattermost: {
    domain: "پیام‌رسان سازمانی",
    tools: [
      { name: "خواندن پیام‌های کانال", description: "آخرین پیام‌های یک کانال را می‌خواند.", requiresApproval: false },
      { name: "جست‌وجوی پیام‌ها", description: "در پیام‌های کانال‌های در دسترس جست‌وجو می‌کند.", requiresApproval: false },
      { name: "ارسال پیام", description: "یک پیام در کانال انتخاب‌شده می‌فرستد.", requiresApproval: true, writes: true },
    ],
  },
  confluence: {
    domain: "پایگاه دانش و مستندات",
    tools: [
      { name: "جست‌وجوی صفحه‌ها", description: "در صفحه‌های فضاهای در دسترس جست‌وجو می‌کند.", requiresApproval: false },
      { name: "خواندن صفحه", description: "متن یک صفحه را می‌خواند.", requiresApproval: false },
      { name: "ساخت یا ویرایش صفحه", description: "صفحه‌ی تازه می‌سازد یا صفحه‌ای را ویرایش می‌کند.", requiresApproval: true, writes: true },
    ],
  },
};

/** Ready domain and tools of a kind of connection; undefined when the kind has none. */
export function getCatalogEntry(type: ConnectionType): CatalogEntry | undefined {
  return catalog[type];
}

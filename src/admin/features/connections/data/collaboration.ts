import type { DefinedConnection } from "@/lib/connections";

/**
 * Team tools the admin connects for the plant: GitLab, Mattermost and
 * Confluence. GitLab and Confluence keep the ids the user panel already uses
 * (`conn-21`, `conn-23`), so they replace the mirrored copies.
 */
export function getCollaborationConnections(): DefinedConnection[] {
  return [
    {
      id: "conn-21",
      name: "گیت‌لب (GitLab)",
      domain: "مخزن کد و ایشوهای پروژه‌های نرم‌افزاری",
      description: "ایشوها و Merge Requestهای پروژه‌های نرم‌افزاری واحد فناوری اطلاعات.",
      type: "gitlab",
      endpoint: "https://gitlab.parsapolymer.local/api/v4",
      auth: "user-login",
      tools: [
        { id: "gl-1", name: "فهرست ایشوها", description: "ایشوهای باز یا بسته‌ی یک پروژه را با برچسب و مسئول می‌خواند.", requiresApproval: false },
        { id: "gl-2", name: "ساخت ایشو", description: "یک ایشوی تازه با عنوان، شرح و برچسب در پروژه می‌سازد.", requiresApproval: true, writes: true },
        { id: "gl-3", name: "وضعیت Merge Request", description: "وضعیت بازبینی، پایپ‌لاین و تأییدهای یک Merge Request را می‌دهد.", requiresApproval: false },
      ],
      groupIds: ["group-003"],
      active: true,
    },
    {
      id: "conn-mattermost",
      name: "مترموست (Mattermost)",
      domain: "پیام‌رسان تیم‌ها و کانال‌های کارخانه",
      description: "ارسال اعلان جریان‌ها به کانال‌های تیم و خواندن پیام‌های یک کانال برای خلاصه‌سازی.",
      type: "mattermost",
      endpoint: "https://chat.parsapolymer.local/api/v4",
      auth: "shared-key",
      tools: [
        { id: "mm-1", name: "ارسال پیام به کانال", description: "یک پیام یا اعلان را در کانال انتخاب‌شده منتشر می‌کند.", requiresApproval: true, writes: true },
        { id: "mm-2", name: "خواندن پیام‌های کانال", description: "پیام‌های اخیر یک کانال را برای خلاصه یا جست‌وجو می‌خواند.", requiresApproval: false },
      ],
      groupIds: ["group-001", "group-003"],
      active: true,
    },
    {
      id: "conn-23",
      name: "کانفلوئنس سازمانی (Confluence)",
      domain: "ویکی، رویه‌ها و مستندات تیم‌ها",
      description: "جست‌وجو در صفحه‌های ویکی و ساخت صفحه‌ی تازه برای صورت‌جلسه و رویه‌ها.",
      type: "confluence",
      endpoint: "https://wiki.parsapolymer.local/rest/api",
      auth: "user-login",
      tools: [
        { id: "cf-1", name: "جست‌وجوی صفحه", description: "صفحه‌های ویکی را با عنوان یا متن پیدا می‌کند و بخش مرتبط را برمی‌گرداند.", requiresApproval: false },
        { id: "cf-2", name: "ساخت صفحه", description: "یک صفحه‌ی تازه در فضای انتخاب‌شده می‌سازد؛ پیش از انتشار تأیید می‌خواهد.", requiresApproval: true, writes: true },
      ],
      groupIds: ["group-003", "group-005"],
      active: true,
    },
  ];
}

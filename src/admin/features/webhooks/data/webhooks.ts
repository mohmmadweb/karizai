export const webhookEvents = {
  "run.finished": "اجرای جریان تمام شد",
  "approval.requested": "درخواست تأیید ثبت شد",
  "agent.published": "عامل منتشر شد",
  "budget.exceeded": "بودجه تمام شد",
  "alert.raised": "هشدار شاخص تولید",
  "document.indexed": "سند نمایه شد",
} as const;

export type WebhookEvent = keyof typeof webhookEvents;

export type Webhook = { id: string; direction: "out" | "in"; name: string; url: string; events: WebhookEvent[]; secretTail: string; active: boolean; target?: string };

export type Delivery = { id: string; at: string; webhookId: string; event: string; status: number | null; ms: number };

export function getWebhooks(): Webhook[] {
  return [
    { id: "wh-1", direction: "out", name: "اعلان به Mattermost کیفیت", url: "https://chat.parsapolymer.local/hooks/q7x2k", events: ["run.finished", "alert.raised"], secretTail: "3f9a", active: true },
    { id: "wh-2", direction: "out", name: "ثبت در سامانه‌ی BI", url: "https://bi.parsapolymer.local/api/kariz-events", events: ["run.finished", "budget.exceeded"], secretTail: "a81c", active: true },
    { id: "wh-3", direction: "out", name: "صف تأیید در اتوماسیون اداری", url: "https://office.parsapolymer.local/webhook/approvals", events: ["approval.requested", "agent.published"], secretTail: "07de", active: false },
    { id: "wh-4", direction: "in", name: "آلارم MES خط ۲", url: "https://kariz.parsapolymer.local/hooks/in/mes-line2", events: [], secretTail: "c4b0", active: true, target: "جریان «مرکز شاخص‌ها و هشدار هوشمند»" },
    { id: "wh-5", direction: "in", name: "نتیجه‌ی آزمون LIMS", url: "https://kariz.parsapolymer.local/hooks/in/lims-result", events: [], secretTail: "9e12", active: true, target: "عامل «دستیار کیفیت و فرمولاسیون»" },
  ];
}

export function getDeliveries(): Delivery[] {
  return [
    { id: "dl-6", at: "۰۹:۴۸", webhookId: "wh-1", event: "alert.raised", status: 200, ms: 140 },
    { id: "dl-5", at: "۰۹:۳۱", webhookId: "wh-4", event: "mes.alarm", status: 202, ms: 35 },
    { id: "dl-4", at: "۰۹:۱۲", webhookId: "wh-2", event: "run.finished", status: 500, ms: 2210 },
    { id: "dl-3", at: "۰۸:۵۵", webhookId: "wh-1", event: "run.finished", status: 200, ms: 162 },
    { id: "dl-2", at: "۰۸:۳۰", webhookId: "wh-2", event: "budget.exceeded", status: null, ms: 10000 },
    { id: "dl-1", at: "۰۸:۰۵", webhookId: "wh-5", event: "lims.result", status: 202, ms: 41 },
  ];
}

/** A random secret, made in the browser only when the admin creates a webhook; it is shown once. */
export function newSecret(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(18));
  return `whsec_${[...bytes].map((b) => b.toString(16).padStart(2, "0")).join("")}`;
}

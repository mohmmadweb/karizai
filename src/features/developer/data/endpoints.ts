import type { ApiKeyKind } from "@/lib/api-keys";

export const apiBase = "https://kariz.parsapolymer.local/api/v1";

export type Endpoint = {
  id: string;
  method: "GET" | "POST" | "DELETE";
  path: string;
  title: string;
  description: string;
  /** Kind of key that may call it; null means any key. */
  keyKind: ApiKeyKind | null;
  request?: unknown;
  response: unknown;
  /** Typical latency and tokens of the sample call. */
  latencyMs: number;
  tokens?: { input: number; output: number };
};

export const endpoints: Endpoint[] = [
  {
    id: "chat", method: "POST", path: "/chat/completions", title: "گفتگو با مدل", keyKind: "model", latencyMs: 1240, tokens: { input: 46, output: 118 },
    description: "سازگار با قالب OpenAI. مدل «auto» را مسیریاب هوشمند انتخاب می‌کند؛ با «فقط داخلی» هیچ متنی از سازمان بیرون نمی‌رود.",
    request: { model: "qwen-internal", messages: [{ role: "system", content: "پاسخ کوتاه و فارسی بده." }, { role: "user", content: "حد مجاز MFI گرید PP-T20 چقدر است؟" }], temperature: 0.2 },
    response: { id: "chatcmpl-8f21", object: "chat.completion", model: "qwen-internal", choices: [{ index: 0, message: { role: "assistant", content: "طبق برگه‌ی فنی، ۱۸ تا ۲۲ گرم بر ۱۰ دقیقه (۲۳۰ درجه، ۲٫۱۶ کیلوگرم)." }, finish_reason: "stop" }], usage: { prompt_tokens: 46, completion_tokens: 118, total_tokens: 164 } },
  },
  {
    id: "agent-run", method: "POST", path: "/agents/{agent_id}/runs", title: "اجرای عامل", keyKind: "agent", latencyMs: 3480, tokens: { input: 1320, output: 540 },
    description: "یک پیام به عامل می‌دهد؛ عامل با دانش، ابزارها و سیاست مدل خودش پاسخ می‌دهد و منابع را برمی‌گرداند. ابزارهای نیازمند تأیید اجرا نمی‌شوند و «awaiting_approval» برمی‌گردد.",
    request: { input: "چرا بچ B-1405-212 مردود شد؟", stream: false },
    response: { run_id: "run_5c0e", agent_id: "agent-quality", agent_version: "1.3", status: "completed", output: "علت محتمل: دمای ناحیه‌ی ۴ اکسترودر (۲۴۸°C) و رطوبت مواد ورودی. پیشنهاد: کاهش دما به ۲۳۵ و خشک‌کردن مواد.", sources: [{ title: "LIMS بچ ۲۱۲" }, { title: "MES ناحیه ۴" }], usage: { total_tokens: 1860 } },
  },
  {
    id: "knowledge-search", method: "POST", path: "/knowledge/search", title: "جست‌وجو در دانش سازمانی", keyKind: "knowledge", latencyMs: 420,
    description: "جست‌وجوی معنایی در مجموعه‌هایی که سازنده‌ی کلید به آن‌ها دسترسی دارد؛ دسترسی از سامانه‌ی مبدأ به ارث می‌رسد.",
    request: { query: "رویه‌ی کنترل کیفیت مواد ورودی", collections: ["kn-quality"], top_k: 3 },
    response: { results: [{ document: "رویه‌ی کنترل کیفیت ورودی (QC-SOP-07)", section: "بند ۴ — نمونه‌برداری", score: 0.91, snippet: "از هر محموله به تعداد جذر کیسه‌ها به‌علاوه‌ی یک نمونه برداشته می‌شود…" }, { document: "برگه‌ی فنی گرید PP-T20", section: "خواص", score: 0.78, snippet: "MFI: ۱۸–۲۲ g/10min" }] },
  },
  {
    id: "workflow-trigger", method: "POST", path: "/workflows/{workflow_id}/trigger", title: "اجرای جریان", keyKind: "agent", latencyMs: 180,
    description: "یک جریان را با ورودی دلخواه شروع می‌کند و شناسه‌ی اجرا را برمی‌گرداند؛ نتیجه با webhook یا GET /runs/{run_id} می‌رسد.",
    request: { input: { material: "PE سنگین HD5502" }, callback_url: "https://mes.parsapolymer.local/hooks/kariz" },
    response: { run_id: "run_91ab", workflow_id: "wf-6", status: "running", steps: 10 },
  },
  {
    id: "webhooks", method: "POST", path: "/webhooks", title: "ثبت webhook", keyKind: null, latencyMs: 140,
    description: "برای رویدادها (پایان اجرا، درخواست تأیید، هشدار) نشانی ثبت کنید. هر درخواست امضای HMAC در سرآیند X-Kariz-Signature دارد.",
    request: { url: "https://mes.parsapolymer.local/hooks/kariz", events: ["run.completed", "approval.requested", "alert.created"] },
    response: { id: "wh_3d7", url: "https://mes.parsapolymer.local/hooks/kariz", events: ["run.completed", "approval.requested", "alert.created"], secret: "whsec_••••••••", active: true },
  },
];

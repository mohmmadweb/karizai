import { getTemplates } from "@/features/workflows/data/templates";
import { taskFromStep } from "@/features/workflows/lib/task-step";
import { describeTrigger, eventLabels } from "@/features/workflows/lib/describe-trigger";
import type { Workflow } from "@/features/workflows/types";
import type { EffectSpec, StoryContext } from "../types";

/** How the demo clock of «حالت زنده» announces a workflow it starts. */
export type LiveCue = { icon: "schedule" | "event"; title: string; description: string; startedBy: string };

type Story = {
  /** Unit and Agent shown in the audit log for steps without their own Agent. */
  unit: string;
  agent: string;
  cue?: LiveCue;
  /** What each step does in the system when it succeeds, by node id. Steps not listed only reach the audit log. */
  steps: Record<string, EffectSpec[]>;
};

const po = "PO-1405-0871";

/** The stories of the built-in workflows; a workflow made from a template shares the template's story. */
const stories: Record<string, Story> = {
  "tpl-reorder": {
    unit: "تدارک",
    agent: "دستیار سفارش مواد اولیه",
    cue: { icon: "schedule", title: "⏰ اجرای زمان‌بندی‌شده: سفارش‌دهی خودکار مواد اولیه", description: "هر روز ۰۸:۰۰ · موجودی انبار مرکزی بررسی می‌شود", startedBy: "زمان‌بندی: هر روز ۰۸:۰۰" },
    steps: {
      n10: [
        {
          kind: "alert", label: "هشدار کمبود در «ربات هشدار» ثبت شد",
          text: "کمبود موجودی: PE سنگین HD5502 در انبار مرکزی ۱۸ تن است؛ نقطه‌ی سفارش ۴۰ تن.",
          alert: { title: "پیش‌بینی کمبود مواد اولیه", tone: "warning", fields: [{ label: "موجودی فعلی", value: "۱۸ تن (پوشش ۳ روز)" }, { label: "نقطه‌ی سفارش", value: "۴۰ تن" }, { label: "پیش‌بینی مدل", value: "۳٫۲ روز تا کمبود · احتمال ۸۷٪" }, { label: "محموله‌ی در راه", value: "۴۰ تن، تا ۱۸ آبان در گمرک" }] },
        },
        {
          kind: "message", to: "col-ali", label: "پیامک به علی رضایی، مدیر تدارک، رفت",
          text: "پیامک خودکار: موجودی HD5502 به ۱۸ تن رسیده و تا ۳ روز دیگر تمام می‌شود. استعلام قیمت بعد از تأیید شروع می‌شود.",
          reply: "دیدم، ممنون. پیش‌نویس که آماده شد خودم بازبینی می‌کنم.",
        },
      ],
      n7: [{ kind: "file", label: "پیش‌نویس سفارش در راهکاران و «دانش سازمانی» ساخته شد", title: `پیش‌نویس سفارش خرید ${po}`, fileKind: "pdf", folder: "پوشه‌ی تدارکات", sizeKb: 186, summary: "۸۰ تن PE سنگین HD5502 از پلیمر خزر، تحویل ۷ روزه، حدود ۶٬۵۶۰ میلیون تومان؛ وضعیت پیش‌نویس در راهکاران.", keywords: ["سفارش خرید", "HD5502", "پلیمر خزر", "راهکاران"] }],
      n8: [
        {
          kind: "group", groupId: "grp-supply", label: "کارت سفارش در گروه «تدارکات و انبار» گذاشته شد",
          text: `پیش‌نویس سفارش خرید ${po} در راهکاران آماده‌ی بررسی است.`,
          alert: { title: `پیش‌نویس ${po} آماده است`, tone: "info", fields: [{ label: "کالا", value: "۸۰ تن PE سنگین HD5502" }, { label: "تأمین‌کننده", value: "پلیمر خزر · تحویل ۷ روزه" }, { label: "هزینه‌ی برآوردی", value: "حدود ۶٬۵۶۰ میلیون تومان" }] },
        },
        { kind: "notification", title: `پیش‌نویس ${po} منتظر بازبینی شماست`, description: "۸۰ تن HD5502 از پلیمر خزر", href: "/messenger/tasks" },
      ],
      n9: [
        { kind: "task", title: "بازبینی و تأیید نهایی پیش‌نویس سفارش ۸۰ تن HD5502", project: "کاهش ریسک تأمین مواد اولیه", priority: "high", dueInDays: 1 },
        { kind: "calendar", title: `جلسه‌ی بازبینی سفارش خرید ${po}`, dayOffset: 1, time: "10:00", durationMinutes: 30, place: "اتاق جلسات ۱" },
      ],
    },
  },
  "tpl-pricing": {
    unit: "فروش",
    agent: "دستیار فروش و قیمت‌گذاری",
    cue: { icon: "event", title: "⚡ رویداد: ایمیل تازه از مشتری", description: "درخواست قیمت ۲۰ تن کامپاند PP-T20", startedBy: "رویداد: ایمیل تازه از مشتری" },
    steps: {
      n7: [{ kind: "file", label: "پیش‌فاکتور در «دانش سازمانی» ساخته شد", title: "پیش‌فاکتور فروش PF-1405-0193", fileKind: "pdf", folder: "سرور فایل فروش", sizeKb: 142, summary: "۲۰ تن کامپاند PP-T20، قیمت ۱۰۴٬۴۰۰ تومان بر کیلوگرم، مبلغ نهایی ۲٬۲۹۶٫۸ میلیون تومان، اعتبار ۵ روز.", keywords: ["پیش‌فاکتور", "PP-T20", "قیمت"] }],
      n8: [
        {
          kind: "group", groupId: "grp-sales", label: "پیام در گروه «فروش» گذاشته شد",
          text: "پیش‌فاکتور فروش آماده و برای مشتری ارسال شد.",
          alert: { title: "پیش‌فاکتور فروش آماده شد", tone: "info", fields: [{ label: "کالا", value: "۲۰ تن کامپاند PP-T20" }, { label: "مبلغ نهایی", value: "۲٬۲۹۶٫۸ میلیون تومان" }, { label: "اعتبار", value: "۵ روز" }] },
        },
        { kind: "task", title: "پیگیری پاسخ مشتری درباره‌ی پیش‌فاکتور PF-1405-0193", project: "توسعه‌ی گرید PP-T20 با ضربه‌ی بالا", priority: "normal", dueInDays: 3 },
      ],
    },
  },
  "tpl-production-plan": {
    unit: "تولید",
    agent: "دستیار برنامه‌ریزی تولید",
    cue: { icon: "event", title: "⚡ رویداد: آلارم E-217 اکسترودر خط ۲", description: "برنامه‌ی تولید با ظرفیت تازه‌ی خطوط دوباره چیده می‌شود", startedBy: "رویداد: آلارم E-217 اکسترودر خط ۲" },
    steps: {
      p8: [{ kind: "file", label: "برنامه‌ی تولید هفته در «دانش سازمانی» ساخته شد", title: "برنامه‌ی تولید هفته‌ی ۱۶ تا ۲۲ آبان", fileKind: "excel", folder: "پوشه‌ی برنامه‌ریزی تولید", sizeKb: 74, summary: "۱۴ سفارش و ۳۱۲ تن روی خطوط ۱ تا ۳؛ ۴ تعویض فرمول، بهره‌وری ۹۱٪ و یک سفارش دیرکرد.", keywords: ["برنامه‌ی تولید", "تعویض فرمول", "خطوط"] }],
      p11: [
        { kind: "channel", channelId: "ch-alerts", label: "اطلاعیه در کانال «هشدارهای تولید» منتشر شد", text: "برنامه‌ی تولید آماده است: ۴ تعویض فرمول، بهره‌وری خطوط ۹۱٪. خط ۳ از ساعت ۱۴ تا ۱۸ برای تعویض اسکرو متوقف است." },
        { kind: "calendar", title: "تعویض فرمول خط ۱: PP-T20 طبیعی ← مشکی", dayOffset: 1, time: "13:00", durationMinutes: 45, place: "سالن تولید خط ۱" },
        { kind: "message", to: "col-reza", label: "برنامه‌ی خط ۲ برای رضا محمدی فرستاده شد", text: "برنامه‌ی خط ۲: کامپاند PE سفید ← طوسی، ساعت ۱۰ فردا.", reply: "باشه، شیفت را هماهنگ می‌کنم." },
      ],
    },
  },
  "tpl-weekly-report": {
    unit: "فروش",
    agent: "دستیار هوش تجاری",
    cue: { icon: "schedule", title: "⏰ اجرای زمان‌بندی‌شده: گزارش فروش هفتگی", description: "هر شنبه ۰۸:۰۰ · آمار فروش به تفکیک استان", startedBy: "زمان‌بندی: هر شنبه ۰۸:۰۰" },
    steps: {
      n2: [{ kind: "file", label: "گزارش Excel در «دانش سازمانی» ساخته شد", title: "گزارش هفتگی فروش ۲ تا ۸ آبان", fileKind: "excel", folder: "سرور فایل فروش", sizeKb: 212, summary: "فروش هفته به تفکیک استان، مشتری و گرید؛ پرفروش‌ترین گرید PP-T20.", keywords: ["فروش", "گزارش هفتگی", "PP-T20"] }],
      n4: [
        {
          kind: "group", groupId: "grp-sales", label: "خلاصه‌ی گزارش در گروه «فروش» گذاشته شد",
          text: "گزارش فروش هفته آماده است.",
          alert: { title: "گزارش فروش هفته‌ی ۲ تا ۸ آبان", tone: "info", fields: [{ label: "پرفروش‌ترین گرید", value: "PP-T20" }, { label: "فایل", value: "در «دانش سازمانی»، سرور فایل فروش" }] },
        },
        { kind: "message", to: "col-mohammad", label: "پیامک به محمد کاظمی، مدیر فروش، رفت", text: "پیامک خودکار: گزارش فروش هفته آماده است.", reply: "ممنون، امروز می‌خوانم." },
      ],
    },
  },
  "tpl-supervised-answer": {
    unit: "کیفیت",
    agent: "دستیار کیفیت و فرمولاسیون",
    steps: {
      s3: [{
        kind: "chat", label: "گزارش تحلیل در گفتگوهای اخیر نشست", agentName: "دستیار کیفیت و فرمولاسیون",
        title: "گزارش جریان: علت مردودی بچ B-1405-212", prompt: "چرا بچ B-1405-212 مردود شد؟",
        text: "**نتیجه:** MFI بچ B-1405-212 برابر ۸٫۹ بود و بیرون از حد مجاز است.\n\n**علت‌ها به ترتیب احتمال:**\n1. دمای بالای ناحیه‌ی ۴ اکسترودر خط ۲ (۲۴۸ درجه، حد ۲۴۰)؛ روند MES هم‌زمانی را نشان می‌دهد.\n2. رطوبت مواد ورودی؛ برگه‌ی فنی مستربچ حداکثر ۰٫۰۵٪ را مجاز می‌داند.\n\n**پیشنهاد:** کالیبراسیون حسگر ناحیه‌ی ۴ و خشک‌کردن مستربچ پیش از بچ آزمایشی.",
        sources: ["گزارش عدم انطباق بچ ۲۱۲", "QC-SOP-07 رویه‌ی کنترل کیفیت ورودی"],
      }],
      s6: [
        {
          kind: "group", groupId: "grp-quality", label: "نتیجه در گروه «کیفیت و فرمولاسیون» گذاشته شد",
          text: "تحلیل علت مردودی بچ B-1405-212 آماده است.",
          alert: { title: "تحلیل مردودی بچ B-1405-212", tone: "warning", fields: [{ label: "MFI", value: "۸٫۹ (بیرون از حد)" }, { label: "علت محتمل", value: "دمای ناحیه‌ی ۴ و رطوبت مواد" }, { label: "ناظر", value: "همه‌ی معیارها برقرار است" }] },
        },
        { kind: "task", title: "اقدام اصلاحی بچ B-1405-212: کالیبراسیون حسگر ناحیه‌ی ۴ و خشک‌کردن مستربچ", project: "بهبود کیفیت ۱۴۰۵", priority: "high", dueInDays: 2 },
      ],
    },
  },
  "tpl-new-customer": {
    unit: "فروش",
    agent: "دستیار فروش و قیمت‌گذاری",
    steps: {
      n3: [{ kind: "message", to: "col-mohammad", label: "خلاصه‌ی مشتری برای محمد کاظمی فرستاده شد", text: "مشتری تازه: پویا پلیمر. خلاصه‌ی پرونده برای پیگیری آماده است.", reply: "فردا با ایشان تماس می‌گیرم." }],
      n4: [{ kind: "notification", title: "یادداشت پیگیری در CRM ثبت شد", description: "پرونده‌ی پویا پلیمر", href: "/workflows/wf-2" }],
    },
  },
  "wf-3": {
    unit: "منابع انسانی",
    agent: "—",
    steps: { n1: [{ kind: "notification", title: "مانده‌ی مرخصی شما بررسی شد", description: "یادآوری روزانه‌ی مرخصی", href: "/workflows/wf-3" }] },
  },
};

const seedStoryKeys: Record<string, string> = { "wf-1": "tpl-weekly-report", "wf-2": "tpl-new-customer", "wf-3": "wf-3", "wf-5": "tpl-pricing", "wf-6": "tpl-reorder", "wf-7": "tpl-production-plan", "wf-8": "tpl-supervised-answer" };

function storyOf(workflow: Workflow): Story | undefined {
  const key = seedStoryKeys[workflow.id] ?? getTemplates().find((template) => template.name === workflow.name)?.id;
  return key ? stories[key] : undefined;
}

/** Where a «post to the channel» tool lands, by the channel name in its settings. */
const postTargets: { word: string; id: string; channel?: boolean }[] = [
  { word: "فروش", id: "grp-sales" },
  { word: "کیفیت", id: "grp-quality" },
  { word: "تدارک", id: "grp-supply" },
  { word: "تولید", id: "ch-alerts", channel: true },
];

/** Generic effects of a workflow without a story, by connection and tool, then by kind of step. */
function genericEffects({ workflow, node }: StoryContext): EffectSpec[] {
  const params = node.config.params ?? {};
  const task = taskFromStep(node);
  if (task) return [{ kind: "task", title: task.title, project: task.projectName, priority: task.priority, dueInDays: 3 }];
  if (node.kind === "tool") {
    switch (node.config.toolId) {
      case "tool-27": {
        const text = params.message || `پیام جریان «${workflow.name}»`;
        const target = postTargets.find((item) => params.channel?.includes(item.word));
        if (target?.channel) return [{ kind: "channel", channelId: target.id, text }];
        if (target) return [{ kind: "group", groupId: target.id, text, alert: { title: node.label, tone: "info", fields: [] } }];
        return [{ kind: "alert", text, alert: { title: node.label, tone: "info", fields: [] } }];
      }
      case "tool-12":
        return [{ kind: "alert", label: "پیامک فرستاده شد", text: params.p1 || "پیامک جریان", alert: { title: "پیامک فرستاده شد", tone: "info", fields: [{ label: "گیرنده", value: params.p0 || "مدیر" }] } }];
      case "tool-60":
        return [{ kind: "file", title: `پیش‌نویس سفارش خرید ${params.material ?? ""}`.trim(), fileKind: "pdf", folder: "پوشه‌ی تدارکات", sizeKb: 180, summary: `${params.quantityTon ?? ""} تن ${params.material ?? ""} از ${params.vendor ?? "تأمین‌کننده"}؛ پیش‌نویس در راهکاران.`, keywords: ["سفارش خرید", "راهکاران"] }];
      case "tool-2":
        return [{ kind: "notification", title: "یادداشت در CRM ثبت شد", description: params.p0 ?? node.label, href: `/workflows/${workflow.id}` }];
      default:
        return [];
    }
  }
  if (node.kind === "orchestrator" || (node.kind === "agent" && workflow.nodes.filter((item) => item.kind === "agent").at(-1)?.id === node.id)) {
    return [{ kind: "chat", title: `گزارش جریان ${workflow.name}`, prompt: node.config.instruction || node.label, agentName: "جریان خودکار", text: `جریان «${workflow.name}» گام «${node.label}» را انجام داد و نتیجه را اینجا گذاشت.` }];
  }
  return [];
}

/** What a succeeded step does in the system: the workflow's story, or generic effects. */
export function effectsFor(context: StoryContext): EffectSpec[] {
  const story = storyOf(context.workflow);
  return story ? (story.steps[context.node.id] ?? []) : genericEffects(context);
}

export const auditIdentity = (workflow: Workflow) => {
  const story = storyOf(workflow);
  return { unit: story?.unit ?? "جریان‌ها", agent: story?.agent ?? "—" };
};

/** How the demo clock announces a workflow. */
export function cueFor(workflow: Workflow): LiveCue {
  const story = storyOf(workflow)?.cue;
  if (story) return story;
  const trigger = workflow.triggers.find((item) => item.kind !== "manual");
  if (trigger?.kind === "event") return { icon: "event", title: `⚡ رویداد: ${eventLabels[trigger.event]}`, description: workflow.name, startedBy: describeTrigger(trigger) };
  return { icon: "schedule", title: `⏰ اجرای زمان‌بندی‌شده: ${workflow.name}`, description: trigger ? describeTrigger(trigger) : workflow.description, startedBy: trigger ? describeTrigger(trigger) : "زمان‌بندی" };
}

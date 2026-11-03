import type { SuggestedTask } from "@/features/social/types";

type ThreadAi = { summary: string[]; task: SuggestedTask; reply: string };

const byColleague: Record<string, ThreadAi> = {
  "col-ali": {
    summary: ["علی رضایی درباره‌ی هشدار سفارش HD5502 پرسید و آماده است همین امروز استعلام بگیرد.", "شما مقدار ۸۰ تن را تأیید کردید.", "کار باز: استعلام قیمت و ثبت پیش‌نویس سفارش خرید در راهکاران."],
    task: { title: "پیگیری استعلام قیمت HD5502 با علی رضایی", assigneeId: "user-1", dueDate: "2026-11-04T00:00:00.000Z", projectId: "proj-3" },
    reply: "سلام آقای رضایی، ممنون از پیگیری. لطفاً استعلام پلیمر خزر و یک تأمین‌کننده‌ی دیگر را تا فردا بفرستید تا پیش‌نویس سفارش را در راهکاران تأیید کنم.",
  },
  "col-sara": {
    summary: ["سارا کریمی موجودی مستربچ مشکی را ۶٫۵ تن شمارش کرده است.", "با تأخیر ۱۰ روزه‌ی تأمین‌کننده، این موجودی حدود ۵ روز مصرف خط ۲ را پوشش می‌دهد."],
    task: { title: "بررسی کفایت موجودی مستربچ مشکی (۶٫۵ تن)", assigneeId: "user-1", dueDate: "2026-11-03T00:00:00.000Z", projectId: "proj-3" },
    reply: "سلام خانم کریمی، ممنون از شمارش. با تأخیر تأمین‌کننده، لطفاً مصرف روزانه‌ی خط ۲ را هم بفرستید تا درباره‌ی سفارش فوری تصمیم بگیریم.",
  },
};

/** What the assistant says about a chat with a colleague; chats without a prepared answer get a short generic one. */
export function getThreadAi(threadId: string, name: string, lastText?: string): ThreadAi {
  return byColleague[threadId] ?? {
    summary: [lastText ? `آخرین پیام: «${lastText}»` : `هنوز پیامی با ${name} رد و بدل نشده است.`, "تصمیم یا کار بازی در این گفتگو دیده نشد."],
    task: { title: `پیگیری گفتگو با ${name}`, assigneeId: "user-1", dueDate: "2026-11-05T00:00:00.000Z", projectId: "proj-4" },
    reply: `سلام ${name}، پیامتان را دیدم. بررسی می‌کنم و تا پایان روز خبر می‌دهم.`,
  };
}

/** «✦ بهبود متن»: the same message, polite and complete. */
export function improveText(text: string, name: string): string {
  const body = text.trim().replace(/[.!؟?]*$/, "");
  return `سلام ${name} عزیز، ${body}. ممنون می‌شوم اگر تا پایان روز خبر بدهید.`;
}

import { getAiAnswer } from "@/features/ai-panel/data/answers";
import type { AiAnswer } from "@/features/ai-panel/types";
import type { KnowledgeDocument } from "../types";

/** «✦ خلاصه» of one file; QC-SOP-07 has its prepared answer. */
export function summaryAnswer(doc: KnowledgeDocument): AiAnswer {
  if (doc.meta?.code === "QC-SOP-07") return getAiAnswer("doc");
  return { text: `**خلاصه‌ی «${doc.title}»**\n\n${doc.summary ?? "این سند هنوز خلاصه‌ای ندارد."}`, sources: [doc.title] };
}

/** «✦ استخراج»: metadata of the file; saving puts it on the file as tags. */
export function metaAnswer(doc: KnowledgeDocument, onSave: (tags: string[]) => void): AiAnswer {
  const meta = doc.meta ?? { type: "سند", owner: "نامشخص", confidentiality: "داخلی" };
  const rows = [["نوع سند", meta.type], ...(meta.code ? [["کد", meta.code]] : []), ["مالک", meta.owner], ["تاریخ بازنگری", doc.updatedAt ? new Intl.DateTimeFormat("fa-IR").format(new Date(doc.updatedAt)) : "نامشخص"], ["سطح محرمانگی", meta.confidentiality]];
  return {
    text: `**اطلاعات استخراج‌شده از «${doc.title}»**\n\n| مشخصه | مقدار |\n| --- | --- |\n${rows.map(([k, v]) => `| ${k} | ${v} |`).join("\n")}`,
    actions: [{ label: "ذخیره به‌عنوان برچسب فایل", message: "برچسب‌ها روی فایل ذخیره شد.", run: () => onSave([meta.type, meta.owner, meta.confidentiality]) }],
  };
}

/** «✦ خلاصه این پوشه»: one line per document. */
export function folderAnswer(folder: string, docs: KnowledgeDocument[]): AiAnswer {
  if (docs.length === 0) return { text: `پوشه‌ی «${folder}» هنوز سندی ندارد.` };
  return {
    text: `**خلاصه‌ی ${folder}** (${docs.length.toLocaleString("fa-IR")} سند)\n\n${docs.map((doc) => `- **${doc.title}:** ${doc.summary ?? "بدون خلاصه"}`).join("\n")}`,
    sources: docs.slice(0, 4).map((doc) => doc.title),
  };
}

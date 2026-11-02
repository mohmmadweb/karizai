import type { GeneratedFile } from "../types";

const escapeHtml = (text: string | number) => String(text).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/** Word opens an HTML page with a .doc name; Excel does the same with a table and .xls. No library is needed. */
function toHtml(file: GeneratedFile): string {
  if (file.kind === "excel") {
    const cells = (row: (string | number)[], tag: string) => `<tr>${row.map((cell) => `<${tag}>${escapeHtml(cell)}</${tag}>`).join("")}</tr>`;
    return `<html dir="rtl"><head><meta charset="utf-8"></head><body><table border="1">${cells(file.columns ?? [], "th")}${(file.rows ?? []).map((row) => cells(row, "td")).join("")}</table></body></html>`;
  }
  const sections = (file.sections ?? []).map((section) => `<h2>${escapeHtml(section.heading)}</h2>${section.lines.map((line) => `<p>${escapeHtml(line)}</p>`).join("")}`).join("");
  return `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40"><head><meta charset="utf-8"><style>body{direction:rtl;font-family:Tahoma,Arial}h1{font-size:20pt}h2{font-size:14pt}p{font-size:11pt}</style></head><body dir="rtl"><h1>${escapeHtml(file.title)}</h1>${sections}</body></html>`;
}

export const fileExtension = (file: GeneratedFile) => (file.kind === "word" ? "doc" : "xls");

/** Builds the file in the browser from what the chat shows; nothing is sent anywhere. */
export function downloadGeneratedFile(file: GeneratedFile) {
  const type = file.kind === "word" ? "application/msword" : "application/vnd.ms-excel";
  const url = URL.createObjectURL(new Blob(["﻿", toHtml(file)], { type: `${type};charset=utf-8` }));
  const link = document.createElement("a");
  link.href = url;
  link.download = `${file.name}.${fileExtension(file)}`;
  link.click();
  URL.revokeObjectURL(url);
}

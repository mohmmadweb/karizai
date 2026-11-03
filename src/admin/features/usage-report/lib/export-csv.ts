export type CsvColumn<T> = { header: string; value: (row: T) => string | number };

const quote = (cell: string | number) => {
  const text = String(cell);
  return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
};

/** UTF-8 text with a byte-order mark, so Excel reads the Persian headers correctly. */
export function buildCsv<T>(rows: T[], columns: CsvColumn<T>[]): string {
  const lines = [columns.map((c) => quote(c.header)).join(",")];
  for (const row of rows) lines.push(columns.map((c) => quote(c.value(row))).join(","));
  return `﻿${lines.join("\r\n")}`;
}

/** Hands the text to the browser as a download; nothing is stored. */
export function downloadCsv(text: string, fileName: string) {
  const url = URL.createObjectURL(new Blob([text], { type: "text/csv;charset=utf-8" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

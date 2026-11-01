import type { StructuredResult } from "../types";

function save(content: string, type: string, name: string) {
  const url = URL.createObjectURL(new Blob(["﻿", content], { type }));
  const link = document.createElement("a");
  link.href = url;
  link.download = name;
  link.click();
  URL.revokeObjectURL(url);
}

const escapeCell = (cell: string | number) => `"${String(cell).replace(/"/g, '""')}"`;

/** Builds the file in the browser from the shown rows; nothing is sent anywhere. */
export function downloadCsv(result: StructuredResult) {
  const lines = [result.columns, ...result.rows].map((row) => row.map(escapeCell).join(","));
  save(lines.join("\n"), "text/csv;charset=utf-8", "result.csv");
}

/** An HTML table with an .xls name opens in Excel without extra libraries. */
export function downloadExcel(result: StructuredResult) {
  const cells = (row: (string | number)[], tag: string) => `<tr>${row.map((cell) => `<${tag}>${cell}</${tag}>`).join("")}</tr>`;
  const html = `<html dir="rtl"><meta charset="utf-8"><table>${cells(result.columns, "th")}${result.rows.map((row) => cells(row, "td")).join("")}</table></html>`;
  save(html, "application/vnd.ms-excel", "result.xls");
}

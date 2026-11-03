import type { ExcelPreviewRow } from "../types";

/** Rows shown in the Excel import preview. The chosen file is never read. */
const rows: ExcelPreviewRow[] = [
  { id: "row-1", name: "پریسا امینی", email: "parisa.amini@example.com", groupName: "فروش" },
  { id: "row-2", name: "کامران یزدانی", email: "kamran.yazdani@example.com", groupName: "مالی" },
  { id: "row-3", name: "الهام جعفری", email: "elham.jafari@example.com", groupName: "فنی" },
];

export function getExcelPreviewRows(): ExcelPreviewRow[] {
  return rows;
}

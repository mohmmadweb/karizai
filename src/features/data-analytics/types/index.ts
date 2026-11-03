import type { StructuredResult } from "@/features/chat/types";

/** A prepared answer of the BI assistant: chart data, the generated query and the AI insight. */
export type DataAnswer = {
  id: string;
  question: string;
  match: RegExp;
  chartTitle: string;
  result: StructuredResult;
  insight: string;
  /** The dashboard «افزودن به داشبورد» puts the chart on. */
  dashboardId: string;
  /** The group «ارسال به گروه» sends to. */
  groupName: string;
};

export type Dashboard = { id: string; name: string; charts: number; note?: string };

export type Hashtag = { id: string; tag: string; count: number; trend: number; last: string };
export const hashtags: Hashtag[] = [
  { id: "h-1", tag: "PP-H30", count: 184, trend: 12, last: "2026-11-03T10:00:00.000Z" },
  { id: "h-2", tag: "HD5502", count: 131, trend: 8, last: "2026-11-03T08:00:00.000Z" },
  { id: "h-3", tag: "PP-T20", count: 117, trend: 21, last: "2026-11-02T15:00:00.000Z" },
  { id: "h-4", tag: "QC-SOP-07", count: 96, trend: 5, last: "2026-11-02T11:00:00.000Z" },
  { id: "h-5", tag: "line2-extruder", count: 88, trend: -4, last: "2026-11-01T09:00:00.000Z" },
  { id: "h-6", tag: "batch-reject", count: 64, trend: -11, last: "2026-10-31T14:00:00.000Z" },
  { id: "h-7", tag: "masterbatch", count: 52, trend: 3, last: "2026-10-30T10:00:00.000Z" },
  { id: "h-8", tag: "safety", count: 47, trend: 0, last: "2026-10-28T10:00:00.000Z" },
  { id: "h-9", tag: "reorder-point", count: 39, trend: 17, last: "2026-10-27T10:00:00.000Z" },
  { id: "h-10", tag: "moisture-test", count: 33, trend: -2, last: "2026-10-25T10:00:00.000Z" },
  { id: "h-11", tag: "izod-impact", count: 25, trend: 9, last: "2026-10-22T10:00:00.000Z" },
  { id: "h-12", tag: "sales-weekly", count: 18, trend: -6, last: "2026-10-20T10:00:00.000Z" },
];

import { formatDate } from "@/lib/format";

/** ۱۴۰۵/۰۸/۱۳ */
export const day = (value: string | number | Date) => formatDate(value, { year: "numeric", month: "2-digit", day: "2-digit" });
/** ۱۴:۳۰ */
export const clock = (value: string | number | Date) => formatDate(value, { hour: "2-digit", minute: "2-digit", hour12: false });
/** Today in the sample world: ۱۳ آبان ۱۴۰۵. */
export const TODAY = "2026-11-04T09:00:00.000Z";

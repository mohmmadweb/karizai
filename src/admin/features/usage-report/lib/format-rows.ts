import { formatNumber } from "@/admin/lib/format";
import type { Totals } from "../types";

export const notRecorded = "ثبت نشده";

/** Cost in tomans with Persian digits, or «ثبت نشده» when no price is recorded. */
export const formatCost = (cost: number | null) =>
  cost === null ? notRecorded : `${formatNumber(Math.round(cost))} تومان`;

/** Plain number for the export file, so Excel can calculate with it. */
export const plainCost = (t: Totals) => (t.cost === null ? "" : Math.round(t.cost));

const dateOptions: Intl.DateTimeFormatOptions = { dateStyle: "medium", timeZone: "UTC" };
const hourOptions: Intl.DateTimeFormatOptions = { hour: "2-digit", minute: "2-digit", timeZone: "UTC" };

export function dayLabel(ms: number) {
  return new Intl.DateTimeFormat("fa-IR-u-ca-persian", dateOptions).format(new Date(ms));
}

export function shortDayLabel(ms: number) {
  return new Intl.DateTimeFormat("fa-IR-u-ca-persian", {
    day: "numeric",
    month: "short",
    timeZone: "UTC",
  }).format(new Date(ms));
}

export function hourLabel(ms: number) {
  return new Intl.DateTimeFormat("fa-IR", hourOptions).format(new Date(ms));
}

"use client";

import { createContext, useContext, useMemo, useRef, useState, type ReactNode } from "react";
import { getReportNow } from "@/admin/features/usage-report/data/usage-records";
import { useDirectory } from "@/admin/features/user-management/hooks/use-directory";
import { getBusinessAreas } from "../data/business-areas";
import { getAlarmHistory, getIndicators } from "../data/indicators";
import { breachText, readingFor, statusOf } from "../lib/series";
import type { AreaKpi, BiAlarm, BusinessArea, Indicator, IndicatorInput, IndicatorStatus, Reading } from "../types";

export type IndicatorRow = {
  indicator: Indicator;
  reading: Reading;
  status: IndicatorStatus;
  /** For example «بالاتر از ۲۴۰», or `null` when inside the range. */
  breach: string | null;
  /** Names of the people and groups that hear about it. */
  recipients: string[];
};

type BiContextValue = {
  indicators: Indicator[];
  /** Enabled indicators with their reading and status, out-of-range first. */
  rows: IndicatorRow[];
  /** Live alarms of out-of-range indicators, alarms sent by hand, and the history; newest first. */
  alarms: BiAlarm[];
  /** The business areas of the overview, with the source and formula of each figure. */
  areas: BusinessArea[];
  updateKpi: (kpi: AreaKpi) => void;
  addIndicator: (input: IndicatorInput) => void;
  updateIndicator: (id: string, input: IndicatorInput) => void;
  removeIndicator: (id: string) => void;
  setEnabled: (id: string, enabled: boolean) => void;
  acknowledge: (alarmId: string) => void;
  /** Sends an alarm now and returns the names it went to. */
  sendAlarm: (indicatorId: string) => string[];
};

const BiContext = createContext<BiContextValue | null>(null);

const order: Record<IndicatorStatus, number> = { out: 0, near: 1, ok: 2 };

/** Indicators, alarms and acknowledgements of the BI dashboard. Everything is temporary and resets on reload. */
export function BiProvider({ children }: { children: ReactNode }) {
  const { users, groups } = useDirectory();
  const [indicators, setIndicators] = useState(getIndicators);
  const [acknowledged, setAcknowledged] = useState<string[]>([]);
  const [areas, setAreas] = useState(getBusinessAreas);
  const [manual, setManual] = useState<BiAlarm[]>([]);
  const counter = useRef(0);

  const value = useMemo<BiContextValue>(() => {
    const names = (item: Indicator) => [
      ...item.groupIds.map((id) => groups.find((g) => g.id === id)?.name),
      ...item.userIds.map((id) => users.find((u) => u.id === id)?.name),
    ].filter((name): name is string => Boolean(name));

    const rows = indicators
      .filter((item) => item.enabled)
      .map((indicator): IndicatorRow => {
        const reading = readingFor(indicator);
        return { indicator, reading, status: statusOf(indicator, reading.current), breach: breachText(indicator, reading.current), recipients: names(indicator) };
      })
      .sort((a, b) => order[a.status] - order[b.status]);

    const alarmOf = (row: IndicatorRow, id: string, raisedAt: string, isManual?: boolean): BiAlarm => ({
      id, indicatorId: row.indicator.id, indicatorName: row.indicator.name, value: row.reading.current, unit: row.indicator.unit,
      limitText: row.breach ?? "نزدیک به حد", severity: row.indicator.severity, raisedAt, recipients: row.recipients,
      state: acknowledged.includes(id) ? "acknowledged" : "sent", resolved: false, manual: isManual,
    });
    const live = rows.filter((row) => row.status === "out").map((row) => alarmOf(row, `live-${row.indicator.id}`, getReportNow()));
    const alarms = [...live, ...manual, ...getAlarmHistory()].sort((a, b) => b.raisedAt.localeCompare(a.raisedAt));

    return {
      indicators,
      rows,
      alarms,
      areas,
      updateKpi: (kpi) => setAreas((list) => list.map((area) => ({ ...area, kpis: area.kpis.map((item) => (item.id === kpi.id ? kpi : item)) }))),
      addIndicator: (input) => setIndicators((list) => [...list, { ...input, id: `ind-new-${++counter.current}` }]),
      updateIndicator: (id, input) => setIndicators((list) => list.map((item) => (item.id === id ? { ...input, id } : item))),
      removeIndicator: (id) => setIndicators((list) => list.filter((item) => item.id !== id)),
      setEnabled: (id, enabled) => setIndicators((list) => list.map((item) => (item.id === id ? { ...item, enabled } : item))),
      acknowledge: (alarmId) => setAcknowledged((list) => (list.includes(alarmId) ? list : [...list, alarmId])),
      sendAlarm: (indicatorId) => {
        const row = rows.find((item) => item.indicator.id === indicatorId);
        if (!row) return [];
        setManual((list) => [alarmOf(row, `manual-${++counter.current}`, new Date().toISOString(), true), ...list]);
        return row.recipients;
      },
    };
  }, [indicators, areas, acknowledged, manual, users, groups]);

  return <BiContext.Provider value={value}>{children}</BiContext.Provider>;
}

export function useBi(): BiContextValue {
  const value = useContext(BiContext);
  if (!value) throw new Error("useBi must be used inside BiProvider");
  return value;
}

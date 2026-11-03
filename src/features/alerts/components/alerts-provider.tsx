"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { getAlertRules, getReportSchedules } from "../data/alerts";
import type { AlertMark, AlertRule, ReportSchedule } from "../types";

type AlertsValue = {
  rules: AlertRule[];
  reports: ReportSchedule[];
  saveRule: (rule: AlertRule) => void;
  removeRule: (id: string) => void;
  saveReport: (report: ReportSchedule) => void;
  removeReport: (id: string) => void;
  /** Marks an alert «مهم» or «بی‌اهمیت»; marking it again with the same value clears it. */
  marks: Record<string, AlertMark>;
  mark: (alertId: string, value: AlertMark) => void;
};

const AlertsContext = createContext<AlertsValue | null>(null);

const upsert = <T extends { id: string }>(list: T[], item: T) => (list.some((entry) => entry.id === item.id) ? list.map((entry) => (entry.id === item.id ? item : entry)) : [...list, item]);

/** Alert rules, scheduled reports and the user's marks on alerts. Everything lives in memory and resets on reload. */
export function AlertsProvider({ children }: { children: ReactNode }) {
  const [rules, setRules] = useState(getAlertRules);
  const [reports, setReports] = useState(getReportSchedules);
  const [marks, setMarks] = useState<Record<string, AlertMark>>({});

  const value: AlertsValue = {
    rules,
    reports,
    saveRule: (rule) => setRules((list) => upsert(list, rule)),
    removeRule: (id) => setRules((list) => list.filter((rule) => rule.id !== id)),
    saveReport: (report) => setReports((list) => upsert(list, report)),
    removeReport: (id) => setReports((list) => list.filter((report) => report.id !== id)),
    marks,
    mark: (alertId, mark) => setMarks((current) => {
      const next = { ...current };
      if (next[alertId] === mark) delete next[alertId];
      else next[alertId] = mark;
      return next;
    }),
  };
  return <AlertsContext.Provider value={value}>{children}</AlertsContext.Provider>;
}

export function useAlerts(): AlertsValue {
  const value = useContext(AlertsContext);
  if (!value) throw new Error("useAlerts must be used inside AlertsProvider");
  return value;
}

export type SourceKind = "mes" | "iot" | "sql" | "manual";

export type Severity = "info" | "warning" | "critical";

/** One business indicator with its standard range and who must hear when it leaves the range. */
export type Indicator = {
  id: string;
  name: string;
  unit: string;
  /** A missing limit (`null`) means that side is open. At least one limit exists. */
  lowerLimit: number | null;
  upperLimit: number | null;
  source: SourceKind;
  /** MES indicator name, IoT topic, or read-only SQL query; empty for manual entry. */
  reference: string;
  /** How often the value is read, in minutes. */
  refreshMinutes: number;
  severity: Severity;
  userIds: string[];
  groupIds: string[];
  enabled: boolean;
};

export type IndicatorInput = Omit<Indicator, "id">;

/** ok: inside the range. near: inside but close to a limit. out: outside. */
export type IndicatorStatus = "ok" | "near" | "out";

export type Reading = {
  current: number;
  /** Oldest first, one value per hour of the last 24 hours. */
  series: number[];
};

export type AlarmState = "sent" | "acknowledged";

export type BiAlarm = {
  id: string;
  indicatorId: string;
  indicatorName: string;
  value: number;
  unit: string;
  /** For example «بالاتر از ۲۴۰». */
  limitText: string;
  severity: Severity;
  /** ISO date string. */
  raisedAt: string;
  recipients: string[];
  state: AlarmState;
  /** Past alarm that is already closed. */
  resolved: boolean;
  /** Sent by the admin from the dashboard. */
  manual?: boolean;
};

export type IndicatorErrors = Partial<Record<"name" | "limits" | "reference" | "refreshMinutes" | "responsible", string>>;

/** One value read from the connection's answer; `label` names the field of the answer it comes from. */
export type KpiVariable = { name: string; label: string; value: number };

/** Where a figure comes from: a connection and one of its tools, the values read, and the formula that combines them. */
export type KpiSource = {
  connection: string;
  tool: string;
  variables: KpiVariable[];
  /** Uses the variable names, numbers, + - * / and parentheses, for example «a / b * 100». */
  formula: string;
  refreshMinutes: number;
};

/** One figure of a business area. `better` says which direction is good; the target is the line between good and bad. */
export type AreaKpi = {
  id: string;
  label: string;
  unit: string;
  target: number;
  better: "higher" | "lower";
  /** Weekly values, oldest first; only the headline figure of an area has one. */
  series?: number[];
  source: KpiSource;
};

export type BusinessArea = {
  id: string;
  title: string;
  icon: import("lucide-react").LucideIcon;
  /** The first figure is the headline: it gets the big number and the trend line. */
  kpis: AreaKpi[];
};

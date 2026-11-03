export type Sensitivity = "low" | "medium" | "high";
export type Frequency = "instant" | "hourly" | "daily";

/** A rule that watches one kind of data and tells someone when it behaves unusually. */
export type AlertRule = {
  id: string;
  name: string;
  /** The data watched, for example an indicator of a line. */
  metric: string;
  sensitivity: Sensitivity;
  recipient: string;
  frequency: Frequency;
  enabled: boolean;
};

/** A report that is prepared and sent on a schedule. */
export type ReportSchedule = {
  id: string;
  name: string;
  /** Day of the week, saturday to friday. */
  day: string;
  /** Time of day as `HH:MM`. */
  time: string;
  recipients: string;
  summary: string;
  enabled: boolean;
};

/** The user's verdict on an alert; unmarked alerts are neither. */
export type AlertMark = "important" | "unimportant";

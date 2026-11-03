/** Confidentiality level of a data source; it decides which models may see its data. */
export type Sensitivity = "public" | "internal" | "confidential";

export const sensitivities: Sensitivity[] = ["public", "internal", "confidential"];

export const sensitivityLabels: Record<Sensitivity, string> = {
  public: "عمومی",
  internal: "داخلی",
  confidential: "محرمانه",
};

/** Internal: the organization's GPU server. External: a provider outside, always after masking. */
export type RunLocation = "internal" | "external";

export const locationLabels: Record<RunLocation, string> = {
  internal: "سرور GPU سازمان",
  external: "بیرونی (با پوشاندن)",
};

export type PolicyModel = {
  id: string;
  name: string;
  location: RunLocation;
  allowed: Record<Sensitivity, boolean>;
  /** Off: no request of this organization goes to the model. */
  enabled: boolean;
};

export type DataSourceLevel = {
  id: string;
  name: string;
  /** System the data comes from, such as LIMS or راهکاران. */
  system: string;
  level: Sensitivity;
};

export type ExternalChannel = "chat" | "workflow" | "api";

export type ExternalRequest = {
  id: string;
  /** ISO date. */
  at: string;
  user: string;
  unit: string;
  agent: string;
  model: string;
  channel: ExternalChannel;
  /** Kinds of data that were replaced with tokens before sending. */
  masked: string[];
  /** sent: masked and sent out. rerouted: the text held forbidden data, so an internal model answered. */
  outcome: "sent" | "rerouted";
};

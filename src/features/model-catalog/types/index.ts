export type CatalogModel = {
  id: string;
  name: string;
  /** Company that makes the model, for example "OpenAI". */
  provider: string;
  description: string;
  /** Hosted on the organization's own servers. */
  isInternal: boolean;
  supportsImages: boolean;
  supportsTools: boolean;
  /** False while the provider cannot be reached; the router skips the model. */
  isAvailable: boolean;
  /** True for models of a registered provider; they really answer. The others are sample entries. */
  isReal?: boolean;
  /** ISO date the maker released this version; recent ones get the «جدید» badge. */
  releasedAt?: string;
  /** Groups the admin allowed to use the model; absent means every group. */
  allowedGroupIds?: string[];
};

/** "auto" lets the system choose a model for each message. */
export type ModelChoice = "auto" | string;

export type CurrentUser = {
  id: string;
  name: string;
  email: string;
  /** Ids of the groups the user belongs to; the admin panel assigns smart routers by group. */
  groupIds: string[];
};

export type Quota = {
  /** Total allowance of the current period, in tokens. */
  limit: number;
  used: number;
  /** ISO date when the allowance resets. */
  resetsAt: string;
};

export type Account = CurrentUser & {
  groups: string[];
  /** "local" accounts change their password here; "sso" accounts use the organization's way. */
  authType: "local" | "sso";
};

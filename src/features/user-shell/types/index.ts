import type { LucideIcon } from "lucide-react";

export type UserSection = {
  id: string;
  title: string;
  href: string;
  icon: LucideIcon;
  exact?: boolean;
  /** Custom active check, for sections whose pages share a prefix with others. */
  match?: (pathname: string) => boolean;
};

/** A titled group of sidebar items, collapsible like the groups of the messenger. */
export type UserSectionGroup = { id: string; title: string; icon: LucideIcon; sections: UserSection[]; /** A title shown once above this group, naming the cluster of groups that starts here. */ heading?: string; /** Items listed directly, without a group title. */ bare?: boolean };

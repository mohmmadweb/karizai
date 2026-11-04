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

/** A titled group of sidebar items. Only one group is open at a time; `always` keeps a group open without a chevron. */
export type UserSectionGroup = { id: string; title: string; icon: LucideIcon; sections: UserSection[]; always?: boolean };
import type { LucideIcon } from "lucide-react";

export type UserSection = {
  id: string;
  title: string;
  href: string;
  icon: LucideIcon;
  exact?: boolean;
};

/** A titled group of sidebar items, collapsible like the groups of the messenger. */
export type UserSectionGroup = { id: string; title: string; sections: UserSection[] };

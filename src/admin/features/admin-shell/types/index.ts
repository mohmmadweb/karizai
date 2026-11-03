import type { LucideIcon } from "lucide-react";

export type AdminSection = {
  id: string;
  slug: string;
  title: string;
  description: string;
  icon: LucideIcon;
};

/** A titled group of sidebar items. */
export type AdminSectionGroup = { id: string; title: string; sections: AdminSection[] };

export type Notification = {
  id: string;
  title: string;
  /** ISO date string. */
  createdAt: string;
};

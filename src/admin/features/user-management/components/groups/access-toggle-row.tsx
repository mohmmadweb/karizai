"use client";

import type { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

type Props = {
  id: string;
  name: ReactNode;
  /** Plain-text name for the switch label. */
  label: string;
  hint?: ReactNode;
  badges?: string[];
  checked: boolean;
  /** Why the switch cannot be changed; shown as text under the name. */
  lockedReason?: string;
  disabled?: boolean;
  onChange: (checked: boolean) => void;
  className?: string;
};

/** One line of a group's access list: a name, small badges and a switch. */
export function AccessToggleRow({ id, name, label, hint, badges = [], checked, lockedReason, disabled, onChange, className }: Props) {
  return (
    <li className={cn("flex min-h-12 items-center justify-between gap-3 px-4 py-2", className)}>
      <div className="flex min-w-0 flex-col gap-0.5">
        <span className="flex flex-wrap items-center gap-2">
          <label htmlFor={id} className="text-label text-foreground">{name}</label>
          {badges.map((badge) => <Badge key={badge} variant="secondary">{badge}</Badge>)}
        </span>
        {hint ? <span className="text-body-sm text-muted-foreground">{hint}</span> : null}
        {lockedReason ? <span className="text-caption text-muted-foreground">{lockedReason}</span> : null}
      </div>
      <Switch
        id={id}
        aria-label={label}
        checked={checked}
        disabled={disabled || Boolean(lockedReason)}
        onCheckedChange={onChange}
      />
    </li>
  );
}

import { PanelRightCloseIcon, PanelRightOpenIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type AdminSidebarToggleProps = {
  collapsed: boolean;
  onToggle: () => void;
};

/** Opens and closes the sidebar. Shown from `lg`; phones use the menu button. */
export function AdminSidebarToggle({
  collapsed,
  onToggle,
}: AdminSidebarToggleProps) {
  const label = collapsed ? "باز کردن ساید بار" : "بستن ساید بار";
  const Icon = collapsed ? PanelRightOpenIcon : PanelRightCloseIcon;
  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            aria-label={label}
            aria-expanded={!collapsed}
            onClick={onToggle}
          />
        }
      >
        <Icon aria-hidden />
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  );
}

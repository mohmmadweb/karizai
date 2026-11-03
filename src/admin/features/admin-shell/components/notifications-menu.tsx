import { BellIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { formatDateTime } from "@/admin/lib/format";
import type { Notification } from "../types";

export function NotificationsMenu({
  notifications,
}: {
  notifications: Notification[];
}) {
  return (
    <DropdownMenu>
      <Tooltip>
        <TooltipTrigger
          render={
            <DropdownMenuTrigger
              render={
                <Button variant="outline" size="icon" aria-label="اعلان‌ها" />
              }
            />
          }
        >
          <BellIcon aria-hidden />
        </TooltipTrigger>
        <TooltipContent>اعلان‌ها</TooltipContent>
      </Tooltip>
      <DropdownMenuContent align="end" className="w-72">
        <DropdownMenuGroup>
          <DropdownMenuLabel>اعلان‌ها</DropdownMenuLabel>
          {notifications.length === 0 ? (
            <p className="px-2 py-6 text-center text-body-sm text-muted-foreground">
              اعلانی وجود ندارد
            </p>
          ) : (
            notifications.map((item) => (
              <DropdownMenuItem key={item.id} className="flex-col items-start">
                <span>{item.title}</span>
                <span className="text-caption text-muted-foreground">
                  {formatDateTime(item.createdAt)}
                </span>
              </DropdownMenuItem>
            ))
          )}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

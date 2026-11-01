"use client";

import { MoonIcon, SunIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useTheme } from "@/lib/use-theme";

/** Switches between the light and dark theme. The choice is temporary. */
export function ThemeToggle() {
  const { toggleTheme } = useTheme();
  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Button
            variant="outline"
            size="icon"
            aria-label="تغییر بین حالت روشن و تیره"
            onClick={toggleTheme}
          />
        }
      >
        {/* Icons follow the `dark` class, so they match before hydration. */}
        <MoonIcon className="dark:hidden" />
        <SunIcon className="hidden dark:block" />
      </TooltipTrigger>
      <TooltipContent>تغییر بین حالت روشن و تیره</TooltipContent>
    </Tooltip>
  );
}

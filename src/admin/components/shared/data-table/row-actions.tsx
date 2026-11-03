"use client";

import { Fragment, useState } from "react";
import Link from "next/link";
import { MoreHorizontalIcon } from "lucide-react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { DataTableAction, DataTableActionGroup } from "./types";

type RowActionsProps = {
  /** Names the row for assistive technology, for example «کاربر سارا احمدی». */
  rowLabel: string;
  groups: DataTableActionGroup[];
};

/**
 * Actions marked `inline` are visible buttons (label hidden on phones); the
 * rest live in one «⋯» menu. Destructive actions can ask for confirmation first.
 */
export function RowActions({ rowLabel, groups }: RowActionsProps) {
  const [pending, setPending] = useState<DataTableAction | null>(null);
  const inline = groups.flat().filter((action) => action.inline);
  const menuGroups = groups
    .map((group) => group.filter((action) => !action.inline))
    .filter((group) => group.length > 0);
  if (inline.length === 0 && menuGroups.length === 0) return null;

  function run(action: DataTableAction) {
    if (action.confirm) setPending(action);
    else action.onSelect?.();
  }

  return (
    <div className="flex items-center justify-end gap-1">
      {inline.map((action) => {
        if (action.iconOnly) {
          return (
            <Tooltip key={action.label}>
              <TooltipTrigger
                render={
                  <Button
                    variant="outline"
                    size="icon-sm"
                    disabled={action.disabled}
                    aria-label={`${action.label} ${rowLabel}`}
                    onClick={() => run(action)}
                  />
                }
              >
                {action.icon}
              </TooltipTrigger>
              <TooltipContent>{action.label}</TooltipContent>
            </Tooltip>
          );
        }
        const content = (
          <>
            {action.icon}
            <span className="max-sm:sr-only">{action.label}</span>
          </>
        );
        return action.href && !action.disabled ? (
          <Link
            key={action.label}
            href={action.href}
            aria-label={`${action.label} ${rowLabel}`}
            className={buttonVariants({ variant: "outline", size: "sm" })}
          >
            {content}
          </Link>
        ) : (
          <Button
            key={action.label}
            variant="outline"
            size="sm"
            disabled={action.disabled}
            aria-label={`${action.label} ${rowLabel}`}
            onClick={() => run(action)}
          >
            {content}
          </Button>
        );
      })}
      {menuGroups.length > 0 ? (
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                variant="ghost"
                size="icon-sm"
                aria-label={`عملیات بیشتر ${rowLabel}`}
              />
            }
          >
            <MoreHorizontalIcon aria-hidden />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="min-w-44">
            {menuGroups.map((group, index) => (
              <Fragment key={index}>
                {index > 0 ? <DropdownMenuSeparator /> : null}
                {group.map((action) => (
                  <DropdownMenuItem
                    key={action.label}
                    disabled={action.disabled}
                    variant={action.destructive ? "destructive" : "default"}
                    render={action.href ? <Link href={action.href} /> : undefined}
                    onClick={action.href ? undefined : () => run(action)}
                  >
                    {action.icon}
                    {action.label}
                  </DropdownMenuItem>
                ))}
              </Fragment>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      ) : null}
      <AlertDialog open={pending !== null} onOpenChange={(open) => !open && setPending(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{pending?.confirm?.title}</AlertDialogTitle>
            <AlertDialogDescription>{pending?.confirm?.description}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button
              variant={pending?.destructive ? "destructive" : "default"}
              onClick={() => {
                pending?.onSelect?.();
                setPending(null);
              }}
            >
              {pending?.confirm?.confirmLabel}
            </Button>
            <AlertDialogCancel>انصراف</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

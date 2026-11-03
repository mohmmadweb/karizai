"use client";

import { useState, type ReactNode } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AiAnswer } from "./ai-answer";
import { AiButton } from "./ai-button";

type Content = ReactNode | ((close: () => void) => ReactNode);

type AiDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  /** What the assistant looked at, shown as «زمینه: …». */
  context?: string;
  children: Content;
};

/** The assistant's answer in a dialog: the title with «✦», the context, then the prepared answer. */
export function AiDialog({ open, onOpenChange, title, context, children }: AiDialogProps) {
  const close = () => onOpenChange(false);
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-1.5"><span aria-hidden className="text-primary">✦</span>{title}</DialogTitle>
          {context ? <DialogDescription>زمینه: {context}</DialogDescription> : null}
        </DialogHeader>
        <div className="max-h-[65vh] overflow-y-auto">
          <AiAnswer>{typeof children === "function" ? children(close) : children}</AiAnswer>
        </div>
      </DialogContent>
    </Dialog>
  );
}

type AiActionProps = Omit<AiDialogProps, "open" | "onOpenChange" | "title"> & {
  label: string;
  /** Dialog title; the button label when absent. */
  title?: string;
  variant?: "soft" | "outline" | "ghost";
  size?: "xs" | "sm" | "default";
  className?: string;
};

/** A «✦» button that opens the assistant's answer in a dialog. */
export function AiAction({ label, title, variant, size, className, ...dialog }: AiActionProps) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <AiButton label={label} variant={variant} size={size} className={className} onClick={() => setOpen(true)} />
      <AiDialog open={open} onOpenChange={setOpen} title={title ?? label} {...dialog} />
    </>
  );
}

"use client";

import type { ComponentProps } from "react";
import { Button } from "@/components/ui/button";

type AiButtonProps = Omit<ComponentProps<typeof Button>, "children"> & { label: string };

/** A button for something the assistant does, marked with «✦» like the rest of the AI layer. */
export function AiButton({ label, variant = "soft", size = "sm", type = "button", ...props }: AiButtonProps) {
  return (
    <Button variant={variant} size={size} type={type} {...props}>
      <span aria-hidden>✦</span>
      {label}
    </Button>
  );
}

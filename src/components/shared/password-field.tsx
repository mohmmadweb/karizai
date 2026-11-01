"use client";

import { useRef, useState } from "react";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type PasswordFieldProps = Omit<React.ComponentProps<typeof Input>, "type">;

/** Password input with a show/hide button; focus stays in the input. */
export function PasswordField({ className, ...props }: PasswordFieldProps) {
  const [visible, setVisible] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const label = visible ? "مخفی کردن رمز" : "نمایش رمز";
  return (
    <div dir="ltr" className="relative">
      <Input
        ref={inputRef}
        type={visible ? "text" : "password"}
        className={cn("pe-11", className)}
        {...props}
      />
      <Button
        type="button"
        variant="ghost"
        size="icon"
        aria-label={label}
        aria-pressed={visible}
        disabled={props.disabled}
        onMouseDown={(event) => event.preventDefault()}
        onClick={() => {
          setVisible((value) => !value);
          inputRef.current?.focus();
        }}
        className="absolute end-0 top-0"
      >
        {visible ? <EyeOffIcon aria-hidden /> : <EyeIcon aria-hidden />}
      </Button>
    </div>
  );
}

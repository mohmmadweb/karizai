"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const idleMs = 30 * 60 * 1000;

/** Ends the session after 30 minutes without activity (presentation only). */
export function IdleTimeout() {
  const router = useRouter();
  const [expired, setExpired] = useState(false);

  useEffect(() => {
    let timer = setTimeout(() => setExpired(true), idleMs);
    const reset = () => {
      clearTimeout(timer);
      timer = setTimeout(() => setExpired(true), idleMs);
    };
    const events = ["pointerdown", "keydown", "scroll"] as const;
    events.forEach((name) => window.addEventListener(name, reset));
    return () => {
      clearTimeout(timer);
      events.forEach((name) => window.removeEventListener(name, reset));
    };
  }, []);

  return (
    <AlertDialog open={expired} onOpenChange={() => undefined}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>نشست شما منقضی شد</AlertDialogTitle>
          <AlertDialogDescription>به دلیل ۳۰ دقیقه بی‌فعالی از حساب خارج شدید. برای ادامه دوباره وارد شوید.</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction onClick={() => router.push("/login")}>ورود دوباره</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

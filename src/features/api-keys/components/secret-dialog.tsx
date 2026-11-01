"use client";

import { useState } from "react";
import { CheckIcon, CopyIcon } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

/** Shows the new key once. Closing the dialog drops the text from the browser too. */
export function SecretDialog({ secret, onClose }: { secret: string | null; onClose: () => void }) {
  const [copied, setCopied] = useState(false);
  async function copy() {
    if (!secret) return;
    try {
      await navigator.clipboard.writeText(secret);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }
  return (
    <Dialog open={secret !== null} onOpenChange={(open) => { if (!open) { setCopied(false); onClose(); } }}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>کلید شما آماده است</DialogTitle>
          <DialogDescription>آن را همین حالا کپی کنید و در جای امنی نگه دارید.</DialogDescription>
        </DialogHeader>
        <div className="flex items-center gap-2 rounded-lg border bg-muted/50 p-3">
          <bdi dir="ltr" className="min-w-0 flex-1 break-all font-mono text-body-sm">{secret}</bdi>
          <Button type="button" size="sm" variant="outline" onClick={() => void copy()}>{copied ? <CheckIcon aria-hidden /> : <CopyIcon aria-hidden />}{copied ? "کپی شد" : "کپی"}</Button>
        </div>
        <Alert variant="warning">
          <AlertTitle>این کلید دوباره نمایش داده نمی‌شود</AlertTitle>
          <AlertDescription>اگر آن را گم کردید، کلید را ابطال کنید و کلید تازه بسازید.</AlertDescription>
        </Alert>
        <Button className="w-fit" onClick={onClose}>متوجه شدم</Button>
      </DialogContent>
    </Dialog>
  );
}

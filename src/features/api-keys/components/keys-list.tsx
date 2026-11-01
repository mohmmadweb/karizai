"use client";

import { useState } from "react";
import { BanIcon } from "lucide-react";
import { toast } from "sonner";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { apiKeyKindLabels, apiKeyStatus, apiKeyStatusLabels, type ApiKeyRecord, type ApiKeyStatus } from "@/lib/api-keys";
import { formatDate } from "@/lib/format";
import { useApiKeys } from "./api-keys-provider";

const badgeVariant: Record<ApiKeyStatus, "success" | "warning" | "secondary"> = { active: "success", expired: "warning", revoked: "secondary" };

export function KeysList({ keys }: { keys: ApiKeyRecord[] }) {
  const { revokeKey } = useApiKeys();
  const [revoking, setRevoking] = useState<ApiKeyRecord | null>(null);
  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {keys.map((key) => {
          const status = apiKeyStatus(key);
          return (
            <Card key={key.id}>
              <CardHeader>
                <CardTitle className="flex flex-wrap items-center gap-2">{key.name}<Badge variant={badgeVariant[status]}>{apiKeyStatusLabels[status]}</Badge></CardTitle>
                <CardDescription>{apiKeyKindLabels[key.kind]}: {key.resourceName}</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-2 text-body-sm">
                <bdi dir="ltr" className="w-fit font-mono text-muted-foreground">msk_…{key.last4}</bdi>
                <p className="text-muted-foreground">ساخته‌شده {formatDate(key.createdAt)} · {key.expiresAt ? `انقضا ${formatDate(key.expiresAt)}` : "بدون انقضا"}</p>
                <p className="text-muted-foreground">{key.lastUsedAt ? `آخرین استفاده ${formatDate(key.lastUsedAt)}` : "هنوز استفاده نشده"}</p>
                {status === "active" ? <Button size="sm" variant="outline" className="w-fit" onClick={() => setRevoking(key)}><BanIcon aria-hidden />ابطال</Button> : null}
              </CardContent>
            </Card>
          );
        })}
      </div>
      <AlertDialog open={revoking !== null} onOpenChange={(open) => { if (!open) setRevoking(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>کلید ابطال شود؟</AlertDialogTitle>
            <AlertDialogDescription>برنامه‌هایی که از کلید «{revoking?.name}» استفاده می‌کنند دیگر پاسخی نمی‌گیرند. این کار برگشت‌پذیر نیست.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>انصراف</AlertDialogCancel>
            <AlertDialogAction onClick={() => { const id = revoking?.id; setRevoking(null); if (id) void revokeKey(id).then((ok) => (ok ? toast.success("کلید ابطال شد.") : toast.error("ابطال انجام نشد."))); }}>ابطال کلید</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";
import { SparklesIcon, XIcon } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/admin/lib/format";
import { useModels } from "../hooks/use-models";
import { isNewModel, providerOf } from "../lib/selectors";

/** «نسخه‌ی تازه آمد»: recently published models that are not turned on yet. Hiding it is temporary. */
export function NewVersionsNotice() {
  const { models, providers } = useModels();
  const [hidden, setHidden] = useState(false);
  const fresh = models.filter((m) => isNewModel(m) && !m.enabled);
  if (hidden || fresh.length === 0) return null;
  return (
    <Alert variant="info" role="status">
      <SparklesIcon aria-hidden />
      <AlertTitle className="flex items-center justify-between gap-2">
        نسخه‌ی تازه آمد
        <Button variant="ghost" size="icon-sm" aria-label="بستن اعلان" onClick={() => setHidden(true)}><XIcon aria-hidden /></Button>
      </AlertTitle>
      <AlertDescription>
        <ul className="flex flex-col gap-1">
          {fresh.map((m) => (
            <li key={m.id}>
              <Link href={`/admin/models/${m.id}`} className="font-medium underline-offset-4 hover:underline">{m.displayName}</Link>
              {" "}از {providerOf(m, providers)?.name ?? "—"}
              {m.releasedAt ? ` · منتشرشده در ${formatDate(m.releasedAt, { dateStyle: "medium" })}` : ""}
              {" "}— در همگام‌سازی خودکار پیدا شد؛ پس از بررسی فعالش کنید.
            </li>
          ))}
        </ul>
      </AlertDescription>
    </Alert>
  );
}

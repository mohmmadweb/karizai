"use client";

import { useState } from "react";
import { MotoCard, MotoPage, MotoPageHeader, StatusTabs } from "@/components/shared/moto/moto";
import { useConnections } from "@/features/connections/components/connections-provider";
import { useModels } from "@/features/model-catalog/components/models-provider";
import { usePolicies } from "@/features/policies/components/policies-provider";
import { getAccount } from "@/features/user-session/data/session";
import { toolModeFor, toolModeLabels } from "@/lib/policies";
import { formatNumber } from "@/lib/format";
import { cn } from "@/lib/utils";
import { personName, currentUserId } from "../lib/people";

type Tab = "groups" | "models" | "connections";

const roleNotes: Record<string, string> = {
  "کیفیت و فرمولاسیون": "ثبت نتایج آزمون، تأیید بچ، مشاهده‌ی رویه‌های QC-SOP",
  "فروش": "مشاهده‌ی پیش‌فاکتور و گریدها",
  "مالی": "مشاهده‌ی گزارش‌های مالی",
  "منابع انسانی": "مشاهده‌ی پرونده‌ی پرسنلی",
};

function Pill({ children, tone }: { children: string; tone: "ok" | "warn" | "off" }) {
  return <span className={cn("rounded-full px-2.5 py-0.5 text-caption", tone === "ok" && "bg-success/10 text-success", tone === "warn" && "bg-warning/25 text-warning-foreground", tone === "off" && "bg-muted text-muted-foreground")}>{children}</span>;
}

export function AccessPageContent() {
  const account = getAccount();
  const policies = usePolicies();
  const { models, isAllowed } = useModels();
  const { connections } = useConnections();
  const [tab, setTab] = useState<Tab>("groups");
  const allowed = models.filter(isAllowed).length;

  return (
    <MotoPage>
      <MotoPageHeader title="نقش و دسترسی من" description="گروه‌ها، نقش‌ها و آنچه با آن‌ها می‌توانید ببینید یا انجام دهید." />
      <MotoCard className="grid gap-4 sm:grid-cols-4">
        {[["نام", personName(currentUserId())], ["ایمیل", account.email], ["گروه‌ها", formatNumber(account.groups.length)], ["مدل‌های مجاز", `${formatNumber(allowed)} از ${formatNumber(models.length)}`]].map(([k, v]) => (
          <div key={k} className="flex min-w-0 flex-col gap-1"><span className="text-caption text-muted-foreground">{k}</span><span className={cn("truncate text-body-sm font-medium", k === "ایمیل" && "font-mono")} dir={k === "ایمیل" ? "ltr" : undefined}>{v}</span></div>
        ))}
      </MotoCard>
      <StatusTabs label="بخش‌ها" value={tab} onChange={setTab} options={[{ value: "groups", label: "گروه‌ها و نقش‌ها" }, { value: "models", label: "مدل‌ها" }, { value: "connections", label: "اتصال‌ها" }]} />
      {tab === "groups" ? (
        <div className="grid gap-4 md:grid-cols-2">
          {account.groups.map((g) => (
            <MotoCard key={g}>
              <h2 className="text-h4">{g}</h2>
              <p className="text-body-sm text-muted-foreground">نقش شما: کاربر سازمانی</p>
              <p className="text-body-sm">{roleNotes[g] ?? "مشاهده‌ی محتوای گروه"}</p>
            </MotoCard>
          ))}
        </div>
      ) : null}
      {tab === "models" ? (
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {models.map((m) => (
            <MotoCard key={m.id} className="gap-2 p-4">
              <div className="flex items-center justify-between gap-2"><h2 className="text-body font-medium"><span dir="ltr" className="font-mono">{m.name}</span></h2><Pill tone={isAllowed(m) ? "ok" : "off"}>{isAllowed(m) ? "مجاز" : "غیرمجاز"}</Pill></div>
              <p className="text-caption text-muted-foreground">{m.isInternal ? "مدل داخلی سازمان" : "مدل بیرونی"} · {m.provider}</p>
            </MotoCard>
          ))}
        </div>
      ) : null}
      {tab === "connections" ? (
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {connections.map((c) => {
            const mode = toolModeFor(policies, c.openTo?.filter((id) => getAccount().groupIds.includes(id)) ?? getAccount().groupIds, c.id);
            return (
              <MotoCard key={c.id} className="gap-2 p-4">
                <div className="flex items-center justify-between gap-2"><h2 className="text-body font-medium">{c.name}</h2><Pill tone={mode === "read" ? "warn" : "ok"}>{toolModeLabels[mode]}</Pill></div>
                <p className="text-caption text-muted-foreground">{c.domain}</p>
              </MotoCard>
            );
          })}
        </div>
      ) : null}
    </MotoPage>
  );
}

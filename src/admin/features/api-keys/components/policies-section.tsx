"use client";

import { EmptyState } from "@/components/shared/empty-state";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { useDirectory } from "@/admin/features/user-management/hooks/use-directory";
import { apiKeyKindLabels, apiKeyKinds, type ApiKeyKind } from "@/lib/api-keys";
import { formatNumber } from "@/admin/lib/format";
import { UsersRoundIcon } from "lucide-react";
import { useApiKeys } from "./api-keys-provider";

/** One row per group: which kinds of key its members may create, and the monthly ceiling of each key. */
export function PoliciesSection() {
  const { groups } = useDirectory();
  const { policyOf, setPolicy } = useApiKeys();
  const active = groups.filter((group) => group.status === "active");

  if (active.length === 0) {
    return <EmptyState icon={<UsersRoundIcon />} title="گروهی وجود ندارد" description="ابتدا در بخش گروه‌ها یک گروه بسازید." />;
  }

  function toggle(groupId: string, kind: ApiKeyKind, checked: boolean) {
    const kinds = policyOf(groupId).kinds;
    setPolicy(groupId, { kinds: apiKeyKinds.filter((item) => (item === kind ? checked : kinds.includes(item))) });
  }

  return (
    <div className="flex flex-col gap-4">
      <p className="max-w-reading text-body text-muted-foreground">
        اعضای هر گروه فقط برای انواعی که تیک می‌خورد می‌توانند در پنل خودشان کلید بسازند، و فقط برای مدل‌ها و عامل‌هایی که خودشان به آن‌ها دسترسی دارند. تغییرها همان لحظه اعمال می‌شود.
      </p>
      <ul className="flex flex-col divide-y rounded-xl border bg-card">
        {active.map((group) => {
          const policy = policyOf(group.id);
          const enabled = policy.kinds.length > 0;
          return (
            <li key={group.id} className="flex flex-col gap-4 p-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex min-w-0 flex-col">
                <span className="text-label">{group.name}</span>
                <span className="text-body-sm text-muted-foreground">{enabled ? "اجازه‌ی ساخت کلید دارد" : "کلیدی نمی‌تواند بسازد"}</span>
              </div>
              <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
                {apiKeyKinds.map((kind) => (
                  <label key={kind} className="flex items-center gap-2 text-body-sm">
                    <Checkbox checked={policy.kinds.includes(kind)} onCheckedChange={(checked) => toggle(group.id, kind, checked)} aria-label={`${apiKeyKindLabels[kind]} برای گروه ${group.name}`} />
                    {apiKeyKindLabels[kind]}
                  </label>
                ))}
                <label className="flex items-center gap-2 text-body-sm">
                  سقف ماهانه‌ی هر کلید
                  <Input
                    type="number"
                    inputMode="numeric"
                    min={0}
                    dir="ltr"
                    className="w-32"
                    disabled={!enabled}
                    placeholder="بدون سقف"
                    value={policy.monthlyTokenLimit ?? ""}
                    onChange={(event) => setPolicy(group.id, { monthlyTokenLimit: event.target.value === "" ? null : Math.max(0, Number(event.target.value)) })}
                    aria-label={`سقف ماهانه‌ی کلیدهای گروه ${group.name} به توکن`}
                  />
                  <span className="text-muted-foreground">{policy.monthlyTokenLimit ? `توکن (${formatNumber(policy.monthlyTokenLimit)})` : "توکن"}</span>
                </label>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

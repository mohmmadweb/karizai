"use client";

import { Trash2Icon } from "lucide-react";
import { MembershipPicker } from "@/admin/features/user-management/components/membership-picker";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { EmptyState } from "@/components/shared/empty-state";
import { useModels } from "@/admin/features/models/hooks/use-models";
import { tierLabels, type RouterMember, type SmartRouter, type Tier } from "@/lib/smart-routing";
import { BotIcon } from "lucide-react";

const tierItems = (Object.keys(tierLabels) as Tier[]).map((value) => ({ value, label: tierLabels[value] }));

type RouterMembersProps = { router: SmartRouter; onChange: (members: RouterMember[]) => void };

/** The models of a router and which kind of request each one answers. */
export function RouterMembers({ router, onChange }: RouterMembersProps) {
  const { models, providers } = useModels();
  const providerName = (providerId: string) => providers.find((p) => p.id === providerId)?.name ?? "";
  const options = models
    .filter((m) => !router.members.some((member) => member.modelId === m.id))
    .map((m) => ({ value: m.id, label: m.displayName, hint: providerName(m.providerId) }));

  return (
    <div className="flex flex-col gap-4">
      <MembershipPicker
        id="router-add-model"
        label="افزودن مدل به این مسیریاب"
        placeholder="مدل‌ها را انتخاب کنید"
        addLabel="افزودن مدل"
        options={options}
        multiple
        searchPlaceholder="جست‌وجوی مدل"
        emptyText="مدلی پیدا نشد."
        disabledReason={models.length === 0 ? "هنوز مدلی نیست؛ ابتدا یک ارائه‌دهنده ثبت کنید." : undefined}
        onAdd={() => undefined}
        onAddMany={(ids) => onChange([...router.members, ...ids.map((modelId) => ({ modelId, tier: "medium" as Tier }))])}
      />
      {router.members.length === 0 ? (
        <EmptyState icon={<BotIcon />} title="این مسیریاب هنوز مدلی ندارد" description="تا مدلی اضافه نشود، کاربران از میان همه‌ی مدل‌های مجاز خود، اولین مدل مناسب را می‌گیرند." />
      ) : (
        <ul className="flex flex-col divide-y divide-border rounded-xl border border-border">
          {router.members.map((member) => {
            const model = models.find((m) => m.id === member.modelId);
            return (
              <li key={member.modelId} className="flex flex-wrap items-center justify-between gap-2 px-3 py-2">
                <div className="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-0.5">
                  <span className="flex flex-wrap items-center gap-2 font-medium">
                    {model?.displayName ?? "مدل حذف‌شده"}
                    {model && !model.enabled ? <Badge variant="warning">غیرفعال</Badge> : null}
                  </span>
                  <span className="text-body-sm text-muted-foreground">{model ? providerName(model.providerId) : "این مدل دیگر وجود ندارد و نادیده گرفته می‌شود."}</span>
                </div>
                <div className="flex items-center gap-2">
                                    <Select items={tierItems} value={member.tier} onValueChange={(tier) => tier && onChange(router.members.map((item) => (item.modelId === member.modelId ? { ...item, tier: tier as Tier } : item)))}>
                    <SelectTrigger size="sm" aria-label={`سطح ${model?.displayName ?? "مدل"}`} className="w-28"><SelectValue /></SelectTrigger>
                    <SelectContent><SelectGroup>{tierItems.map((t) => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}</SelectGroup></SelectContent>
                  </Select>
                  <Button variant="ghost" size="icon-sm" aria-label={`برداشتن ${model?.displayName ?? "مدل"} از مسیریاب`} onClick={() => onChange(router.members.filter((item) => item.modelId !== member.modelId))}><Trash2Icon aria-hidden /></Button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

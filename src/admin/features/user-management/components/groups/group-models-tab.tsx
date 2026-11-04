"use client";

import Link from "@/components/shared/app-link";
import { BotIcon, XIcon } from "lucide-react";
import { toast } from "sonner";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { useAccess } from "@/admin/features/access-control/hooks/use-access";
import { useModels } from "@/admin/features/models/hooks/use-models";
import { MembershipPicker } from "../membership-picker";
import type { Group } from "../../types";
import { useGroupModelIds, useModelOptions } from "./group-models-picker";

/** Models this group may use. The same grants appear on each model's access tab. */
export function GroupModelsTab({ group }: { group: Group }) {
  const { grant, revoke } = useAccess();
  const { models, providers } = useModels();
  const ownIds = useGroupModelIds(group.id);
  const own = models.filter((m) => ownIds.includes(m.id));
  const options = useModelOptions().filter((o) => !ownIds.includes(o.value));
  const link = (modelId: string) => ({
    resourceType: "model" as const,
    resourceId: modelId,
    subjectType: "group" as const,
    subjectId: group.id,
  });

  return (
    <div className="flex flex-col gap-6">
      <MembershipPicker
        id="group-add-model"
        label="دسترسی به مدل"
        placeholder="مدل‌ها را انتخاب کنید"
        addLabel="افزودن مدل"
        options={options}
        multiple
        emptyText="مدلی پیدا نشد."
        searchPlaceholder="جست‌وجوی مدل"
        disabledReason={
          models.length === 0
            ? "هنوز مدلی نیست؛ ابتدا در بخش مدل‌ها یک ارائه‌دهنده ثبت کنید."
            : group.status === "inactive"
              ? "برای گروه غیرفعال دسترسی تازه داده نمی‌شود."
              : undefined
        }
        onAdd={(id) => grant(link(id))}
        onAddMany={(ids) => {
          ids.forEach((id) => grant(link(id)));
          toast.success(`${ids.length.toLocaleString("fa-IR")} مدل به گروه داده شد.`);
        }}
      />
      {own.length === 0 ? (
        <EmptyState
          icon={<BotIcon />}
          title="این گروه به هیچ مدلی دسترسی ندارد"
          description="از بالا مدل‌ها را انتخاب کنید و «افزودن مدل» را بزنید."
        />
      ) : (
        <ul className="flex flex-col divide-y divide-border rounded-xl border border-border">
          {own.map((model) => (
            <li key={model.id} className="flex items-center justify-between gap-3 p-3">
              <div className="flex min-w-0 flex-col">
                <Link
                  href={`/admin/models/${model.id}`}
                  className="rounded-sm font-medium outline-none hover:underline focus-visible:ring-3 focus-visible:ring-ring/50"
                >
                  {model.displayName}
                </Link>
                <span className="text-body-sm text-muted-foreground">
                  {providers.find((p) => p.id === model.providerId)?.name}
                  {model.enabled ? "" : " · غیرفعال"}
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  revoke(link(model.id));
                  toast.success("دسترسی گروه به این مدل برداشته شد.");
                }}
              >
                <XIcon aria-hidden />
                برداشتن
                <span className="sr-only"> دسترسی به {model.displayName}</span>
              </Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

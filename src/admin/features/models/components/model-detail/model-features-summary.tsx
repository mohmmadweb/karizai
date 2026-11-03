import { formatNumber } from "@/admin/lib/format";
import type { AiModel } from "../../types";

const none = "ثبت نشده";

function Item({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <dt className="text-caption text-muted-foreground">{label}</dt>
      <dd className="text-body-sm">{value}</dd>
    </div>
  );
}

/** Saved features at a glance; «ثبت نشده» where nothing is recorded. */
export function ModelFeaturesSummary({ model }: { model: AiModel }) {
  const price = (v: number | null) => (v === null ? none : `${formatNumber(v)} تومان`);
  return (
    <dl className="grid grid-cols-2 gap-4 rounded-xl border border-border bg-card p-4 lg:grid-cols-5">
      <Item label="هزینه‌ی ورودی (هر یک میلیون توکن)" value={price(model.costInputPerMillion)} />
      <Item label="هزینه‌ی خروجی (هر یک میلیون توکن)" value={price(model.costOutputPerMillion)} />
      <Item
        label="طول پنجره‌ی متن"
        value={model.contextWindow === null ? none : `${formatNumber(model.contextWindow)} توکن`}
      />
      <Item label="تصویر" value={model.supportsImages ? "پشتیبانی می‌شود" : "پشتیبانی نمی‌شود"} />
      <Item label="ابزار" value={model.supportsTools ? "پشتیبانی می‌شود" : "پشتیبانی نمی‌شود"} />
    </dl>
  );
}

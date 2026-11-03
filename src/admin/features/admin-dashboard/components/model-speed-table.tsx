import Link from "next/link";
import { CpuIcon } from "lucide-react";
import { DataTable } from "@/admin/components/shared/data-table/data-table";
import type { DataTableColumn } from "@/admin/components/shared/data-table/types";
import { EmptyState } from "@/components/shared/empty-state";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { formatNumber } from "@/admin/lib/format";
import { complexities, complexityLabels } from "../lib/model-speed";
import type { ModelSpeed } from "../types";
import { TimingCell } from "./timing-cell";

type Props = { speeds: ModelSpeed[]; hasEnabledModel: boolean };

function NameCell({ s }: { s: ModelSpeed }) {
  return (
    <span className="flex flex-col items-start gap-1">
      <span className="font-medium text-foreground">{s.name}</span>
      <span className="text-caption text-muted-foreground">{s.providerName}</span>
      {s.selfHosted ? <Badge variant="info">سلف‌هاست</Badge> : null}
    </span>
  );
}

const speedText = (s: ModelSpeed) => `${formatNumber(s.tokensPerSecond)} توکن در ثانیه`;

export function ModelSpeedTable({ speeds, hasEnabledModel }: Props) {
  if (speeds.length === 0) {
    return (
      <EmptyState
        icon={<CpuIcon aria-hidden />}
        title={hasEnabledModel ? "مدلی در دسترس نیست" : "مدل فعالی نیست"}
        description={
          hasEnabledModel
            ? "ارائه‌دهنده‌ی مدل‌های فعال در دسترس نیست."
            : "برای دیدن سرعت، دست‌کم یک مدل را در بخش مدل‌ها فعال کنید."
        }
        action={<Link href="/admin/models" className={buttonVariants({ variant: "outline" })}>مدل‌ها</Link>}
      />
    );
  }
  const columns: DataTableColumn<ModelSpeed>[] = [
    { id: "name", header: "مدل", cell: (s) => <NameCell s={s} /> },
    { id: "ttft", header: "زمان تا اولین کلمه", cell: (s) => <TimingCell timing={s.ttft} /> },
    { id: "tps", header: "سرعت تولید", align: "end", cell: speedText },
    ...complexities.map((c) => ({
      id: c,
      header: `زمان کامل، ${complexityLabels[c]}`,
      cell: (s: ModelSpeed) => <TimingCell timing={s.e2e[c]} />,
    })),
  ];
  return (
    <DataTable
      label="سرعت مدل‌ها"
      rows={speeds}
      columns={columns}
      getRowId={(s) => s.modelId}
      getRowLabel={(s) => `مدل ${s.name}`}
      defaultPageSize={5}
      renderCard={(s) => (
        <>
          <NameCell s={s} />
          <dl className="grid grid-cols-2 gap-x-3 gap-y-3 text-caption text-muted-foreground">
            <div>
              <dt>زمان تا اولین کلمه</dt>
              <dd><TimingCell timing={s.ttft} /></dd>
            </div>
            <div>
              <dt>سرعت تولید</dt>
              <dd className="text-foreground tabular-nums">{speedText(s)}</dd>
            </div>
            {complexities.map((c) => (
              <div key={c}>
                <dt>زمان کامل، {complexityLabels[c]}</dt>
                <dd><TimingCell timing={s.e2e[c]} /></dd>
              </div>
            ))}
          </dl>
        </>
      )}
    />
  );
}

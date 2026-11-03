import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatNumber } from "@/admin/lib/format";
import { formatCost } from "../lib/format-rows";
import type { Totals } from "../types";

export function SummaryCards({ totals }: { totals: Totals }) {
  const items = [
    { label: "درخواست‌ها", value: formatNumber(totals.requests) },
    { label: "توکن ورودی", value: formatNumber(totals.inputTokens) },
    { label: "توکن خروجی", value: formatNumber(totals.outputTokens) },
    { label: "هزینه‌ی تقریبی", value: formatCost(totals.cost) },
  ];
  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((item) => (
        <li key={item.label}>
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="text-body-sm font-normal text-muted-foreground">
                {item.label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-h3 text-foreground tabular-nums">{item.value}</p>
            </CardContent>
          </Card>
        </li>
      ))}
    </ul>
  );
}
